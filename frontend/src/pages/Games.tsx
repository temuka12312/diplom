import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { gamesCatalog, type GameCatalogItem, type GameLanguage } from "../data/games";
import "../style/games.css";

const languages: Array<"All" | GameLanguage> = [
  "All",
  "CSS",
  "HTML",
  "Python",
  "JavaScript",
  "Java",
];

function GameCard({ game }: { game: GameCatalogItem }) {
  return (
    <article className="card games-card">
      <div className="games-card-top">
        <span className="games-language-pill">{game.language}</span>
        <span className={`games-status-pill ${game.status}`}>{game.status.replace("-", " ")}</span>
      </div>
      <h2>{game.title}</h2>
      <p>{game.description}</p>
      <div className="games-meta">
        <span>{game.levelCount} levels</span>
        <span>{game.duration}</span>
        <span>{game.difficulty}</span>
      </div>
      <Link
        to={`/games/${game.slug}`}
        className={`button ${game.status === "playable" ? "" : "button-muted"}`}
      >
        {game.status === "playable" ? "Тоглох" : "Дэлгэрэнгүй"}
      </Link>
    </article>
  );
}

export default function Games() {
  const [language, setLanguage] = useState<"All" | GameLanguage>("All");
  const [query, setQuery] = useState("");

  const filteredGames = useMemo(() => {
    return gamesCatalog.filter((game) => {
      const languageMatch = language === "All" || game.language === language;
      const searchMatch =
        !query.trim() ||
        [
          game.title,
          game.language,
          game.description,
          game.tagline,
          ...game.searchTerms,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase());
      return languageMatch && searchMatch;
    });
  }, [language, query]);

  const playableCount = gamesCatalog.filter((game) => game.status === "playable").length;

  return (
    <div className="container page-shell games-page">
      <section className="games-hero card">
        <div>
          <span className="page-kicker">All Games</span>
          <h1 className="page-title">Бүх тоглоом</h1>
          <p className="page-subtitle">
            Course-оос тусдаа, search болон filter-тэй game catalog. User өөрөө сонирхсон
            хэлээ сонгоод game page руу орж шууд тоглож эхэлнэ.
          </p>
        </div>

        <div className="games-hero-stats">
          <div className="games-stat-box">
            <strong>{gamesCatalog.length}</strong>
            <span>Нийт тоглоом</span>
          </div>
          <div className="games-stat-box">
            <strong>{playableCount}</strong>
            <span>Тоглож болох</span>
          </div>
          <div className="games-stat-box">
            <strong>Beginner</strong>
            <span>Эхний үе шат</span>
          </div>
        </div>
      </section>

      <section className="card games-toolbar">
        <input
          type="text"
          className="profile-input"
          placeholder="Game хайх... flex, house, html, css"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <div className="games-filter-row">
          {languages.map((item) => (
            <button
              key={item}
              type="button"
              className={`choice-pill ${language === item ? "selected" : ""}`}
              onClick={() => setLanguage(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="games-catalog">
        <div className="games-grid">
          {filteredGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="card games-empty-state">
            Хайлтад тохирох game олдсонгүй.
          </div>
        )}
      </section>
    </div>
  );
}
