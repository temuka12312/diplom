import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLesson } from "../api/courses";
import { getLessonProgress, completeLesson } from "../api/progress";
import type { LessonProgress } from "../api/progress";
import type { Lesson } from "../api/courses";
import {
  getLessonSummary,
  getLessonQuiz,
  type QuizQuestion,
} from "../api/ai";
import { saveQuizScore } from "../api/progress";

export default function LessonDetail() {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);

  const [quizScore, setQuizScore] = useState<number | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    Promise.all([
      getLesson(lessonId),
      getLessonProgress(lessonId).catch(() => null),
    ])
      .then(([lessonData, progressData]) => {
        setLesson(lessonData);

        if (progressData) {
          setProgress(progressData);
          setIsCompleted(progressData.is_completed);
          if (typeof progressData.score === "number") {
            setQuizScore(progressData.score);
          }
        }
      })
      .catch(() => setError("Failed to load lesson"))
      .finally(() => setLoading(false));
  }, [lessonId]);

  const handleComplete = async () => {
    if (!lesson) return;

    try {
      const updated = await completeLesson(lesson.id, lesson.score);

      setProgress(updated);
      setIsCompleted(updated.is_completed);
      setQuizScore(updated.score);

      alert("Lesson marked as completed!");
    } catch (err) {
      console.error("Complete lesson error >>>", err);
      alert("Failed to complete lesson");
    }
  };

  const handleGenerateSummary = async () => {
    if (!lessonId) return;

    try {
      setSummaryLoading(true);
      setSummaryError("");
      const res = await getLessonSummary(lessonId);
      setSummary(res.summary);
    } catch (err) {
      console.error("AI summary error >>>", err);
      setSummaryError("Failed to generate summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!lessonId) return;

    setQuizLoading(true);
    setQuizError("");
    setQuiz(null);
    setQuizResult(null);
    setAnswers({});

    try {
      const data = await getLessonQuiz(lessonId);
      setQuiz(data.questions);
    } catch (err) {
      console.error("AI quiz error >>>", err);
      setQuizError("Failed to generate quiz");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSelectOption = (qId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optionIndex,
    }));
  };

  const handleCheckQuiz = async () => {
    if (!quiz) return;

    let correct = 0;
    quiz.forEach((q) => {
      if (answers[q.id] === q.answer_index) {
        correct += 1;
      }
    });

    const percent = Math.round((correct / quiz.length) * 100);

    setQuizResult(`Таны оноо: ${correct} / ${quiz.length} (${percent}%)`);
    setQuizScore(percent);

    try {
      const updated = await completeLesson(lessonId!, percent);
      setProgress(updated);
    } catch (err) {
      console.error("Failed to save quiz score", err);
    }
  };

  if (loading || !lesson) return <p>Loading...</p>;
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

      {quizScore !== null && (
        <p style={{ marginTop: 8 }}>
          <strong>Quiz score:</strong> {quizScore}%
        </p>
      )}

      <h2>Video</h2>
      {lesson.video_url ? (
        <iframe
          width="800"
          height="450"
          src={lesson.video_url}
          allowFullScreen
        ></iframe>
      ) : (
        <p>No video for this lesson.</p>
      )}

      <hr style={{ margin: "24px 0" }} />
      <h2>AI Summary</h2>

      {summaryError && <p style={{ color: "red" }}>{summaryError}</p>}

      {summary ? (
        <p>{summary}</p>
      ) : (
        <p>
          Click the button below to generate an AI-based summary of this
          lesson.
        </p>
      )}

      <button onClick={handleGenerateSummary} disabled={summaryLoading}>
        {summaryLoading ? "Generating summary..." : "Generate AI Summary"}
      </button>

      <hr style={{ margin: "32px 0" }} />
      <h2>AI Quiz</h2>

      <button onClick={handleGenerateQuiz} disabled={quizLoading}>
        {quizLoading ? "Generating quiz..." : "Generate AI Quiz"}
      </button>

      {quizError && <p style={{ color: "red" }}>{quizError}</p>}

      {quiz && quiz.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {quiz.map((q) => (
            <div
              key={q.id}
              style={{
                border: "1px solid #eee",
                padding: 12,
                borderRadius: 4,
                marginBottom: 12,
              }}
            >
              <p>
                <strong>Q{q.id}:</strong> {q.question}
              </p>

              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {q.options.map((opt, idx) => {
                  const selected = answers[q.id] === idx;
                  const isCorrect = q.answer_index === idx;

                  return (
                    <li key={idx} style={{ marginBottom: 4 }}>
                      <label style={{ cursor: "pointer" }}>
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          checked={selected || false}
                          onChange={() => handleSelectOption(q.id, idx)}
                          style={{ marginRight: 6 }}
                        />
                        {opt}
                      </label>

                      {quizResult && selected && isCorrect && (
                        <span style={{ color: "green", marginLeft: 8 }}>
                          ✓
                        </span>
                      )}
                      {quizResult && selected && !isCorrect && (
                        <span style={{ color: "red", marginLeft: 8 }}>✗</span>
                      )}
                    </li>
                  );
                })}
              </ul>

              {quizResult && (
                <p style={{ fontSize: 12, color: "#555" }}>
                  <strong>Explanation:</strong> {q.explanation}
                </p>
              )}
            </div>
          ))}

          <button onClick={handleCheckQuiz} style={{ marginTop: 8 }}>
            Check answers
          </button>

          {quizResult && (
            <p style={{ marginTop: 8, fontWeight: "bold" }}>{quizResult}</p>
          )}
        </div>
      )}
    </div>
  );
}