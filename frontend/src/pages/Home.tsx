import { useEffect, useState } from "react";
import { meApi } from "../api/auth";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Та нэвтрээгүй байна.");
      return;
    }

    meApi()
      .then((res) => setUser(res))
      .catch(() => setError("Таны мэдээллийг авч чадсангүй (JWT алдаа байж магад)."));
  }, []);

  return (
    <div>
      <h1>Home</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {user ? (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      ) : !error ? (
        <p>Loading...</p>
      ) : null}
    </div>
  );
}