import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../hooks/authSession";
import ElearningLanding from "./landing-design/ElearningLanding";

export default function LandingPage() {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <ElearningLanding />;
}
