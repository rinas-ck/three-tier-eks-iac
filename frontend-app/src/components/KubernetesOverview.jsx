
import { useEffect, useState } from "react";
import { Box, Layers, Activity } from "lucide-react";

function KubernetesOverview() {
  const [pods, setPods] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [podsResponse, deploymentsResponse] =
          await Promise.all([
            fetch("/api/pods"),
            fetch("/api/deployments"),
          ]);

        if (!podsResponse.ok || !deploymentsResponse.ok) {
          throw new Error("Failed to fetch Kubernetes data");
        }

        const podsData = await podsResponse.json();
        const deploymentsData = await deploymentsResponse.json();

        setPods(Array.isArray(podsData) ? podsData : []);
        setDeployments(
          Array.isArray(deploymentsData) ? deploymentsData : []
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading Kubernetes resources...</p>;

  if (error) return <p className="error-message">{error}</p>;

  const runningPods = pods.filter(
    (pod) => pod.status === "Running"
  ).length;

  const healthyDeployments = deployments.filter(
    (deployment) =>
      deployment.ready === deployment.desired
  ).length;

  return (
    <div className="kubernetes-overview">
      <h2>Kubernetes Resources</h2>

      <div className="k8s-summary">
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
          <span>Across all namespaces</span>
        </div>

        <div className="k8s-card">
          <Activity size={22} />
          <h3>{healthyDeployments}</h3>
          <p>Healthy Deployments</p>
          <span>Ready replicas match desired</span>
        </div>
      </div>
    </div>
  );
}

export default KubernetesOverview;
