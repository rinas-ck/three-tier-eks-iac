import psycopg
import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from kubernetes import client, config
from kubernetes.config.config_exception import ConfigException

app = Flask(__name__)

# Allow requests from the local frontend
CORS(app, origins=[
    "http://localhost:5173",
    "http://localhost:8081"
])

# Kubernetes authentication
try:
    if os.getenv("KUBERNETES_SERVICE_HOST"):
        config.load_incluster_config()
        print("Connected using in-cluster Kubernetes configuration")
    else:
        config.load_kube_config()
        print("Connected using local kubeconfig")

except ConfigException as error:
    print(f"Kubernetes configuration error: {error}")


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "CloudOps Backend API",
        "status": "running"
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "version": "1.0.0"
    })


@app.route("/api/nodes", methods=["GET"])
def get_nodes():
    try:
        v1 = client.CoreV1Api()
        nodes = v1.list_node()

        node_list = []

        for node in nodes.items:
            addresses = node.status.addresses or []

            private_ip = next(
                (
                    address.address
                    for address in addresses
                    if address.type == "InternalIP"
                ),
                None
            )

            capacity = node.status.capacity or {}
            labels = node.metadata.labels or {}
            conditions = node.status.conditions or []

            ready = any(
                condition.type == "Ready"
                and condition.status == "True"
                for condition in conditions
            )

            node_list.append({
                "name": node.metadata.name,
                "private_ip": private_ip,
                "instance_type": labels.get(
                    "node.kubernetes.io/instance-type", "Unknown"
                ),
                "zone": labels.get(
                    "topology.kubernetes.io/zone", "Unknown"
                ),
                "status": ready,
                "cpu": capacity.get("cpu"),
                "memory": capacity.get("memory")
            })

        return jsonify(node_list)

    except Exception as error:
        return jsonify({"error": str(error)}), 500

@app.route("/api/db-health")
def db_health():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT version();")
                version = cur.fetchone()[0]

        return {
            "status": "healthy",
            "database": "connected",
            "version": version
        }, 200

    except Exception as e:
        app.logger.exception("Database connection failed")
        return {
            "status": "unhealthy",
            "database": "disconnected"
        }, 503

def get_db_connection():
    return psycopg.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "cloudops"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        connect_timeout=5
    )

def initialize_database():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS cloudops_records (
                        id SERIAL PRIMARY KEY,
                        title VARCHAR(150) NOT NULL,
                        description TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """)
        app.logger.info("Database table initialized successfully")

    except Exception:
        app.logger.exception("Database initialization failed")

@app.route("/api/pods", methods=["GET"])
def get_pods():
    try:
        v1 = client.CoreV1Api()
        pods = v1.list_pod_for_all_namespaces()

        pod_list = []

        for pod in pods.items:
            restart_count = sum(
                container.restart_count
                for container in (pod.status.container_statuses or [])
            )

            pod_list.append({
                "name": pod.metadata.name,
                "namespace": pod.metadata.namespace,
                "status": pod.status.phase,
                "node": pod.spec.node_name,
                "restarts": restart_count
            })

        return jsonify(pod_list)

    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/api/deployments", methods=["GET"])
def get_deployments():
    try:
        apps_v1 = client.AppsV1Api()
        deployments = apps_v1.list_deployment_for_all_namespaces()

        deployment_list = []

        for deployment in deployments.items:
            status = deployment.status

            deployment_list.append({
                "name": deployment.metadata.name,
                "namespace": deployment.metadata.namespace,
                "desired": deployment.spec.replicas or 0,
                "ready": status.ready_replicas or 0,
                "available": status.available_replicas or 0
            })

        return jsonify(deployment_list)

    except Exception as error:
        return jsonify({"error": str(error)}), 500

@app.route("/api/records", methods=["POST"])
def create_record():
    data = request.get_json()

    if not data or not data.get("title"):
        return jsonify({"error": "Title is required"}), 400

    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO cloudops_records (title, description)
                    VALUES (%s, %s)
                    RETURNING id, title, description, created_at;
                    """,
                    (data["title"], data.get("description", ""))
                )
                row = cur.fetchone()

        return jsonify({
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "created_at": row[3].isoformat()
        }), 201

    except Exception:
        app.logger.exception("Create record failed")
        return jsonify({"error": "Database operation failed"}), 500

@app.route("/api/records", methods=["GET"])
def get_records():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT id, title, description, created_at
                    FROM cloudops_records
                    ORDER BY id DESC;
                """)
                rows = cur.fetchall()

        return jsonify([
            {
                "id": row[0],
                "title": row[1],
                "description": row[2],
                "created_at": row[3].isoformat()
            }
            for row in rows
        ])

    except Exception:
        app.logger.exception("Get records failed")
        return jsonify({"error": "Database operation failed"}), 500
@app.route("/api/records/<int:record_id>", methods=["PUT"])
def update_record(record_id):
    data = request.get_json()

    if not data or not data.get("title"):
        return jsonify({"error": "Title is required"}), 400

    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE cloudops_records
                    SET title = %s, description = %s
                    WHERE id = %s
                    RETURNING id, title, description, created_at;
                    """,
                    (data["title"], data.get("description", ""), record_id)
                )
                row = cur.fetchone()

        if row is None:
            return jsonify({"error": "Record not found"}), 404

        return jsonify({
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "created_at": row[3].isoformat()
        }), 200

    except Exception:
        app.logger.exception("Update record failed")
        return jsonify({"error": "Database operation failed"}), 500

@app.route("/api/records/<int:record_id>", methods=["DELETE"])
def delete_record(record_id):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM cloudops_records
                    WHERE id = %s
                    RETURNING id;
                    """,
                    (record_id,)
                )
                deleted = cur.fetchone()

        if deleted is None:
            return jsonify({"error": "Record not found"}), 404

        return jsonify({
            "message": "Record deleted successfully",
            "id": deleted[0]
        }), 200

    except Exception:
        app.logger.exception("Delete record failed")
        return jsonify({"error": "Database operation failed"}), 500


if __name__ == "__main__":
    initialize_database()
    app.run(host="0.0.0.0", port=8000)
