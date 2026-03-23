import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Courses from "../pages/Courses";
import CourseDetail from "../pages/CourseDetail";
import LessonDetail from "../pages/LessonDetail";
import ProgressSummaryPage from "../pages/ProgressSummary";
import PlacementTest from "../pages/PlacementTest";
import LevelUpTest from "../pages/LevelUpTest";

import ChatWidget from "../components/ChatWidget";
import DashboardLayout from "../components/DashboardLayout";
import AuthLayout from "../components/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

function Layout() {
  return (
    <>
      <Routes>
        {/* AUTH */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Home />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Courses />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CourseDetail />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/lessons/:lessonId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <LessonDetail />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProgressSummaryPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/placement-test"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PlacementTest />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/level-up-test"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <LevelUpTest />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      <ChatWidget />
    </>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}