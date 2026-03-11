import api from "./axios";

export interface Lesson {
  id: number;
  title: string;
  content: string;
  order: number;
  video_url: string;

  file?: string | null;        
  attachment?: string | null;  

  score: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  lessons: Lesson[];
}


/* ---------- COURSES ---------- */

export const getCourses = async (): Promise<Course[]> => {
  const res = await api.get("/courses/");
  return res.data;
};


export const getCoursesByLevel = async (
  level: string
): Promise<Course[]> => {
  const res = await api.get(`/courses/?level=${level}`);
  return res.data;
};


export const getMyLevelCourses = async (): Promise<Course[]> => {
  const res = await api.get("/courses/?my_level=1");
  return res.data;
};


export const getCourse = async (
  id: number | string
): Promise<Course> => {
  const res = await api.get(`/courses/${id}/`);
  return res.data;
};


/* ---------- LESSON ---------- */

export const getLesson = async (
  id: number | string
): Promise<Lesson> => {
  const res = await api.get(`/courses/lessons/${id}/`);
  return res.data;
};