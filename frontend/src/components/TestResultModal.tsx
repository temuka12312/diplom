import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

interface Props {
  title: string;
  correct: number;
  total: number;
  percent: number;
  levelLabel?: string;
  tone?: "success" | "info" | "warning";
  message: string;
  actionLabel: string;
  onClose: () => void | Promise<void>;
}

const toneIcons = {
  success: "▲",
  info: "◎",
  warning: "◆",
};

export default function TestResultModal({
  title,
  correct,
  total,
  percent,
  levelLabel,
  tone = "info",
  message,
  actionLabel,
  onClose,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <>
      <motion.div
        className="test-result-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <motion.div
          className="test-result-modal"
          initial={{ opacity: 0, scale: 0.92, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{
            duration: 0.28,
            ease: [0.22, 1, 0.36, 1],
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={`test-result-icon ${tone}`}>{toneIcons[tone]}</div>

          <div className="test-result-copy">
            <p className="test-result-kicker">Assessment Complete</p>
            <h2>{title}</h2>
            <p className="test-result-message">{message}</p>
          </div>

          <div className="test-result-stats">
            <div className="test-result-stat-card">
              <span>Зөв хариулт</span>
              <strong>
                {correct}/{total}
              </strong>
            </div>

            <div className="test-result-stat-card">
              <span>Амжилт</span>
              <strong>{percent}%</strong>
            </div>
          </div>

          {levelLabel && (
            <div className="test-result-level-row">
              <span className="test-result-level-label">Таны түвшин</span>
              <span className="level-pill test-result-level-pill">{levelLabel}</span>
            </div>
          )}

          <button className="button test-result-action" onClick={() => void onClose()}>
            {actionLabel}
          </button>
        </motion.div>
      </motion.div>
    </>,
    document.body
  );
}
