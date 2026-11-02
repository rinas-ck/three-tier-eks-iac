import { Bell, Search, UserCircle } from "lucide-react";

function Header() {
  return (
    <header className="dashboard-header">
      <div className="header-title">
        <h1>Infrastructure Overview</h1>
        <p>Monitor your cloud infrastructure and applications</p>
      </div>

      <div className="header-actions">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search..." />
        </div>

        <button className="icon-button" aria-label="Notifications">
          <Bell size={20} />
        </button>

        <div className="user-profile">
          <UserCircle size={28} />
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}

export default Header;