import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProgressSummary, type ProgressSummary } from "../api/progress";

export default function Home() {
  const [data, setData] = useState<ProgressSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProgressSummary()
      .then(setData)
      .catch(() => setError("Failed to load profile"));
  }, []);

  const stats = useMemo(() => {
    if (!data) return null;

    const totalCourses = data.courses.length;
    const completedCourses = data.courses.filter(
      (c) => c.total_lessons > 0 && c.completed_lessons === c.total_lessons
    ).length;

    const avgProgress =
      totalCourses > 0
        ? Math.round(
            data.courses.reduce((sum, c) => sum + c.progress_percent, 0) /
              totalCourses
          )
        : 0;

    return {
      totalCourses,
      completedCourses,
      avgProgress,
    };
  }, [data]);

  if (error) {
    return (
      <div className="container page-shell">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!data || !stats) {
    return (
      <div className="container page-shell">
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container page-shell">
      <div className="page-header">
        <span className="page-kicker">Dashboard</span>
        <h1 className="page-title">Welcome back, {data.username}</h1>
        <p className="page-subtitle">
          Таны профайл, ахиц, оноо болон дараагийн алхмууд энд харагдана.
        </p>
      </div>

      <div className="home-grid">
        <div className="card home-profile-card">
          <h2>Profile Overview</h2>

          <div className="profile-grid">
            <div className="profile-row">
              <span>Username</span>
              <strong>{data.username}</strong>
            </div>
            <div className="profile-row">
              <span>Email</span>
              <strong>{data.email}</strong>
            </div>
            <div className="profile-row">
              <span>Role</span>
              <strong>{data.role}</strong>
            </div>
            <div className="profile-row">
              <span>Skill level</span>
              <strong>{data.skill_level ?? "beginner"}</strong>
            </div>
            <div className="profile-row">
              <span>Total score</span>
              <strong>{data.total_score}</strong>
            </div>
            <div className="profile-row">
              <span>Completed lessons</span>
              <strong>{data.completed_lessons}</strong>
            </div>
          </div>
        </div>

        <div className="card home-actions-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/courses">
              <button className="button">Browse Courses</button>
            </Link>

            <Link to="/progress">
              <button className="button button-muted">View Progress</button>
            </Link>

            {data.skill_level !== "advanced" && (
              <Link to="/level-up-test">
                <button className="button">Take Level-Up Test</button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="home-stats-grid">
        <div className="card stat-card">
          <span className="stat-label">Total Courses</span>
          <strong className="stat-value">{stats.totalCourses}</strong>
        </div>

        <div className="card stat-card">
          <span className="stat-label">Completed Courses</span>
          <strong className="stat-value">{stats.completedCourses}</strong>
        </div>

        <div className="card stat-card">
          <span className="stat-label">Average Progress</span>
          <strong className="stat-value">{stats.avgProgress}%</strong>
          <div className="progress-bar-wrapper compact">
            <div
              className="progress-bar-fill"
              style={{ width: `${stats.avgProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Course Progress</h2>

        {data.courses.length === 0 ? (
          <p>No courses yet.</p>
        ) : (
          <div className="home-course-list">
            {data.courses.map((c) => (
              <div key={c.course_id} className="home-course-item">
                <div className="home-course-top">
                  <strong>{c.course_title}</strong>
                  <span>{c.progress_percent}%</span>
                </div>

                <div className="progress-bar-wrapper">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${c.progress_percent}%` }}
                  />
                </div>

                <small>
                  {c.completed_lessons}/{c.total_lessons} lessons completed
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}