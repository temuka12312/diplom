import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProgressSummary, type ProgressSummary } from "../api/progress";

type UserLevel = "beginner" | "elementary" | "intermediate" | "advanced";

const levelLabels: Record<UserLevel, string> = {
  beginner: "Анхан",
  elementary: "Суурь",
  intermediate: "Дунд",
  advanced: "Ахисан",
};

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

  const userLevel = (data?.skill_level as UserLevel) || "beginner";
  const levelText = levelLabels[userLevel] || "Анхан";

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
          <h2>Профайлын мэдээлэл</h2>

          <div className="profile-grid">
            <div className="profile-row">
              <span>Хэрэглэгч</span>
              <strong>{data.username}</strong>
            </div>
            <div className="profile-row">
              <span>Имэйл</span>
              <strong>{data.email}</strong>
            </div>
            <div className="profile-row">
              <span>Эрх</span>
              <strong>{data.role}</strong>
            </div>
            <div className="profile-row">
              <span>Түвшин</span>
              <strong>{levelText}</strong>
            </div>
            <div className="profile-row">
              <span>Нийт оноо</span>
              <strong>{data.total_score}</strong>
            </div>
            <div className="profile-row">
              <span>Дуусгасан хичээл</span>
              <strong>{data.completed_lessons}</strong>
            </div>
          </div>
        </div>

        <div className="card home-actions-card">
          <h2>Түргэн үйлдэл</h2>
          <div className="quick-actions">
            <Link to="/courses">
              <button className="button">Курсүүд үзэх</button>
            </Link>

            <Link to="/progress">
              <button className="button button-muted">Ахиц харах</button>
            </Link>

            {userLevel !== "advanced" && (
              <Link to="/level-up-test">
                <button className="button">Түвшин ахиулах тест</button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="home-stats-grid">
        <div className="card stat-card">
          <div className="profile-grid">
            <div className="profile-row">
              <span className="stat-label">Нийт курс: </span>
              <strong className="stat-value">{stats.totalCourses}</strong>
            </div>
            <div className="profile-row">
              <span className="stat-label">Дуусгасан курс: </span>
              <strong className="stat-value">{stats.completedCourses}</strong>
            </div>
          </div>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Дундаж ахиц: </span>
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
        <h2>Курсийн явц</h2>

        {data.courses.length === 0 ? (
          <p>Одоогоор курс алга.</p>
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
                  {c.completed_lessons}/{c.total_lessons} хичээл дууссан
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}