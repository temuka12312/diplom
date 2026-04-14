import { Navigate, useLocation } from "react-router-dom";
import React from "react";
import useAuth from "../hooks/useAuth";
import LoadingState from "../components/LoadingState";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState title="Нэвтрэлт шалгаж байна" subtitle="Түр хүлээнэ үү..." compact />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const onPlacementPage = location.pathname.startsWith("/placement-test");

  if (!user.has_placement_test && !onPlacementPage) {
    return <Navigate to="/placement-test" replace />;
  }

  if (user.has_placement_test && onPlacementPage) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
