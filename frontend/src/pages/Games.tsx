import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { gamesCatalog, type GameCatalogItem, type GameLanguage } from "../data/games";
import "../style/games.css";

type FlexLevel = {
  id: number;
  title: string;
  goal: string;
  hint: string;
  target: {
    flexDirection: "row" | "column";
    justifyContent:
      | "flex-start"
      | "center"
      | "flex-end"
      | "space-between"
      | "space-around"
      | "space-evenly";
    alignItems: "flex-start" | "center" | "flex-end" | "stretch";
  };
  lilies: Array<{ id: string; label: string }>;
};

type HouseLevel = {
  id: number;
  title: string;
  goal: string;
  hint: string;
  slots: Array<{
    key: "title" | "roof" | "main" | "window" | "door" | "footer";
    label: string;
    expected: string;
  }>;
};

type HouseSlotKey = HouseLevel["slots"][number]["key"];
type HouseSlotMatch = HouseLevel["slots"][number] & {
  matched: boolean;
  content: string;
  currentTag: string;
};

const languages: Array<"All" | GameLanguage> = [
  "All",
  "CSS",
  "HTML",
  "Python",
  "JavaScript",
  "Java",
];

const flexLevels: FlexLevel[] = [
  {
    id: 1,
    title: "Level 1: Center the frog",
    goal: "Ногоон навчийн яг төвд шар мэлхийг аваач.",
    hint: "`justify-content` ба `align-items` хоёроор төвлөрүүлнэ.",
    target: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
    lilies: [{ id: "frog", label: "Frog" }],
  },
  {
    id: 2,
    title: "Level 2: Two ends",
    goal: "Хоёр мэлхийг зүүн ба баруун үзүүрт нь тараа.",
    hint: "Мөр хэвээр, хоорондын зай жигд биш үзүүр рүү тулна.",
    target: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    lilies: [
      { id: "frog-1", label: "Frog A" },
      { id: "frog-2", label: "Frog B" },
    ],
  },
  {
    id: 3,
    title: "Level 3: Stack it",
    goal: "Объектуудыг дээрээс доош нэг баганад байрлуул.",
    hint: "`flex-direction`-ийг сольж байж босоо болно.",
    target: { flexDirection: "column", justifyContent: "center", alignItems: "center" },
    lilies: [
      { id: "frog-1", label: "Frog A" },
      { id: "frog-2", label: "Frog B" },
      { id: "frog-3", label: "Frog C" },
    ],
  },
  {
    id: 4,
    title: "Level 4: Bottom dock",
    goal: "Мэлхийнүүдийг доод мөрийн төвд буулга.",
    hint: "Багана биш мөр хэвээр. Хөндлөн ба босоо тэнхлэгээ ялга.",
    target: { flexDirection: "row", justifyContent: "center", alignItems: "flex-end" },
    lilies: [
      { id: "frog-1", label: "Frog A" },
      { id: "frog-2", label: "Frog B" },
    ],
  },
  {
    id: 5,
    title: "Level 5: Vertical spacing",
    goal: "Гурван мэлхийг дээрээс доош тэнцүү зайтай байрлуул.",
    hint: "Column үед main axis босоо болно.",
    target: { flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" },
    lilies: [
      { id: "frog-1", label: "Frog A" },
      { id: "frog-2", label: "Frog B" },
      { id: "frog-3", label: "Frog C" },
    ],
  },
  {
    id: 6,
    title: "Level 6: Left tower",
    goal: "Баганын эхлэлд, зүүн дээд буланд багцла.",
    hint: "Column + start/start.",
    target: { flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" },
    lilies: [
      { id: "frog-1", label: "Frog A" },
      { id: "frog-2", label: "Frog B" },
      { id: "frog-3", label: "Frog C" },
    ],
  },
];

const houseLevels: HouseLevel[] = [
  {
    id: 1,
    title: "Level 1: Title first",
    goal: "Байшингийн нэрийг зөв semantic tag-д хий.",
    hint: "Хуудасны гол гарчигт `h1` хамгийн тохиромжтой.",
    slots: [{ key: "title", label: "Байшингийн гарчиг", expected: "h1" }],
  },
  {
    id: 2,
    title: "Level 2: Roof image",
    goal: "Дээврийн зураг оруулах зөв tag сонго.",
    hint: "Зураг бол text биш.",
    slots: [{ key: "roof", label: "Дээврийн зураг", expected: "img" }],
  },
  {
    id: 3,
    title: "Level 3: Main wrapper",
    goal: "Байшингийн гол хэсгийг semantic wrapper-т оруул.",
    hint: "Контентийн төв хэсэгт `main` хэрэглэнэ.",
    slots: [{ key: "main", label: "Гол бүтэц", expected: "main" }],
  },
  {
    id: 4,
    title: "Level 4: Window button биш",
    goal: "Цонхны ерөнхий блокт зөв tag сонго.",
    hint: "Зүгээр контейнер бол `div` тохиромжтой.",
    slots: [{ key: "window", label: "Цонхны хэсэг", expected: "div" }],
  },
  {
    id: 5,
    title: "Level 5: Door action",
    goal: "Doorbell дарах интерактив хэсгийг зөв tag-д хийнэ.",
    hint: "Action хийхэд `button` хэрэглэнэ.",
    slots: [{ key: "door", label: "Хаалганы товч", expected: "button" }],
  },
  {
    id: 6,
    title: "Level 6: Full house",
    goal: "Бүх хэсгийг зөв tag-уудаар бүрдүүл.",
    hint: "Semantic-аа эхлээд, дараа нь зураг ба action-аа бод.",
    slots: [
      { key: "title", label: "Байшингийн гарчиг", expected: "h1" },
      { key: "roof", label: "Дээврийн зураг", expected: "img" },
      { key: "main", label: "Гол бүтэц", expected: "main" },
      { key: "window", label: "Цонхны хэсэг", expected: "div" },
      { key: "door", label: "Хаалганы товч", expected: "button" },
      { key: "footer", label: "Доод мэдээлэл", expected: "footer" },
    ],
  },
];

const fullHouseSlots = houseLevels[houseLevels.length - 1].slots;

const tagChoices = ["h1", "img", "main", "div", "button", "footer", "p", "section"];
const defaultFlexSettings: FlexLevel["target"] = {
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "flex-start",
};

const defaultFlexCode = `display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: flex-start;`;

function parseCssProperties(source: string) {
  const entries = source
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [rawKey, ...rawValue] = chunk.split(":");
      return [rawKey?.trim().toLowerCase(), rawValue.join(":").trim().toLowerCase()] as const;
    });

  return Object.fromEntries(entries);
}

type FlexCheckResult = {
  key: "flex-direction" | "justify-content" | "align-items";
  expected: string;
  actual: string;
  valid: boolean;
};

const cssLabelMap: Record<FlexCheckResult["key"], string> = {
  "flex-direction": "Чиглэл",
  "justify-content": "Хэвтээ байрлал",
  "align-items": "Босоо байрлал",
};

function normalizeFlexSettings(source: string): FlexLevel["target"] {
  const properties = parseCssProperties(source);
  return {
    flexDirection:
      properties["flex-direction"] === "column" ? "column" : defaultFlexSettings.flexDirection,
    justifyContent:
      properties["justify-content"] === "center" ||
      properties["justify-content"] === "flex-end" ||
      properties["justify-content"] === "space-between" ||
      properties["justify-content"] === "space-around" ||
      properties["justify-content"] === "space-evenly"
        ? properties["justify-content"]
        : defaultFlexSettings.justifyContent,
    alignItems:
      properties["align-items"] === "center" ||
      properties["align-items"] === "flex-end" ||
      properties["align-items"] === "stretch"
        ? properties["align-items"]
        : defaultFlexSettings.alignItems,
  };
}

function getDefaultHtmlCode(level: HouseLevel) {
  const fullScaffold = [
    "<article class=\"house\">",
    "  <tag data-slot=\"title\">Байшингийн гарчиг</tag>",
    "  <tag data-slot=\"roof\">Дээврийн зураг</tag>",
    "  <tag data-slot=\"main\">Гол бүтэц</tag>",
    "  <tag data-slot=\"window\">Цонхны текст</tag>",
    "  <tag data-slot=\"door\">Хаалганы текст</tag>",
    "  <tag data-slot=\"footer\">Доод хэсгийн текст</tag>",
    "</article>",
  ];

  if (level.id === 1) {
    return fullScaffold.join("\n");
  }

  return fullScaffold.join("\n");
}

function getSlotNode(source: string, slotKey: HouseSlotKey) {
  const blockPattern = new RegExp(
    `<([a-z0-9-]+)\\b([^>]*)data-slot=["']${slotKey}["']([^>]*)>([\\s\\S]*?)<\\/\\1>`,
    "i"
  );
  const blockMatch = source.match(blockPattern);
  if (blockMatch) {
    return {
      tag: blockMatch[1].toLowerCase(),
      attrs: `${blockMatch[2] || ""} ${blockMatch[3] || ""}`,
      content: blockMatch[4] || "",
    };
  }

  const selfClosingPattern = new RegExp(
    `<([a-z0-9-]+)\\b([^>]*)data-slot=["']${slotKey}["']([^>]*)\\/?>`,
    "i"
  );
  const selfClosingMatch = source.match(selfClosingPattern);
  if (selfClosingMatch) {
    return {
      tag: selfClosingMatch[1].toLowerCase(),
      attrs: `${selfClosingMatch[2] || ""} ${selfClosingMatch[3] || ""}`,
      content: "",
    };
  }

  return null;
}

function getSlotContent(source: string, slotKey: HouseSlotKey) {
  const node = getSlotNode(source, slotKey);
  if (!node) return getPlaceholderContent(slotKey);

  if (node.tag === "img") {
    const altMatch = node.attrs.match(/alt\s*=\s*"([^"]+)"/i);
    const srcMatch = node.attrs.match(/src\s*=\s*"([^"]+)"/i);
    return altMatch?.[1]?.trim() || srcMatch?.[1]?.trim() || getPlaceholderContent(slotKey);
  }

  const text = node.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text || getPlaceholderContent(slotKey);
}

function getPlaceholderContent(slotKey: HouseSlotKey) {
  const placeholders: Record<HouseSlotKey, string> = {
    title: "Энд гарчиг гарна",
    roof: "Дээврийн зураг",
    main: "Гол бүтэц",
    window: "Цонхны текст",
    door: "Хаалганы текст",
    footer: "Доод хэсгийн текст",
  };

  return placeholders[slotKey];
}

function getMatchedSlots(level: HouseLevel, source: string): HouseSlotMatch[] {
  return level.slots.map((slot) => ({
    ...slot,
    matched: getSlotNode(source, slot.key)?.tag === slot.expected,
    content: getSlotContent(source, slot.key),
    currentTag: getSlotNode(source, slot.key)?.tag || "tag",
  }));
}

function FlexPondGame() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [code, setCode] = useState(defaultFlexCode);
  const [submittedCode, setSubmittedCode] = useState(defaultFlexCode);
  const [hasChecked, setHasChecked] = useState(false);
  const level = flexLevels[levelIndex];
  const liveSettings = useMemo(() => normalizeFlexSettings(code), [code]);
  const settings = useMemo(() => normalizeFlexSettings(submittedCode), [submittedCode]);
  const parsedProperties = useMemo(() => parseCssProperties(submittedCode), [submittedCode]);
  const checks: FlexCheckResult[] = [
    {
      key: "flex-direction",
      expected: level.target.flexDirection,
      actual: parsedProperties["flex-direction"] || "(missing)",
      valid: parsedProperties["flex-direction"] === level.target.flexDirection,
    },
    {
      key: "justify-content",
      expected: level.target.justifyContent,
      actual: parsedProperties["justify-content"] || "(missing)",
      valid: parsedProperties["justify-content"] === level.target.justifyContent,
    },
    {
      key: "align-items",
      expected: level.target.alignItems,
      actual: parsedProperties["align-items"] || "(missing)",
      valid: parsedProperties["align-items"] === level.target.alignItems,
    },
  ];

  const isCorrect =
    settings.flexDirection === level.target.flexDirection &&
    settings.justifyContent === level.target.justifyContent &&
    settings.alignItems === level.target.alignItems;

  const goToLevel = (index: number) => {
    setLevelIndex(index);
    setCode(defaultFlexCode);
    setSubmittedCode(defaultFlexCode);
    setHasChecked(false);
  };

  return (
    <section className="card game-panel">
      <div className="game-panel-head">
        <div>
          <span className="page-kicker">Playable</span>
          <h2>CSS Flex Pond</h2>
          <p>{level.goal}</p>
        </div>
        <div className={`game-badge ${isCorrect ? "success" : ""}`}>
          {isCorrect ? "Solved" : `Level ${level.id}/${flexLevels.length}`}
        </div>
      </div>

      <div className="game-level-strip">
        {flexLevels.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`level-chip ${index === levelIndex ? "active" : ""}`}
            onClick={() => goToLevel(index)}
          >
            {item.id}
          </button>
        ))}
      </div>

      <div className="game-grid">
        <div className="game-controls">
          <div className="control-block">
            <span>CSS code</span>
            <textarea
              className="game-editor"
              spellCheck={false}
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </div>

          <button
            type="button"
            className="button"
            onClick={() => {
              setSubmittedCode(code);
              setHasChecked(true);
            }}
          >
            Шалгах
          </button>

          {hasChecked && (
            <>
              <div className="game-code-preview">
                <code>{`display: flex;`}</code>
                <code>{`flex-direction: ${settings.flexDirection};`}</code>
                <code>{`justify-content: ${settings.justifyContent};`}</code>
                <code>{`align-items: ${settings.alignItems};`}</code>
              </div>

              <div className="validation-list">
                {checks.map((check) => (
                  <div
                    key={check.key}
                    className={`validation-item ${check.valid ? "success" : "error"}`}
                  >
                    <strong>{cssLabelMap[check.key]}</strong>
                    <span>Одоогийн утга: {check.actual}</span>
                    {!check.valid && <span>Зөв утга: {check.expected}</span>}
                  </div>
                ))}
              </div>
            </>
          )}

          <p className="game-hint">{level.hint}</p>
          <p className="game-hint">`display: flex;` тогтмол байна. Чи зөвхөн 3 property-оо өөрөө бичиж засна.</p>
          {!hasChecked && <p className="game-hint">Code-оо бичээд `Шалгах` дарж result-ээ хар.</p>}
          {hasChecked && !isCorrect && (
            <p className="game-hint">`flex-center` буруу. Энэ level дээр зөв утга нь `center`.</p>
          )}

          {hasChecked && isCorrect && (
            <button
              type="button"
              className="button"
              onClick={() => goToLevel(Math.min(levelIndex + 1, flexLevels.length - 1))}
              disabled={levelIndex === flexLevels.length - 1}
            >
              {levelIndex === flexLevels.length - 1 ? "Бүх level дууссан" : "Дараагийн level"}
            </button>
          )}
        </div>

        <div className="game-preview-wrap">
          <div className="target-note">
            Target: {level.title}
          </div>
          <div
            className="flex-pond-preview"
            style={{
              flexDirection: liveSettings.flexDirection,
              justifyContent: liveSettings.justifyContent,
              alignItems: liveSettings.alignItems,
            }}
          >
            {level.lilies.map((lily, index) => (
              <div
                key={lily.id}
                className="pond-frog"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {lily.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HouseBuilderGame() {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = houseLevels[levelIndex];
  const [code, setCode] = useState(getDefaultHtmlCode(houseLevels[0]));
  const [submittedCode, setSubmittedCode] = useState(getDefaultHtmlCode(houseLevels[0]));
  const [hasChecked, setHasChecked] = useState(false);
  const liveMatchedTags = useMemo(
    () => getMatchedSlots({ ...level, slots: fullHouseSlots }, code),
    [level, code]
  );
  const matchedTags = useMemo(() => getMatchedSlots(level, submittedCode), [level, submittedCode]);

  const resetForLevel = (index: number) => {
    const nextLevel = houseLevels[index];
    const nextCode = getDefaultHtmlCode(nextLevel);
    setLevelIndex(index);
    setCode(nextCode);
    setSubmittedCode(nextCode);
    setHasChecked(false);
  };

  const isCorrect = matchedTags.every((slot) => slot.matched);
  const compilerPreview = useMemo(() => {
    const slotMap = Object.fromEntries(liveMatchedTags.map((slot) => [slot.key, slot]));
    const lines = ["<article class=\"house-preview\">"];

    if (slotMap.title) {
      lines.push(
        `  <${slotMap.title.currentTag}>${slotMap.title.content}</${slotMap.title.currentTag}>`
      );
    }
    if (slotMap.roof) {
      if (slotMap.roof.currentTag === "img") {
        lines.push(`  <img alt="${slotMap.roof.content}" />`);
      } else {
        lines.push(
          `  <${slotMap.roof.currentTag}>${slotMap.roof.content}</${slotMap.roof.currentTag}>`
        );
      }
    }
    if (slotMap.main) {
      lines.push(`  <${slotMap.main.currentTag}>${slotMap.main.content}</${slotMap.main.currentTag}>`);
    }
    if (slotMap.window) {
      lines.push(
        `  <${slotMap.window.currentTag}>${slotMap.window.content}</${slotMap.window.currentTag}>`
      );
    }
    if (slotMap.door) {
      lines.push(
        `  <${slotMap.door.currentTag}>${slotMap.door.content}</${slotMap.door.currentTag}>`
      );
    }
    if (slotMap.footer) {
      lines.push(
        `  <${slotMap.footer.currentTag}>${slotMap.footer.content}</${slotMap.footer.currentTag}>`
      );
    }

    lines.push("</article>");
    return lines.join("\n");
  }, [liveMatchedTags]);
  const liveSlotMap = useMemo(
    () => Object.fromEntries(liveMatchedTags.map((slot) => [slot.key, slot])),
    [liveMatchedTags]
  );

  return (
    <section className="card game-panel">
      <div className="game-panel-head">
        <div>
          <span className="page-kicker">Playable</span>
          <h2>HTML House Builder</h2>
          <p>{level.goal}</p>
        </div>
        <div className={`game-badge ${isCorrect ? "success" : ""}`}>
          {isCorrect ? "Built" : `Level ${level.id}/${houseLevels.length}`}
        </div>
      </div>

      <div className="game-level-strip">
        {houseLevels.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`level-chip ${index === levelIndex ? "active" : ""}`}
            onClick={() => resetForLevel(index)}
          >
            {item.id}
          </button>
        ))}
      </div>

      <div className="game-grid">
        <div className="game-controls">
          <div className="control-block">
            <span>HTML code</span>
            <textarea
              className="game-editor game-editor-tall"
              spellCheck={false}
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </div>

          <button
            type="button"
            className="button"
            onClick={() => {
              setSubmittedCode(code);
              setHasChecked(true);
            }}
          >
            Шалгах
          </button>

          <div className="game-code-preview compiler-preview">
            <span className="compiler-title">Compiler output</span>
            <code>{compilerPreview}</code>
          </div>

          {hasChecked && (
            <>
              <div className="game-code-preview">
                {matchedTags.map((slot) => (
                  <code key={slot.key}>
                    {slot.label}: {slot.matched ? `<${slot.expected}>` : `<${slot.currentTag}>`}
                  </code>
                ))}
              </div>

              <div className="validation-list">
                {matchedTags.map((slot) => (
                  <div
                    key={slot.key}
                    className={`validation-item ${slot.matched ? "success" : "error"}`}
                  >
                    <strong>{slot.label}</strong>
                    <span>
                      {slot.matched
                        ? `<${slot.expected}> tag олдлоо`
                        : `Одоогоор <${slot.currentTag}> байна, <${slot.expected}> болго`}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          <p className="game-hint">{level.hint}</p>
          <p className="game-hint">
            Ашиглаж болох tag-ууд: {tagChoices.map((tag) => `<${tag}>`).join(", ")}
          </p>
          {!hasChecked && <p className="game-hint">Tag-уудаа бичээд `Шалгах` дарж result-ээ хар.</p>}

          {hasChecked && isCorrect && (
            <button
              type="button"
              className="button"
              onClick={() => resetForLevel(Math.min(levelIndex + 1, houseLevels.length - 1))}
              disabled={levelIndex === houseLevels.length - 1}
            >
              {levelIndex === houseLevels.length - 1 ? "Бүх level дууссан" : "Дараагийн level"}
            </button>
          )}
        </div>

        <div className="game-preview-wrap">
          <div className="target-note">{level.title}</div>
          <div className={`house-preview ${isCorrect ? "complete" : ""}`}>
            {liveSlotMap.title && (
              <div className="house-title-tag active">{liveSlotMap.title.content}</div>
            )}

            {liveSlotMap.roof && (
              <div className="house-roof active">
                <span>{liveSlotMap.roof.content}</span>
              </div>
            )}

            {liveSlotMap.main && (
              <div className="house-body active">
                <div className="house-structure-box active">{liveSlotMap.main.content}</div>
                <div className="house-room-row">
                  {liveSlotMap.window && (
                    <div className="house-window active">{liveSlotMap.window.content}</div>
                  )}
                  {liveSlotMap.door && (
                    <div className="house-door active">{liveSlotMap.door.content}</div>
                  )}
                </div>
              </div>
            )}

            {liveSlotMap.footer && (
              <div className="house-footer-tag active">{liveSlotMap.footer.content}</div>
            )}
          </div>

          <div className="house-blueprint">
            {level.slots.map((slot) => {
              const liveSlot = liveMatchedTags.find((item) => item.key === slot.key);
              return (
                <div
                  key={slot.key}
                  className={`house-blueprint-item ${liveSlot?.matched ? "active" : ""}`}
                >
                  <strong>{slot.label}</strong>
                  <span>
                    {liveSlot?.matched
                      ? `<${slot.expected}> орсон`
                      : `<${slot.expected}> хүлээж байна`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function GameCard({
  game,
  active,
  onOpen,
}: {
  game: GameCatalogItem;
  active: boolean;
  onOpen: () => void;
}) {
  return (
    <article className={`card games-card ${active ? "active" : ""}`}>
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
      <button
        type="button"
        className={`button ${game.status === "playable" ? "" : "button-muted"}`}
        onClick={onOpen}
      >
        {game.status === "playable" ? "Тоглох" : "Дэлгэрэнгүй"}
      </button>
    </article>
  );
}

export default function Games() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [language, setLanguage] = useState<"All" | GameLanguage>("All");
  const [query, setQuery] = useState("");
  const initialGame =
    gamesCatalog.find((game) => game.slug === searchParams.get("game")) || gamesCatalog[0];
  const [selectedGame, setSelectedGame] = useState<GameCatalogItem>(initialGame);

  useEffect(() => {
    const requestedGame = searchParams.get("game");
    if (!requestedGame) return;
    const match = gamesCatalog.find((game) => game.slug === requestedGame);
    if (match && match.slug !== selectedGame.slug) {
      setSelectedGame(match);
    }
  }, [searchParams, selectedGame.slug]);

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
            хэлээ сонгоод шууд тоглож эхэлнэ.
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
            <GameCard
              key={game.slug}
              game={game}
              active={selectedGame.slug === game.slug}
              onOpen={() => {
                setSelectedGame(game);
                setSearchParams({ game: game.slug });
              }}
            />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="card games-empty-state">
            Хайлтад тохирох game олдсонгүй.
          </div>
        )}
      </section>

      {selectedGame.slug === "css-flex-pond" && <FlexPondGame />}
      {selectedGame.slug === "html-house-builder" && <HouseBuilderGame />}

      {selectedGame.status === "coming-soon" && (
        <section className="card game-panel coming-panel">
          <span className="page-kicker">{selectedGame.language}</span>
          <h2>{selectedGame.title}</h2>
          <p>{selectedGame.description}</p>
          <div className="games-meta">
            <span>{selectedGame.levelCount} levels</span>
            <span>{selectedGame.duration}</span>
            <span>Coming soon</span>
          </div>
        </section>
      )}
    </div>
  );
}
