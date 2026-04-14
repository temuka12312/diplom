import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getHomeFeed,
  resolveCourseThumbnail,
  type HomeFeedResponse,
  type Course,
} from "../api/courses";
import useAuth from "../hooks/useAuth";
import LoadingState from "../components/LoadingState";

type UserLevel = "beginner" | "elementary" | "intermediate" | "advanced";

const levelLabels: Record<UserLevel, string> = {
  beginner: "Анхан",
  elementary: "Суурь",
  intermediate: "Дунд",
  advanced: "Ахисан",
};

function CourseTile({ course }: { course: Course }) {
  const levelText = levelLabels[(course.level as UserLevel) || "beginner"] || "Анхан";
  const [expanded, setExpanded] = useState(false);
  const thumbnail = resolveCourseThumbnail(course.thumbnail);

  return (
    <article className="card home-feed-card">
      <div className="home-feed-thumbnail">
        {thumbnail ? (
          <img src={thumbnail} alt={course.title} />
        ) : (
          <div className="home-feed-thumbnail-fallback">{course.track_name || "Course"}</div>
        )}
      </div>

      <div className="home-feed-card-top">
        <span className="badge">{course.track_name || "General"}</span>
        <span className="level-pill">{levelText}</span>
      </div>

      <h3>{course.title}</h3>
      <p className={`home-feed-description ${expanded ? "expanded" : ""}`}>
        {course.description || "Тухайн чиглэлийн сургалтыг эхлүүлэх курс."}
      </p>
      <button
        type="button"
        className="show-more"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? "show less" : "show more"}
      </button>

      <div className="home-feed-metrics">
        <span>{course.lesson_count || course.lessons?.length || 0} lessons</span>
        <span>{course.learner_count || 0} learners</span>
        <span>{course.liked_count || 0} likes</span>
      </div>

      <Link to={`/courses/${course.id}`} className="button">
        Курс нээх
      </Link>
    </article>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [feed, setFeed] = useState<HomeFeedResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getHomeFeed()
      .then(setFeed)
      .catch(() => setError("Home feed ачаалж чадсангүй."));
  }, []);

  const levelText =
    levelLabels[(user?.skill_level as UserLevel) || "beginner"] || "Анхан";

  if (error) {
    return (
      <div className="container page-shell">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!feed || !user) {
    return (
      <div className="container page-shell">
        <LoadingState
          title="Home feed бэлдэж байна"
          subtitle="Танд тохирсон popular course болон track-уудыг ангилж байна..."
        />
      </div>
    );
  }

  return (
    <div className="container page-shell">
      <section className="card home-hero-card">
        <div className="home-hero-copy">
          <span className="page-kicker">Home</span>
          <h1 className="page-title">Welcome back, {user.nickname || user.username}</h1>
          <p className="page-subtitle">
            Таны түвшин <strong>{levelText}</strong>. Доорх хэсгээс track-уудаар ангилсан
            popular course-уудыг үзээрэй.
          </p>

          <div className="home-hero-actions">
            <Link to="/profile" className="button">
              Profile нээх
            </Link>
            <Link to="/courses" className="button button-muted">
              Бүх курс
            </Link>
          </div>
        </div>

        <div className="home-hero-stats">
          <div className="home-stat-panel">
            <span>Түвшин</span>
            <strong>{levelText}</strong>
          </div>
          <div className="home-stat-panel">
            <span>Оноо</span>
            <strong>{user.total_score}</strong>
          </div>
          <div className="home-stat-panel">
            <span>Дуусгасан хичээл</span>
            <strong>{user.completed_lessons}</strong>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <div>
            <span className="page-kicker">Featured</span>
            <h2>Хамгийн их үзэлттэй course-ууд</h2>
          </div>
          <Link to="/courses" className="button button-muted">
            Бүгдийг харах
          </Link>
        </div>

        <div className="home-feed-grid">
          {feed.featured_courses.map((course) => (
            <CourseTile key={course.id} course={course} />
          ))}
        </div>
      </section>

      {feed.track_sections.map((section) => (
        <section key={section.id} className="home-section">
          <div className="section-head">
            <div>
              <span className="page-kicker">{section.name}</span>
              <h2>{section.name} track</h2>
              <p className="page-subtitle">
                {section.description || "Энэ чиглэлийн хамгийн идэвхтэй course-ууд."}
              </p>
            </div>
            <Link to="/tracks" className="button button-muted">
              Track-ууд
            </Link>
          </div>

          <div className="home-feed-grid">
            {section.courses.map((course) => (
              <CourseTile key={`${section.id}-${course.id}`} course={course} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
