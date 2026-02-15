import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div>
      <h1>🏠 Home</h1>
      <p>Welcome to E-Learning platform</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
