import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api, { getApiErrorMessage } from "../api/axios";
import {
  getPlacementTest,
  submitPlacementTest,
  type PlacementQuestion,
} from "../api/ai";
import useAuth from "../hooks/useAuth";
import LoadingState from "../components/LoadingState";
import TestResultModal from "../components/TestResultModal";
import "../style/test.css";

export default function PlacementTest() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<Record<number, number | null>>({});

  const [showModal, setShowModal] = useState(false);
  const [scoreData, setScoreData] = useState<{
    correct: number;
    total: number;
    percent: number;
    level: string;
  } | null>(null);

  const answeredCount = questions.filter((q) => answers[q.id] !== null && answers[q.id] !== undefined).length;

  const handleStartPlacement = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getPlacementTest();
      setQuestions(res.questions || []);
      setStarted(true);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to load placement test"));
    } finally {
      setLoading(false);
    }
  };

  const handleStartBeginner = async () => {
    try {
      setLoading(true);
      setError("");

      await api.post("/auth/save-level/", {
        level: "beginner",
      });

      await refreshUser();
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Анхан шат тохируулах үед алдаа гарлаа."));
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (questions.length === 0) return;

    const orderedAnswers = questions.map((q) => {
      const value = answers[q.id];
      return value === null || value === undefined ? -1 : value;
    });

    try {
      const res = await submitPlacementTest(orderedAnswers);
      setScoreData({
        correct: res.correct,
        total: res.total,
        percent: res.percent,
        level: res.level,
      });
      setShowModal(true);
    } catch (err: unknown) {
      console.error("Placement test submit error", err);
      setError(getApiErrorMessage(err, "Түвшин хадгалах үед алдаа гарлаа."));
    }
  };

  const handleCloseModal = async () => {
    setShowModal(false);
    await refreshUser();
    navigate("/dashboard", { replace: true });
  };

  if (!started) {
    return (
      <div className="container page-shell placement-page">
        <section className="card placement-hero-card">
          <div className="placement-hero-copy">
            <div className="page-header placement-hero-header">
              <span className="page-kicker">AI Placement</span>
              <h1 className="page-title">Түвшин тогтоох</h1>
              <p className="page-subtitle">
                Богино шалгалт өгөөд өөрийн одоогийн түвшинд тохирсон сургалтын замаа
                автоматаар авна. Хэрэв хүсвэл анхан шатнаас шууд эхлэх боломжтой.
              </p>
            </div>

            <div className="placement-chip-list" aria-hidden="true">
              <span className="placement-chip">AI үнэлгээ</span>
              <span className="placement-chip">5-7 минут</span>
              <span className="placement-chip">Хувийн learning path</span>
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="action-row placement-action-row">
              <button
                className="button placement-primary-button"
                onClick={handleStartPlacement}
                disabled={loading}
              >
                {loading ? "Ачааллаж байна..." : "Placement test өгөх"}
              </button>

              <button
                className="button button-muted"
                onClick={handleStartBeginner}
                disabled={loading}
              >
                {loading ? "Тохируулж байна..." : "Анхан шатнаас суралцах"}
              </button>
            </div>

            <p className="placement-helper-text">
              Шалгалтын дараа систем таны түвшинд таарсан курс, lesson-уудыг санал болгоно.
            </p>
          </div>

          <div className="placement-hero-panel">
            <div className="placement-panel-glow" aria-hidden="true" />
            <div className="placement-metric-card">
              <span>Үр дүн</span>
              <strong>Тохирсон түвшин</strong>
              <p>Beginner, Elementary, Intermediate, Advanced ангиллаас автоматаар сонгоно.</p>
            </div>
            <div className="placement-metric-grid">
              <div className="placement-mini-stat">
                <strong>Adaptive</strong>
                <span>AI-аар бэлтгэсэн асуултууд</span>
              </div>
              <div className="placement-mini-stat">
                <strong>Instant</strong>
                <span>Шууд үнэлж dashboard руу шилжүүлнэ</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container page-shell">
        <LoadingState
          title="Placement test бэлдэж байна"
          subtitle="Асуултуудыг үүсгэж, шалгалтын орчныг тохируулж байна..."
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
        <p>Одоогоор placement test-ийн асуулт алга байна.</p>
      </div>
    );
  }

  return (
    <div className="container page-shell placement-page">
      <section className="card placement-quiz-hero">
        <div className="placement-quiz-copy">
          <span className="page-kicker">AI Placement</span>
          <h1 className="page-title">Түвшин тогтоох шалгалт</h1>
          <p className="page-subtitle">
            Доорх асуултуудад хариулаад өөрийн түвшинг тогтоолгоно уу.
          </p>
        </div>

        <div className="placement-quiz-stats">
          <div className="placement-quiz-stat">
            <span>Нийт асуулт</span>
            <strong>{questions.length}</strong>
          </div>
          <div className="placement-quiz-stat">
            <span>Хариулсан</span>
            <strong>{answeredCount}</strong>
          </div>
          <div className="placement-quiz-stat">
            <span>Явц</span>
            <strong>{Math.round((answeredCount / questions.length) * 100)}%</strong>
          </div>
        </div>

        <div className="placement-progress">
          <span
            className="placement-progress-bar"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </section>

      {questions.map((q, questionIndex) => (
        <div key={q.id} className="card test-card">
          <p className="question-title">
            <span className="question-number">Q{questionIndex + 1}</span>
            {q.question}
          </p>

          <ul className="option-list">
            {q.options.map((opt, idx) => (
              <li key={idx}>
                <label
                  className={`option-item ${answers[q.id] === idx ? "selected" : ""}`}
                >
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

      <div className="action-row center placement-submit-row">
        <button className="button" onClick={handleSubmit}>
          Шалгалтаа явуулах
        </button>
      </div>

      <AnimatePresence>
        {showModal && scoreData && (
          <TestResultModal
            title="Шалгалтын үр дүн"
            correct={scoreData.correct}
            total={scoreData.total}
            percent={scoreData.percent}
            levelLabel={scoreData.level}
            tone="info"
            message="Энэ түвшинд тань тохирсон хичээлүүдийг систем автоматаар санал болгоно."
            actionLabel="Dashboard руу очих"
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
