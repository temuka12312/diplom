import { Code2, Brain, Palette, Database, Shield, Globe, Cpu, LineChart, Smartphone, Cloud } from "lucide-react";
import { useReveal } from "./useReveal";

const topics = [
  { icon: <Code2 size={20} />, label: "Веб хөгжүүлэлт", courses: 124, color: "#5eead4" },
  { icon: <Brain size={20} />, label: "Хиймэл оюун", courses: 68, color: "#818cf8" },
  { icon: <Palette size={20} />, label: "UI/UX дизайн", courses: 43, color: "#c084fc" },
  { icon: <Database size={20} />, label: "Өгөгдлийн шинжилгээ", courses: 59, color: "#34d399" },
  { icon: <Shield size={20} />, label: "Кибер аюулгүй байдал", courses: 31, color: "#f59e0b" },
  { icon: <Globe size={20} />, label: "Cloud & DevOps", courses: 47, color: "#f43f5e" },
  { icon: <Cpu size={20} />, label: "Embedded систем", courses: 19, color: "#a78bfa" },
  { icon: <LineChart size={20} />, label: "Бизнес анализ", courses: 36, color: "#ec4899" },
  { icon: <Smartphone size={20} />, label: "Mobile хөгжүүлэлт", courses: 41, color: "#14b8a6" },
  { icon: <Cloud size={20} />, label: "AWS & Azure", courses: 28, color: "#fb923c" },
];

export function TopicsSection() {
  const { ref, visible } = useReveal(0.1);

  return (
    <section className="w-full flex items-center justify-center" style={{ minHeight: "100vh", background: "#07091a" }}>
      <div ref={ref} className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
          <div>
            <div className="inline-block px-3 py-1 rounded-full mb-4"
              style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#5eead4", background: "rgba(94,234,212,0.07)", border: "1px solid rgba(94,234,212,0.15)", letterSpacing: "0.12em" }}>
              СЭДВҮҮД
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,3.5vw,3rem)", color: "#e2e8f0", letterSpacing: "-0.03em" }}>
              Юунаас эхлэх вэ?
            </h2>
          </div>
          <a href="#" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: "#5eead4", textDecoration: "none", fontSize: "0.9rem" }}>Бүх сэдэв →</a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {topics.map((t, i) => (
            <button key={t.label}
              className="rounded-2xl p-5 flex flex-col items-start gap-3 text-left"
              style={{
                background: "#0d1120", border: "1px solid rgba(94,234,212,0.07)", cursor: "pointer",
                transition: "all 0.2s", opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${i * 0.04}s`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.border = `1px solid ${t.color}35`; (e.currentTarget as HTMLButtonElement).style.background = t.color + "08"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(94,234,212,0.07)"; (e.currentTarget as HTMLButtonElement).style.background = "#0d1120"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: t.color + "18", color: t.color }}>
                {t.icon}
              </div>
              <div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: "#e2e8f0", fontSize: "0.82rem", lineHeight: 1.3 }}>{t.label}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", color: "#64748b", fontSize: "0.62rem", marginTop: "3px" }}>{t.courses.toLocaleString()} хичээл</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
