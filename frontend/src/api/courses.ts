import api from "./axios";
import { API_ORIGIN } from "./axios";

export interface Lesson {
  id: number;
  title: string;
  content: string;
  video_url?: string;
  video_file?: string | null;
  file?: string | null;
  attachment?: string | null;
  order: number;
  score: number;
  is_liked?: boolean;

  practice_title?: string;
  practice_description?: string;
  practice_hint?: string;
  practice_expected_output?: string;
  practice_bonus_score?: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail?: string | null;
  level: string;
  track: number | null;
  track_name?: string;
  track_slug?: string;
  learner_count?: number;
  liked_count?: number;
  lesson_count?: number;
  lessons: Lesson[];
}

export interface LearningTrack {
  id: number;
  name: string;
  description: string;
  slug: string;
  icon: string;
  order: number;
  courses_count?: number;
}

export interface LikedLessonItem {
  id: number;
  lesson: Lesson;
  course_id: number;
  course_title: string;
  created_at: string;
}

export interface TrackSection {
  id: number;
  name: string;
  slug: string;
  description: string;
  courses: Course[];
}

export interface HomeFeedResponse {
  user_level: string;
  featured_courses: Course[];
  track_sections: TrackSection[];
}

export interface CatalogSearchResult {
  tracks: Array<{
    id: number;
    name: string;
    slug: string;
    type: "track";
  }>;
  courses: Array<{
    id: number;
    title: string;
    track_name?: string;
    type: "course";
  }>;
  lessons: Array<{
    id: number;
    title: string;
    course_id: number;
    course_title: string;
    type: "lesson";
  }>;
}

export const getTracks = async (): Promise<LearningTrack[]> => {
  const res = await api.get("/courses/tracks/");
  return res.data;
};

export const getTrackCourses = async (
  trackId: number | string
): Promise<Course[]> => {
  const res = await api.get(`/courses/tracks/${trackId}/`);
  return res.data;
};

export const getCourses = async (): Promise<Course[]> => {
  const res = await api.get("/courses/");
  return res.data;
};

export const getMyLevelCourses = async (): Promise<Course[]> => {
  const res = await api.get("/courses/?my_level=1");
  return res.data;
};

export const getCourse = async (id: number | string): Promise<Course> => {
  const res = await api.get(`/courses/${id}/`);
  return res.data;
};

export const getLesson = async (lessonId: number | string): Promise<Lesson> => {
  const res = await api.get(`/courses/lessons/${lessonId}/`);
  return res.data;
};

export const toggleLessonLike = async (
  lessonId: number | string
): Promise<{ liked: boolean }> => {
  const res = await api.post(`/courses/lessons/${lessonId}/toggle-like/`);
  return res.data;
};

export const getLikedLessons = async (): Promise<LikedLessonItem[]> => {
  const res = await api.get("/courses/liked-lessons/");
  return res.data;
};

export const getHomeFeed = async (): Promise<HomeFeedResponse> => {
  const res = await api.get("/courses/home-feed/");
  return res.data;
};

export const searchCatalog = async (query: string): Promise<CatalogSearchResult> => {
  const res = await api.get("/courses/search/", {
    params: { q: query },
  });
  return res.data;
};

export const resolveCourseThumbnail = (image?: string | null) => {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${API_ORIGIN}${image}`;
};
