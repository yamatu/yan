export interface Blog {
  id: number;
  title: string;
  summary: string;
  content: string;
  path?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at: string;
  updated_at: string;
}

export interface Solution {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  path?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface Carousel {
  id: number;
  title: string;
  image_url: string;
  alt_text: string;
  description: string;
  sort_order: number;
  position: "top" | "bottom";
  rotation: number;
  image_width?: number;
  image_height?: number;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}
