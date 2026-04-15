import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

interface ApiErrorData {
  moderation_reason?: string;
  detail?: string;
  username?: string[];
  password?: string[];
  non_field_errors?: string[];
}

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError<ApiErrorData>(error)) {
    return fallback;
  }

  if (error.request && !error.response) {
    return "API сервертэй холбогдож чадсангүй. Backend ажиллаж байгаа эсэх болон CORS тохиргоогоо шалгана уу.";
  }

  return (
    error.response?.data?.non_field_errors?.[0] ||
    error.response?.data?.username?.[0] ||
    error.response?.data?.password?.[0] ||
    error.response?.data?.moderation_reason ||
    error.response?.data?.detail ||
    fallback
  );
};

export default api;
