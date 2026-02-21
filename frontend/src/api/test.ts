import api from "./client";

export const testApi = async () => {
  const res = await api.get("/api/test/");
  return res.data;
};