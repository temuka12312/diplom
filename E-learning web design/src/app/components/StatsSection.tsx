import { useEffect, useState } from "react";
import { useReveal } from "./useReveal";

function useCountUp(target: number, go: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!go) return;
    let start: number | null = null;
    const dur = 1600;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [go, target]);
  return n;
}

function Ring({ value, max, color, size = 88 }: { value: number; max: number; color: string; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / max) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1)" }} />
    </svg>
  );
}

const stats = [
  { label: "Active Learners", target: 2400, suffix: "K+", ring: 82, color: "#5eead4", desc: "Worldwide community" },
  { label: "Expert Courses",  target: 8500, suffix: "+",  ring: 91, color: "#818cf8", desc: "Across 80 disciplines" },
  { label: "Top Instructors", target: 620,  suffix: "+",  ring: 68, color: "#c084fc", desc: "Industry professionals" },
  { label: "Completion Rate", target: 94,   suffix: "%",  ring: 94, color: "#34d399", desc: "Learner satisfaction" },
];

export function StatsSection() {
  const { ref, visible } = useReveal(0.2);

  return (
    <section className="w-full flex items-center justify-center" style={{ minHeight: "100vh", background: "#060812" }}>
      <div ref={ref} className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.6s ease" }}>
          <div className="inline-block px-3 py-1 rounded-full mb-4"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#5eead4", background: "rgba(94,234,212,0.07)", border: "1px solid rgba(94,234,212,0.15)", letterSpacing: "0.12em" }}>
            BY THE NUMBERS
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,3.5vw,3rem)", color: "#e2e8f0", letterSpacing: "-0.03em" }}>
            Trusted at Scale
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => {
            const n = useCountUp(s.target, visible);
            return (
              <div key={s.label}
                className="rounded-2xl p-7 flex flex-col items-center text-center relative overflow-hidden group"
                style={{
                  background: "#0d1120",
                  border: "1px solid rgba(94,234,212,0.07)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(36px)",
                  transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
                }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${s.color}10, transparent 70%)` }} />
                <div className="relative mb-3">
                  <Ring value={visible ? s.ring : 0} max={100} color={s.color} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "#e2e8f0" }}>
                      {n.toLocaleString()}{s.suffix}
                    </span>
                  </div>
                </div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: "#cbd5e1", fontSize: "0.9rem", marginTop: "8px" }}>{s.label}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", color: "#64748b", fontSize: "0.65rem", marginTop: "4px" }}>{s.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
