import { useEffect, useMemo, useState } from "react";
import { getProgressSummary } from "../api/progress";
import type {
  ProgressSummary,
  CourseProgress,
  WeeklyActivity,
} from "../api/progress";
import { getRecommendations } from "../api/ai";
import type { RecommendedLesson } from "../api/ai";
import { Link } from "react-router-dom";
import LoadingState from "../components/LoadingState";
import "../style/ProgressSummary.css";

type UserLevel = "beginner" | "elementary" | "intermediate" | "advanced";

const levelLabels: Record<UserLevel, string> = {
  beginner: "Анхан",
  elementary: "Суурь",
  intermediate: "Дунд",
  advanced: "Ахисан",
};

function WeeklyActivityChart({ activity }: { activity: WeeklyActivity[] }) {
  const maxCount = Math.max(...activity.map((item) => item.lesson_count), 1);
  const totalLessons = activity.reduce((sum, item) => sum + item.lesson_count, 0);
  const activeDays = activity.filter((item) => item.lesson_count > 0).length;

  return (
    <section className="card weekly-activity-card">
      <div className="weekly-activity-head">
        <div>
          <span className="page-kicker">Last 7 Days</span>
          <h2>Хичээл үзсэн идэвх</h2>
          <p className="page-subtitle">
            Сүүлийн 7 хоногт өдөр бүр хэдэн lesson дуусгасныг харуулна.
          </p>
        </div>

        <div className="weekly-activity-summary">
          <div className="weekly-summary-pill">
            <strong>{totalLessons}</strong>
            <span>lesson</span>
          </div>
          <div className="weekly-summary-pill">
            <strong>{activeDays}</strong>
            <span>active day</span>
          </div>
        </div>
      </div>

      <div className="weekly-chart">
        {activity.map((item) => {
          const height = `${Math.max((item.lesson_count / maxCount) * 100, item.lesson_count > 0 ? 16 : 6)}%`;

          return (
            <div key={item.date} className="weekly-chart-col">
              <span className="weekly-chart-value">{item.lesson_count}</span>
              <div className="weekly-chart-track">
                <div
                  className="weekly-chart-bar"
                  style={{ height }}
                  title={`${item.label}: ${item.lesson_count} lesson`}
                />
              </div>
              <span className="weekly-chart-label">{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function ProgressSummaryPage() {
  const [data, setData] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [recs, setRecs] = useState<RecommendedLesson[]>([]);
  const [recsLoading, setRecsLoading] = useState(true);
  const [recsError, setRecsError] = useState("");

  useEffect(() => {
    getProgressSummary()
      .then((res) => setData(res))
      .catch(() => setError("Failed to load progress summary"))
      .finally(() => setLoading(false));

    getRecommendations()
      .then((items) => setRecs(items))
      .catch(() => setRecsError("Failed to load recommendations"))
      .finally(() => setRecsLoading(false));
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

  if (loading) {
    return (
      <div className="container page-shell">
        <LoadingState
          title="Ахиц тооцоолж байна"
          subtitle="Курс, оноо, recommendation мэдээллийг нэгтгэж байна..."
        />
      </div>
    );
  }
  if (error) return <p className="error-text">{error}</p>;
  if (!data || !stats) return <p>No data.</p>;

  const getQuizScoreClass = (score: number) => {
    if (score >= 80) return "quiz-score-high";
    if (score >= 50) return "quiz-score-mid";
    if (score > 0) return "quiz-score-low";
    return "quiz-score-none";
  };

  const userLevel = (data.skill_level as UserLevel) || "beginner";
  const levelText = levelLabels[userLevel] || "Анхан";

  return (
    <div className="progress-page">
      <div className="page-header">
        <span className="page-kicker">Performance Overview</span>
        <h1 className="page-title">My Learning Progress</h1>
        <p className="page-subtitle">
          Таны сургалтын ахиц, оноо, түвшин болон AI recommendation энд харагдана.
        </p>
      </div>

      <div className="progress-top-grid">
        <section className="card profile-section">
          <h2>Profile</h2>

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
              <strong>{data.role ?? "student"}</strong>
            </div>
            <div className="profile-row">
              <span>Skill level</span>
              <strong>{levelText}</strong>
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

          <div className="level-up-box">
            <h3 className="level-up-title">Level Progress</h3>

            {userLevel !== "advanced" ? (
              <>
                <p className="level-up-text">
                  Take a level-up test to unlock higher-level courses.
                </p>
                <Link to="/level-up-test" className="level-up-link">
                  <button className="button level-up-button">Take Level-Up Test</button>
                </Link>
              </>
            ) : (
              <p className="level-up-max">You are already at the highest level.</p>
            )}
          </div>
        </section>

        <section className="card quick-stats-card">
          <h2>Quick Stats</h2>

          <div className="quick-stat-box">
            <span>Total Courses</span>
            <strong>{stats.totalCourses}</strong>
          </div>

          <div className="quick-stat-box">
            <span>Completed Courses</span>
            <strong>{stats.completedCourses}</strong>
          </div>

          <div className="quick-stat-box">
            <span>Average Progress</span>
            <strong>{stats.avgProgress}%</strong>

            <div className="progress-bar-wrapper compact">
              <div
                className="progress-bar-fill"
                style={{ width: `${stats.avgProgress}%` }}
              />
            </div>
          </div>
        </section>
      </div>

      <WeeklyActivityChart activity={data.weekly_activity ?? []} />

      <section className="card courses-section">
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
                const courseScore = c.course_score ?? 0;

                return (
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
                      <span className="progress-percent">{c.progress_percent}%</span>
                    </td>
                    <td className="center">
                      <span
                        className={`quiz-score-badge ${getQuizScoreClass(
                          courseScore
                        )}`}
                      >
                        {courseScore.toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section className="card recs-section">
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
