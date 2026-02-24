import { useEffect, useState } from "react";
import { getProgressSummary, type ProgressSummary } from "../api/progress";

export default function Home() {
  const [data, setData] = useState<ProgressSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProgressSummary()
      .then(setData)
      .catch(() => setError("Failed to load profile"));
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Profile</h1>

      <p><strong>Username:</strong> {data.username}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Role:</strong> {data.role}</p>
      <p><strong>Skill level:</strong> {data.skill_level}</p>
      <p><strong>Total score:</strong> {data.total_score}</p>
      <p><strong>Completed lessons:</strong> {data.completed_lessons}</p>

      <h2>Course progress</h2>
      {data.courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <ul>
          {data.courses.map((c) => (
            <li key={c.course_id}>
              {c.course_title} – {c.progress_percent}% (
              {c.completed_lessons}/{c.total_lessons} lessons)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}