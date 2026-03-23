import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses, getMyLevelCourses } from "../api/courses";
import { meApi } from "../api/auth";
import type { Course } from "../api/courses";
import "../style/courses.css";

type UserLevel = "beginner" | "intermediate" | "advanced";

const levelRank: Record<UserLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

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

  const getLevelClass = (level: string) => {
    if (level === "beginner") return "pill-beginner";
    if (level === "intermediate") return "pill-intermediate";
    return "pill-advanced";
  };

  return (
    <div className="container page-shell">
      <div className="page-header">
        <span className="page-kicker">Learning Paths</span>
        <h1 className="page-title">Courses</h1>
        <p className="page-subtitle">
          Unlock courses based on your current level and progress.
        </p>
      </div>

      <div className="card courses-topbar">
        <div>
          <p className="mini-label">Your level</p>
          <span className={`level-pill ${getLevelClass(userLevel)}`}>
            {userLevel}
          </span>
        </div>

        <div className="mode-switch">
          <button
            className={`button ${mode === "my" ? "" : "button-muted"}`}
            onClick={() => setMode("my")}
          >
            My Level
          </button>

          <button
            className={`button ${mode === "all" ? "" : "button-muted"}`}
            onClick={() => setMode("all")}
          >
            All Courses
          </button>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => {
            const locked = isLocked(course.level);

            return (
              <div
                key={course.id}
                className={`card course-card ${locked ? "course-card-locked" : ""}`}
              >
                <div className="course-card-head">
                  <h2 className="course-title">
                    {locked ? (
                      <span>{course.title}</span>
                    ) : (
                      <Link to={`/courses/${course.id}`}>{course.title}</Link>
                    )}
                  </h2>

                  <span className={`level-pill ${getLevelClass(course.level)}`}>
                    {course.level}
                  </span>
                </div>

                <p className={`course-description ${expanded === course.id ? "expanded" : ""}`}>
                  {course.description}
                </p>

                <button
                  className="show-more"
                  onClick={() =>
                    setExpanded(expanded === course.id ? null : course.id)
                  }
                >
                  {expanded === course.id ? "show less" : "..."}
                </button>

                {locked ? (
                  <div className="locked-box">
                    <p className="warning-text">
                      🔒 Locked — This course requires a higher level.
                    </p>
                    <button className="button button-muted" disabled>
                      Locked
                    </button>
                  </div>
                ) : (
                  <Link to={`/courses/${course.id}`}>
                    <button className="button">Open Course</button>
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