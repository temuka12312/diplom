import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginApi(username, password);

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      navigate("/");
    } catch (err) {
      setError("Нэвтрэх нэр эсвэл нууц үг буруу байна.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="page-kicker">Welcome Back</span>
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">
          LOTUS Learn систем рүү нэвтэрч суралцах аяллаа үргэлжлүүлээрэй.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Username</label>
            <input
              className="input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="button auth-button" type="submit">
            Login
          </button>
        </form>

        <p className="auth-footer">
          Бүртгэлгүй юу? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}