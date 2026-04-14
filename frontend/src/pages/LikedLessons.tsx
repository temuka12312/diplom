import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLikedLessons, type LikedLessonItem } from "../api/courses";
import LoadingState from "../components/LoadingState";

export default function LikedLessons() {
  const [items, setItems] = useState<LikedLessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getLikedLessons()
      .then(setItems)
      .catch(() => setError("Таалагдсан хичээлүүдийг ачаалж чадсангүй."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="card">
          <LoadingState
            title="Таалагдсан хичээлүүдийг ачаалж байна"
            subtitle="Таны bookmark хийсэн жагсаалтыг бэлдэж байна..."
            compact
          />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="card error-text">{error}</div>;
  }

  return (
    <div className="page-shell">
      <div className="card">
        <h1 className="page-title">Таалагдсан хичээлүүд</h1>
        <p className="lesson-content">
          Таны like хийсэн хичээлүүд энд харагдана.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="card">
          <p>Та одоогоор ямар ч хичээл like хийгээгүй байна.</p>
        </div>
      ) : (
        <div className="discussion-list">
          {items.map((item) => (
            <div key={item.id} className="card">
              <h3>{item.lesson.title}</h3>
              <p className="lesson-content">{item.lesson.content}</p>
              <p className="hint-note">Course: {item.course_title}</p>

              <div style={{ marginTop: 12 }}>
                <Link
                  className="button"
                  to={`/courses/${item.course_id}/lessons/${item.lesson.id}`}
                >
                  Хичээл рүү орох
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
