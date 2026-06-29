-- MixLab Database Schema for Supabase SQL Editor
-- Complete SQL script for creating all required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DRINKS TABLE
-- ============================================
CREATE TABLE drinks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cocktail', 'mocktail')),
  base TEXT NOT NULL,
  preparation TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  photo_url TEXT DEFAULT NULL,
  favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID DEFAULT NULL -- prepared for auth
);

CREATE INDEX idx_drinks_type ON drinks(type);
CREATE INDEX idx_drinks_base ON drinks(base);
CREATE INDEX idx_drinks_favorite ON drinks(favorite);
CREATE INDEX idx_drinks_created_at ON drinks(created_at DESC);
CREATE INDEX idx_drinks_user_id ON drinks(user_id);

-- ============================================
-- INGREDIENTS TABLE (master list)
-- ============================================
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_ingredients_name ON ingredients(name);

-- ============================================
-- DRINK_INGREDIENTS TABLE (junction)
-- ============================================
CREATE TABLE drink_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drink_id UUID NOT NULL REFERENCES drinks(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL, -- denormalized for performance
  quantity TEXT NOT NULL DEFAULT '1',
  unit TEXT NOT NULL DEFAULT 'ml',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_drink_ingredients_drink ON drink_ingredients(drink_id);
CREATE INDEX idx_drink_ingredients_ingredient ON drink_ingredients(ingredient_id);

-- ============================================
-- VIBES TABLE
-- ============================================
CREATE TABLE vibes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  emoji TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DRINK_VIBES TABLE (junction)
-- ============================================
CREATE TABLE drink_vibes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drink_id UUID NOT NULL REFERENCES drinks(id) ON DELETE CASCADE,
  vibe_id UUID NOT NULL REFERENCES vibes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(drink_id, vibe_id)
);

CREATE INDEX idx_drink_vibes_drink ON drink_vibes(drink_id);
CREATE INDEX idx_drink_vibes_vibe ON drink_vibes(vibe_id);

-- ============================================
-- TAGS TABLE
-- ============================================
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DRINK_TAGS TABLE (junction)
-- ============================================
CREATE TABLE drink_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drink_id UUID NOT NULL REFERENCES drinks(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(drink_id, tag_id)
);

CREATE INDEX idx_drink_tags_drink ON drink_tags(drink_id);
CREATE INDEX idx_drink_tags_tag ON drink_tags(tag_id);

-- ============================================
-- RATINGS TABLE
-- ============================================
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drink_id UUID NOT NULL REFERENCES drinks(id) ON DELETE CASCADE,
  overall NUMERIC(3,1) NOT NULL DEFAULT 0,
  taste NUMERIC(3,1) NOT NULL DEFAULT 0,
  balance NUMERIC(3,1) NOT NULL DEFAULT 0,
  presentation NUMERIC(3,1) NOT NULL DEFAULT 0,
  style NUMERIC(3,1) NOT NULL DEFAULT 0,
  originality NUMERIC(3,1) NOT NULL DEFAULT 0,
  difficulty NUMERIC(3,1) NOT NULL DEFAULT 0,
  professionalism NUMERIC(3,1) NOT NULL DEFAULT 0,
  ingredient_harmony NUMERIC(3,1) NOT NULL DEFAULT 0,
  vibe_consistency NUMERIC(3,1) NOT NULL DEFAULT 0,
  -- Text feedback
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  serving_tips TEXT[] DEFAULT '{}',
  suggested_garnish TEXT DEFAULT '',
  glass_recommendation TEXT DEFAULT '',
  suggested_improvements TEXT[] DEFAULT '{}',
  possible_variations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(drink_id)
);

CREATE INDEX idx_ratings_drink ON ratings(drink_id);
CREATE INDEX idx_ratings_overall ON ratings(overall DESC);

-- ============================================
-- STORAGE BUCKET (run via Supabase dashboard)
-- ============================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('drink-photos', 'drink-photos', true);

-- ============================================
-- ROW LEVEL SECURITY (prepared for auth)
-- ============================================
ALTER TABLE drinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_vibes ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Public access policies (for unauthenticated use)
CREATE POLICY "Allow all on drinks" ON drinks FOR ALL USING (true);
CREATE POLICY "Allow all on drink_ingredients" ON drink_ingredients FOR ALL USING (true);
CREATE POLICY "Allow all on drink_vibes" ON drink_vibes FOR ALL USING (true);
CREATE POLICY "Allow all on drink_tags" ON drink_tags FOR ALL USING (true);
CREATE POLICY "Allow all on ratings" ON ratings FOR ALL USING (true);
CREATE POLICY "Allow all on ingredients" ON ingredients FOR ALL USING (true);
CREATE POLICY "Allow all on vibes" ON vibes FOR ALL USING (true);
CREATE POLICY "Allow all on tags" ON tags FOR ALL USING (true);

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_drinks_updated_at
  BEFORE UPDATE ON drinks
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- SEED VIBES
-- ============================================
INSERT INTO vibes (name, emoji) VALUES
  ('Refreshing', '💧'), ('Fruity', '🍓'), ('Sweet', '🍯'),
  ('Sour', '🍋'), ('Tropical', '🌴'), ('Creamy', '🥛'),
  ('Spicy', '🌶️'), ('Smoky', '🔥'), ('Elegant', '✨'),
  ('Classic', '🎩'), ('Modern', '🔮'), ('Party', '🎉'),
  ('Summer', '☀️'), ('Winter', '❄️'), ('Dessert', '🍰'),
  ('Exotic', '🦜'), ('Luxury', '💎'), ('Light', '🪶'),
  ('Strong', '💪'), ('Experimental', '🧪')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- USEFUL VIEWS
-- ============================================
CREATE OR REPLACE VIEW drink_details AS
SELECT
  d.*,
  r.overall as rating_overall,
  r.taste as rating_taste,
  r.balance as rating_balance,
  ARRAY_AGG(DISTINCT dv_v.name) FILTER (WHERE dv_v.name IS NOT NULL) as vibe_names,
  ARRAY_AGG(DISTINCT dt_t.name) FILTER (WHERE dt_t.name IS NOT NULL) as tag_names,
  json_agg(
    json_build_object(
      'name', di.ingredient_name,
      'quantity', di.quantity,
      'unit', di.unit,
      'sort_order', di.sort_order
    ) ORDER BY di.sort_order
  ) FILTER (WHERE di.ingredient_name IS NOT NULL) as ingredients_json
FROM drinks d
LEFT JOIN ratings r ON r.drink_id = d.id
LEFT JOIN drink_vibes dv ON dv.drink_id = d.id
LEFT JOIN vibes dv_v ON dv_v.id = dv.vibe_id
LEFT JOIN drink_tags dt ON dt.drink_id = d.id
LEFT JOIN tags dt_t ON dt_t.id = dt.tag_id
LEFT JOIN drink_ingredients di ON di.drink_id = d.id
GROUP BY d.id, r.overall, r.taste, r.balance;
