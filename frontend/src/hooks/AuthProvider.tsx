import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { meApi, type MeResponse } from "../api/auth";
import { AuthContext } from "./authContext";
import { isAuthenticated, logout } from "./authSession";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(() => isAuthenticated());

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    setLoading(true);

    try {
      const nextUser = await meApi();
      setUser(nextUser);
      return nextUser;
    } catch {
      logout();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      refreshUser,
    }),
    [user, loading, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
