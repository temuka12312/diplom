interface Props {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export default function LoadingState({
  title = "Түр хүлээнэ үү",
  subtitle = "Мэдээллийг ачаалж байна...",
  compact = false,
}: Props) {
  return (
    <div className={`loading-state ${compact ? "compact" : ""}`}>
      <div className="loading-state-orbit" aria-hidden="true">
        <span className="loading-state-ring loading-state-ring-a" />
        <span className="loading-state-ring loading-state-ring-b" />
        <span className="loading-state-core" />
      </div>

      <div className="loading-state-copy">
        <p className="loading-state-title">{title}</p>
        <p className="loading-state-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}
