import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../api/auth";
import AuthMascot from "../components/AuthMascot";

type MascotMode =
  | "idle"
  | "look-left"
  | "look-center"
  | "look-right"
  | "cover-eyes";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<"username" | "email" | "password" | null>(null);
  const [error, setError] = useState("");

  const mascotMode = useMemo<MascotMode>(() => {
    if (focusedField === "password") return "cover-eyes";

    if (focusedField === "username") {
      if (username.length === 0) return "look-center";
      if (username.length < 8) return "look-left";
      return "look-right";
    }

    if (focusedField === "email") {
      if (email.length === 0) return "look-center";
      if (email.length < 10) return "look-left";
      return "look-right";
    }

    return "idle";
  }, [focusedField, username, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await registerApi(username, email, password);
      navigate("/login");
    } catch {
      setError("Бүртгүүлэх үед алдаа гарлаа.");
    }
  };

  return (
    <AuthMascot
      mode={mascotMode}
      title="Create account"
      subtitle="Шинэ бүртгэл үүсгээд өөрийн шатлалтай сургалтыг эхлүүлээрэй."
    >
      <div className="auth-form-shell">
        <h2>Register</h2>
        <p className="auth-note">Шинэ хэрэглэгчийн мэдээллээ оруулна уу.</p>

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
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholder="test@gmail.com"
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
            Register
          </button>
        </form>

        <div className="auth-switch">
          Аль хэдийн бүртгэлтэй юу? <Link to="/login">Login</Link>
        </div>
      </div>
    </AuthMascot>
  );
}