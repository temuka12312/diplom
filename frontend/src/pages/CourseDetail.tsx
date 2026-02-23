import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourse } from "../api/courses";
import type { Course, Lesson } from "../api/courses";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    getCourse(id)
      .then((data) => setCourse(data))
      .catch(() => setError("Failed to load course"));
  }, [id]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!course) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to="/courses">← Back to courses</Link>

      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>
        <strong>Level:</strong> {course.level}
      </p>

      <h2>Lessons</h2>
      {course.lessons.length === 0 ? (
        <p>No lessons yet.</p>
      ) : (
        <ol>
          {course.lessons.map((lesson: Lesson) => (
            <li key={lesson.id}>
                <Link to={`/courses/${course.id}/lessons/${lesson.id}`}>
                <strong>{lesson.title}</strong>
                </Link>
                {lesson.video_url && (
                <>
                    {" "}
                    –{" "}
                    <a href={lesson.video_url} target="_blank" rel="noreferrer">
                    Video
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