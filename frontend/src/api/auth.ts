import api from "./axios";

export const login = async (username: string, password: string) => {
  const res = await api.post("auth/login/", { username, password });
  return res.data;
};

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  await api.post("auth/register/", { username, email, password });
};