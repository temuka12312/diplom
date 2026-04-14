import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCourses,
  resolveCourseThumbnail,
  type Course,
} from "../api/courses";
import {
  getProgressSummary,
  type ProgressSummary,
  type CourseProgress,
} from "../api/progress";
import LoadingState from "../components/LoadingState";

type JoinedCourse = Course & {
  progress: CourseProgress;
};

export default function MyLearning() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getCourses(), getProgressSummary()])
      .then(([coursesData, summaryData]) => {
        setCourses(coursesData);
        setSummary(summaryData);
      })
      .catch(() => setError("My learning мэдээллийг ачаалж чадсангүй."))
      .finally(() => setLoading(false));
  }, []);

  const startedCourses = useMemo<JoinedCourse[]>(() => {
    if (!summary) return [];

    const startedMap = new Map(
      summary.courses
        .filter((course) => course.completed_lessons > 0 || course.progress_percent > 0)
        .map((course) => [course.course_id, course])
    );

    return courses
      .filter((course) => startedMap.has(course.id))
      .map((course) => ({
        ...course,
        progress: startedMap.get(course.id)!,
      }))
      .sort((a, b) => b.progress.progress_percent - a.progress.progress_percent);
  }, [courses, summary]);

  if (loading) {
    return (
      <div className="container page-shell">
        <LoadingState
          title="My learning ачаалж байна"
          subtitle="Таны үзсэн course-уудыг нэгтгэж байна..."
        />
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

  return (
    <div className="container page-shell">
      <div className="page-header">
        <span className="page-kicker">My Learning</span>
        <h1 className="page-title">Үзсэн course-ууд</h1>
        <p className="page-subtitle">
          Таны эхэлсэн, үргэлжлүүлж байгаа болон дуусгасан course-ууд энд харагдана.
        </p>
      </div>

      {startedCourses.length === 0 ? (
        <div className="card">
          <p>Та одоогоор course үзэж эхлээгүй байна.</p>
        </div>
      ) : (
        <div className="home-feed-grid">
          {startedCourses.map((course) => {
            const thumbnail = resolveCourseThumbnail(course.thumbnail);
            const isCompleted =
              course.progress.total_lessons > 0 &&
              course.progress.completed_lessons === course.progress.total_lessons;

            return (
              <article key={course.id} className="card home-feed-card">
                <div className="home-feed-thumbnail">
                  {thumbnail ? (
                    <img src={thumbnail} alt={course.title} />
                  ) : (
                    <div className="home-feed-thumbnail-fallback">
                      {course.track_name || "Course"}
                    </div>
                  )}
                </div>

                <div className="home-feed-card-top">
                  <span className="badge">{course.track_name || "General"}</span>
                  <span className={`badge ${isCompleted ? "my-learning-complete" : ""}`}>
                    {isCompleted ? "Completed" : "In progress"}
                  </span>
                </div>

                <h3>{course.title}</h3>
                <ExpandableDescription text={course.description} />

                <div className="my-learning-progress">
                  <div className="progress-bar-wrapper">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${course.progress.progress_percent}%` }}
                    />
                  </div>
                  <div className="my-learning-progress-meta">
                    <span>{course.progress.progress_percent}% completed</span>
                    <span>
                      {course.progress.completed_lessons}/{course.progress.total_lessons} lessons
                    </span>
                  </div>
                </div>

                <Link to={`/courses/${course.id}`} className="button">
                  {isCompleted ? "Дахин үзэх" : "Үргэлжлүүлэх"}
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ExpandableDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <p className={`home-feed-description ${expanded ? "expanded" : ""}`}>
        {text}
      </p>
      <button
        type="button"
        className="show-more"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? "show less" : "show more"}
      </button>
    </>
  );
}
