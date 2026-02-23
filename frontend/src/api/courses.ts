import api from "./axios";

export const getCourses = async () => {
  const res = await api.get("/courses/");
  return res.data;
};

export const getCourseDetail = async (id: number) => {
  const res = await api.get(`/courses/${id}/`);
  return res.data;
};