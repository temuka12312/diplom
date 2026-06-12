import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useReveal } from "./useReveal";
import "../testimonials.css";

const testimonials = [
  { name: "Энхжин", role: "Frontend суралцагч", initials: "ЭЖ", color: "#5eead4", rating: 5, text: "Түвшин тогтоох тест миний мэдлэгт яг тохирсон хичээл санал болгосон. Ахицын самбар өдөр бүр сурах сэдэл өгдөг." },
  { name: "Тэмүүлэн", role: "Backend суралцагч", initials: "ТМ", color: "#818cf8", rating: 5, text: "AI хураангуй нь урт хичээлийн гол санааг хурдан ойлгоход тусалдаг. Дадлага ажил нь ойлголтоо бататгахад хэрэгтэй." },
  { name: "Номин", role: "UX/UI суралцагч", initials: "НМ", color: "#c084fc", rating: 5, text: "Хичээлүүд шат дараатай учраас хаанаас эхлэхээ мэдэхгүй байсан асуудал арилсан. Roadmap нь маш ойлгомжтой." },
  { name: "Билгүүн", role: "AI сонирхогч", initials: "БГ", color: "#34d399", rating: 5, text: "Өмнөх оноо, түвшин, quiz-ийн үр дүн дээр тулгуурлаж дараагийн хичээл санал болгодог нь их хэрэгтэй санагдсан." },
  { name: "Ариунаа", role: "Оюутан", initials: "АР", color: "#fb923c", rating: 5, text: "Community хэсэгт асуултаа тавиад бусад суралцагчтай санал солилцох боломжтой нь сургалтыг амьд болгосон." },
];

export function TestimonialsSection() {
  const { ref, visible } = useReveal(0.1);
  const [active, setActive] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) setVisibleCount(1);
      else if (window.innerWidth < 1280) setVisibleCount(2);
      else setVisibleCount(3);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    const maxIndex = Math.max(0, testimonials.length - visibleCount);
    setActive((current) => Math.min(current, maxIndex));

    const timer = window.setInterval(() => {
      setActive((current) => (current >= maxIndex ? 0 : current + 1));
    }, 3000);

    return () => window.clearInterval(timer);
  }, [visibleCount]);

  return (
    <section className="w-full flex items-center justify-center" style={{ minHeight: "100vh", background: "#07091a" }}>
      <div ref={ref} className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-10"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
              <div className="inline-block px-3 py-1 rounded-full mb-4"
                style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#5eead4", background: "rgba(94,234,212,0.07)", border: "1px solid rgba(94,234,212,0.15)", letterSpacing: "0.12em" }}>
                СУРАЛЦАГЧДЫН СЭТГЭГДЭЛ
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,3.5vw,3rem)", color: "#e2e8f0", letterSpacing: "-0.03em" }}>
                Бодит хэрэглээний үр дүн
              </h2>
          </div>

        <div className="rounded-2xl p-5 md:p-6 testimonial-window"
          style={{ background: "rgba(13,17,32,0.55)", border: "1px solid rgba(94,234,212,0.08)", boxShadow: "0 30px 80px rgba(0,0,0,0.24)", opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 0.2s" }}>
          <div
            className="testimonial-track"
            style={{ transform: `translateX(calc(var(--testimonial-step) * -${active}))` }}
          >
          {testimonials.map((t, i) => (
            <div key={t.name} className="testimonial-card rounded-2xl p-6 flex flex-col gap-4"
              style={{ minHeight: "232px", background: "#0d1120", border: "1px solid rgba(94,234,212,0.07)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s` }}>
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
          </div>
        </div>
      </div>
    </section>
  );
}
