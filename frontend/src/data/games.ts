export type GameLanguage = "CSS" | "HTML" | "Python" | "Java" | "JavaScript";
export type GameStatus = "playable" | "coming-soon";

export interface GameCatalogItem {
  slug: string;
  title: string;
  language: GameLanguage;
  difficulty: "Beginner";
  description: string;
  tagline: string;
  duration: string;
  levelCount: number;
  status: GameStatus;
  searchTerms: string[];
}

export const gamesCatalog: GameCatalogItem[] = [
  {
    slug: "css-flex-pond",
    title: "CSS Flex Pond",
    language: "CSS",
    difficulty: "Beginner",
    description: "Flexbox ашиглаад object-уудыг зөв мөр, багана, төвшинд оруулах puzzle.",
    tagline: "Flexbox-г Froggy маягаар шат ахиулж сур.",
    duration: "10-15 мин",
    levelCount: 6,
    status: "playable",
    searchTerms: ["css", "flex", "flexbox", "layout", "frog", "pond", "justify", "align"],
  },
  {
    slug: "html-house-builder",
    title: "HTML House Builder",
    language: "HTML",
    difficulty: "Beginner",
    description: "Зөв tag-уудаар байшингийн хэсгүүдийг угсардаг semantic puzzle.",
    tagline: "Tag бүр юу хийдгийг шууд барьж үзээд ойлго.",
    duration: "10-15 мин",
    levelCount: 6,
    status: "playable",
    searchTerms: ["html", "tag", "house", "builder", "semantic", "header", "main", "footer"],
  },
  {
    slug: "python-bot-quest",
    title: "Python Bot Quest",
    language: "Python",
    difficulty: "Beginner",
    description: "Command, loop, condition ашиглаад bot-оо зорилгод хүргэдэг puzzle.",
    tagline: "Тун удахгүй.",
    duration: "8-12 мин",
    levelCount: 8,
    status: "coming-soon",
    searchTerms: ["python", "loop", "if", "bot", "quest", "function"],
  },
  {
    slug: "javascript-event-lab",
    title: "JavaScript Event Lab",
    language: "JavaScript",
    difficulty: "Beginner",
    description: "Click, event, DOM interaction-ийг жижиг mission-уудаар сурна.",
    tagline: "Тун удахгүй.",
    duration: "8-12 мин",
    levelCount: 7,
    status: "coming-soon",
    searchTerms: ["javascript", "js", "dom", "event", "button", "interaction"],
  },
  {
    slug: "java-class-escape",
    title: "Java Class Escape",
    language: "Java",
    difficulty: "Beginner",
    description: "Class, object, condition ашиглаж unlock хийдэг logic game.",
    tagline: "Тун удахгүй.",
    duration: "12-18 мин",
    levelCount: 7,
    status: "coming-soon",
    searchTerms: ["java", "class", "object", "oop", "condition", "escape"],
  },
];

export function searchGames(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return gamesCatalog.filter((game) => {
    const haystack = [
      game.title,
      game.language,
      game.description,
      game.tagline,
      ...game.searchTerms,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
