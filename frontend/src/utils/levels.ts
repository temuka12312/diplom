export type UserLevel = "beginner" | "elementary" | "intermediate" | "advanced";

export const levelLabels: Record<UserLevel, string> = {
  beginner: "Анхан",
  elementary: "Суурь",
  intermediate: "Дунд",
  advanced: "Ахисан",
};

export const getLevelLabel = (level?: string | null) =>
  levelLabels[(level as UserLevel) || "beginner"] || "Анхан";

export const getLevelClass = (level?: string | null) => {
  if (level === "beginner") return "pill-beginner";
  if (level === "elementary") return "pill-elementary";
  if (level === "intermediate") return "pill-intermediate";
  return "pill-advanced";
};

export const levelRank: Record<UserLevel, number> = {
  beginner: 1,
  elementary: 2,
  intermediate: 3,
  advanced: 4,
};
