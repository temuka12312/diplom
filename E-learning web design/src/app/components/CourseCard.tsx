import { Star, Clock, Users, BookOpen } from "lucide-react";

interface CourseCardProps {
  title: string;
  instructor: string;
  category: string;
  rating: number;
  students: string;
  duration: string;
  lessons: number;
  price: string;
  badge?: string;
  image: string;
  color: string;
}

export function CourseCard({ title, instructor, category, rating, students, duration, lessons, price, badge, image, color }: CourseCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-transform duration-200 cursor-pointer"
      style={{ background: "#141726", border: "1px solid rgba(108,99,255,0.12)" }}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div className="relative" style={{ aspectRatio: "16/9", background: "#1e2235" }}>
        <img src={image} alt={title} className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(20,23,38,0.7) 100%)" }} />
        {badge && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, background: color, color: "#fff" }}>
            {badge}
          </div>
        )}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs" style={{ fontFamily: "Space Mono, monospace", background: "rgba(13,15,26,0.8)", color: "#e8eaf0", backdropFilter: "blur(6px)" }}>
          {category}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#e8eaf0", fontSize: "1rem", lineHeight: 1.4 }}>{title}</h3>
        <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 500, color: "#8892b0", fontSize: "0.85rem" }}>by {instructor}</p>

        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={13} fill={i <= Math.floor(rating) ? "#f59e0b" : "none"} color="#f59e0b" />
          ))}
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.75rem", color: "#f59e0b", marginLeft: "4px" }}>{rating}</span>
          <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.75rem", color: "#8892b0", marginLeft: "2px" }}>({students})</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1" style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", color: "#8892b0" }}>
            <Clock size={13} /> {duration}
          </span>
          <span className="flex items-center gap-1" style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", color: "#8892b0" }}>
            <BookOpen size={13} /> {lessons} lessons
          </span>
          <span className="flex items-center gap-1" style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", color: "#8892b0" }}>
            <Users size={13} /> {students}
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: "1px solid rgba(108,99,255,0.1)" }}>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#e8eaf0", fontSize: "1.1rem" }}>{price}</span>
          <button className="px-4 py-2 rounded-lg text-sm transition-opacity" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, background: "linear-gradient(135deg, #6c63ff, #7c3aed)", color: "#fff", border: "none", cursor: "pointer" }}>
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}
