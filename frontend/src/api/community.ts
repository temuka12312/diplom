import api from "./axios";

export interface CommunityComment {
  id: number;
  post: number;
  author: number;
  author_username: string;
  content: string;
  created_at: string;
}

export interface CommunityPost {
  id: number;
  author: number;
  author_username: string;
  title: string;
  content: string;
  lesson: number | null;
  created_at: string;
  comments: CommunityComment[];
}

export const getCommunityPosts = async (lessonId?: number | string): Promise<CommunityPost[]> => {
  const url = lessonId
    ? `/community/posts/?lesson=${lessonId}`
    : "/community/posts/";
  const res = await api.get(url);
  return res.data;
};

export const createCommunityPost = async (payload: {
  title?: string;
  content: string;
  lesson?: number | null;
}) => {
  const res = await api.post("/community/posts/", payload);
  return res.data;
};

export const createCommunityComment = async (payload: {
  post: number;
  content: string;
}) => {
  const res = await api.post("/community/comments/", payload);
  return res.data;
};