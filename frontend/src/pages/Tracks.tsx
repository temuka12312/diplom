import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTracks, type LearningTrack } from "../api/courses";
import "../style/tracks.css";

export default function Tracks() {
  const [tracks, setTracks] = useState<LearningTrack[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getTracks()
      .then(setTracks)
      .catch(() => setError("Сургалтын чиглэлүүдийг ачаалж чадсангүй."));
  }, []);

  return (
    <div className="container page-shell">
      <div className="page-header">
        <h1 className="page-title page-kicker">Суралцах чиглэлүүд</h1>
        <p className="page-subtitle">
          Өөрийн сонирхол, зорилгод тохирсон чиглэлээ сонгоно уу.
        </p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="tracks-grid">
        {tracks.map((track) => (
          <Link
            key={track.id}
            to={`/courses/track/${track.id}`}
            className="card track-card"
          >
            <div className="track-card-top">
              <span className="track-chip">Track</span>
              <span className="track-count">
                {track.courses_count ?? 0} курс
              </span>
            </div>

            <h2 className="page-kicker">{track.name}</h2>
            <p>{track.description || "Энэ чиглэлтэй холбоотой курсүүд."}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}