import { useEffect, useState } from "react";
import { getProgressSummary } from "../api/progress";
import type { ProgressSummary, CourseProgress } from "../api/progress";
import { getRecommendations } from "../api/ai";
import type { RecommendedLesson } from "../api/ai";
import { Link } from "react-router-dom";
import "../style/ProgressSummary.css";

export default function ProgressSummaryPage() {
  const [data, setData] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [recs, setRecs] = useState<RecommendedLesson[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recsError, setRecsError] = useState("");

  useEffect(() => {
    getProgressSummary()
      .then((res) => setData(res))
      .catch(() => setError("Failed to load progress summary"))
      .finally(() => setLoading(false));

    setRecsLoading(true);
    setRecsError("");
    getRecommendations()
      .then((items) => setRecs(items))
      .catch(() => setRecsError("Failed to load recommendations"))
      .finally(() => setRecsLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container page-shell">
        <p className="loading-text">Loading progress...</p>
      </div>
    );
  }

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
        <p>No data.</p>
      </div>
    );
  }

  const getQuizScoreClass = (score: number) => {
    if (score >= 80) return "quiz-score-high";
    if (score >= 50) return "quiz-score-mid";
    if (score > 0) return "quiz-score-low";
    return "quiz-score-none";
  };

  const totalCourses = data.courses.length;
  const completedCourses = data.courses.filter(
    (c) => c.progress_percent >= 100
  ).length;
  const averageProgress =
    totalCourses > 0
      ? Math.round(
          data.courses.reduce((sum, c) => sum + c.progress_percent, 0) /
            totalCourses
        )
      : 0;

  return (
    <div className="container page-shell">
      <div className="page-header">
        <span className="page-kicker">Performance Overview</span>
        <h1 className="page-title">My Learning Progress</h1>
        <p className="page-subtitle">
          Таны сургалтын ахиц, оноо, түвшин болон AI recommendation энд харагдана.
        </p>
      </div>

      <div className="home-grid" style={{ marginBottom: 20 }}>
        <section className="profile-section">
          <h2>Profile</h2>
          <p>
            <strong>Username:</strong> {data.username}
          </p>
          <p>
            <strong>Email:</strong> {data.email}
          </p>
          <p>
            <strong>Role:</strong> {data.role ?? "student"}
          </p>
          <p>
            <strong>Skill level:</strong>{" "}
            <span className="level-pill pill-beginner">
              {data.skill_level ?? "not set"}
            </span>
          </p>
          <p>
            <strong>Total score:</strong> {data.total_score}
          </p>
          <p>
            <strong>Completed lessons:</strong> {data.completed_lessons}
          </p>

          <div className="level-up-box">
            <h3 className="level-up-title">Level Progress</h3>

            {data.skill_level !== "advanced" ? (
              <>
                <p className="level-up-text">
                  Take a level-up test to unlock higher-level courses.
                </p>
                <Link to="/level-up-test" className="level-up-link">
                  <button className="level-up-button">Take Level-Up Test</button>
                </Link>
              </>
            ) : (
              <p className="level-up-max">
                You are already at the highest level.
              </p>
            )}
          </div>
        </section>

        <section className="profile-section">
          <h2>Quick Stats</h2>
          <div className="home-course-list">
            <div className="home-course-item">
              <div className="home-course-top">
                <strong>Total Courses</strong>
                <span>{totalCourses}</span>
              </div>
            </div>

            <div className="home-course-item">
              <div className="home-course-top">
                <strong>Completed Courses</strong>
                <span>{completedCourses}</span>
              </div>
            </div>

            <div className="home-course-item">
              <div className="home-course-top">
                <strong>Average Progress</strong>
                <span>{averageProgress}%</span>
              </div>
              <div className="progress-bar-wrapper">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${averageProgress}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="courses-section">
        <h2>Courses</h2>

        {data.courses.length === 0 ? (
          <p>No courses yet.</p>
        ) : (
          <table className="progress-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Lessons</th>
                <th>Progress</th>
                <th>Quiz score</th>
              </tr>
            </thead>
            <tbody>
              {data.courses.map((c: CourseProgress) => {
                const score = (c as any).course_score ?? 0;

                return (
                  <tr key={c.course_id}>
                    <td>
                      <Link to={`/courses/${c.course_id}`}>
                        {c.course_title}
                      </Link>
                    </td>

                    <td className="center">
                      {c.completed_lessons} / {c.total_lessons}
                    </td>

                    <td>
                      <div className="progress-bar-wrapper">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${c.progress_percent}%` }}
                        />
                      </div>
                      <span className="progress-percent">
                        {c.progress_percent}%
                      </span>
                    </td>

                    <td className="center">
                      <span
                        className={`quiz-score-badge ${getQuizScoreClass(score)}`}
                      >
                        {typeof score === "number" ? score.toFixed(0) : score}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section className="recs-section">
        <h2>Recommended Lessons</h2>

        {recsLoading && <p className="loading-text">Loading recommendations...</p>}
        {recsError && <p className="error-text">{recsError}</p>}

        {!recsLoading && !recsError && (
          <>
            {recs.length === 0 ? (
              <p>No recommendations yet.</p>
            ) : (
              <ul className="recs-list">
                {recs.map((r) => (
                  <li key={r.lesson_id} className="recs-list-item">
                    <Link
                      to={`/courses/${r.course_id}`}
                      className="recs-course-link"
                    >
                      {r.course_title}
                    </Link>
                    {" — "}
                    <Link
                      to={`/courses/${r.course_id}/lessons/${r.lesson_id}`}
                      className="recs-lesson-link"
                    >
                      {r.lesson_title}
                    </Link>
                    <span className="recs-level">({r.level})</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </div>
  );
}