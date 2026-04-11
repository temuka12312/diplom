import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTrackCourses, type Course } from "../api/courses";
import { meApi } from "../api/auth";
import "../style/courses.css";

type UserLevel = "beginner" | "elementary" | "intermediate" | "advanced";

const levelRank: Record<UserLevel, number> = {
  beginner: 1,
  elementary: 2,
  intermediate: 3,
  advanced: 4,
};

const levelLabels: Record<UserLevel, string> = {
  beginner: "Анхан",
  elementary: "Суурь",
  intermediate: "Дунд",
  advanced: "Ахисан",
};

export default function TrackCourses() {
  const { trackId } = useParams<{ trackId: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [userLevel, setUserLevel] = useState<UserLevel>("beginner");

  useEffect(() => {
    meApi()
      .then((user) => {
        setUserLevel((user.skill_level as UserLevel) || "beginner");
      })
      .catch(() => setUserLevel("beginner"));
  }, []);

  useEffect(() => {
    if (!trackId) return;

    getTrackCourses(trackId)
      .then(setCourses)
      .catch(() => setError("Курсүүдийг ачаалж чадсангүй."));
  }, [trackId]);

  const isLocked = (courseLevel: string) => {
    const cLevel = (courseLevel as UserLevel) || "beginner";
    return levelRank[cLevel] > levelRank[userLevel];
  };

  const getLevelClass = (level: string) => {
    if (level === "beginner") return "pill-beginner";
    if (level === "elementary") return "pill-elementary";
    if (level === "intermediate") return "pill-intermediate";
    return "pill-advanced";
  };

  const getLevelLabel = (level: string) =>
    levelLabels[(level as UserLevel) || "beginner"] || "Анхан";

  return (
    <div className="container page-shell">
      <div className="back-link-wrap">
        <Link className="back-link" to="/courses">
          ← Чиглэлүүд рүү буцах
        </Link>
      </div>

      <div className="page-header">
        <h1 className="page-title page-kicker">{courses[0]?.track_name || "Курсүүд"}</h1>
        <p className="page-subtitle">
          Энэ чиглэлд хамаарах сургалтын агуулгууд.
        </p>
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
                <div className="course-card-head">
                  <h2 className="course-title page-kicker">
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
                       Илүү өндөр түвшин шаардлагатай.
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