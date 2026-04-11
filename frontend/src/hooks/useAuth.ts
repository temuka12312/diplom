import { useState, useEffect } from "react";
import { meApi, type MeResponse } from "../api/auth";

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export default function useAuth() {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(() => isAuthenticated());

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return;
    }

    meApi()
      .then((u) => {
        setUser(u);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, setUser };
}
