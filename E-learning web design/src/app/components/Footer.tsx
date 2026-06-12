import { BookMarked, Github, Twitter, Linkedin, Youtube } from "lucide-react";

const nav = {
  Learn: ["Browse Courses", "Learning Paths", "Certifications", "For Teams"],
  Company: ["About", "Careers", "Blog", "Press"],
  Support: ["Help Center", "Community", "Refund Policy", "Status"],
};

export function Footer() {
  return (
    <footer className="w-full border-t px-6 pt-16 pb-10" style={{ background: "#060812", borderColor: "rgba(94,234,212,0.07)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #5eead4, #818cf8)" }}>
                <BookMarked size={15} color="#060812" strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#e2e8f0" }}>Learnify</span>
            </div>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#64748b", fontSize: "0.875rem", lineHeight: 1.75, maxWidth: "260px", marginBottom: "1.5rem" }}>
              Empowering the next generation of engineers, designers, and data scientists worldwide.
            </p>
            <div className="flex gap-2">
              {[Twitter, Github, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{ background: "#0d1120", border: "1px solid rgba(94,234,212,0.07)", color: "#64748b" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#5eead4"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(94,234,212,0.2)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#64748b"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(94,234,212,0.07)"; }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(nav).map(([section, items]) => (
            <div key={section}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#5eead4", letterSpacing: "0.12em", marginBottom: "1rem" }}>{section.toUpperCase()}</div>
              <ul className="flex flex-col gap-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, color: "#64748b", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
                    >{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8" style={{ borderTop: "1px solid rgba(94,234,212,0.06)" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", color: "#334155", fontSize: "0.68rem" }}>© 2025 Learnify Inc.</span>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map(t => (
              <a key={t} href="#" style={{ fontFamily: "'DM Mono', monospace", color: "#334155", fontSize: "0.68rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#64748b")}
                onMouseLeave={e => (e.currentTarget.style.color = "#334155")}
              >{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
