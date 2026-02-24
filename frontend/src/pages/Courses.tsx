import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../api/courses";
import type { Course } from "../api/courses";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getCourses()
      .then((data) => setCourses(data))
      .catch(() => setError("Failed to load courses"));
  }, []);

  return (
    <div>
      <h1>Courses</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {courses.map((course) => (
        <div key={course.id} style={{ marginBottom: 24 }}>
          <h2>
            <Link to={`/courses/${course.id}`}>{course.title}</Link>
          </h2>
          <p>{course.description}</p>
          <p>
            <strong>Level: </strong>
            {course.level}
          </p>
        </div>
      ))}
    </div>
  );
}
