import { Navigate, useLocation } from "react-router-dom";
import React from "react";
import useAuth from "../hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const onPlacementPage = location.pathname.startsWith("/placement-test");

  if (!user.has_placement_test && !onPlacementPage) {
    return <Navigate to="/placement-test" replace />;
  }

  if (user.has_placement_test && onPlacementPage) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}