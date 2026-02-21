import { useEffect, useState } from "react";
import { testApi } from "../api/test";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    testApi()
      .then((res) => setData(res))
      .catch(() => setError("API error"));
  }, []);

  return (
    <div>
      <h1>Home</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}