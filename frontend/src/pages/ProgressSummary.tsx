import { useEffect, useState } from "react";
import { getProgressSummary } from "../api/progress";
import type { ProgressSummary, CourseProgress } from "../api/progress";

export default function ProgressSummaryPage() {
  const [data, setData] = useState<ProgressSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProgressSummary()
      .then(setData)
      .catch(() => setError("Failed to load progress summary"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!data) return <p>No data.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>My Progress</h1>

      <section style={{ marginBottom: 24 }}>
        <h2>User info</h2>
        <p>
          <strong>Username:</strong> {data.username}
        </p>
        <p>
          <strong>Email:</strong> {data.email}
        </p>
        <p>
          <strong>Role:</strong> {data.role ?? "N/A"}
        </p>
        <p>
          <strong>Skill level:</strong> {data.skill_level ?? "N/A"}
        </p>
        <p>
          <strong>Total score:</strong> {data.total_score}
        </p>
        <p>
          <strong>Completed lessons:</strong> {data.completed_lessons}
        </p>
      </section>

      <section>
        <h2>Course progress</h2>
        {data.courses.length === 0 ? (
          <p>No courses yet.</p>
        ) : (
          <table
            style={{
              borderCollapse: "collapse",
              minWidth: "60%",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: 8 }}>Course</th>
                <th style={{ border: "1px solid #ccc", padding: 8 }}>
                  Completed
                </th>
                <th style={{ border: "1px solid #ccc", padding: 8 }}>
                  Total lessons
                </th>
                <th style={{ border: "1px solid #ccc", padding: 8 }}>
                  Progress
                </th>
              </tr>
            </thead>
            <tbody>
              {data.courses.map((c: CourseProgress) => (
                <tr key={c.course_id}>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>
                    {c.course_title}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>
                    {c.completed_lessons}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>
                    {c.total_lessons}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>
                    {c.progress_percent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}