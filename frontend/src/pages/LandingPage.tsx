import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { API_ORIGIN } from "../api/axios";
import { getLandingContent, type LandingContent } from "../api/website";
import { isAuthenticated } from "../hooks/useAuth";
import "../style/landing.css";

const fallbackSlides = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80",
];

function resolveImageUrl(image?: string | null) {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${API_ORIGIN}${image}`;
}

export default function LandingPage() {
  const [data, setData] = useState<LandingContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    getLandingContent()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const slides = useMemo(() => {
    if (!data) return fallbackSlides;

    return [
      resolveImageUrl(data.slide_image_1) || fallbackSlides[0],
      resolveImageUrl(data.slide_image_2) || fallbackSlides[1],
      resolveImageUrl(data.slide_image_3) || fallbackSlides[2],
    ];
  }, [data]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return <div className="landing-loading">Loading...</div>;
  }

  return (
    <div className="landing-page">
      <div className="landing-orb orb-one" />
      <div className="landing-orb orb-two" />
      <div className="landing-orb orb-three" />

      <header className="landing-navbar">
        <div className="landing-brand">{data?.site_name || "LOTUS Learn"}</div>

        <div className="landing-nav-actions">
          <Link to="/login" className="landing-btn landing-btn-light">
            Login
          </Link>
          <Link to="/register" className="landing-btn landing-btn-primary">
            Register
          </Link>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-left">
          <span className="landing-badge">AI E-Learning Platform</span>
          <h1>{data?.hero_title}</h1>
          <p>{data?.hero_subtitle}</p>

          <div className="landing-hero-actions">
            <Link to="/register" className="landing-btn landing-btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="landing-btn landing-btn-outline">
              Sign In
            </Link>
          </div>

          <div className="landing-features">
            <div className="landing-feature-card">
              <h3>{data?.feature_1_title}</h3>
              <p>{data?.feature_1_text}</p>
            </div>

            <div className="landing-feature-card">
              <h3>{data?.feature_2_title}</h3>
              <p>{data?.feature_2_text}</p>
            </div>

            <div className="landing-feature-card">
              <h3>{data?.feature_3_title}</h3>
              <p>{data?.feature_3_text}</p>
            </div>
          </div>
        </div>

        <div className="landing-hero-right">
          <div className="landing-slider-card">
            {slides.map((src, i) => (
              <img
                key={i}
                src={src}
                className={`landing-slide ${i === slideIndex ? "active" : ""}`}
                alt={`slide-${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="landing-about">
        <div className="landing-about-card">
          <h2>{data?.about_title}</h2>
          <p>{data?.about_text}</p>
        </div>
      </section>
    </div>
  );
}
