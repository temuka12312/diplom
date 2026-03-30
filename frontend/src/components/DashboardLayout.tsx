import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../hooks/useAuth";
import useAuth from "../hooks/useAuth";
import {
  FaHome,
  FaBook,
  FaChartLine,
  FaRocket,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";
import "../style/layout.css";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAdmin = (user as any)?.is_superuser || (user as any)?.is_staff;
  const userLabel = isAdmin ? "Admin" : "Student";

  return (
    <div className="dashboard-shell">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      <div className="stars">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={
              {
                left: `${(i * 13 + 7) % 100}%`,
                top: `${(i * 17 + 11) % 100}%`,
                animationDelay: `${i * 0.5}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className={`layout ${collapsed ? "collapsed" : ""}`}>
        <aside className="sidebar">
          <div>
            <div className="sidebar-top-row">
              <h2 className="logo">
                LOTUS {!collapsed && <span>Learn</span>}
              </h2>

              <button
                className="sidebar-toggle"
                type="button"
                onClick={() => setCollapsed((prev) => !prev)}
                aria-label="Toggle sidebar"
              >
                {collapsed ? <FaBars /> : <FaTimes />}
              </button>
            </div>

            <nav className="sidebar-nav">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title="Dashboard"
              >
                <FaHome />
                {!collapsed && <span>Dashboard</span>}
              </NavLink>

              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title="Courses"
              >
                <FaBook />
                {!collapsed && <span>Courses</span>}
              </NavLink>

              <NavLink
                to="/progress"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title="Progress"
              >
                <FaChartLine />
                {!collapsed && <span>Progress</span>}
              </NavLink>

              <NavLink
                to="/level-up-test"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title="Level Test"
              >
                <FaRocket />
                {!collapsed && <span>Level Test</span>}
              </NavLink>
              <NavLink
                to="/community"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title="Community"
              >
                <FaUsers />
                {!collapsed && <span>Community</span>}
              </NavLink>
            </nav>
          </div>

          <button
            className="button button-danger sidebar-logout"
            onClick={handleLogout}
            title="Logout"
            type="button"
          >
            <FaSignOutAlt />
            {!collapsed && <span>Logout</span>}
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
    </div>
  );
}