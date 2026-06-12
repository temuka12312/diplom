interface SnapNavProps {
  total: number;
  current: number;
  labels: string[];
  onDotClick: (i: number) => void;
}

export function SnapNav({ total, current, labels, onDotClick }: SnapNavProps) {
  return (
    <div
      className="fixed right-6 top-1/2 z-50 flex flex-col gap-3 items-center"
      style={{ transform: "translateY(-50%)" }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          title={labels[i]}
          onClick={() => onDotClick(i)}
          style={{
            width: current === i ? "8px" : "6px",
            height: current === i ? "28px" : "6px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
            background: current === i
              ? "linear-gradient(180deg, #5eead4, #818cf8)"
              : "rgba(94,234,212,0.2)",
          }}
        />
      ))}
    </div>
  );
}
