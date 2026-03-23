import { useEffect, useState } from "react";
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

  if (error) {
    return (
      <div className="container page-shell">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!data) {
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
        <div className="card">
          <h2>Profile Overview</h2>
          <div className="profile-stats">
            <p><strong>Username:</strong> {data.username}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Role:</strong> {data.role}</p>
            <p><strong>Skill level:</strong> {data.skill_level}</p>
            <p><strong>Total score:</strong> {data.total_score}</p>
            <p><strong>Completed lessons:</strong> {data.completed_lessons}</p>
          </div>
        </div>

        <div className="card">
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