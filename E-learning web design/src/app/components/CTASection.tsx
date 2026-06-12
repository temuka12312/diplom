import { ArrowRight } from "lucide-react";
import { useReveal } from "./useReveal";

export function CTASection() {
  const { ref, visible } = useReveal(0.2);

  return (
    <section className="w-full flex items-center justify-center" style={{ minHeight: "100vh", background: "#07091a" }}>
      <div ref={ref} className="max-w-4xl mx-auto px-6 w-full text-center">

        {/* Big gradient headline */}
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(32px)", transition: "all 0.7s ease" }}>
          <div className="inline-block px-3 py-1 rounded-full mb-8"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#5eead4", background: "rgba(94,234,212,0.07)", border: "1px solid rgba(94,234,212,0.15)", letterSpacing: "0.12em" }}>
            GET STARTED TODAY
          </div>

          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(2.4rem,6vw,5rem)", lineHeight: 1.04, letterSpacing: "-0.04em", marginBottom: "1.5rem" }}>
            <span style={{ color: "#e2e8f0" }}>The career you want</span>
            <br />
            <span style={{ background: "linear-gradient(90deg, #5eead4 0%, #818cf8 50%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              starts right here.
            </span>
          </h2>

          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, color: "#64748b", fontSize: "1.1rem", lineHeight: 1.75, maxWidth: "520px", margin: "0 auto 3rem" }}>
            Unlimited access to 8,500+ courses, structured career paths, and a global community of engineers building tomorrow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1rem", padding: "16px 36px", borderRadius: "14px", background: "linear-gradient(135deg, #5eead4, #818cf8)", color: "#060812", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", boxShadow: "0 0 48px rgba(94,234,212,0.18)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 72px rgba(94,234,212,0.3)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 48px rgba(94,234,212,0.18)"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}>
              Start for free <ArrowRight size={18} />
            </button>
            <button
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "1rem", padding: "16px 36px", borderRadius: "14px", background: "rgba(255,255,255,0.03)", color: "#94a3b8", border: "1px solid rgba(94,234,212,0.12)", cursor: "pointer" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(94,234,212,0.06)"; (e.currentTarget as HTMLButtonElement).style.color = "#e2e8f0"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8"; }}>
              View Pro — $29/mo
            </button>
          </div>

          <p style={{ fontFamily: "'DM Mono', monospace", color: "#475569", fontSize: "0.68rem", letterSpacing: "0.06em" }}>
            NO CREDIT CARD REQUIRED · 30-DAY MONEY-BACK
          </p>
        </div>

        {/* Decorative bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(94,234,212,0.15), transparent)" }} />
      </div>
    </section>
  );
}
