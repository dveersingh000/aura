/*
  # AURAIS - Emotional Fragrance Discovery Schema

  ## Overview
  Database schema for an AI-powered emotional fragrance discovery app that matches users with perfumes based on mood, personality, and scent preferences.

  ## New Tables

  ### 1. `perfumes`
  Stores L'Oréal perfume products with emotional metadata
  - `id` (uuid, primary key)
  - `name` (text) - Product name
  - `brand` (text) - L'Oréal brand line
  - `description` (text) - Emotional description
  - `image_url` (text) - Product image
  - `price` (numeric) - Price
  - `aura_color` (text) - Hex color for AR visualization
  - `vr_environment` (text) - Associated VR mood world
  - `emotional_impact` (text) - Psychological effect description
  - `created_at` (timestamptz)

  ### 2. `moods`
  Emotional states for MoodScan feature
  - `id` (uuid, primary key)
  - `name` (text) - Mood name (calm, romantic, energetic, bold, fresh)
  - `description` (text) - Mood description
  - `color` (text) - Associated color
  - `icon` (text) - Icon name

  ### 3. `personas`
  Fragrance personality types
  - `id` (uuid, primary key)
  - `name` (text) - Persona name
  - `description` (text) - Personality description
  - `characteristics` (text[]) - Key traits

  ### 4. `scent_notes`
  Fragrance note categories
  - `id` (uuid, primary key)
  - `name` (text) - Note name (vanilla, citrus, floral, woody, spicy)
  - `category` (text) - Top/Middle/Base note
  - `description` (text)

  ### 5. Relationship Tables
  - `perfume_moods` - Links perfumes to moods
  - `perfume_notes` - Links perfumes to scent notes
  - `perfume_personas` - Links perfumes to personas

  ### 6. `user_profiles`
  User scent DNA and preferences (if auth is added later)
  - `id` (uuid, primary key)
  - `detected_mood` (uuid, foreign key)
  - `detected_persona` (uuid, foreign key)
  - `selected_notes` (uuid[]) - Array of scent note IDs
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for catalog data
  - Authenticated access for user profiles
*/

-- Create tables
CREATE TABLE IF NOT EXISTS perfumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL DEFAULT 'L''Oréal',
  description text NOT NULL,
  image_url text,
  price numeric(10,2),
  aura_color text NOT NULL,
  vr_environment text NOT NULL,
  emotional_impact text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS moods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  color text NOT NULL,
  icon text NOT NULL
);

CREATE TABLE IF NOT EXISTS personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  characteristics text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS scent_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text NOT NULL CHECK (category IN ('top', 'middle', 'base')),
  description text NOT NULL
);

CREATE TABLE IF NOT EXISTS perfume_moods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  perfume_id uuid REFERENCES perfumes(id) ON DELETE CASCADE,
  mood_id uuid REFERENCES moods(id) ON DELETE CASCADE,
  strength integer DEFAULT 5 CHECK (strength >= 1 AND strength <= 10),
  UNIQUE(perfume_id, mood_id)
);

CREATE TABLE IF NOT EXISTS perfume_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  perfume_id uuid REFERENCES perfumes(id) ON DELETE CASCADE,
  note_id uuid REFERENCES scent_notes(id) ON DELETE CASCADE,
  prominence integer DEFAULT 5 CHECK (prominence >= 1 AND prominence <= 10),
  UNIQUE(perfume_id, note_id)
);

CREATE TABLE IF NOT EXISTS perfume_personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  perfume_id uuid REFERENCES perfumes(id) ON DELETE CASCADE,
  persona_id uuid REFERENCES personas(id) ON DELETE CASCADE,
  match_score integer DEFAULT 5 CHECK (match_score >= 1 AND match_score <= 10),
  UNIQUE(perfume_id, persona_id)
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  detected_mood uuid REFERENCES moods(id),
  detected_persona uuid REFERENCES personas(id),
  selected_notes uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE scent_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfume_moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfume_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfume_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Public read access for catalog data
CREATE POLICY "Allow public read access to perfumes"
  ON perfumes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to moods"
  ON moods FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to personas"
  ON personas FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to scent notes"
  ON scent_notes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to perfume moods"
  ON perfume_moods FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to perfume notes"
  ON perfume_notes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to perfume personas"
  ON perfume_personas FOR SELECT
  TO public
  USING (true);

-- Public insert for user profiles (for prototype)
CREATE POLICY "Allow public insert to user profiles"
  ON user_profiles FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read access to user profiles"
  ON user_profiles FOR SELECT
  TO public
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_perfume_moods_perfume ON perfume_moods(perfume_id);
CREATE INDEX IF NOT EXISTS idx_perfume_moods_mood ON perfume_moods(mood_id);
CREATE INDEX IF NOT EXISTS idx_perfume_notes_perfume ON perfume_notes(perfume_id);
CREATE INDEX IF NOT EXISTS idx_perfume_notes_note ON perfume_notes(note_id);
CREATE INDEX IF NOT EXISTS idx_perfume_personas_perfume ON perfume_personas(perfume_id);
CREATE INDEX IF NOT EXISTS idx_perfume_personas_persona ON perfume_personas(persona_id);