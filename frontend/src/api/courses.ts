import api from "./axios";

export interface Lesson {
  id: number;
  title: string;
  content: string;
  video_url: string;
  order: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  lessons: Lesson[];
}

export const getCourses = async (): Promise<Course[]> => {
  const res = await api.get("/courses/");
  return res.data;
};

export const getCourse = async (id: number | string): Promise<Course> => {
  const res = await api.get(`/courses/${id}/`);
  return res.data;
};

export const getLesson = async (id: number | string): Promise<Lesson> => {
  const res = await api.get(`/courses/lessons/${id}/`);
  return res.data;
};