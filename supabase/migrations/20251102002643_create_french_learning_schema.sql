/*
  # French Learning App Schema

  1. New Tables
    - `worlds` - Thematic learning worlds (e.g., "Moi et le monde")
      - `id` (uuid, primary key)
      - `slug` (text, unique)
      - `title_fr` (text) - French title
      - `title_ru` (text) - Russian title for reference
      - `description` (text)
      - `order` (integer)
      - `color_palette` (jsonb) - watercolor colors for this world
      - `created_at` (timestamptz)
    
    - `scenes` - Individual learning scenes/exercises
      - `id` (uuid, primary key)
      - `world_id` (uuid, foreign key)
      - `slug` (text)
      - `type` (text) - visual_immersion, visual_recall, audio_guess, etc.
      - `order` (integer)
      - `title_fr` (text)
      - `content_spec` (jsonb) - scene configuration
      - `is_core` (boolean) - core A0 scenes
      - `created_at` (timestamptz)
    
    - `assets` - Media assets (images, audio, animations)
      - `id` (uuid, primary key)
      - `kind` (text) - image, audio, lottie, video
      - `url` (text)
      - `alt_text` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
    
    - `culture_cards` - Etymology and cultural facts
      - `id` (uuid, primary key)
      - `word_or_phrase` (text)
      - `etymology` (text)
      - `fun_fact` (text)
      - `related_scene_id` (uuid, nullable)
      - `illustration_asset_id` (uuid, nullable)
      - `created_at` (timestamptz)
    
    - `user_profiles` - User settings and preferences
      - `id` (uuid, primary key)
      - `email` (text, nullable)
      - `display_name` (text)
      - `native_language` (text, default 'ru')
      - `learning_goal` (text)
      - `preferred_time` (text)
      - `created_at` (timestamptz)
    
    - `user_progress` - Track learning progress
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `scene_id` (uuid, foreign key)
      - `stars` (integer, default 0) - understanding level (0-5)
      - `last_seen_at` (timestamptz)
      - `next_review_at` (timestamptz)
      - `srs_bucket` (integer, default 0) - spaced repetition bucket
      - `completed_at` (timestamptz, nullable)
      - `created_at` (timestamptz)
    
    - `user_events` - Learning analytics
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `event_name` (text)
      - `scene_id` (uuid, nullable)
      - `payload` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own progress and events
    - Content tables are publicly readable
*/

-- Create worlds table
CREATE TABLE IF NOT EXISTS worlds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_fr text NOT NULL,
  title_ru text NOT NULL,
  description text NOT NULL,
  "order" integer NOT NULL,
  color_palette jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE worlds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Worlds are viewable by everyone"
  ON worlds FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create scenes table
CREATE TABLE IF NOT EXISTS scenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  slug text NOT NULL,
  type text NOT NULL,
  "order" integer NOT NULL,
  title_fr text NOT NULL,
  content_spec jsonb DEFAULT '{}',
  is_core boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(world_id, slug)
);

ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scenes are viewable by everyone"
  ON scenes FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  url text NOT NULL,
  alt_text text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assets are viewable by everyone"
  ON assets FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create culture_cards table
CREATE TABLE IF NOT EXISTS culture_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word_or_phrase text NOT NULL,
  etymology text NOT NULL,
  fun_fact text NOT NULL,
  related_scene_id uuid REFERENCES scenes(id) ON DELETE SET NULL,
  illustration_asset_id uuid REFERENCES assets(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE culture_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Culture cards are viewable by everyone"
  ON culture_cards FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  display_name text DEFAULT '',
  native_language text DEFAULT 'ru',
  learning_goal text DEFAULT '',
  preferred_time text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (id = gen_random_uuid());

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (id = gen_random_uuid())
  WITH CHECK (id = gen_random_uuid());

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  scene_id uuid NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
  stars integer DEFAULT 0,
  last_seen_at timestamptz DEFAULT now(),
  next_review_at timestamptz DEFAULT now(),
  srs_bucket integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, scene_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create user_events table
CREATE TABLE IF NOT EXISTS user_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  event_name text NOT NULL,
  scene_id uuid REFERENCES scenes(id) ON DELETE SET NULL,
  payload jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
  ON user_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own events"
  ON user_events FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scenes_world_id ON scenes(world_id);
CREATE INDEX IF NOT EXISTS idx_scenes_order ON scenes("order");
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_scene_id ON user_progress(scene_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_next_review ON user_progress(next_review_at);
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON user_events(created_at);