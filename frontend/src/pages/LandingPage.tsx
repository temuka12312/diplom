import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { API_ORIGIN } from "../api/axios";
import { getLandingContent, type LandingContent } from "../api/website";
import { isAuthenticated } from "../hooks/useAuth";
import LoadingState from "../components/LoadingState";
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

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={`landing-review-star ${index < rating ? "filled" : ""}`}>
      ★
    </span>
  ));
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
    return (
      <div className="landing-loading">
        <LoadingState
          title="LOTUS Learn ачаалж байна"
          subtitle="Нүүр хуудасны агуулгыг бэлдэж байна..."
        />
      </div>
    );
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

      <section className="landing-reviews">
        <div className="landing-section-head">
          <span className="landing-badge">Learner Reviews</span>
          <h2>Суралцагчид юу гэж хэлж байна</h2>
          <p>
            Платформын хэрэглээ, түвшин тогтоох тест болон ахицын тухай бодит сэтгэгдлүүд.
          </p>
        </div>

        <div className="landing-review-grid">
          {data?.reviews?.length ? (
            data.reviews.map((review) => (
              <article key={review.id} className="landing-review-card">
                <div className="landing-review-stars">{renderStars(review.rating)}</div>
                <p className="landing-review-text">“{review.review_text}”</p>
                <div className="landing-review-meta">
                  <strong>{review.name}</strong>
                  <span>
                    {[review.role, review.company].filter(Boolean).join(" • ") || "LOTUS Learn User"}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <>
              <article className="landing-review-card">
                <div className="landing-review-stars">{renderStars(5)}</div>
                <p className="landing-review-text">
                  “Placement test нь миний түвшинд таарсан хичээлүүдийг хурдан олж өгсөн.”
                </p>
                <div className="landing-review-meta">
                  <strong>Enkhjin</strong>
                  <span>Frontend Learner</span>
                </div>
              </article>

              <article className="landing-review-card">
                <div className="landing-review-stars">{renderStars(5)}</div>
                <p className="landing-review-text">
                  “Dashboard, progress, level-up test нь суралцах явцаа хянахад их ойлгомжтой.”
                </p>
                <div className="landing-review-meta">
                  <strong>Temuulen</strong>
                  <span>Student Developer</span>
                </div>
              </article>

              <article className="landing-review-card">
                <div className="landing-review-stars">{renderStars(4)}</div>
                <p className="landing-review-text">
                  “AI summary болон adaptive content нь цаг хэмнэдэг, эхлэхэд амар болгосон.”
                </p>
                <div className="landing-review-meta">
                  <strong>Nandia</strong>
                  <span>Self-paced Learner</span>
                </div>
              </article>
            </>
          )}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-grid">
          <div>
            <div className="landing-footer-brand">{data?.site_name || "LOTUS Learn"}</div>
            <p className="landing-footer-copy">
              AI-д суурилсан шатлалтай сургалтын туршлага, placement test, ахиц хяналт, community.
            </p>
          </div>

          <div>
            <h3>Platform</h3>
            <ul>
              <li>Placement Test</li>
              <li>Adaptive Courses</li>
              <li>Level Up Test</li>
              <li>Progress Tracking</li>
            </ul>
          </div>

          <div>
            <h3>For Learners</h3>
            <ul>
              <li>Structured Lessons</li>
              <li>AI Summaries</li>
              <li>Practice Quizzes</li>
              <li>Learning Community</li>
            </ul>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <span>© 2026 LOTUS Learn. All rights reserved.</span>
          <span>Built for modern adaptive e-learning.</span>
        </div>
      </footer>
    </div>
  );
}
