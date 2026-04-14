import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getTracks,
  searchCatalog,
  type CatalogSearchResult,
  type LearningTrack,
} from "../api/courses";
import { API_ORIGIN } from "../api/axios";
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
  FaUsers,
  FaHeart,
  FaSearch,
} from "react-icons/fa";
import "../style/layout.css";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [tracks, setTracks] = useState<LearningTrack[]>([]);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CatalogSearchResult | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const navigateFromMenu = (path: string) => {
    setProfileMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    getTracks().then(setTracks).catch(() => {});
  }, []);

  useEffect(() => {
    setProfileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults(null);
      setSearchOpen(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        const data = await searchCatalog(query);
        setSearchResults(data);
        setSearchOpen(true);
      } catch {
        setSearchResults(null);
      }
    }, 220);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  const isAdmin = Boolean(user?.is_superuser || user?.is_staff);
  const userLabel = isAdmin ? "Admin" : "Student";
  const profileLabel = user?.nickname || user?.display_name || user?.username || userLabel;
  const avatarUrl = user?.avatar_url
    ? user.avatar_url.startsWith("http://") || user.avatar_url.startsWith("https://")
      ? user.avatar_url
      : `${API_ORIGIN}${user.avatar_url}`
    : null;
  const headerTitleMap: Array<[string, string]> = [
    ["/profile", "Profile"],
    ["/my-learning", "My Learning"],
    ["/courses/track/", "Track Courses"],
    ["/courses/", "Course Detail"],
    ["/courses", "Courses"],
    ["/tracks", "Tracks"],
    ["/liked-lessons", "Wishlist"],
    ["/progress", "Learning Progress"],
    ["/level-up-test", "Level Test"],
    ["/community", "Community"],
    ["/dashboard", "Home"],
  ];
  const headerTitle =
    headerTitleMap.find(([path]) => location.pathname.startsWith(path))?.[1] ?? "Home";

  const handleSearchNavigate = (path: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(path);
  };

  const hasSearchResults = Boolean(
    searchResults &&
      (searchResults.tracks.length || searchResults.courses.length || searchResults.lessons.length)
  );

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
                {!collapsed && <span>Home</span>}
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
                to="/liked-lessons"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title="Liked Lessons"
              >
                <FaHeart />
                {!collapsed && <span>Liked Lessons</span>}
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

          <div className="sidebar-footer-note">
            {!collapsed && (
              <>
                <span>© 2026 LOTUS Learn.</span>
                <span>All rights reserved.</span>
              </>
            )}
          </div>
        </aside>

        <div className="main">
          <header className="header">
            <div className="header-title">{headerTitle}</div>

            <div className="header-actions">
              <div className="header-search" ref={searchRef}>
                <FaSearch className="header-search-icon" />
                <input
                  type="text"
                  className="header-search-input"
                  placeholder="Search courses, tracks, lessons..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim()) setSearchOpen(true);
                  }}
                />

                <AnimatePresence>
                  {searchOpen && searchQuery.trim() && (
                    <motion.div
                      className="header-search-dropdown"
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      {hasSearchResults ? (
                        <>
                          {searchResults!.tracks.length > 0 && (
                            <div className="header-search-group">
                              <span className="header-search-group-title">Tracks</span>
                              {searchResults!.tracks.map((track) => (
                                <button
                                  key={`track-${track.id}`}
                                  type="button"
                                  className="header-search-item"
                                  onClick={() => handleSearchNavigate(`/courses/track/${track.id}`)}
                                >
                                  <strong>{track.name}</strong>
                                  <span>Track</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {searchResults!.courses.length > 0 && (
                            <div className="header-search-group">
                              <span className="header-search-group-title">Courses</span>
                              {searchResults!.courses.map((course) => (
                                <button
                                  key={`course-${course.id}`}
                                  type="button"
                                  className="header-search-item"
                                  onClick={() => handleSearchNavigate(`/courses/${course.id}`)}
                                >
                                  <strong>{course.title}</strong>
                                  <span>{course.track_name || "Course"}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {searchResults!.lessons.length > 0 && (
                            <div className="header-search-group">
                              <span className="header-search-group-title">Lessons</span>
                              {searchResults!.lessons.map((lesson) => (
                                <button
                                  key={`lesson-${lesson.id}`}
                                  type="button"
                                  className="header-search-item"
                                  onClick={() =>
                                    handleSearchNavigate(
                                      `/courses/${lesson.course_id}?lesson=${lesson.id}`
                                    )
                                  }
                                >
                                  <strong>{lesson.title}</strong>
                                  <span>{lesson.course_title}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="header-search-empty">
                          No matching track, course, or lesson found.
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="header-profile-menu" ref={profileMenuRef}>
                <button
                  type="button"
                  className={`header-user ${isAdmin ? "admin-badge" : ""}`}
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                >
                  {avatarUrl ? (
                    <img className="header-avatar" src={avatarUrl} alt={profileLabel} />
                  ) : (
                    <span className="header-avatar-fallback">
                      {profileLabel.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <span>{profileLabel}</span>
                  <FaChevronDown
                    className={`header-user-chevron ${profileMenuOpen ? "open" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      className="header-profile-dropdown"
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      onMouseDown={(event) => event.stopPropagation()}
                    >
                      <div className="header-profile-dropdown-head">
                        {avatarUrl ? (
                          <img className="header-dropdown-avatar" src={avatarUrl} alt={profileLabel} />
                        ) : (
                          <span className="header-dropdown-avatar fallback">
                            {profileLabel.slice(0, 1).toUpperCase()}
                          </span>
                        )}

                        <div className="header-dropdown-identity">
                          <strong>{profileLabel}</strong>
                          <span>{user?.email}</span>
                        </div>
                      </div>

                      <div className="header-profile-group">
                        <button
                          type="button"
                          className="header-profile-action"
                          onClick={() => navigateFromMenu("/profile")}
                        >
                          Profile
                        </button>
                        <button
                          type="button"
                          className="header-profile-action"
                          onClick={() => navigateFromMenu("/my-learning")}
                        >
                          My learning
                        </button>
                        <button
                          type="button"
                          className="header-profile-action"
                          onClick={() => navigateFromMenu("/liked-lessons")}
                        >
                          Wishlist
                        </button>
                      </div>

                      <div className="header-profile-group">
                        <button
                          type="button"
                          className="header-profile-action"
                          onClick={() => navigateFromMenu("/progress")}
                        >
                          Learning progress
                        </button>
                      </div>

                      <div className="header-profile-group">
                        <button
                          type="button"
                          className="header-profile-action danger"
                          onClick={() => {
                            setProfileMenuOpen(false);
                            handleLogout();
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
