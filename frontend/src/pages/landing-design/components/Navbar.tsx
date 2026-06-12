import { useState } from "react";
import { Link } from "react-router-dom";
import { BookMarked, Menu, X } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(6,8,18,0.7)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(94,234,212,0.07)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #5eead4 0%, #818cf8 100%)" }}
          >
            <BookMarked size={15} color="#060812" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#e2e8f0", letterSpacing: "-0.02em" }}>
            LOTUS Learn
          </span>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", padding: "8px 20px", borderRadius: "10px", background: "transparent", color: "#e2e8f0", border: "1px solid rgba(94,234,212,0.15)", cursor: "pointer", textDecoration: "none" }}>
            Нэвтрэх
          </Link>
          <Link to="/register" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", padding: "8px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #5eead4, #818cf8)", color: "#060812", border: "none", cursor: "pointer", textDecoration: "none" }}>
            Бүртгүүлэх
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "#e2e8f0", cursor: "pointer" }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-4" style={{ borderTop: "1px solid rgba(94,234,212,0.07)", background: "#060812" }}>
          <Link to="/login" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, padding: "10px", borderRadius: "10px", color: "#e2e8f0", border: "1px solid rgba(94,234,212,0.15)", textAlign: "center", textDecoration: "none" }}>
            Нэвтрэх
          </Link>
          <Link to="/register" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, padding: "10px", borderRadius: "10px", background: "linear-gradient(135deg, #5eead4, #818cf8)", color: "#060812", border: "none", cursor: "pointer", textAlign: "center", textDecoration: "none" }}>
            Бүртгүүлэх
          </Link>
        </div>
      )}
    </nav>
  );
}
