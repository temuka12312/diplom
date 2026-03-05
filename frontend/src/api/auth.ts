import api from "./axios";

export const loginApi = async (username: string, password: string) => {
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

export interface MeResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  skill_level: string | null;
  total_score: number;
  completed_lessons: number;
  has_placement_test: boolean;
}

export const meApi = async (): Promise<MeResponse> => {
  const res = await api.get("/auth/me/");
  return res.data; 
};

export const saveLevel = async (level: string) => {
  const res = await api.post("/auth/save-level/", { level });
  return res.data;
};