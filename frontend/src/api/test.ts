import api from "./axios";

export const testApi = async () => {
  const res = await api.get("/test/");
  return res.data;
};