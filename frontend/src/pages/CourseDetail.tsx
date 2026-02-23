import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseDetail } from "../api/courses";

export default function CourseDetail() {
  const { id } = useParams(); // /courses/:id
  const [course, setCourse] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    getCourseDetail(Number(id))
      .then((res) => setCourse(res))
      .catch(() => setError("API error"));
  }, [id]);

  if (error) {
    return (
      <div>
        <h1>Course Detail</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <h1>Course Detail</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/courses">← Back to courses</Link>

      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>
        <b>Level:</b> {course.level}
      </p>

      <h2>Lessons</h2>
      {course.lessons && course.lessons.length > 0 ? (
        <ul>
          {course.lessons.map((lesson: any) => (
            <li key={lesson.id} style={{ marginBottom: "10px" }}>
              <b>{lesson.title}</b> <br />
              {lesson.video_url && (
                <a href={lesson.video_url} target="_blank" rel="noreferrer">
                  ▶ Watch video
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No lessons yet</p>
      )}
    </div>
  );
}