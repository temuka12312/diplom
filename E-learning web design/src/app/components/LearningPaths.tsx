import { useState } from "react";
import { CheckCircle2, Lock, Zap, Trophy, Clock, ArrowRight } from "lucide-react";
import { useReveal } from "./useReveal";

const paths = [
  {
    id: "frontend", label: "Frontend Dev", color: "#5eead4",
    title: "Frontend Developer Path",
    desc: "HTML to production-grade React apps with TypeScript, testing, and CI/CD.",
    duration: "6 months", courses: 12,
    steps: [
      { title: "HTML & CSS Mastery", done: true },
      { title: "JavaScript Deep Dive", done: true },
      { title: "React Core Concepts", done: true },
      { title: "TypeScript & Generics", done: false, active: true },
      { title: "State Management", done: false, locked: true },
      { title: "Testing & CI/CD", done: false, locked: true },
    ],
  },
  {
    id: "data", label: "Data Scientist", color: "#818cf8",
    title: "Data Science Path",
    desc: "Python, statistics, ML pipelines, and deployment from scratch to production.",
    duration: "8 months", courses: 15,
    steps: [
      { title: "Python for Analysis", done: true },
      { title: "Stats & Probability", done: false, active: true },
      { title: "Machine Learning Basics", done: false, locked: true },
      { title: "Deep Learning & NLP", done: false, locked: true },
      { title: "MLOps & Deployment", done: false, locked: true },
      { title: "Capstone Project", done: false, locked: true },
    ],
  },
  {
    id: "design", label: "UX Designer", color: "#c084fc",
    title: "UX/UI Designer Path",
    desc: "Research, wireframing, Figma mastery, and a portfolio-ready design system.",
    duration: "5 months", courses: 9,
    steps: [
      { title: "Design Thinking", done: true },
      { title: "Figma Mastery", done: true },
      { title: "User Research Methods", done: false, active: true },
      { title: "Design Systems", done: false, locked: true },
      { title: "Prototyping & Testing", done: false, locked: true },
      { title: "Portfolio Building", done: false, locked: true },
    ],
  },
];

export function LearningPaths() {
  const [active, setActive] = useState("frontend");
  const path = paths.find(p => p.id === active)!;
  const done = path.steps.filter(s => s.done).length;
  const pct = Math.round((done / path.steps.length) * 100);
  const { ref, visible } = useReveal(0.1);

  return (
    <section className="w-full flex items-center justify-center py-8" style={{ minHeight: "100vh", background: "#07091a" }}>
      <div ref={ref} className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-12"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
          <div className="inline-block px-3 py-1 rounded-full mb-4"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#5eead4", background: "rgba(94,234,212,0.07)", border: "1px solid rgba(94,234,212,0.15)", letterSpacing: "0.12em" }}>
            CAREER PATHS
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,3.5vw,3rem)", color: "#e2e8f0", letterSpacing: "-0.03em" }}>
            Your Structured Roadmap
          </h2>
        </div>

        {/* Path tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 0.1s" }}>
          {paths.map(p => (
            <button key={p.id} onClick={() => setActive(p.id)}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "0.875rem",
                padding: "10px 22px", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s",
                background: active === p.id ? p.color + "15" : "rgba(255,255,255,0.02)",
                border: `1px solid ${active === p.id ? p.color + "50" : "rgba(94,234,212,0.08)"}`,
                color: active === p.id ? "#e2e8f0" : "#64748b",
              }}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>

          {/* Info */}
          <div className="lg:col-span-2 rounded-2xl p-7 flex flex-col" style={{ background: "#0d1120", border: "1px solid rgba(94,234,212,0.07)" }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: path.color + "15" }}>
              <Trophy size={22} color={path.color} />
            </div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#e2e8f0", marginBottom: "0.6rem" }}>{path.title}</h3>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#64748b", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>{path.desc}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[["Duration", path.duration], ["Courses", path.courses + " total"]].map(([l, v]) => (
                <div key={l} className="rounded-xl p-3" style={{ background: "rgba(94,234,212,0.04)" }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: "#e2e8f0", fontSize: "0.9rem" }}>{v}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", color: "#64748b", fontSize: "0.62rem", marginTop: "2px" }}>{l}</div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: "#94a3b8", fontSize: "0.82rem" }}>Progress</span>
                <span style={{ fontFamily: "'DM Mono', monospace", color: path.color, fontSize: "0.75rem" }}>{pct}%</span>
              </div>
              <div className="rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${path.color}, ${path.color}88)` }} />
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", color: "#64748b", fontSize: "0.62rem", marginTop: "6px" }}>
                {done} / {path.steps.length} modules complete
              </div>
            </div>

            <button className="mt-auto flex items-center justify-center gap-2 py-3 rounded-xl"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", background: `linear-gradient(135deg, ${path.color}, ${path.color}bb)`, color: "#060812", border: "none", cursor: "pointer" }}>
              Continue Path <ArrowRight size={16} />
            </button>
          </div>

          {/* Roadmap */}
          <div className="lg:col-span-3 rounded-2xl p-7" style={{ background: "#0d1120", border: "1px solid rgba(94,234,212,0.07)" }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: "#94a3b8", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Course Roadmap</div>
            {path.steps.map((step, i) => (
              <div key={step.title} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: step.done ? path.color + "20" : "rgba(255,255,255,0.04)", border: `1.5px solid ${step.done ? path.color : (step as any).active ? path.color + "60" : "rgba(255,255,255,0.08)"}` }}>
                    {step.done ? <CheckCircle2 size={15} color={path.color} /> : (step as any).locked ? <Lock size={12} color="#475569" /> : <Zap size={13} color={path.color} />}
                  </div>
                  {i < path.steps.length - 1 && (
                    <div className="w-px flex-1 my-1" style={{ background: step.done ? path.color + "40" : "rgba(255,255,255,0.05)", minHeight: "28px" }} />
                  )}
                </div>
                <div className={`flex-1 pb-5 ${i === path.steps.length - 1 ? "pb-0" : ""}`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: (step as any).active ? 700 : 500, color: (step as any).locked ? "#475569" : "#e2e8f0", fontSize: "0.9rem" }}>
                      {step.title}
                    </span>
                    {step.done && <span className="px-1.5 py-0.5 rounded text-xs" style={{ fontFamily: "'DM Mono', monospace", background: path.color + "15", color: path.color, fontSize: "0.62rem" }}>done</span>}
                    {(step as any).active && <span className="px-1.5 py-0.5 rounded text-xs" style={{ fontFamily: "'DM Mono', monospace", background: "rgba(245,158,11,0.12)", color: "#f59e0b", fontSize: "0.62rem" }}>in progress</span>}
                    {(step as any).locked && <span className="px-1.5 py-0.5 rounded text-xs" style={{ fontFamily: "'DM Mono', monospace", background: "rgba(255,255,255,0.04)", color: "#475569", fontSize: "0.62rem" }}>locked</span>}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", color: "#475569", fontSize: "0.65rem", marginTop: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={10} /> {2 + i * 2}–{4 + i * 2} hrs · {8 + i * 4} lessons
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
