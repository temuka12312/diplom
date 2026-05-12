import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourse } from "../api/courses";
import { meApi } from "../api/auth";
import type { Course, Lesson } from "../api/courses";
import LoadingState from "../components/LoadingState";
import { getLevelClass, getLevelLabel, levelRank, type UserLevel } from "../utils/levels";

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
        <LoadingState
          title="Курс ачаалж байна"
          subtitle="Хичээлийн бүтэц болон түвшний мэдээллийг бэлдэж байна..."
        />
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
