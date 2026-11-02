
import { useEffect, useState } from "react";
import { RefreshCw, Box, Server, Layers } from "lucide-react";

function Kubernetes() {
  const [nodes, setNodes] = useState([]);
  const [pods, setPods] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [nodeRes, podRes, deploymentRes] = await Promise.all([
        fetch("/api/nodes"),
        fetch("/api/pods"),
        fetch("/api/deployments"),
      ]);

      if (!nodeRes.ok || !podRes.ok || !deploymentRes.ok) {
        throw new Error("Unable to fetch Kubernetes resources");
      }

      const [nodeData, podData, deploymentData] = await Promise.all([
        nodeRes.json(),
        podRes.json(),
        deploymentRes.json(),
      ]);

      setNodes(Array.isArray(nodeData) ? nodeData : []);
      setPods(Array.isArray(podData) ? podData : []);
      setDeployments(
        Array.isArray(deploymentData) ? deploymentData : []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const runningPods = pods.filter(
    (pod) => pod.status === "Running"
  ).length;

  return (
    <main className="main-content">
      <header className="dashboard-header">
        <div className="header-title">
          <h1>Kubernetes Management</h1>
          <p>Live resources from your Amazon EKS cluster</p>
        </div>

        <button className="icon-button" onClick={fetchData}>
          <RefreshCw size={18} />
        </button>
      </header>

      {error && <p className="records-error">{error}</p>}

      {loading ? (
        <p>Loading Kubernetes resources...</p>
      ) : (
        <>
          <section className="k8s-summary">
            <div className="k8s-card">
              <Server size={22} />
              <h3>{nodes.length}</h3>
              <p>Worker Nodes</p>
            </div>

            <div className="k8s-card">
              <Box size={22} />
              <h3>{pods.length}</h3>
              <p>Total Pods</p>
              <span>{runningPods} Running</span>
            </div>

            <div className="k8s-card">
              <Layers size={22} />
              <h3>{deployments.length}</h3>
              <p>Deployments</p>
              <span>
                {deployments.filter(
                  (d) => d.ready === d.desired
                ).length} Healthy
              </span>
            </div>
          </section>

          <section className="records-table-card">
            <h2>Worker Nodes</h2>
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
                  {nodes.map((node) => (
                    <tr key={node.name}>
                      <td>{node.name}</td>
                      <td>{node.private_ip}</td>
                      <td>{node.instance_type}</td>
                      <td>{node.zone}</td>
                      <td>{node.status ? "Ready" : "Not Ready"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="records-table-card">
            <h2>Pods</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Namespace</th>
                    <th>Status</th>
                    <th>Node</th>
                    <th>Restarts</th>
                  </tr>
                </thead>
                <tbody>
                  {pods.map((pod) => (
                    <tr key={`${pod.namespace}-${pod.name}`}>
                      <td>{pod.name}</td>
                      <td>{pod.namespace}</td>
                      <td>{pod.status}</td>
                      <td>{pod.node || "-"}</td>
                      <td>{pod.restarts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="records-table-card">
            <h2>Deployments</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Namespace</th>
                    <th>Desired</th>
                    <th>Ready</th>
                    <th>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {deployments.map((deployment) => (
                    <tr key={`${deployment.namespace}-${deployment.name}`}>
                      <td>{deployment.name}</td>
                      <td>{deployment.namespace}</td>
                      <td>{deployment.desired}</td>
                      <td>{deployment.ready}</td>
                      <td>{deployment.available}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default Kubernetes;
