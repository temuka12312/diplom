import { useEffect, useState } from "react";
import { getCourses } from "../api/courses";

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getCourses()
      .then((res) => setCourses(res))
      .catch(() => setError("API error"));
  }, []);

  return (
    <div>
      <h1>Courses</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {courses.map((course) => (
        <div key={course.id} style={{ marginBottom: "40px" }}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <p>Level: {course.level}</p>

          <h3>Lessons:</h3>
          {course.lessons.length > 0 ? (
            <ul>
              {course.lessons.map((lesson: any) => (
                <li key={lesson.id}>
                  {lesson.title} <br />
                  {lesson.video_url && (
                    <a href={lesson.video_url} target="_blank">
                      ▶ Watch video
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No lessons found</p>
          )}
        </div>
      ))}
    </div>
  );
}