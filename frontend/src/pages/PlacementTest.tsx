import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlacementTest, type PlacementQuestion } from "../api/ai";
import { saveLevel } from "../api/auth";

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

  const navigate = useNavigate();

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

    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer_index) {
        correct += 1;
      }
    });

    const percent = Math.round((correct / questions.length) * 100);

    let level = "beginner";
    if (percent >= 70) level = "advanced";
    else if (percent >= 40) level = "intermediate";

    const message = `Зөв хариулт: ${correct}/${questions.length} (${percent}%).\nТаны түвшин: ${level}.`;

    setResult(message);
    setScoreData({
      correct,
      total: questions.length,
      percent,
      level,
    });
    setShowModal(true); // popup нээх

    try {
      await saveLevel(level);
    } catch (e) {
      console.error("Failed to save level", e);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/"); // popup хаагдахад Home руу шилжүүлнэ
  };

  if (loading) return <p>Placement test ачаалж байна...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!loading && !error && questions.length === 0) {
    return <p>Одоогоор placement test-ийн асуулт алга байна.</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
      <h1>Түвшин тогтоох шалгалт</h1>
      <p>Доорх асуултуудад хариулаад өөрийн түвшинг тогтоолгоно уу.</p>

      {questions.map((q) => (
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
            {q.options.map((opt, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                <label style={{ cursor: "pointer" }}>
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[q.id] === idx || false}
                    onChange={() => handleSelect(q.id, idx)}
                    style={{ marginRight: 6 }}
                  />
                  {opt}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button onClick={handleSubmit} style={{ marginTop: 8 }}>
        Шалгалтаа явуулах
      </button>

      {result && (
        <p style={{ marginTop: 12, fontWeight: "bold", whiteSpace: "pre-line" }}>
          {result}
        </p>
      )}

      {showModal && scoreData && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 8,
              padding: 24,
              maxWidth: 400,
              width: "100%",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Шалгалтын үр дүн</h2>
            <p>
              Зөв хариулт:{" "}
              <strong>
                {scoreData.correct}/{scoreData.total}
              </strong>{" "}
              ({scoreData.percent}%)
            </p>
            <p>
              Таны түвшин: <strong>{scoreData.level}</strong>
            </p>
            <p style={{ fontSize: 13, color: "#555" }}>
              Энэ түвшингээр тань тохирсон хичээлүүдийг санал болгоно.
            </p>

            <button
              onClick={handleCloseModal}
              style={{
                marginTop: 16,
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                background: "#4CAF50",
                color: "white",
                cursor: "pointer",
              }}
            >
              OK, эхлэл рүү очих
            </button>
          </div>
        </div>
      )}
    </div>
  );
}