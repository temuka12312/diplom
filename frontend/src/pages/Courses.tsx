import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    <div style={{ padding: "20px" }}>
      <h1>Courses</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {courses.map((course) => (
        <div key={course.id} style={{ marginBottom: "40px" }}>
          <h2>
            {/* End deer detail ruu үсэрнэ */}
            <Link to={`/courses/${course.id}`}>{course.title}</Link>
          </h2>
          <p>{course.description}</p>
          <p>Level: {course.level}</p>
        </div>
      ))}
    </div>
  );
}