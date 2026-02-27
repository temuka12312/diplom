import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "12px 24px",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px",
      }}
    >
      {/* Logo */}
      <strong style={{ fontSize: "20px" }}>LOTUS-Learn</strong>

      {/* Navigation links */}
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {isAuthenticated() ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/courses">Courses</Link>

            <Link to="/progress">Progress</Link>

            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}