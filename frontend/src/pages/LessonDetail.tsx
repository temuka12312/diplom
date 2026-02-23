import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLesson } from "../api/courses";
import type { Lesson } from "../api/courses";

export default function LessonDetail() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!lessonId) return;

    getLesson(lessonId)
      .then((data) => setLesson(data))
      .catch(() => setError("Failed to load lesson"));
  }, [lessonId]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!lesson) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to={`/courses/${courseId}`}>← Back to course</Link>

      <h1>{lesson.title}</h1>
      <p>{lesson.content}</p>

      {lesson.video_url && (
        <div style={{ marginTop: 20 }}>
          <h2>Video</h2>
          {/* YouTube link бол иймэрхүү embed хийж болно, энгийн линк бол a tag ашиглаарай */}
          <iframe
            width="560"
            height="315"
            src={lesson.video_url}
            title={lesson.title}
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}