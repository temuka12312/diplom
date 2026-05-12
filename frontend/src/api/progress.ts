import api from "./axios";

export interface LessonProgress {
  id: number;
  lesson: number;
  is_completed: boolean;
  score: number;
  practice_answer: string;
  practice_submitted: boolean;
  practice_feedback: string;
  practice_submitted_at: string | null;
  completed_at: string | null;
}

export interface CourseProgress {
  course_id: number;
  course_title: string;
  total_lessons: number;
  completed_lessons: number;
  progress_percent: number;
  course_score: number;
}

export interface WeeklyActivity {
  date: string;
  label: string;
  lesson_count: number;
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

export interface PracticeSubmitResponse {
  accepted: boolean;
  feedback: string;
  progress: LessonProgress;
}

export const submitPracticeTask = async (
  lessonId: number | string,
  answer: string
): Promise<PracticeSubmitResponse> => {
  const res = await api.post(`/progress/lessons/${lessonId}/submit-practice/`, {
    answer,
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
  weekly_activity: WeeklyActivity[];
}

export const getProgressSummary = async (): Promise<ProgressSummary> => {
  const res = await api.get("/progress/summary/");
  return res.data;
};


export const saveQuizScore = async (
  lessonId: number | string,
  score: number
) => {
  const res = await api.post(`/progress/lessons/${lessonId}/quiz-score/`, {
    score,
  });
  return res.data;
};
