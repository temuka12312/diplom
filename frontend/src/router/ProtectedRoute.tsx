import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../hooks/useAuth";

export default function ProtectedRoute({ children }: any) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
}
