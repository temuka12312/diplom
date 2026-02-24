import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLesson } from "../api/courses";
import { getLessonProgress, completeLesson } from "../api/progress";
import type { LessonProgress } from "../api/progress";

export default function LessonDetail() {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();

  const [lesson, setLesson] = useState<any | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!lessonId) return;

    Promise.all([
      getLesson(lessonId),
      getLessonProgress(lessonId).catch(() => null),
    ])
      .then(([lessonData, progressData]) => {
        setLesson(lessonData);

        if (progressData && progressData.is_completed) {
          setIsCompleted(true);
          setProgress(progressData);
        }
      })
      .catch(() => setError("Failed to load lesson"))
      .finally(() => setLoading(false));
  }, [lessonId]);

  const handleComplete = async () => {
    if (!lesson) return;

    try {
      const updated = await completeLesson(lesson.id, 0);

      setProgress(updated);
      setIsCompleted(updated.is_completed);

      alert("Lesson marked as completed!");
    } catch (err) {
      console.error("Complete lesson error >>>", err);
      alert("Failed to complete lesson");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <Link to={`/courses/${courseId}`}>← Back to course</Link>

      <h1>{lesson.title}</h1>
      <p>{lesson.content}</p>

      {isCompleted ? (
        <button disabled style={{ background: "#4CAF50", color: "white" }}>
          Completed ✓
        </button>
      ) : (
        <button onClick={handleComplete}>Mark as completed</button>
      )}

      <h2>Video</h2>
      <iframe
        width="800"
        height="450"
        src={lesson.video_url}
        allowFullScreen
      ></iframe>
    </div>
  );
}