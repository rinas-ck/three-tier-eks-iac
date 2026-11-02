import { useEffect, useState } from "react";
import KubernetesOverview from "../components/KubernetesOverview";
import {
  Boxes,
  Server,
  Rocket,
  Activity
} from "lucide-react";

import Header from "../components/Header";
import StatCard from "../components/StatCard";
import ResourceChart from "../components/ResourceChart";
import NodeTable from "../components/NodeTable";

function Dashboard() {

  const [deploymentCount, setDeploymentCount] = useState(null);

useEffect(() => {
  const fetchDeployments = async () => {
    try {
      const response = await fetch("/api/deployments");

      if (!response.ok) {
        throw new Error("Failed to fetch deployments");
      }

      const data = await response.json();

      setDeploymentCount(
        Array.isArray(data) ? data.length : 0
      );
    } catch (error) {
      console.error("Deployment fetch error:", error);
    }
  };

  fetchDeployments();
}, []);

  const stats = [
    {
      title: "EKS Clusters",
      value: "1",
      subtitle: "Cluster active",
      icon: Boxes,
      color: "purple",
    },
    {
      title: "Worker Nodes",
      value: "2",
      subtitle: "All nodes healthy",
      icon: Server,
      color: "blue",
    },
    {
  title: "Deployments",
  value: deploymentCount === null
    ? "..."
    : String(deploymentCount),
  subtitle: deploymentCount === null
    ? "Loading deployments"
    : `${deploymentCount} deployments detected`,
  icon: Rocket,
  color: "orange",
},
    {
      title: "Application Health",
      value: "100%",
      subtitle: "Infrastructure operational",
      icon: Activity,
      color: "green",
    },
  ];

  return (
    <main className="main-content">

      {/* Dashboard Header */}
      <Header />

      {/* Infrastructure Statistics */}
      <section className="stats-grid">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
          />
        ))}
      </section>

      {/* Resource Monitoring Charts */}
      <section className="charts-grid">
        <ResourceChart
          title="CPU Utilization"
          color="#8b7cff"
        />

        <ResourceChart
          title="Memory Utilization"
          color="#38bdf8"
        />
      </section>

      {/* Kubernetes Worker Nodes */}
      <section className="nodes-section">
        <NodeTable />
      </section>

      <section className="kubernetes-section">
        <KubernetesOverview />
      </section>

      {/* Welcome Section */}
      <section className="welcome-section">
        <h2>Welcome to CloudOps Dashboard</h2>

        <p>
          Monitor and manage your AWS infrastructure
          from one centralized dashboard.
        </p>
      </section>

    </main>
  );
}

export default Dashboard;
