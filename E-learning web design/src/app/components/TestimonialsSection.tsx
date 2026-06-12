import { useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useReveal } from "./useReveal";

const testimonials = [
  { name: "Emily Rodriguez", role: "Frontend Engineer @ Stripe", initials: "ER", color: "#5eead4", rating: 5, text: "Learnify took me from marketing coordinator to frontend engineer in 8 months. The projects are real, the feedback is fast, and the community kept me accountable every step of the way." },
  { name: "James Okafor", role: "Data Analyst @ Netflix", initials: "JO", color: "#818cf8", rating: 5, text: "The Python and Data Science track was exceptional. Real-world datasets, clear walkthroughs, and an instructor who actually replied in the forum within hours. Worth every dollar." },
  { name: "Mia Tanaka", role: "UX Designer @ Shopify", initials: "MT", color: "#c084fc", rating: 5, text: "Priya's design systems course is the most comprehensive I've found anywhere online. My portfolio went from generic to portfolio-ready in six weeks." },
  { name: "Carlos Reyes", role: "ML Engineer @ Spotify", initials: "CR", color: "#34d399", rating: 5, text: "The deep learning curriculum uses PyTorch with real production patterns, not toy examples. I landed my ML role at Spotify directly after completing the AI path." },
  { name: "Aisha Patel", role: "Full-Stack Dev @ Linear", initials: "AP", color: "#fb923c", rating: 5, text: "The React & TypeScript course taught me patterns I use every day. The codebase structure, testing strategy, and CI setup were all production-grade from day one." },
];

export function TestimonialsSection() {
  const { ref, visible } = useReveal(0.1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section className="w-full flex items-center justify-center overflow-hidden" style={{ minHeight: "100vh", background: "#07091a" }}>
      <div ref={ref} className="w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
            <div>
              <div className="inline-block px-3 py-1 rounded-full mb-4"
                style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#5eead4", background: "rgba(94,234,212,0.07)", border: "1px solid rgba(94,234,212,0.15)", letterSpacing: "0.12em" }}>
                STUDENT STORIES
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,3.5vw,3rem)", color: "#e2e8f0", letterSpacing: "-0.03em" }}>
                Real Outcomes
              </h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scroll(-1)} className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: "#0d1120", border: "1px solid rgba(94,234,212,0.1)", color: "#64748b", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#5eead4"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#64748b"; }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => scroll(1)} className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: "#0d1120", border: "1px solid rgba(94,234,212,0.1)", color: "#64748b", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#5eead4"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#64748b"; }}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal scroll strip */}
        <div ref={scrollRef}
          className="flex gap-4 px-6 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 0.2s" }}>
          <div className="flex-shrink-0" style={{ width: "calc((100vw - 1280px) / 2)", maxWidth: "24px" }} />
          {testimonials.map((t, i) => (
            <div key={t.name} className="flex-shrink-0 rounded-2xl p-7 flex flex-col gap-4"
              style={{ width: "340px", background: "#0d1120", border: "1px solid rgba(94,234,212,0.07)", opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(40px)", transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s` }}>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.75, flex: 1 }}>
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid rgba(94,234,212,0.06)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: t.color + "20" }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: t.color, fontSize: "0.75rem" }}>{t.initials}</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: "#e2e8f0", fontSize: "0.875rem" }}>{t.name}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", color: "#64748b", fontSize: "0.65rem", marginTop: "1px" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex-shrink-0" style={{ width: "calc((100vw - 1280px) / 2)", maxWidth: "24px" }} />
        </div>
      </div>
    </section>
  );
}
