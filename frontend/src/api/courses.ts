import api from "./axios";

export interface Lesson {
  id: number;
  title: string;
  content: string;
  video_url?: string;
  video_file?: string | null;
  file?: string | null;
  attachment?: string | null;
  order: number;
  score: number;

  practice_title?: string;
  practice_description?: string;
  practice_hint?: string;
  practice_expected_output?: string;
  practice_bonus_score?: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  track: number | null;
  track_name?: string;
  track_slug?: string;
  lessons: Lesson[];
}

export interface LearningTrack {
  id: number;
  name: string;
  description: string;
  slug: string;
  icon: string;
  order: number;
  courses_count?: number;
}

export const getTracks = async (): Promise<LearningTrack[]> => {
  const res = await api.get("/courses/tracks/");
  return res.data;
};

export const getTrackCourses = async (
  trackId: number | string
): Promise<Course[]> => {
  const res = await api.get(`/courses/tracks/${trackId}/`);
  return res.data;
};

export const getCourses = async (): Promise<Course[]> => {
  const res = await api.get("/courses/");
  return res.data;
};

export const getMyLevelCourses = async (): Promise<Course[]> => {
  const res = await api.get("/courses/?my_level=1");
  return res.data;
};

export const getCourse = async (id: number | string): Promise<Course> => {
  const res = await api.get(`/courses/${id}/`);
  return res.data;
};

export const getLesson = async (lessonId: number | string): Promise<Lesson> => {
  const res = await api.get(`/courses/lessons/${lessonId}/`);
  return res.data;
};