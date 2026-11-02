
import { useEffect, useState } from "react";
import { Server, CheckCircle, XCircle } from "lucide-react";

function NodeTable() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetch("/api/nodes");

        if (!response.ok) {
          throw new Error("Failed to fetch Kubernetes nodes");
        }

        const data = await response.json();

        setNodes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  return (
    <div className="node-table-card">
      <div className="table-heading">
        <div>
          <h3>Kubernetes Worker Nodes</h3>
          <p>Live information from your EKS cluster</p>
        </div>
        <Server size={22} />
      </div>

      {loading && <p>Loading worker nodes...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Node</th>
                <th>Private IP</th>
                <th>Instance</th>
                <th>Availability Zone</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {nodes.map((node) => {
                const isReady = node.status === true;

                return (
                  <tr key={node.name}>
                    <td>{node.name}</td>
                    <td>{node.private_ip}</td>
                    <td>{node.instance_type}</td>
                    <td>{node.zone}</td>
                    <td>
                      <span className="node-status">
                        {isReady ? (
                          <CheckCircle size={15} />
                        ) : (
                          <XCircle size={15} />
                        )}
                        {isReady ? "Ready" : "Not Ready"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default NodeTable;
