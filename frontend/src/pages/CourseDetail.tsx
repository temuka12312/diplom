import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourse } from "../api/courses";
import { meApi } from "../api/auth";
import type { Course, Lesson } from "../api/courses";

type UserLevel = "beginner" | "intermediate" | "advanced";

const levelRank: Record<UserLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
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

  const getLevelBadgeStyle = (level: string) => {
    if (level === "beginner") {
      return {
        background: "#e8f5e9",
        color: "#2e7d32",
      };
    }
    if (level === "intermediate") {
      return {
        background: "#fff8e1",
        color: "#ef6c00",
      };
    }
    return {
      background: "#ffebee",
      color: "#c62828",
    };
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!course) {
    return <p>Loading...</p>;
  }

  const locked =
    levelRank[(course.level as UserLevel) || "beginner"] > levelRank[userLevel];

  if (locked) {
    return (
      <div>
        <Link to="/courses">← Back to courses</Link>

        <div
          style={{
            marginTop: 20,
            border: "1px solid #f5c2c7",
            background: "#fff5f5",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h1 style={{ marginTop: 0 }}>{course.title}</h1>

          <p style={{ marginBottom: 12 }}>{course.description}</p>

          <span
            style={{
              ...getLevelBadgeStyle(course.level),
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              textTransform: "capitalize",
              display: "inline-block",
              marginBottom: 16,
            }}
          >
            {course.level}
          </span>

          <p style={{ color: "#b91c1c", fontWeight: 600 }}>
            🔒 This course is locked for your current level.
          </p>
          <p>
            Your current level: <strong>{userLevel}</strong>
          </p>
          <p>
            Reach <strong>{course.level}</strong> level to access this course.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link to="/courses">← Back to courses</Link>

      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>
        <strong>Level:</strong>{" "}
        <span
          style={{
            ...getLevelBadgeStyle(course.level),
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            textTransform: "capitalize",
          }}
        >
          {course.level}
        </span>
      </p>

      <h2>Lessons</h2>
      {course.lessons.length === 0 ? (
        <p>No lessons yet.</p>
      ) : (
        <ol>
          {course.lessons.map((lesson: Lesson) => (
            <li key={lesson.id} style={{ marginBottom: 10 }}>
              <Link to={`/courses/${course.id}/lessons/${lesson.id}`}>
                <strong>{lesson.title}</strong>
              </Link>

              {lesson.video_url && (
                <>
                  {" – "}
                  <a href={lesson.video_url} target="_blank" rel="noreferrer">
                    Video
                  </a>
                </>
              )}

              {lesson.file && (
                <>
                  {" – "}
                  <a href={lesson.file} target="_blank" rel="noreferrer">
                    PDF
                  </a>
                </>
              )}

              {lesson.attachment && (
                <>
                  {" – "}
                  <a href={lesson.attachment} target="_blank" rel="noreferrer">
                    Attachment
                  </a>
                </>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}