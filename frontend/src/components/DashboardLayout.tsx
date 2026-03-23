import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../hooks/useAuth";
import useAuth from "../hooks/useAuth";
import { FaHome, FaBook, FaChartLine, FaRocket } from "react-icons/fa";
import "../style/layout.css";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = user?.is_superuser || user?.is_staff;
  const userLabel = isAdmin ? "Admin" : "Student";

  return (
    <div className="layout">
      <aside className="sidebar">
        <div>
          <h2 className="logo">LOTUS Learn</h2>

          <nav className="sidebar-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <FaHome />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/courses" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <FaBook />
              <span>Courses</span>
            </NavLink>

            <NavLink to="/progress" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <FaChartLine />
              <span>Progress</span>
            </NavLink>

            <NavLink to="/level-up-test" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <FaRocket />
              <span>Level Test</span>
            </NavLink>
          </nav>
        </div>

        <button className="button button-danger sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <div className="main">
        <header className="header">
          <div className="header-title">E-Learning Dashboard</div>
          <div className={`header-user ${isAdmin ? "admin-badge" : ""}`}>
            <span className="user-dot" />
            <span>{userLabel}</span>
          </div>
        </header>

        <div className="content">{children}</div>
      </div>
    </div>
  );
}