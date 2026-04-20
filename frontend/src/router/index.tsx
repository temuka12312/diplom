import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import MyLearning from "../pages/MyLearning";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Courses from "../pages/Courses";
import CourseDetail from "../pages/CourseDetail";
import LikedLessons from "../pages/LikedLessons";
import LessonDetail from "../pages/LessonDetail";
import ProgressSummaryPage from "../pages/ProgressSummary";
import PlacementTest from "../pages/PlacementTest";
import LevelUpTest from "../pages/LevelUpTest";
import Community from "../pages/Community";
import Tracks from "../pages/Tracks";
import TrackCourses from "../pages/TrackCourses";
import Games from "../pages/Games";

import ChatWidget from "../components/ChatWidget";
import DashboardLayout from "../components/DashboardLayout";
import AuthLayout from "../components/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import PageFade from "../components/PageFade";

function Layout() {
  const location = useLocation();
  const showChatWidget = location.pathname !== "/";

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PageFade>
              <LandingPage />
            </PageFade>
          }
        />

        <Route
          path="/login"
          element={
            <PageFade>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </PageFade>
          }
        />

        <Route
          path="/register"
          element={
            <PageFade>
              <AuthLayout>
                <Register />
              </AuthLayout>
            </PageFade>
          }
        />

        <Route
          path="/dashboard"
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
          path="/my-learning"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MyLearning />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tracks"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Tracks />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/track/:trackId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <TrackCourses />
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
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
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

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Community />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/games"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Games />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/liked-lessons"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <LikedLessons />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      {showChatWidget && <ChatWidget />}
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
