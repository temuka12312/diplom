import { useEffect, useRef, useState } from "react";
import "./index.css";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { CoursesSection } from "./components/CoursesSection";
import { LearningPaths } from "./components/LearningPaths";
import { InstructorsSection } from "./components/InstructorsSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { PricingSection } from "./components/PricingSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";
import { SnapNav } from "./components/SnapNav";
import { TopicsSection } from "./components/TopicsSection";

/* MARKER-MAKE-KIT-INVOKED */
/* MARKER-MAKE-KIT-DISCOVERY-READ */

const SECTION_LABELS = [
  "Нүүр", "Үзүүлэлт", "Сэдэв", "Хичээл",
  "Замнал", "Багш", "Сэтгэгдэл",
  "Багц", "Эхлэх", "Төгсгөл",
];

const SECTIONS = [
  <HeroSection />,
  <StatsSection />,
  <TopicsSection />,
  <CoursesSection />,
  <LearningPaths />,
  <InstructorsSection />,
  <TestimonialsSection />,
  <PricingSection />,
  <CTASection />,
  <Footer />,
];

export default function ElearningLanding() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentRef = useRef(0);
  const snapLockRef = useRef(false);
  const touchStartRef = useRef<number | null>(null);

  const goToSection = (index: number) => {
    const next = Math.max(0, Math.min(index, SECTIONS.length - 1));
    currentRef.current = next;
    setCurrent(next);
    snapLockRef.current = true;
    sectionRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      snapLockRef.current = false;
    }, 850);
  };

  // Track current section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting) {
                    currentRef.current = i;
                    setCurrent(i);
                  }
                },
        { root: containerRef.current, threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (i: number) => goToSection(i);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 12) return;
      event.preventDefault();
      if (snapLockRef.current) return;
      goToSection(currentRef.current + (event.deltaY > 0 ? 1 : -1));
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartRef.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      const start = touchStartRef.current;
      const currentY = event.touches[0]?.clientY;
      if (start === null || currentY === undefined) return;
      const delta = start - currentY;
      if (Math.abs(delta) < 36) return;
      event.preventDefault();
      if (snapLockRef.current) return;
      touchStartRef.current = currentY;
      goToSection(currentRef.current + (delta > 0 ? 1 : -1));
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div style={{ background: "#060812", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <SnapNav total={SECTIONS.length} current={current} labels={SECTION_LABELS} onDotClick={scrollTo} />

      <div
        ref={containerRef}
        style={{
          height: "100vh",
          overflowY: "scroll",
          overflowX: "hidden",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
        }}
        /* hide scrollbar */
        className="[&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        {SECTIONS.map((section, i) => (
          <div
            key={i}
            ref={el => { sectionRefs.current[i] = el; }}
            style={{
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {section}
          </div>
        ))}
      </div>
    </div>
  );
}
