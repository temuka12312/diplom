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

  if (loading) return <p className="loading-text">Loading progress...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!data) return <p>No data.</p>;

  const getQuizScoreClass = (score: number) => {
    if (score >= 80) return "quiz-score-high";
    if (score >= 50) return "quiz-score-mid";
    if (score > 0) return "quiz-score-low";
    return "quiz-score-none";
  };

  return (
    <div className="progress-page">
      <h1>My Learning Progress</h1>

      {/* USER INFO */}
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
          <strong>Skill level:</strong> {data.skill_level ?? "not set"}
        </p>
        <p>
          <strong>Total score:</strong> {data.total_score}
        </p>
        <p>
          <strong>Completed lessons:</strong> {data.completed_lessons}
        </p>
      </section>

      {/* COURSES TABLE */}
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
              {data.courses.map((c: CourseProgress) => (
                <tr key={c.course_id}>
                  <td>{c.course_title}</td>
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
                      className={`quiz-score-badge ${getQuizScoreClass(
                        (c as any).course_score ?? 0
                      )}`}
                    >
                      {((c as any).course_score ?? 0).toFixed
                        ? (c as any).course_score.toFixed(0)
                        : (c as any).course_score ?? 0}
                      %
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* AI RECOMMENDATIONS */}
      <section className="recs-section">
        <h2>Recommended Lessons</h2>

        {recsLoading && (
          <p className="loading-text">Loading recommendations...</p>
        )}

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