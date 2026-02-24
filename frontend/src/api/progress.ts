import api from "./axios";

export interface LessonProgress {
  id: number;
  lesson: number;
  is_completed: boolean;
  score: number;
  completed_at: string | null;
}

export interface CourseProgress {
  course_id: number;
  course_title: string;
  total_lessons: number;
  completed_lessons: number;
  progress_percent: number;
}

export const getLessonProgress = async (
  lessonId: number | string
): Promise<LessonProgress> => {
  const res = await api.get(`/progress/lessons/${lessonId}/`);
  return res.data;
};

export const completeLesson = async (
  lessonId: number | string,
  score: number
): Promise<LessonProgress> => {
  const res = await api.post(`/progress/lessons/${lessonId}/complete/`, {
    score,
  });
  return res.data;
};

export interface ProgressSummary {
  username: string;
  email: string;
  role: string | null;
  skill_level: string | null;
  total_score: number;
  completed_lessons: number;
  courses: CourseProgress[];
}

export const getProgressSummary = async (): Promise<ProgressSummary> => {
  const res = await api.get("/progress/summary/");
  return res.data;
};