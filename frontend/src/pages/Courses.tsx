import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses, getMyLevelCourses, resolveCourseThumbnail } from "../api/courses";
import { meApi } from "../api/auth";
import type { Course } from "../api/courses";
import { getLevelClass, getLevelLabel, levelRank, type UserLevel } from "../utils/levels";
import "../style/courses.css";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"my" | "all">("my");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [userLevel, setUserLevel] = useState<UserLevel>("beginner");

  useEffect(() => {
    meApi()
      .then((user) => {
        setUserLevel((user.skill_level as UserLevel) || "beginner");
      })
      .catch(() => {
        setUserLevel("beginner");
      });
  }, []);

  useEffect(() => {
    const loader = mode === "my" ? getMyLevelCourses : getCourses;

    loader()
      .then((data) => setCourses(data))
      .catch(() => setError("Failed to load courses"));
  }, [mode]);

  const isLocked = (courseLevel: string) => {
    const cLevel = (courseLevel as UserLevel) || "beginner";
    return levelRank[cLevel] > levelRank[userLevel];
  };

  return (
    <div className="container page-shell">
      <div className="page-header">
        <span className="page-kicker">Learning Paths</span>
        <h1 className="page-title">Курсүүд</h1>
        <p className="page-subtitle">
          Таны түвшин, ахицад тохирсон курсүүдийг эндээс үзнэ.
        </p>
      </div>

      <div className="card courses-topbar">
        <div>
          <p className="mini-label">Таны түвшин</p>
          <span className={`level-pill ${getLevelClass(userLevel)}`}>
            {getLevelLabel(userLevel)}
          </span>
        </div>

        <div className="mode-switch">
          <button
            className={`button ${mode === "my" ? "" : "button-muted"}`}
            onClick={() => setMode("my")}
          >
            Миний түвшин
          </button>

          <button
            className={`button ${mode === "all" ? "" : "button-muted"}`}
            onClick={() => setMode("all")}
          >
            Бүх курс
          </button>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {courses.length === 0 ? (
        <p>Курс олдсонгүй.</p>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => {
            const locked = isLocked(course.level);

            return (
              <div
                key={course.id}
                className={`card course-card ${locked ? "course-card-locked" : ""}`}
              >
                <div className="course-card-thumbnail">
                  {resolveCourseThumbnail(course.thumbnail) ? (
                    <img src={resolveCourseThumbnail(course.thumbnail) || ""} alt={course.title} />
                  ) : (
                    <div className="course-card-thumbnail-fallback">
                      {course.track_name || "Course"}
                    </div>
                  )}
                </div>

                <div className="course-card-head">
                  <h2 className="course-title">
                    {locked ? (
                      <span>{course.title}</span>
                    ) : (
                      <Link to={`/courses/${course.id}`}>{course.title}</Link>
                    )}
                  </h2>

                  <span className={`level-pill ${getLevelClass(course.level)}`}>
                    {getLevelLabel(course.level)}
                  </span>
                </div>

                <p
                  className={`course-description ${
                    expanded === course.id ? "expanded" : ""
                  }`}
                >
                  {course.description}
                </p>

                <button
                  type="button"
                  className="show-more"
                  onClick={() =>
                    setExpanded(expanded === course.id ? null : course.id)
                  }
                >
                  {expanded === course.id ? "Хураах" : "..."}
                </button>

                {locked ? (
                  <div className="locked-box">
                    <p className="warning-text">
                      🔒 Энэ курсийг үзэхийн тулд илүү өндөр түвшин хэрэгтэй.
                    </p>
                    <button className="button button-muted" disabled>
                      Түгжээтэй
                    </button>
                  </div>
                ) : (
                  <Link to={`/courses/${course.id}`}>
                    <button className="button">Курс нээх</button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
