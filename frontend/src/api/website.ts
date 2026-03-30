import api from "./axios";

export interface LandingContent {
  site_name: string;
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_text: string;
  feature_1_title: string;
  feature_1_text: string;
  feature_2_title: string;
  feature_2_text: string;
  feature_3_title: string;
  feature_3_text: string;
  slide_image_1: string | null;
  slide_image_2: string | null;
  slide_image_3: string | null;
}

export const getLandingContent = async (): Promise<LandingContent> => {
  const res = await api.get("/website/landing/");
  return res.data;
};