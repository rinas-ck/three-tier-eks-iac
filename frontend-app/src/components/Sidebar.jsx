import {
  LayoutDashboard,
  Server,
  Boxes,
  Database,
  Activity,
  Settings,
  Cloud
} from "lucide-react";

function Sidebar({ activePage, onNavigate }) {
  const menuItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Kubernetes", icon: Boxes },
    { name: "Applications", icon: Server },
    { name: "Database", icon: Database },
    { name: "Monitoring", icon: Activity },
    { name: "Settings", icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Cloud size={28} />
        <h2>CloudOps</h2>
      </div>

      <p className="menu-label">MAIN MENU</p>

      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => onNavigate(item.name)}
              className={
                activePage === item.name
                  ? "menu-item active"
                  : "menu-item"
              }
              type="button"
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot"></span>
        AWS eu-north-1
      </div>
    </aside>
  );
}

export default Sidebar;