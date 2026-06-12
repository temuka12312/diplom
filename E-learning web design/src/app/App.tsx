import { useEffect, useRef, useState } from "react";
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
  "Home", "Stats", "Topics", "Courses",
  "Paths", "Instructors", "Stories",
  "Pricing", "Get Started", "Footer",
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

export default function App() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track current section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setCurrent(i); },
        { root: containerRef.current, threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
  };

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
