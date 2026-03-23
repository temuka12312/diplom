import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLesson } from "../api/courses";
import { getLessonProgress, completeLesson } from "../api/progress";
import type { LessonProgress } from "../api/progress";
import type { Lesson } from "../api/courses";
import {
  getLessonSummary,
  getLessonQuiz,
  type LessonQuizQuestion,
} from "../api/ai";

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

  const [quiz, setQuiz] = useState<LessonQuizQuestion[] | null>(null);
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
      setIsCompleted(updated.is_completed);
    } catch (err) {
      console.error("Failed to save quiz score", err);
    }
  };

  if (loading) {
    return (
      <div className="container page-shell">
        <p className="loading-text">Loading lesson...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page-shell">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container page-shell">
        <p>Lesson not found.</p>
      </div>
    );
  }

  return (
    <div className="container page-shell">
      <div className="back-link-wrap">
        <Link className="back-link" to={`/courses/${courseId}`}>
          ← Back to course
        </Link>
      </div>

      <div className="card lesson-hero-card">
        <div className="lesson-hero-top">
          <div>
            <span className="page-kicker">Lesson Detail</span>
            <h1 className="page-title lesson-title">{lesson.title}</h1>
          </div>

          {isCompleted ? (
            <span className="status-pill success">Completed ✓</span>
          ) : (
            <button className="button" onClick={handleComplete}>
              Mark as completed
            </button>
          )}
        </div>

        <p className="lesson-content">{lesson.content}</p>

        {quizScore !== null && (
          <div className="lesson-score-box">
            <strong>Quiz score:</strong> {quizScore}%
          </div>
        )}
      </div>

      <div className="card">
        <h2>🎥 Video</h2>
        {lesson.video_url ? (
          <div className="video-frame-wrap">
            <iframe
              className="video-frame"
              src={lesson.video_url}
              allowFullScreen
              title={lesson.title}
            />
          </div>
        ) : (
          <p>No video for this lesson.</p>
        )}
      </div>

      <div className="card">
        <div className="section-head">
          <h2>🤖 AI Summary</h2>
          <button className="button" onClick={handleGenerateSummary} disabled={summaryLoading}>
            {summaryLoading ? "Generating..." : "Generate Summary"}
          </button>
        </div>

        {summaryError && <p className="error-text">{summaryError}</p>}

        {summary ? (
          <div className="summary-box">{summary}</div>
        ) : (
          <p>Click the button to generate an AI-based summary of this lesson.</p>
        )}
      </div>

      <div className="card">
        <div className="section-head">
          <h2>🧠 AI Quiz</h2>
          <button className="button" onClick={handleGenerateQuiz} disabled={quizLoading}>
            {quizLoading ? "Generating..." : "Generate AI Quiz"}
          </button>
        </div>

        {quizError && <p className="error-text">{quizError}</p>}

        {quiz && quiz.length > 0 && (
          <div className="quiz-wrap">
            {quiz.map((q) => (
              <div key={q.id} className="quiz-question-card">
                <p className="question-title">
                  <span className="question-number">Q{q.id}</span>
                  {q.question}
                </p>

                <ul className="option-list">
                  {q.options.map((opt, idx) => {
                    const selected = answers[q.id] === idx;
                    const isCorrect = q.answer_index === idx;

                    return (
                      <li key={idx}>
                        <label className="option-item">
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            checked={selected || false}
                            onChange={() => handleSelectOption(q.id, idx)}
                          />
                          <span>{opt}</span>
                        </label>

                        {quizResult && selected && isCorrect && (
                          <span className="inline-feedback success-text">✓ Correct</span>
                        )}
                        {quizResult && selected && !isCorrect && (
                          <span className="inline-feedback error-text">✗ Incorrect</span>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {quizResult && (
                  <p className="explanation-text">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                )}
              </div>
            ))}

            <div className="action-row">
              <button className="button" onClick={handleCheckQuiz}>
                Check answers
              </button>
            </div>

            {quizResult && <p className="result-text">{quizResult}</p>}
          </div>
        )}
      </div>
    </div>
  );
}