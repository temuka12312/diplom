import { useState } from "react";
import { Star, Clock, ArrowUpRight } from "lucide-react";
import { useReveal } from "./useReveal";

const CATS = ["All", "Development", "Data Science", "Design", "AI & ML"];

const courses = [
  { title: "Full-Stack Web Development", instructor: "Sarah Chen", category: "Development", rating: 4.9, students: "18.4k", duration: "42h", price: "$89", badge: "Bestseller", badgeColor: "#f59e0b", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=700&h=420&fit=crop&auto=format", accent: "#5eead4", size: "large" },
  { title: "Python for ML", instructor: "Marcus Johnson", category: "Data Science", rating: 4.8, students: "24k", duration: "38h", price: "$79", badge: "Hot", badgeColor: "#f43f5e", image: "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?w=500&h=320&fit=crop&auto=format", accent: "#818cf8", size: "small" },
  { title: "UX/UI Design Masterclass", instructor: "Priya Nair", category: "Design", rating: 4.9, students: "11.7k", duration: "28h", price: "$69", badge: "New", badgeColor: "#5eead4", image: "https://images.unsplash.com/photo-1602576666092-bf6447a729fc?w=500&h=320&fit=crop&auto=format", accent: "#c084fc", size: "small" },
  { title: "Deep Learning & Neural Nets", instructor: "Dr. Amir Patel", category: "AI & ML", rating: 4.7, students: "9.3k", duration: "52h", price: "$99", image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=500&h=320&fit=crop&auto=format", accent: "#34d399", size: "small" },
  { title: "React & TypeScript Complete", instructor: "Jake Morrison", category: "Development", rating: 4.8, students: "15k", duration: "34h", price: "$84", badge: "Trending", badgeColor: "#818cf8", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&h=320&fit=crop&auto=format", accent: "#818cf8", size: "small" },
];

export function CoursesSection() {
  const [cat, setCat] = useState("All");
  const { ref, visible } = useReveal(0.1);
  const filtered = cat === "All" ? courses : courses.filter(c => c.category === cat);

  return (
    <section className="w-full flex items-center justify-center py-8" style={{ minHeight: "100vh", background: "#060812" }}>
      <div ref={ref} className="max-w-7xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
          <div>
            <div className="inline-block px-3 py-1 rounded-full mb-3" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#5eead4", background: "rgba(94,234,212,0.07)", border: "1px solid rgba(94,234,212,0.15)", letterSpacing: "0.12em" }}>
              FEATURED COURSES
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,3.5vw,3rem)", color: "#e2e8f0", letterSpacing: "-0.03em" }}>
              What You'll Master
            </h2>
          </div>
          <a href="#" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: "#5eead4", textDecoration: "none", fontSize: "0.9rem" }}>View all →</a>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 0.1s" }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "0.8rem",
                padding: "6px 16px", borderRadius: "999px", border: `1px solid ${cat === c ? "rgba(94,234,212,0.35)" : "rgba(94,234,212,0.08)"}`,
                background: cat === c ? "rgba(94,234,212,0.1)" : "transparent",
                color: cat === c ? "#5eead4" : "#64748b", cursor: "pointer", transition: "all 0.2s",
              }}>
              {c}
            </button>
          ))}
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 0.15s" }}>
          {/* Large featured card */}
          {filtered[0] && (
            <div className="lg:col-span-2 lg:row-span-2 rounded-2xl overflow-hidden relative group cursor-pointer"
              style={{ background: "#0d1120", border: "1px solid rgba(94,234,212,0.07)", minHeight: "320px" }}
              onMouseEnter={e => (e.currentTarget.style.border = `1px solid ${filtered[0].accent}30`)}
              onMouseLeave={e => (e.currentTarget.style.border = "1px solid rgba(94,234,212,0.07)")}>
              <img src={filtered[0].image} alt={filtered[0].title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,8,18,0.97) 30%, rgba(6,8,18,0.4) 100%)" }} />
              <div className="absolute inset-0 p-7 flex flex-col justify-end">
                {filtered[0].badge && (
                  <span className="self-start px-2 py-1 rounded-md text-xs mb-4"
                    style={{ fontFamily: "'DM Mono', monospace", background: filtered[0].badgeColor + "25", color: filtered[0].badgeColor, border: `1px solid ${filtered[0].badgeColor}40` }}>
                    {filtered[0].badge}
                  </span>
                )}
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#e2e8f0", lineHeight: 1.25, marginBottom: "0.5rem" }}>{filtered[0].title}</h3>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#64748b", fontSize: "0.85rem", marginBottom: "1rem" }}>by {filtered[0].instructor}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1" style={{ fontFamily: "'DM Mono', monospace", color: "#f59e0b", fontSize: "0.75rem" }}>
                      <Star size={12} fill="#f59e0b" /> {filtered[0].rating}
                    </span>
                    <span style={{ fontFamily: "'DM Mono', monospace", color: "#64748b", fontSize: "0.75rem" }}>
                      <Clock size={11} style={{ display: "inline", marginRight: "4px" }} />{filtered[0].duration}
                    </span>
                    <span style={{ fontFamily: "'DM Mono', monospace", color: "#64748b", fontSize: "0.75rem" }}>{filtered[0].students} enrolled</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: "#e2e8f0", fontSize: "1.1rem" }}>{filtered[0].price}</span>
                    <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${filtered[0].accent}, #818cf8)`, border: "none", cursor: "pointer" }}>
                      <ArrowUpRight size={16} color="#060812" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Small cards */}
          {filtered.slice(1, 5).map(c => (
            <div key={c.title} className="rounded-2xl overflow-hidden relative group cursor-pointer"
              style={{ background: "#0d1120", border: "1px solid rgba(94,234,212,0.07)", minHeight: "152px" }}
              onMouseEnter={e => (e.currentTarget.style.border = `1px solid ${c.accent}30`)}
              onMouseLeave={e => (e.currentTarget.style.border = "1px solid rgba(94,234,212,0.07)")}>
              <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,8,18,0.98) 35%, rgba(6,8,18,0.45) 100%)" }} />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                {c.badge && (
                  <span className="self-start px-2 py-0.5 rounded-md text-xs mb-2"
                    style={{ fontFamily: "'DM Mono', monospace", background: c.badgeColor + "20", color: c.badgeColor, fontSize: "0.62rem" }}>
                    {c.badge}
                  </span>
                )}
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#e2e8f0", lineHeight: 1.3, marginBottom: "0.35rem" }}>{c.title}</h3>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: "'DM Mono', monospace", color: "#64748b", fontSize: "0.68rem" }}>{c.instructor} · {c.duration}</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: c.accent, fontSize: "0.9rem" }}>{c.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
