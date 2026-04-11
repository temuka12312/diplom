import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLesson } from "../api/courses";
import type { Lesson } from "../api/courses";
import { runPythonCode } from "../api/compiler";
import { completeLesson, getLessonProgress } from "../api/progress";
import type { LessonProgress } from "../api/progress";
import {
  getLessonQuiz,
  getLessonSummary,
  type LessonQuizQuestion,
} from "../api/ai";
import {
  createCommunityComment,
  createCommunityPost,
  getCommunityPosts,
  type CommunityPost,
} from "../api/community";
import { getApiErrorMessage } from "../api/axios";
import "../style/lesson-detail.css";

type PracticeMode = "python" | "web" | "text";

export default function LessonDetail() {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [, setProgress] = useState<LessonProgress | null>(null);
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

  const [discussionPosts, setDiscussionPosts] = useState<CommunityPost[]>([]);
  const [discussionLoading, setDiscussionLoading] = useState(false);
  const [discussionError, setDiscussionError] = useState("");
  const [discussionText, setDiscussionText] = useState("");
  const [discussionComments, setDiscussionComments] = useState<
    Record<number, string>
  >({});

  const [videoCompleted, setVideoCompleted] = useState(false);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExpected, setShowExpected] = useState(false);
  const [practiceFeedback, setPracticeFeedback] = useState<string | null>(null);

  const [runnerLoading, setRunnerLoading] = useState(false);
  const [runnerOutput, setRunnerOutput] = useState("");
  const [runnerError, setRunnerError] = useState("");

  const hasPractice = useMemo(() => {
    return Boolean(
      lesson?.practice_title?.trim() ||
        lesson?.practice_description?.trim() ||
        lesson?.practice_hint?.trim() ||
        lesson?.practice_expected_output?.trim()
    );
  }, [lesson]);

  const hasVideo = useMemo(() => {
    return Boolean(lesson?.video_url || lesson?.video_file);
  }, [lesson]);

  const practiceMode = useMemo<PracticeMode>(() => {
    const source = `
      ${lesson?.title || ""}
      ${lesson?.content || ""}
      ${lesson?.practice_title || ""}
      ${lesson?.practice_description || ""}
      ${lesson?.practice_hint || ""}
    `.toLowerCase();

    if (
      source.includes("html") ||
      source.includes("css") ||
      source.includes("javascript") ||
      source.includes("js") ||
      source.includes("web")
    ) {
      return "web";
    }

    if (
      source.includes("python") ||
      source.includes("print(") ||
      source.includes("def ") ||
      source.includes("list") ||
      source.includes("tuple")
    ) {
      return "python";
    }

    return "text";
  }, [lesson]);

  const previewDocument = useMemo(() => {
    if (practiceMode !== "web") return "";

    const code = practiceAnswer || "";
    const source = `
      ${lesson?.title || ""}
      ${lesson?.content || ""}
      ${lesson?.practice_description || ""}
    `.toLowerCase();

    const looksLikeHtml =
      code.includes("<div") ||
      code.includes("<h1") ||
      code.includes("<p") ||
      code.includes("<html") ||
      code.includes("<body");

    const looksLikeJs =
      source.includes("javascript") || source.includes("js");

    const looksLikeCss =
      !looksLikeHtml &&
      (code.includes("{") ||
        code.includes("color:") ||
        code.includes("font-size") ||
        code.includes("background:") ||
        code.includes("text-align"));

    if (looksLikeHtml) {
      return code;
    }

    if (looksLikeJs) {
      return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
    font-family: Arial, sans-serif;
    padding: 20px;
    background: #182142;
    color: #e2e8f0;
  }
  .box {
    padding: 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.14);
    margin-top: 12px;
  }
  button {
    padding: 10px 16px;
    border-radius: 10px;
    border: none;
    background: #6366f1;
    color: white;
    cursor: pointer;
  }
  </style>
</head>
<body>
  <h1>JavaScript Preview</h1>
  <button id="demoBtn">Click me</button>
  <div id="output" class="box">Output энд харагдана</div>
  <script>
    try {
      ${code}
    } catch (e) {
      document.getElementById("output").innerText = "JS Error: " + e.message;
    }
  </script>
</body>
</html>
      `;
    }

    if (looksLikeCss) {
      return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
    font-family: Arial, sans-serif;
    padding: 20px;
    background: white;
    color: #111827;
  }

  .preview-wrap {
    max-width: 700px;
    margin: 0 auto;
  }

  button {
    padding: 10px 16px;
    border-radius: 10px;
    border: none;
    background: #6366f1;
    color: white;
    cursor: pointer;
  }

    ${code}
  </style>
</head>
<body>
  <div class="preview-wrap">
    <h1>LOTUS Learn Demo Title</h1>
    <p class="content-text">This is preview text for your CSS task.</p>
    <button>Demo Button</button>
  </div>
</body>
</html>
      `;
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
    font-family: Arial, sans-serif;
    padding: 20px;
    background: #182142;
    color: #e2e8f0;
  }
  </style>
</head>
<body>
  <div>Preview mode</div>
  <pre>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
</body>
</html>
    `;
  }, [practiceAnswer, practiceMode, lesson]);

  const canMarkDone = useMemo(() => {
    if (!lesson || isCompleted) return false;

    if (hasVideo && hasPractice) return videoCompleted && practiceSubmitted;
    if (hasVideo) return videoCompleted;
    if (hasPractice) return practiceSubmitted;

    return true;
  }, [lesson, isCompleted, hasVideo, hasPractice, videoCompleted, practiceSubmitted]);

  const loadDiscussion = useCallback(async () => {
    if (!lessonId) return;

    try {
      setDiscussionLoading(true);
      setDiscussionError("");
      const data = await getCommunityPosts(lessonId);
      setDiscussionPosts(data);
    } catch (err) {
      console.error("Discussion load error >>>", err);
      setDiscussionError("Failed to load discussion");
    } finally {
      setDiscussionLoading(false);
    }
  }, [lessonId]);

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

    loadDiscussion();
  }, [lessonId, loadDiscussion]);

  const handleComplete = async () => {
    if (!lesson || !canMarkDone) return;

    try {
      const bonus = practiceSubmitted ? lesson.practice_bonus_score || 0 : 0;
      const finalScore = quizScore !== null ? quizScore + bonus : lesson.score + bonus;

      const updated = await completeLesson(lesson.id, finalScore);
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

    try {
      setQuizLoading(true);
      setQuizError("");
      setQuiz(null);
      setQuizResult(null);
      setAnswers({});

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

  const handleCheckQuiz = () => {
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
  };

  const handlePracticeSubmit = () => {
    const value = practiceAnswer.trim();

    if (!value) {
      setPracticeFeedback("Эхлээд даалгаврын хариултаа бичнэ үү.");
      return;
    }

    setPracticeSubmitted(true);
    setPracticeFeedback(
      "Даалгавар submit хийгдлээ. Одоо хичээлээ дууссан гэж тэмдэглэх боломжтой."
    );
  };

  const handleRunCode = async () => {
    if (!practiceAnswer.trim()) {
      setRunnerOutput("");
      setRunnerError("Эхлээд кодоо бичнэ үү.");
      return;
    }

    try {
      setRunnerLoading(true);
      setRunnerOutput("");
      setRunnerError("");

      const res = await runPythonCode(practiceAnswer);
      setRunnerOutput(res.output || "");
      setRunnerError(res.error || "");
    } catch (err: unknown) {
      setRunnerOutput("");
      setRunnerError(
        getApiErrorMessage(err, "Код ажиллуулах үед алдаа гарлаа.")
      );
    } finally {
      setRunnerLoading(false);
    }
  };

  const handleCreateDiscussionPost = async () => {
    if (!lessonId || !discussionText.trim()) return;

    try {
      await createCommunityPost({
        title: "",
        content: discussionText.trim(),
        lesson: Number(lessonId),
      });
      setDiscussionText("");
      loadDiscussion();
    } catch (err: unknown) {
      console.error("Create discussion post error >>>", err);
      setDiscussionError(
        getApiErrorMessage(err, "Failed to create discussion post")
      );
    }
  };

  const handleCreateDiscussionComment = async (postId: number) => {
    const value = discussionComments[postId]?.trim();
    if (!value) return;

    try {
      await createCommunityComment({
        post: postId,
        content: value,
      });

      setDiscussionComments((prev) => ({
        ...prev,
        [postId]: "",
      }));

      loadDiscussion();
    } catch (err: unknown) {
      console.error("Create discussion comment error >>>", err);
      setDiscussionError(getApiErrorMessage(err, "Failed to add comment"));
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
    <div className="container page-shell lesson-page">
      <div className="back-link-wrap">
        <Link className="back-link" to={`/courses/${courseId}`}>
          ← Back to course
        </Link>
      </div>

      <div className="lesson-top-grid">
        <div className="card lesson-hero-card">
          <div className="lesson-hero-top">
            <div>
              <span className="page-kicker">Lesson</span>
              <h1 className="page-title lesson-title">{lesson.title}</h1>
            </div>

            {isCompleted ? (
              <span className="status-pill success">Completed ✓</span>
            ) : (
              <button
                className="button"
                onClick={handleComplete}
                disabled={!canMarkDone}
              >
                Mark as completed
              </button>
            )}
          </div>

          <p className="lesson-content">{lesson.content}</p>

          {quizScore !== null && (
            <div className="lesson-score-box">
              <strong>Current score:</strong> {quizScore}
              {practiceSubmitted && lesson.practice_bonus_score
                ? ` + ${lesson.practice_bonus_score} bonus`
                : ""}
            </div>
          )}
        </div>

        <div className="card sticky-side-card lesson-progress-card">
          <div className="practice-side-label">Lesson Progress</div>

          <div className="progress-check-list">
            <div
              className={`progress-check-item ${
                !hasVideo || videoCompleted ? "done" : ""
              }`}
            >
              <span>{!hasVideo || videoCompleted ? "✓" : "•"}</span>
              <span>{hasVideo ? "Видео үзэж дуусгах" : "Видео шаардлагагүй"}</span>
            </div>

            <div
              className={`progress-check-item ${
                !hasPractice || practiceSubmitted ? "done" : ""
              }`}
            >
              <span>{!hasPractice || practiceSubmitted ? "✓" : "•"}</span>
              <span>
                {hasPractice
                  ? "Practice task submit хийх"
                  : "Practice task шаардлагагүй"}
              </span>
            </div>
          </div>

          <button
            className="button side-complete-btn"
            disabled={!canMarkDone || isCompleted}
            onClick={handleComplete}
          >
            {isCompleted ? "Completed" : "Mark Done"}
          </button>

          {!isCompleted && !canMarkDone && (
            <p className="side-note">
              Хичээлийн шаардлагуудыг гүйцээсний дараа идэвхжинэ.
            </p>
          )}
        </div>
      </div>

      <div className="lesson-bottom-layout">
        <div className="lesson-bottom-main">
          <div className="card lesson-video-card">
            <h2 className="page-kicker">Video</h2>

            {lesson.video_url ? (
              <>
                <div className="video-frame-wrap">
                  <iframe
                    className="video-frame"
                    src={lesson.video_url}
                    allowFullScreen
                    title={lesson.title}
                  />
                </div>

                {!videoCompleted ? (
                  <div className="video-complete-row">
                    <button
                      className="button"
                      type="button"
                      onClick={() => setVideoCompleted(true)}
                    >
                      Бичлэг үзэж дууслаа
                    </button>
                  </div>
                ) : (
                  <p className="success-text">✓ Видео бүрэн үзэгдлээ.</p>
                )}
              </>
            ) : lesson.video_file ? (
              <>
                <div className="video-frame-wrap">
                  <video
                    className="lesson-video-player"
                    controls
                    onEnded={() => setVideoCompleted(true)}
                  >
                    <source src={lesson.video_file} />
                  </video>
                </div>

                {videoCompleted && (
                  <p className="success-text">✓ Видео бүрэн үзэгдлээ.</p>
                )}
              </>
            ) : (
              <p>No video for this lesson.</p>
            )}

            {hasVideo && !videoCompleted && (
              <p className="hint-note">
                Видеог бүрэн үзсэний дараа completion unlock-д нөлөөлнө.
              </p>
            )}
          </div>

          {hasPractice && (
            <div className="card practice-card">
              <div className="practice-head">
                <div>
                  <span className="page-kicker">Practice Task</span>
                  <h2 className="practice-title">
                    {lesson.practice_title || "Жижиг практик даалгавар"}
                  </h2>
                </div>

                <div className="practice-bonus-badge">
                  +{lesson.practice_bonus_score || 5} bonus
                </div>
              </div>

              <div className="practice-task-box">
                <div className="practice-label">Даалгавар</div>
                <p className="practice-text">
                  {lesson.practice_description || "Practice task байхгүй байна."}
                </p>
              </div>

              {!!lesson.practice_hint && (
                <div className="practice-action-box">
                  <button
                    type="button"
                    className="button button-muted"
                    onClick={() => setShowHint((prev) => !prev)}
                  >
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </button>

                  {showHint && (
                    <div className="practice-hint-box">
                      <div className="practice-label">Hint</div>
                      <p className="practice-text">{lesson.practice_hint}</p>
                    </div>
                  )}
                </div>
              )}

              <div
                className={`practice-workspace ${
                  practiceMode === "web" ? "has-preview" : ""
                }`}
              >
                <div className="practice-editor-box">
                  <div className="practice-editor-head">practice.txt</div>
                  <textarea
                    className="practice-editor"
                    rows={8}
                    placeholder="Энд хариулт, код эсвэл бодолтоо бич..."
                    value={practiceAnswer}
                    onChange={(e) => setPracticeAnswer(e.target.value)}
                    disabled={practiceSubmitted}
                  />
                </div>

                {practiceMode === "web" && (
                  <div className="preview-box">
                    <div className="practice-editor-head">Live Preview</div>
                    <iframe
                      title="live-preview"
                      srcDoc={previewDocument}
                      className="live-preview-frame"
                    />
                  </div>
                )}
              </div>

              <div className="practice-actions">
                {practiceMode === "python" && (
                  <button
                    type="button"
                    className="button button-muted"
                    onClick={handleRunCode}
                    disabled={runnerLoading}
                  >
                    {runnerLoading ? "Running..." : "Run Code"}
                  </button>
                )}

                <button
                  className="button"
                  onClick={handlePracticeSubmit}
                  disabled={practiceSubmitted}
                >
                  {practiceSubmitted ? "Submitted" : "Submit"}
                </button>

                {!!lesson.practice_expected_output && (
                  <button
                    type="button"
                    className="button button-muted"
                    onClick={() => setShowExpected((prev) => !prev)}
                  >
                    {showExpected ? "Hide Solution" : "Show Solution"}
                  </button>
                )}
              </div>

              {practiceMode === "python" && (runnerOutput || runnerError) && (
                <div className="runner-result-wrap">
                  {runnerOutput && (
                    <div className="runner-output-box">
                      <div className="practice-label">Output</div>
                      <pre className="runner-pre">{runnerOutput}</pre>
                    </div>
                  )}

                  {runnerError && (
                    <div className="runner-error-box">
                      <div className="practice-label">Error</div>
                      <pre className="runner-pre">{runnerError}</pre>
                    </div>
                  )}
                </div>
              )}

              {showExpected && !!lesson.practice_expected_output && (
                <div className="practice-solution-box">
                  <div className="practice-label">Expected Result / Solution</div>
                  <pre className="practice-solution-pre">
                    {lesson.practice_expected_output}
                  </pre>
                </div>
              )}

              {practiceFeedback && (
                <div className="practice-feedback-box">
                  <div className="practice-label">Feedback</div>
                  <p className="practice-text">{practiceFeedback}</p>
                </div>
              )}
            </div>
          )}

          <div
            className={`lesson-dual-grid${
              quiz && quiz.length > 0 ? " lesson-dual-grid--quiz-expanded" : ""
            }`}
          >
            <div className="card">
              <div className="section-head">
                <h2 className="page-kicker">AI Summary</h2>
                <button
                  className="button"
                  onClick={handleGenerateSummary}
                  disabled={summaryLoading}
                >
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

            <div className="card lesson-quiz-card">
              <div className="section-head">
                <h2 className="page-kicker">AI Quiz</h2>
                <button
                  className="button"
                  onClick={handleGenerateQuiz}
                  disabled={quizLoading}
                >
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
                                <span className="inline-feedback success-text">
                                  ✓ Correct
                                </span>
                              )}
                              {quizResult && selected && !isCorrect && (
                                <span className="inline-feedback error-text">
                                  ✗ Incorrect
                                </span>
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

          <div className="card lesson-comment-card">
            <div className="section-head">
              <h2 className="page-kicker">Comment</h2>
            </div>

            {discussionError && <p className="error-text">{discussionError}</p>}

            <div className="discussion-create-box">
              <textarea
                className="discussion-textarea"
                rows={4}
                placeholder="Энэ хичээлтэй холбоотой асуулт, санал, тайлбараа бичнэ үү..."
                value={discussionText}
                onChange={(e) => setDiscussionText(e.target.value)}
              />
              <div>
                <button className="button" onClick={handleCreateDiscussionPost}>
                  Post Discussion
                </button>
              </div>
            </div>

            {discussionLoading ? (
              <p>Loading discussion...</p>
            ) : discussionPosts.length === 0 ? (
              <p>No comment yet for this lesson.</p>
            ) : (
              <div className="discussion-list">
                {discussionPosts.map((post) => (
                  <div key={post.id} className="discussion-post-card">
                    <div className="discussion-post-head">
                      <p className="discussion-author">{post.author_username}</p>
                      <p className="discussion-date">
                        {new Date(post.created_at).toLocaleString()}
                      </p>
                    </div>

                    <p className="discussion-post-content">{post.content}</p>

                    <div className="discussion-comments">
                      {post.comments.length === 0 ? (
                        <p className="discussion-empty">No comments yet.</p>
                      ) : (
                        post.comments.map((comment) => (
                          <div key={comment.id} className="discussion-comment-card">
                            <p className="discussion-comment-author">
                              {comment.author_username}
                            </p>
                            <p className="discussion-comment-content">
                              {comment.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="discussion-comment-form">
                      <input
                        className="discussion-comment-input"
                        placeholder="Write a comment..."
                        value={discussionComments[post.id] || ""}
                        onChange={(e) =>
                          setDiscussionComments((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="button"
                        onClick={() => handleCreateDiscussionComment(post.id)}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
