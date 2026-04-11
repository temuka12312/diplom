import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getTracks, type LearningTrack } from "../api/courses";
import { logout } from "../hooks/useAuth";
import useAuth from "../hooks/useAuth";
import {
  FaHome,
  FaBook,
  FaChartLine,
  FaChevronDown,
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
  const location = useLocation();
  const { user } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [tracks, setTracks] = useState<LearningTrack[]>([]);
  const [coursesOpen, setCoursesOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    getTracks().then(setTracks).catch(() => {});
  }, []);

  const isAdmin = Boolean(user?.is_superuser || user?.is_staff);
  const userLabel = isAdmin ? "Admin" : "Student";

  return (
    <motion.div
      className="dashboard-shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
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
                to="/dashboard"
                end
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title="Dashboard"
              >
                <FaHome />
                {!collapsed && <span>Dashboard</span>}
              </NavLink>

              <button
                type="button"
                className={`nav-item nav-dropdown-toggle ${coursesOpen ? "open" : ""}`}
                onClick={() => setCoursesOpen((prev) => !prev)}
                title="Courses"
              >
                <div className="nav-dropdown-left">
                  <FaBook />
                  {!collapsed && <span>Courses</span>}
                </div>
                {!collapsed && <FaChevronDown className="dropdown-icon" />}
              </button>

              {!collapsed && coursesOpen && (
                <div className="nav-submenu">
                  <NavLink
                    to="/tracks"
                    className={({ isActive }) =>
                      isActive ? "nav-subitem active" : "nav-subitem"
                    }
                  >
                    Бүх чиглэл
                  </NavLink>

                  <NavLink
                    to="/courses"
                    className={({ isActive }) =>
                      isActive ? "nav-subitem active" : "nav-subitem"
                    }
                  >
                    Бүх хичээл
                  </NavLink>


                  {tracks.map((track) => (
                    <NavLink
                      key={track.id}
                      to={`/courses/track/${track.id}`}
                      className={({ isActive }) =>
                        isActive ? "nav-subitem active" : "nav-subitem"
                      }
                    >
                      {track.name}
                    </NavLink>
                  ))}
                </div>
              )}

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

          <div className="content">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ width: "100%" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
