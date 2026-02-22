import api from "./axios";

export const loginApi = async (
  username: string,
  password: string
) => {
  const res = await api.post("/auth/login/", {
    username,
    password,
  });
  return res.data;
};

export const registerApi = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await api.post("/auth/register/", {
    username,
    email,
    password,
  });
  return res.data;
};
