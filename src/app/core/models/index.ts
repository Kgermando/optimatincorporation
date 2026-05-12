// === AUTH ===
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// === USER ===
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  created_at: string;
  updated_at: string;
}

// === PORTFOLIO ===
export interface Portfolio {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: PortfolioCategory;
  client?: string;
  year: number;
  cover_url: string;
  gallery_urls: string[];
  video_url?: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type PortfolioCategory =
  | 'film'
  | 'spot_publicitaire'
  | 'court_metrage'
  | 'motion_graphics'
  | 'documentaire'
  | 'simulation_3d';

// === SERVICE ===
export interface Service {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon_url?: string;
  features: string[];
  order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// === TEAM ===
export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo_url: string;
  social_facebook?: string;
  social_instagram?: string;
  social_linkedin?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

// === BLOG ===
export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  author: string;
  category: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// === CONTACT ===
export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read?: boolean;
  created_at?: string;
}

// === UPLOAD ===
export interface UploadResponse {
  url: string;
  file_id: string;
  file_name: string;
  size: number;
}

// === API ===
export interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
  page?: number;
  per_page?: number;
}

export interface PaginationQuery {
  page?: number;
  per_page?: number;
  category?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface PaginationQuery {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
}
