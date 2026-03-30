import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../api/auth";
import AuthMascot from "../components/AuthMascot";

type MascotMode =
  | "idle"
  | "look-left"
  | "look-center"
  | "look-right"
  | "cover-eyes";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<"username" | "password" | null>(null);
  const [error, setError] = useState("");

  const mascotMode = useMemo<MascotMode>(() => {
    if (focusedField === "password") return "cover-eyes";
    if (focusedField === "username") {
      if (username.length === 0) return "look-center";
      if (username.length < 8) return "look-left";
      return "look-right";
    }
    return "idle";
  }, [focusedField, username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginApi(username, password);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      navigate("/dashboard");
    } catch {
      setError("Нэвтрэх үед алдаа гарлаа.");
    }
  };

  return (
    <AuthMascot
      mode={mascotMode}
      title="Welcome back"
      subtitle="Өөрийн аккаунтаар нэвтэрч сургалтаа үргэлжлүүлээрэй."
    >
      <div className="auth-form-shell">
        <h2>Login</h2>
        <p className="auth-note">Систем рүү нэвтрэх мэдээллээ оруулна уу.</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField(null)}
              placeholder="enter your name"
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
            />
          </div>

          <button className="auth-submit" type="submit">
            Login
          </button>
        </form>

        <div className="auth-switch">
          Бүртгэлгүй юу? <Link to="/register">Register</Link>
        </div>
      </div>
    </AuthMascot>
  );
}