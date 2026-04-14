import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  getLevelUpTest,
  submitLevelUpTest,
  type QuizQuestion,
} from "../api/ai";
import useAuth from "../hooks/useAuth";
import LoadingState from "../components/LoadingState";
import TestResultModal from "../components/TestResultModal";

export default function LevelUpTest() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentLevel, setCurrentLevel] = useState("");
  const [nextLevel, setNextLevel] = useState("");
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [passed, setPassed] = useState(false);
  const [scoreData, setScoreData] = useState<{
    correct: number;
    total: number;
    percent: number;
  } | null>(null);

  useEffect(() => {
    getLevelUpTest()
      .then((res) => {
        setQuestions(res.questions || []);
        setCurrentLevel(res.current_level);
        setNextLevel(res.next_level);
      })
      .catch(() => setError("Failed to load level-up test"))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (qId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (!questions.length) return;

    const orderedAnswers = questions.map((q) => {
      const value = answers[q.id];
      return value === null || value === undefined ? -1 : value;
    });

    try {
      const res = await submitLevelUpTest(orderedAnswers);

      setPassed(res.passed);
      setScoreData({
        correct: res.correct,
        total: res.total,
        percent: res.percent,
      });
      setShowModal(true);
    } catch (e) {
      console.error("Level-up submit error", e);
      setError("Level-up test submit үед алдаа гарлаа.");
    }
  };

  const handleCloseModal = async () => {
    setShowModal(false);
    await refreshUser();
    navigate("/progress", { replace: true });
  };

  if (loading) {
    return (
      <div className="container page-shell">
        <LoadingState
          title="Level-up test бэлдэж байна"
          subtitle="Таны дараагийн түвшний шалгалтыг ачаалж байна..."
        />
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

  if (questions.length === 0) {
    return (
      <div className="container page-shell">
        <p>Одоогоор level-up test-ийн асуулт алга байна.</p>
      </div>
    );
  }

  return (
    <div className="container page-shell">
      <div className="page-header">
        <span className="page-kicker">AI Level Progress</span>
        <h1 className="page-title">Level Up Test</h1>
        <p className="page-subtitle">
          Одоогийн түвшнээсээ дараагийн түвшин рүү ахих шалгалт өгнө.
        </p>
      </div>

      <div className="card level-info-card">
        <div className="level-info-grid">
          <div>
            <p className="mini-label">Current level</p>
            <span className="level-pill pill-beginner">{currentLevel}</span>
          </div>
          <div>
            <p className="mini-label">Target level</p>
            <span className="level-pill level-pill-target">{nextLevel}</span>
          </div>
        </div>
      </div>

      {questions.map((q) => (
        <div key={q.id} className="card test-card">
          <p className="question-title">
            <span className="question-number">Q{q.id}</span>
            {q.question}
          </p>

          <ul className="option-list">
            {q.options.map((opt, idx) => (
              <li key={idx}>
                <label className="option-item">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[q.id] === idx || false}
                    onChange={() => handleSelect(q.id, idx)}
                  />
                  <span>{opt}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="action-row center">
        <button className="button" onClick={handleSubmit}>
          Submit Level-Up Test
        </button>
      </div>

      <AnimatePresence>
        {showModal && scoreData && (
          <TestResultModal
            title="Level-Up Test Result"
            correct={scoreData.correct}
            total={scoreData.total}
            percent={scoreData.percent}
            levelLabel={passed ? nextLevel : currentLevel}
            tone={passed ? "success" : "warning"}
            message={
              passed
                ? `Гоё. Та дараагийн ${nextLevel} түвшин рүү амжилттай ахилаа.`
                : "Та энэ удаа тэнцсэнгүй. Хичээлээ давтаад дахин оролдоно уу."
            }
            actionLabel="Progress руу буцах"
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
