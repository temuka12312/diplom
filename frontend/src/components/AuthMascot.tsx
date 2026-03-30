import React from "react";
import "../style/auth-mascot.css";

interface Props {
  mode: "idle" | "look-left" | "look-center" | "look-right" | "cover-eyes";
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthMascot({
  mode,
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <div className={`ai-visual ${mode}`}>
            <div className="ai-orb">
              <div className="ai-core" />
              <div className="ai-ring ring-1" />
              <div className="ai-ring ring-2" />
              <div className="ai-ring ring-3" />
              <div className="ai-glow glow-1" />
              <div className="ai-glow glow-2" />
            </div>

            <div className="ai-particles">
              <span className="particle p1" />
              <span className="particle p2" />
              <span className="particle p3" />
              <span className="particle p4" />
            </div>
          </div>

          <div className="auth-copy">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>

        <div className="auth-right">{children}</div>
      </div>
    </div>
  );
}