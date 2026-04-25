import { Link, Navigate, useParams } from "react-router-dom";
import { GameExperience } from "../components/GameExperience";
import { gamesCatalog, getGameBySlug } from "../data/games";
import "../style/games.css";

export default function GameDetail() {
  const { slug } = useParams();
  const game = getGameBySlug(slug);

  if (!game) {
    return <Navigate to="/games" replace />;
  }

  const relatedGames = gamesCatalog.filter((item) => item.slug !== game.slug).slice(0, 3);

  return (
    <div className="container page-shell games-page">
      <section className="card game-detail-hero">
        <div className="game-detail-copy">
          <Link to="/games" className="games-back-link">
            ← Бүх тоглоом
          </Link>
          <span className="page-kicker">{game.language}</span>
          <h1 className="page-title">{game.title}</h1>
          <p className="page-subtitle">{game.description}</p>
          <p className="game-hint">{game.tagline}</p>
        </div>

        <div className="game-detail-meta">
          <div className="games-stat-box">
            <strong>{game.levelCount}</strong>
            <span>Level</span>
          </div>
          <div className="games-stat-box">
            <strong>{game.duration}</strong>
            <span>Дундаж хугацаа</span>
          </div>
          <div className="games-stat-box">
            <strong>{game.status === "playable" ? "Open" : "Soon"}</strong>
            <span>{game.status === "playable" ? "Тоглоход бэлэн" : "Удахгүй нэмэгдэнэ"}</span>
          </div>
        </div>
      </section>

      {game.status === "playable" ? (
        <GameExperience slug={game.slug} />
      ) : (
        <section className="card game-panel coming-panel">
          <span className="page-kicker">{game.language}</span>
          <h2>{game.title}</h2>
          <p>{game.description}</p>
          <div className="games-meta">
            <span>{game.levelCount} levels</span>
            <span>{game.duration}</span>
            <span>Coming soon</span>
          </div>
        </section>
      )}

      <section className="card games-related">
        <div className="game-panel-head">
          <div>
            <span className="page-kicker">More Games</span>
            <h2>Бусад тоглоомууд</h2>
          </div>
        </div>
        <div className="games-grid">
          {relatedGames.map((item) => (
            <article key={item.slug} className="card games-card">
              <div className="games-card-top">
                <span className="games-language-pill">{item.language}</span>
                <span className={`games-status-pill ${item.status}`}>
                  {item.status.replace("-", " ")}
                </span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link
                to={`/games/${item.slug}`}
                className={`button ${item.status === "playable" ? "" : "button-muted"}`}
              >
                {item.status === "playable" ? "Нээх" : "Дэлгэрэнгүй"}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
