import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { useReveal } from "./useReveal";

const plans = [
  {
    id: "free", name: "Үндсэн", price: { m: 0, y: 0 }, desc: "Өнөөдөр эхлэх",
    color: "#64748b",
    features: ["Үндсэн хичээлүүд", "Community эрх", "Хичээлийн preview", "Суурь сертификат", null, null],
    cta: "Эхлэх",
  },
  {
    id: "pro", name: "Ахисан", price: { m: 0, y: 0 }, desc: "Хамгийн тохиромжтой",
    color: "#5eead4", popular: true,
    features: ["Бүх хичээл", "AI хураангуй", "Ахицын dashboard", "Level-up тест", "Сургалтын замнал", "Давуу support"],
    cta: "Бүртгүүлэх",
  },
  {
    id: "teams", name: "Баг", price: { m: 0, y: 0 }, desc: "Сургалтын багт",
    color: "#818cf8",
    features: ["Ахисан багц бүгд", "Багийн хэрэглэгчид", "Admin analytics", "Custom path", "Аюулгүй нэвтрэлт", "Хариуцсан админ"],
    cta: "Турших",
  },
];

export function PricingSection() {
  const [yearly, setYearly] = useState(false);
  const { ref, visible } = useReveal(0.1);

  return (
    <section className="w-full flex items-center justify-center py-8" style={{ minHeight: "100vh", background: "#060812" }}>
      <div ref={ref} className="max-w-5xl mx-auto px-6 w-full">
        <div className="text-center mb-12"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
          <div className="inline-block px-3 py-1 rounded-full mb-4"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#5eead4", background: "rgba(94,234,212,0.07)", border: "1px solid rgba(94,234,212,0.15)", letterSpacing: "0.12em" }}>
            БАГЦУУД
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,3.5vw,3rem)", color: "#e2e8f0", letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
            Суралцах хэлбэрээ сонго
          </h2>

          {/* Toggle */}
          <div className="inline-flex p-1 rounded-xl" style={{ background: "#0d1120", border: "1px solid rgba(94,234,212,0.08)" }}>
            {["Сар", "Жил"].map(o => (
              <button key={o} onClick={() => setYearly(o === "Жил")}
                className="flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", border: "none", cursor: "pointer", background: (o === "Жил") === yearly ? "#131829" : "transparent", color: (o === "Жил") === yearly ? "#e2e8f0" : "#64748b" }}>
                {o}
                {o === "Жил" && <span className="px-1.5 py-0.5 rounded" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", background: "rgba(52,211,153,0.12)", color: "#34d399" }}>уян хатан</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <div key={plan.id}
              className="rounded-2xl p-7 flex flex-col relative overflow-visible"
              style={{
                background: plan.popular ? "linear-gradient(160deg, #0f1628, #0d1530)" : "#0d1120",
                border: `1px solid ${plan.popular ? "rgba(94,234,212,0.2)" : "rgba(94,234,212,0.07)"}`,
                transform: plan.popular ? "scale(1.03)" : "scale(1)",
                boxShadow: plan.popular ? "0 0 60px rgba(94,234,212,0.08)" : "none",
                opacity: visible ? 1 : 0, transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.3s ease`,
              }}>

              {/* Top shine */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #5eead4, transparent)" }} />
              )}
              {plan.popular && (
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full"
                  style={{ top: "-14px", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", background: "linear-gradient(135deg, #5eead4, #818cf8)", color: "#060812", boxShadow: "0 10px 30px rgba(94,234,212,0.18)" }}>
                  <Sparkles size={10} /> ОНЦЛОХ
                </div>
              )}

              <div className="mb-1" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#64748b", letterSpacing: "0.1em" }}>{plan.desc.toUpperCase()}</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: "#e2e8f0", fontSize: "1.1rem", marginBottom: "1rem" }}>{plan.name}</div>

              <div className="flex items-end gap-1 mb-7">
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: "#e2e8f0", fontSize: "2.8rem", lineHeight: 1 }}>
                  {yearly ? plan.price.y : plan.price.m}
                </span>
                {plan.price.m > 0 && (
                  <span style={{ fontFamily: "'DM Mono', monospace", color: "#64748b", fontSize: "0.78rem", paddingBottom: "6px" }}>/сар</span>
                )}
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2.5">
                    {f
                      ? <><div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: plan.color + "20" }}><Check size={10} color={plan.color} /></div><span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, color: "#94a3b8", fontSize: "0.85rem" }}>{f}</span></>
                      : <><div className="w-4 h-4" /><span style={{ fontFamily: "'DM Mono', monospace", color: "#334155", fontSize: "0.85rem" }}>—</span></>
                    }
                  </li>
                ))}
              </ul>

              <button className="w-full py-3 rounded-xl transition-all duration-200"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
                  background: plan.popular ? "linear-gradient(135deg, #5eead4, #818cf8)" : "rgba(255,255,255,0.04)",
                  color: plan.popular ? "#060812" : "#94a3b8",
                  border: plan.popular ? "none" : `1px solid ${plan.color}30`,
                }}
                onMouseEnter={e => { if (!plan.popular) (e.currentTarget as HTMLButtonElement).style.background = "rgba(94,234,212,0.07)"; }}
                onMouseLeave={e => { if (!plan.popular) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
              >{plan.cta}</button>
            </div>
          ))}
        </div>

        <p className="text-center mt-6" style={{ fontFamily: "'DM Mono', monospace", color: "#475569", fontSize: "0.68rem", letterSpacing: "0.05em" }}>
          ҮНДСЭН ХЭРЭГЛЭЭ ҮНЭГҮЙ · АХИЦАА ХЯНАХ БОЛОМЖТОЙ
        </p>
      </div>
    </section>
  );
}
