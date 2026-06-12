import { Star, Users, ArrowUpRight } from "lucide-react";
import { useReveal } from "./useReveal";

const instructors = [
  { name: "Sarah Chen", role: "Staff Engineer @ Google", tag: "Web Dev", color: "#5eead4", rating: 4.9, students: "18.4k", courses: 6, img: "https://images.unsplash.com/photo-1619852182277-79aa23f82c8e?w=400&h=400&fit=crop&auto=format" },
  { name: "Marcus Johnson", role: "Data Scientist @ Meta", tag: "Data Science", color: "#818cf8", rating: 4.8, students: "24.1k", courses: 4, img: "https://images.unsplash.com/photo-1597933471507-1ca5765185d8?w=400&h=400&fit=crop&auto=format" },
  { name: "Priya Nair", role: "Lead Designer @ Airbnb", tag: "UX Design", color: "#c084fc", rating: 4.9, students: "11.7k", courses: 5, img: "https://images.unsplash.com/photo-1623076189461-f7706b741c04?w=400&h=400&fit=crop&auto=format" },
  { name: "Dr. Amir Patel", role: "AI Researcher @ OpenAI", tag: "AI & ML", color: "#34d399", rating: 4.7, students: "9.3k", courses: 3, img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop&auto=format" },
];

export function InstructorsSection() {
  const { ref, visible } = useReveal(0.1);

  return (
    <section className="w-full flex items-center justify-center" style={{ minHeight: "100vh", background: "#060812" }}>
      <div ref={ref} className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
          <div>
            <div className="inline-block px-3 py-1 rounded-full mb-4"
              style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#5eead4", background: "rgba(94,234,212,0.07)", border: "1px solid rgba(94,234,212,0.15)", letterSpacing: "0.12em" }}>
              INSTRUCTORS
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,3.5vw,3rem)", color: "#e2e8f0", letterSpacing: "-0.03em" }}>
              Learn from Industry Leaders
            </h2>
          </div>
          <a href="#" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: "#5eead4", textDecoration: "none", fontSize: "0.9rem" }}>Meet all instructors →</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {instructors.map((inst, i) => (
            <div key={inst.name}
              className="rounded-2xl overflow-hidden group cursor-pointer relative"
              style={{ background: "#0d1120", border: "1px solid rgba(94,234,212,0.07)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s` }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${inst.color}35`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(94,234,212,0.07)"; }}>

              {/* Image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3", background: "#131829" }}>
                <img src={inst.img} alt={inst.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, #0d1120 0%, transparent 60%)` }} />
                {/* Top-right arrow */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: inst.color }}>
                  <ArrowUpRight size={14} color="#060812" />
                </div>
                {/* Tag */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md"
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", background: inst.color + "20", color: inst.color, border: `1px solid ${inst.color}30` }}>
                  {inst.tag}
                </div>
              </div>

              <div className="p-5">
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: "#e2e8f0", fontSize: "1rem" }}>{inst.name}</h3>
                <p style={{ fontFamily: "'DM Mono', monospace", color: "#64748b", fontSize: "0.68rem", marginTop: "3px", marginBottom: "1rem" }}>{inst.role}</p>

                <div className="flex items-center gap-1 mb-3">
                  <Star size={12} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#f59e0b" }}>{inst.rating}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#475569", marginLeft: "2px" }}>rating</span>
                </div>

                <div className="flex justify-between pt-3" style={{ borderTop: "1px solid rgba(94,234,212,0.06)" }}>
                  <div className="flex items-center gap-1">
                    <Users size={11} color="#64748b" />
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: "#e2e8f0", fontSize: "0.82rem" }}>{inst.students}</span>
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", color: "#64748b", fontSize: "0.68rem" }}>{inst.courses} courses</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
