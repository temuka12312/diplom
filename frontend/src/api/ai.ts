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

// ---- QUIZ ----

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer_index: number;
  explanation: string;
}

export interface LessonQuizResponse {
  lesson_id: number;
  title: string;
  questions: QuizQuestion[];
}

export const getLessonQuiz = async (
  lessonId: number | string
): Promise<LessonQuizResponse> => {
  const res = await api.get(`/ai/lessons/${lessonId}/quiz/`);
  return res.data;
};

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


export interface PlacementQuestion {
  id: number;
  question: string;
  options: string[];
  answer_index: number;
  explanation: string;
}

export interface PlacementTestResponse {
  questions: PlacementQuestion[];
}

export const getPlacementTest = async (): Promise<PlacementTestResponse> => {
  const res = await api.get("/ai/placement-test/");
  return res.data;
};