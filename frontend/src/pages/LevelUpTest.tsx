import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLevelUpTest, type QuizQuestion } from "../api/ai";
import { saveLevel } from "../api/auth";

export default function LevelUpTest() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentLevel, setCurrentLevel] = useState("");
  const [nextLevel, setNextLevel] = useState("");
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [passed, setPassed] = useState(false);
  const [scoreData, setScoreData] = useState<{
    correct: number;
    total: number;
    percent: number;
  } | null>(null);

  const navigate = useNavigate();

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

    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer_index) {
        correct += 1;
      }
    });

    const percent = Math.round((correct / questions.length) * 100);
    const didPass = percent >= 70;

    setPassed(didPass);
    setScoreData({
      correct,
      total: questions.length,
      percent,
    });

    if (didPass) {
      try {
        await saveLevel(nextLevel);
        setResult(
          `Тэнцлээ! ${correct}/${questions.length} (${percent}%). Таны шинэ түвшин: ${nextLevel}`
        );
      } catch (e) {
        setResult("Level хадгалах үед алдаа гарлаа.");
      }
    } else {
      setResult(
        `Тэнцээгүй. ${correct}/${questions.length} (${percent}%). Дахин оролдоно уу.`
      );
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    window.location.replace("/progress");
  };

  if (loading) return <p>Loading level-up test...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
      <h1>Level Up Test</h1>
      <p>
        Current level: <strong>{currentLevel}</strong>
      </p>
      <p>
        Target level: <strong>{nextLevel}</strong>
      </p>

      {questions.map((q) => (
        <div
          key={q.id}
          style={{
            border: "1px solid #eee",
            padding: 12,
            borderRadius: 6,
            marginBottom: 12,
          }}
        >
          <p>
            <strong>Q{q.id}:</strong> {q.question}
          </p>

          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {q.options.map((opt, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                <label>
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

      <button onClick={handleSubmit}>Submit Level-Up Test</button>

      {result && (
        <p style={{ marginTop: 12, fontWeight: "bold" }}>
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
              maxWidth: 420,
              width: "100%",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Level-Up Test Result</h2>

            <p>
              Зөв хариулт:{" "}
              <strong>
                {scoreData.correct}/{scoreData.total}
              </strong>{" "}
              ({scoreData.percent}%)
            </p>

            {passed ? (
              <p>
                🎉 Congratulations! Your new level is{" "}
                <strong>{nextLevel}</strong>.
              </p>
            ) : (
              <p>
                ❌ You did not pass this time. Please review your lessons and try
                again.
              </p>
            )}

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
              OK, Back to Progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
}