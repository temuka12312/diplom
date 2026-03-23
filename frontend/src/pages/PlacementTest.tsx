import { useEffect, useState } from "react";
import {
  getPlacementTest,
  submitPlacementTest,
  type PlacementQuestion,
} from "../api/ai";

export default function PlacementTest() {
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [result, setResult] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [scoreData, setScoreData] = useState<{
    correct: number;
    total: number;
    percent: number;
    level: string;
  } | null>(null);

  useEffect(() => {
    getPlacementTest()
      .then((res) => setQuestions(res.questions || []))
      .catch(() => setError("Failed to load placement test"))
      .finally(() => setLoading(false));
  }, []);

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

      const message = `Зөв хариулт: ${res.correct}/${res.total} (${res.percent}%).\nТаны түвшин: ${res.level}.`;

      setResult(message);
      setScoreData({
        correct: res.correct,
        total: res.total,
        percent: res.percent,
        level: res.level,
      });
      setShowModal(true);
    } catch (e) {
      console.error("Placement test submit error", e);
      setError("Түвшин хадгалах үед алдаа гарлаа.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    window.location.replace("/");
  };

  if (loading) {
    return (
      <div className="container page-shell">
        <p className="loading-text">Placement test ачаалж байна...</p>
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
    <div className="container page-shell">
      <div className="page-header">
        <span className="page-kicker">AI Placement</span>
        <h1 className="page-title">Түвшин тогтоох шалгалт</h1>
        <p className="page-subtitle">
          Доорх асуултуудад хариулаад өөрийн түвшинг тогтоолгоно уу.
        </p>
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
          Шалгалтаа явуулах
        </button>
      </div>

      {result && <p className="result-text">{result}</p>}

      {showModal && scoreData && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <div className="result-icon">🎯</div>
            <h2>Шалгалтын үр дүн</h2>

            <p className="result-stat">
              Зөв хариулт:{" "}
              <strong>
                {scoreData.correct}/{scoreData.total}
              </strong>{" "}
              ({scoreData.percent}%)
            </p>

            <p className="result-level">
              Таны түвшин: <span className="level-pill">{scoreData.level}</span>
            </p>

            <p className="modal-note">
              Энэ түвшингээр тань тохирсон хичээлүүдийг санал болгоно.
            </p>

            <button className="button" onClick={handleCloseModal}>
              OK, эхлэл рүү очих
            </button>
          </div>
        </div>
      )}
    </div>
  );
}