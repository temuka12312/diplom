import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses, getMyLevelCourses } from "../api/courses";
import { meApi } from "../api/auth";
import type { Course } from "../api/courses";

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

  return (
    <div>
      <h1>Courses</h1>

      <p style={{ marginBottom: 12 }}>
        <strong>Your level:</strong> {userLevel}
      </p>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setMode("my")} style={{ marginRight: 8 }}>
          My Level
        </button>

        <button onClick={() => setMode("all")}>All Courses</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {courses.map((course) => {
            const locked = isLocked(course.level);

            return (
              <div
                key={course.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 16,
                  background: locked ? "#fafafa" : "#fff",
                  opacity: locked ? 0.75 : 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <h2 style={{ margin: 0 }}>
                    {locked ? (
                      <span>{course.title}</span>
                    ) : (
                      <Link to={`/courses/${course.id}`}>{course.title}</Link>
                    )}
                  </h2>

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
                </div>

                <p style={{ marginBottom: 12 }}>{course.description}</p>

                {locked ? (
                  <div>
                    <p style={{ color: "#b45309", marginBottom: 8 }}>
                      🔒 Locked — This course requires a higher level.
                    </p>
                    <button disabled style={{ cursor: "not-allowed" }}>
                      Locked
                    </button>
                  </div>
                ) : (
                  <Link to={`/courses/${course.id}`}>
                    <button>Open Course</button>
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