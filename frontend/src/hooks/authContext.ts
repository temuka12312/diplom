import { createContext } from "react";
import type { MeResponse } from "../api/auth";

export interface AuthContextValue {
  user: MeResponse | null;
  loading: boolean;
  setUser: (user: MeResponse | null) => void;
  refreshUser: () => Promise<MeResponse | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
