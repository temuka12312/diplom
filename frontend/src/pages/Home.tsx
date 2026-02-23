import { useEffect, useState } from "react";
import { testApi } from "../api/test";
import { logout } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    testApi()
      .then((res) => setData(res))
      .catch(() => setError("API error"));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Home</h1>

      <button onClick={handleLogout}>Logout</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}