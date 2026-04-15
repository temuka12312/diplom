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
  current_password?: string[];
  new_password?: string[];
  email?: string[];
  nickname?: string[];
  non_field_errors?: string[];
}

const translateApiErrorMessage = (message: string) => {
  const normalized = message.trim();

  const exactTranslations: Record<string, string> = {
    "Current password is incorrect.": "Одоогийн нууц үг буруу байна.",
    "This username is already taken.": "Энэ username аль хэдийн ашиглагдаж байна.",
    "This field may not be blank.": "Энэ талбар хоосон байж болохгүй.",
  };

  if (exactTranslations[normalized]) {
    return exactTranslations[normalized];
  }

  const minLengthMatch = normalized.match(
    /^Ensure this field has at least (\d+) characters\.$/
  );

  if (minLengthMatch) {
    return `Энэ талбар хамгийн багадаа ${minLengthMatch[1]} тэмдэгт байх ёстой.`;
  }

  return normalized;
};

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError<ApiErrorData>(error)) {
    return fallback;
  }

  if (error.request && !error.response) {
    return "API сервертэй холбогдож чадсангүй. Backend ажиллаж байгаа эсэх болон CORS тохиргоогоо шалгана уу.";
  }

  const message =
    error.response?.data?.non_field_errors?.[0] ||
    error.response?.data?.username?.[0] ||
    error.response?.data?.email?.[0] ||
    error.response?.data?.nickname?.[0] ||
    error.response?.data?.password?.[0] ||
    error.response?.data?.current_password?.[0] ||
    error.response?.data?.new_password?.[0] ||
    error.response?.data?.moderation_reason ||
    error.response?.data?.detail ||
    fallback;

  return translateApiErrorMessage(message);
};

export default api;
