import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useReveal } from "./useReveal";

const ROLES = ["суралцагчдад", "хөгжүүлэгчдэд", "дизайнеруудад", "AI сонирхогчдод", "бүтээгчдэд"];

export function HeroSection() {
  const { ref, visible } = useReveal(0.1);
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState("");
  const [erasing, setErasing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Typewriter
  useEffect(() => {
    const word = ROLES[idx];
    let t: ReturnType<typeof setTimeout>;
    if (!erasing && chars.length < word.length) {
      t = setTimeout(() => setChars(word.slice(0, chars.length + 1)), 75);
    } else if (!erasing && chars.length === word.length) {
      t = setTimeout(() => setErasing(true), 2000);
    } else if (erasing && chars.length > 0) {
      t = setTimeout(() => setChars(chars.slice(0, -1)), 40);
    } else {
      setErasing(false);
      setIdx(i => (i + 1) % ROLES.length);
    }
    return () => clearTimeout(t);
  }, [chars, erasing, idx]);

  // Aurora canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number, t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const blobs = [
      { x: 0.3, y: 0.2, r: 0.35, color: "94,234,212" },
      { x: 0.7, y: 0.6, r: 0.3,  color: "129,140,248" },
      { x: 0.15, y: 0.7, r: 0.25, color: "167,139,250" },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      blobs.forEach((b, i) => {
        const cx = (b.x + Math.sin(t * 0.004 + i) * 0.08) * canvas.width;
        const cy = (b.y + Math.cos(t * 0.003 + i * 1.3) * 0.06) * canvas.height;
        const r = b.r * Math.min(canvas.width, canvas.height);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `rgba(${b.color},0.12)`);
        grad.addColorStop(1, `rgba(${b.color},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      });
      t++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  const style = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(32px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden" style={{ minHeight: "100vh" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(94,234,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.03) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }} />

      <div ref={ref} className="relative max-w-7xl mx-auto px-6 w-full pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <div style={style(0)}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
                style={{ background: "rgba(94,234,212,0.07)", border: "1px solid rgba(94,234,212,0.18)", fontFamily: "'DM Mono', monospace", color: "#5eead4", fontSize: "0.72rem" }}>
                <Sparkles size={11} />
                AI-Д СУУРИЛСАН ЦАХИМ СУРГАЛТЫН ПЛАТФОРМ
              </div>
            </div>

            <div style={style(0.1)}>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(2.6rem,5.5vw,4.5rem)", lineHeight: 1.06, color: "#e2e8f0", letterSpacing: "-0.04em", marginBottom: "0.5rem" }}>
                Таны түвшинд тохирсон
              </h1>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(2.6rem,5.5vw,4.5rem)", lineHeight: 1.06, letterSpacing: "-0.04em", marginBottom: "1.75rem", minHeight: "1.2em" }}>
                <span style={{ background: "linear-gradient(90deg, #5eead4 0%, #818cf8 60%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {chars}
                  <span style={{ WebkitTextFillColor: "#5eead4", animation: "none", opacity: 0.8 }}>|</span>
                </span>
              </h1>
            </div>

            <div style={style(0.2)}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: "1.05rem", color: "#64748b", lineHeight: 1.8, maxWidth: "460px", marginBottom: "2.5rem" }}>
                Түвшин тогтоох тест, ахицын хяналт, AI хураангуй болон дадлага ажлаар мэдлэгээ шат дараатай хөгжүүлээрэй.
              </p>
            </div>

            <div style={style(0.3)} className="flex flex-wrap gap-3 mb-12">
              <Link
                to="/register"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem", padding: "13px 28px", borderRadius: "12px", background: "linear-gradient(135deg, #5eead4, #818cf8)", color: "#060812", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 0 40px rgba(94,234,212,0.2)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 60px rgba(94,234,212,0.35)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 40px rgba(94,234,212,0.2)"; (e.currentTarget as HTMLAnchorElement).style.transform = "none"; }}
              >
                Эхлэх <ArrowRight size={17} />
              </Link>
              <button
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "0.95rem", padding: "13px 24px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", color: "#94a3b8", border: "1px solid rgba(94,234,212,0.12)", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(94,234,212,0.06)"; (e.currentTarget as HTMLButtonElement).style.color = "#e2e8f0"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8"; }}
              >
                <Play size={14} fill="currentColor" /> Танилцах
              </button>
            </div>

            <div style={style(0.4)} className="flex flex-wrap gap-6">
              {[["2.4K+", "Суралцагч"], ["94%", "Дуусгалт"], ["4.9★", "Үнэлгээ"]].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#e2e8f0" }}>{v}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#64748b", marginTop: "2px" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – dashboard */}
          <div style={style(0.25)}>
            <div className="relative rounded-2xl p-6"
              style={{ background: "rgba(13,17,32,0.8)", border: "1px solid rgba(94,234,212,0.1)", backdropFilter: "blur(24px)", boxShadow: "0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(94,234,212,0.05)" }}>

              {/* Top bar */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: "#e2e8f0", fontSize: "0.9rem" }}>Миний сургалт</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", color: "#64748b", fontSize: "0.65rem", marginTop: "2px" }}>24-р долоо хоног</div>
                </div>
                <div className="flex gap-1">
                  {["#5eead4","#818cf8","#c084fc"].map(c => (
                    <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
                  ))}
                </div>
              </div>

              {/* Activity bars */}
              <div className="mb-6 p-4 rounded-xl" style={{ background: "rgba(94,234,212,0.04)", border: "1px solid rgba(94,234,212,0.07)" }}>
                <div className="flex justify-between items-end gap-2" style={{ height: "64px" }}>
                  {[40,65,30,80,55,90,45].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                      <div className="w-full rounded-sm transition-all duration-700"
                        style={{ height: `${h}%`, background: i === 5 ? "linear-gradient(180deg, #5eead4, #818cf8)" : "rgba(94,234,212,0.12)" }} />
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", color: i === 5 ? "#5eead4" : "#64748b" }}>
                        {["M","T","W","T","F","S","S"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courses */}
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#64748b", marginBottom: "10px", letterSpacing: "0.1em" }}>ACTIVE COURSES</div>
              {[
                { name: "Ахисан түвшний TypeScript", pct: 78, c: "#5eead4" },
                { name: "AI ба Deep Learning", pct: 43, c: "#818cf8" },
                { name: "UI дизайны систем", pct: 91, c: "#c084fc" },
              ].map(c => (
                <div key={c.name} className="flex items-center gap-3 mb-3.5">
                  <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: c.c }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1.5">
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: "#cbd5e1", fontSize: "0.8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: c.c, flexShrink: 0, marginLeft: "8px" }}>{c.pct}%</span>
                    </div>
                    <div className="rounded-full h-1" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.c, opacity: 0.8 }} />
                    </div>
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div className="grid grid-cols-3 gap-2 mt-5 pt-4" style={{ borderTop: "1px solid rgba(94,234,212,0.06)" }}>
                {[["128ц", "Суралцсан"], ["23ө", "Дараалал"], ["5", "Сертификат"]].map(([v, l]) => (
                  <div key={l} className="text-center py-2 rounded-xl" style={{ background: "rgba(94,234,212,0.04)" }}>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: "#e2e8f0", fontSize: "1rem" }}>{v}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", color: "#64748b", fontSize: "0.58rem" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-2 px-3 py-2 rounded-xl flex items-center gap-2"
              style={{ background: "rgba(13,17,32,0.9)", border: "1px solid rgba(94,234,212,0.2)", backdropFilter: "blur(12px)" }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#5eead4" }} />
              <span style={{ fontFamily: "'DM Mono', monospace", color: "#5eead4", fontSize: "0.7rem" }}>Сертификат авлаа!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
