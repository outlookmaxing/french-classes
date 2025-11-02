import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type World = {
  id: string;
  slug: string;
  title_fr: string;
  title_ru: string;
  description: string;
  order: number;
  color_palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  created_at: string;
};

export type Scene = {
  id: string;
  world_id: string;
  slug: string;
  type: 'visual_immersion' | 'visual_recall' | 'audio_guess' | 'associations' | 'roleplay' | 'culture' | 'errors';
  order: number;
  title_fr: string;
  content_spec: Record<string, unknown>;
  is_core: boolean;
  created_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  scene_id: string;
  stars: number;
  last_seen_at: string;
  next_review_at: string;
  srs_bucket: number;
  completed_at: string | null;
  created_at: string;
};
