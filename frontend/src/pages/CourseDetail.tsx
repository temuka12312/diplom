import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourse } from "../api/courses";
import { meApi } from "../api/auth";
import type { Course, Lesson } from "../api/courses";

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

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState("");
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
    if (!id) return;

    getCourse(id)
      .then((data) => setCourse(data))
      .catch(() => setError("Failed to load course"));
  }, [id]);

  const getLevelClass = (level: string) => {
    if (level === "beginner") return "pill-beginner";
    if (level === "elementary") return "pill-elementary";
    if (level === "intermediate") return "pill-intermediate";
    return "pill-advanced";
  };

  const getLevelLabel = (level: string) => {
    return levelLabels[(level as UserLevel) || "beginner"] || "Анхан";
  };

  if (error) {
    return (
      <div className="container page-shell">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container page-shell">
        <p className="loading-text">Loading course...</p>
      </div>
    );
  }

  const locked =
    levelRank[(course.level as UserLevel) || "beginner"] > levelRank[userLevel];

  if (locked) {
    return (
      <div className="container page-shell">
        <div className="back-link-wrap">
          <Link className="back-link" to="/courses">
            ← Курсүүд рүү буцах
          </Link>
        </div>

        <div className="card locked-course-card">
          <span className="page-kicker">Locked Course</span>
          <h1 className="page-title page-kicker">{course.title}</h1>
          <p className="course-description">{course.description}</p>

          <span className={`level-pill ${getLevelClass(course.level)}`}>
            {getLevelLabel(course.level)}
          </span>

          <p className="warning-text" style={{ marginTop: 16 }}>
             Энэ курс таны одоогийн түвшинд хаалттай байна.
          </p>
          <p>
            Таны түвшин: <strong>{getLevelLabel(userLevel)}</strong>
          </p>
          <p>
            Энэ курсийг үзэхийн тулд <strong>{getLevelLabel(course.level)}</strong>{" "}
            түвшинд хүрэх шаардлагатай.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-shell">
      <div className="back-link-wrap">
        <Link className="back-link" to="/courses">
          ← Курсүүд рүү буцах
        </Link>
      </div>

      <div className="card">
        <h1 className="page-title page-kicker">{course.title}</h1>
        <p className="course-description">{course.description}</p>
        <span className={`level-pill ${getLevelClass(course.level)}`}>
          {getLevelLabel(course.level)}
        </span>
      </div>

      <div className="card">
        <h2>Хичээлүүд</h2>
        {course.lessons.length === 0 ? (
          <p>Одоогоор хичээл алга.</p>
        ) : (
          <div className="lesson-list">
            {course.lessons.map((lesson: Lesson) => (
              <Link to={`/courses/${course.id}/lessons/${lesson.id}`}>
                <div key={lesson.id} className="lesson-list-item">
                  <strong className="page-kicker">{lesson.title}</strong>
                  <div className="lesson-links">
                    {lesson.video_url && (
                      <a href={lesson.video_url} target="_blank" rel="noreferrer">
                        Video
                      </a>
                    )}

                    {lesson.file && (
                      <a href={lesson.file} target="_blank" rel="noreferrer">
                        PDF
                      </a>
                    )}

                    {lesson.attachment && (
                      <a href={lesson.attachment} target="_blank" rel="noreferrer">
                        Attachment
                      </a>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}