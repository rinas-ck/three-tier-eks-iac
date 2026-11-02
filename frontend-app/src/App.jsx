import Kubernetes from "./pages/Kubernetes";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Overview");

  return (
    <div className="app-container">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      {activePage === "Overview" ? (
  <Dashboard />
) : activePage === "Database" ? (
  <Records />
) : activePage === "Kubernetes" ? (
  <Kubernetes />
) : (
  <main className="main-content">
    <h1>{activePage}</h1>
    <p>Coming soon...</p>
  </main>
)}
    </div>
  );
}

export default App;