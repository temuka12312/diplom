import api from "./axios";

export interface LessonSummaryResponse {
  lesson_id: number;
  title: string;
  summary: string;
}

export const getLessonSummary = async (
  lessonId: number | string
): Promise<LessonSummaryResponse> => {
  const res = await api.get(`/ai/lessons/${lessonId}/summary/`);
  return res.data;
};

/* ---------- LESSON QUIZ (answer_index-тэй) ---------- */

export interface LessonQuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer_index: number;
  explanation: string;
}

export interface LessonQuizResponse {
  lesson_id: number;
  title: string;
  questions: LessonQuizQuestion[];
}

export const getLessonQuiz = async (
  lessonId: number | string
): Promise<LessonQuizResponse> => {
  const res = await api.get(`/ai/lessons/${lessonId}/quiz/`);
  return res.data;
};

/* ---------- RECOMMENDATIONS ---------- */

export interface RecommendedLesson {
  lesson_id: number;
  lesson_title: string;
  course_id: number;
  course_title: string;
  level: string;
}

export const getRecommendations = async (): Promise<RecommendedLesson[]> => {
  const res = await api.get("/ai/recommendations/");
  return res.data.results;
};

/* ---------- PLACEMENT / LEVEL-UP TEST (answer_index-гүй) ---------- */

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  explanation: string;
}

export interface PlacementQuestion {
  id: number;
  question: string;
  options: string[];
  explanation: string;
}

export interface PlacementTestResponse {
  questions: PlacementQuestion[];
}

export interface PlacementSubmitResponse {
  correct: number;
  total: number;
  percent: number;
  level: string;
  message: string;
}

export const getPlacementTest = async (): Promise<PlacementTestResponse> => {
  const res = await api.get("/ai/placement-test/");
  return res.data;
};

export const submitPlacementTest = async (
  answers: number[]
): Promise<PlacementSubmitResponse> => {
  const res = await api.post("/ai/placement-test/submit/", { answers });
  return res.data;
};

export interface LevelUpTestResponse {
  current_level: string;
  next_level: string;
  questions: QuizQuestion[];
}

export interface LevelUpSubmitResponse {
  current_level: string;
  next_level: string;
  passed: boolean;
  correct: number;
  total: number;
  percent: number;
  new_level: string;
  message: string;
}

export const getLevelUpTest = async (): Promise<LevelUpTestResponse> => {
  const res = await api.get("/ai/level-up-test/");
  return res.data;
};

export const submitLevelUpTest = async (
  answers: number[]
): Promise<LevelUpSubmitResponse> => {
  const res = await api.post("/ai/level-up-test/submit/", { answers });
  return res.data;
};

/* ---------- CHAT ---------- */

export const sendChat = async (message: string) => {
  const res = await api.post("/ai/chat/", { message });
  return res.data.reply;
};