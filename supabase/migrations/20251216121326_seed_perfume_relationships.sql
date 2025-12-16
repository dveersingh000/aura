/*
  # Seed Perfume Relationships

  ## Overview
  Create emotional connections between perfumes and moods, personas, and scent notes.
  This powers the recommendation engine.

  ## Relationships Created
  1. Perfume-Mood mappings with strength ratings
  2. Perfume-Persona mappings with match scores
  3. Perfume-Note mappings with prominence ratings
*/

-- Helper to get IDs (using DO block for easier maintenance)
DO $$
DECLARE
  -- Perfume IDs
  lvb_id uuid;
  blackopium_id uuid;
  monparis_id uuid;
  acqua_id uuid;
  sipassione_id uuid;
  idole_id uuid;
  libre_id uuid;
  goodgirl_id uuid;
  
  -- Mood IDs
  calm_id uuid;
  romantic_id uuid;
  energetic_id uuid;
  bold_id uuid;
  fresh_id uuid;
  mysterious_id uuid;
  
  -- Persona IDs
  romantic_persona_id uuid;
  freespirit_persona_id uuid;
  sophisticated_persona_id uuid;
  adventurer_persona_id uuid;
  minimalist_persona_id uuid;
  visionary_persona_id uuid;
  
  -- Note IDs
  citrus_id uuid;
  fruity_id uuid;
  green_id uuid;
  spicy_id uuid;
  floral_id uuid;
  woody_id uuid;
  aquatic_id uuid;
  gourmand_id uuid;
  amber_id uuid;
  musk_id uuid;
  oriental_id uuid;
  leather_id uuid;

BEGIN
  -- Get Perfume IDs
  SELECT id INTO lvb_id FROM perfumes WHERE name = 'La Vie Est Belle';
  SELECT id INTO blackopium_id FROM perfumes WHERE name = 'Black Opium';
  SELECT id INTO monparis_id FROM perfumes WHERE name = 'Mon Paris';
  SELECT id INTO acqua_id FROM perfumes WHERE name = 'Acqua Di Gioia';
  SELECT id INTO sipassione_id FROM perfumes WHERE name = 'Si Passione';
  SELECT id INTO idole_id FROM perfumes WHERE name = 'Idôle';
  SELECT id INTO libre_id FROM perfumes WHERE name = 'Libre';
  SELECT id INTO goodgirl_id FROM perfumes WHERE name = 'Good Girl';
  
  -- Get Mood IDs
  SELECT id INTO calm_id FROM moods WHERE name = 'Calm';
  SELECT id INTO romantic_id FROM moods WHERE name = 'Romantic';
  SELECT id INTO energetic_id FROM moods WHERE name = 'Energetic';
  SELECT id INTO bold_id FROM moods WHERE name = 'Bold';
  SELECT id INTO fresh_id FROM moods WHERE name = 'Fresh';
  SELECT id INTO mysterious_id FROM moods WHERE name = 'Mysterious';
  
  -- Get Persona IDs
  SELECT id INTO romantic_persona_id FROM personas WHERE name = 'The Romantic';
  SELECT id INTO freespirit_persona_id FROM personas WHERE name = 'The Free Spirit';
  SELECT id INTO sophisticated_persona_id FROM personas WHERE name = 'The Sophisticated';
  SELECT id INTO adventurer_persona_id FROM personas WHERE name = 'The Adventurer';
  SELECT id INTO minimalist_persona_id FROM personas WHERE name = 'The Minimalist';
  SELECT id INTO visionary_persona_id FROM personas WHERE name = 'The Bold Visionary';
  
  -- Get Note IDs
  SELECT id INTO citrus_id FROM scent_notes WHERE name = 'Citrus';
  SELECT id INTO fruity_id FROM scent_notes WHERE name = 'Fruity';
  SELECT id INTO green_id FROM scent_notes WHERE name = 'Green';
  SELECT id INTO spicy_id FROM scent_notes WHERE name = 'Spicy';
  SELECT id INTO floral_id FROM scent_notes WHERE name = 'Floral';
  SELECT id INTO woody_id FROM scent_notes WHERE name = 'Woody';
  SELECT id INTO aquatic_id FROM scent_notes WHERE name = 'Aquatic';
  SELECT id INTO gourmand_id FROM scent_notes WHERE name = 'Gourmand';
  SELECT id INTO amber_id FROM scent_notes WHERE name = 'Amber';
  SELECT id INTO musk_id FROM scent_notes WHERE name = 'Musk';
  SELECT id INTO oriental_id FROM scent_notes WHERE name = 'Oriental';
  SELECT id INTO leather_id FROM scent_notes WHERE name = 'Leather';

  -- La Vie Est Belle - Happy, Romantic, Sweet
  INSERT INTO perfume_moods (perfume_id, mood_id, strength) VALUES
    (lvb_id, romantic_id, 9),
    (lvb_id, energetic_id, 7),
    (lvb_id, fresh_id, 6);
  
  INSERT INTO perfume_personas (perfume_id, persona_id, match_score) VALUES
    (lvb_id, romantic_persona_id, 10),
    (lvb_id, freespirit_persona_id, 8);
  
  INSERT INTO perfume_notes (perfume_id, note_id, prominence) VALUES
    (lvb_id, fruity_id, 9),
    (lvb_id, floral_id, 10),
    (lvb_id, gourmand_id, 8),
    (lvb_id, musk_id, 7);

  -- Black Opium - Bold, Mysterious, Energetic
  INSERT INTO perfume_moods (perfume_id, mood_id, strength) VALUES
    (blackopium_id, bold_id, 10),
    (blackopium_id, mysterious_id, 9),
    (blackopium_id, energetic_id, 8);
  
  INSERT INTO perfume_personas (perfume_id, persona_id, match_score) VALUES
    (blackopium_id, visionary_persona_id, 10),
    (blackopium_id, adventurer_persona_id, 9);
  
  INSERT INTO perfume_notes (perfume_id, note_id, prominence) VALUES
    (blackopium_id, spicy_id, 8),
    (blackopium_id, gourmand_id, 10),
    (blackopium_id, oriental_id, 9),
    (blackopium_id, amber_id, 7);

  -- Mon Paris - Romantic, Bold
  INSERT INTO perfume_moods (perfume_id, mood_id, strength) VALUES
    (monparis_id, romantic_id, 10),
    (monparis_id, bold_id, 7),
    (monparis_id, energetic_id, 6);
  
  INSERT INTO perfume_personas (perfume_id, persona_id, match_score) VALUES
    (monparis_id, romantic_persona_id, 10),
    (monparis_id, adventurer_persona_id, 7);
  
  INSERT INTO perfume_notes (perfume_id, note_id, prominence) VALUES
    (monparis_id, fruity_id, 10),
    (monparis_id, floral_id, 9),
    (monparis_id, musk_id, 8),
    (monparis_id, amber_id, 6);

  -- Acqua Di Gioia - Fresh, Calm
  INSERT INTO perfume_moods (perfume_id, mood_id, strength) VALUES
    (acqua_id, fresh_id, 10),
    (acqua_id, calm_id, 9),
    (acqua_id, energetic_id, 5);
  
  INSERT INTO perfume_personas (perfume_id, persona_id, match_score) VALUES
    (acqua_id, minimalist_persona_id, 10),
    (acqua_id, freespirit_persona_id, 8);
  
  INSERT INTO perfume_notes (perfume_id, note_id, prominence) VALUES
    (acqua_id, citrus_id, 9),
    (acqua_id, green_id, 8),
    (acqua_id, aquatic_id, 10),
    (acqua_id, woody_id, 6);

  -- Si Passione - Bold, Romantic
  INSERT INTO perfume_moods (perfume_id, mood_id, strength) VALUES
    (sipassione_id, bold_id, 9),
    (sipassione_id, romantic_id, 8),
    (sipassione_id, mysterious_id, 6);
  
  INSERT INTO perfume_personas (perfume_id, persona_id, match_score) VALUES
    (sipassione_id, visionary_persona_id, 9),
    (sipassione_id, romantic_persona_id, 8);
  
  INSERT INTO perfume_notes (perfume_id, note_id, prominence) VALUES
    (sipassione_id, fruity_id, 8),
    (sipassione_id, floral_id, 9),
    (sipassione_id, gourmand_id, 7),
    (sipassione_id, woody_id, 8);

  -- Idôle - Fresh, Energetic, Minimalist
  INSERT INTO perfume_moods (perfume_id, mood_id, strength) VALUES
    (idole_id, fresh_id, 9),
    (idole_id, energetic_id, 8),
    (idole_id, calm_id, 6);
  
  INSERT INTO perfume_personas (perfume_id, persona_id, match_score) VALUES
    (idole_id, minimalist_persona_id, 10),
    (idole_id, sophisticated_persona_id, 8);
  
  INSERT INTO perfume_notes (perfume_id, note_id, prominence) VALUES
    (idole_id, citrus_id, 8),
    (idole_id, floral_id, 10),
    (idole_id, musk_id, 9),
    (idole_id, woody_id, 6);

  -- Libre - Bold, Fresh, Free
  INSERT INTO perfume_moods (perfume_id, mood_id, strength) VALUES
    (libre_id, bold_id, 8),
    (libre_id, fresh_id, 7),
    (libre_id, energetic_id, 9);
  
  INSERT INTO perfume_personas (perfume_id, persona_id, match_score) VALUES
    (libre_id, freespirit_persona_id, 10),
    (libre_id, visionary_persona_id, 8);
  
  INSERT INTO perfume_notes (perfume_id, note_id, prominence) VALUES
    (libre_id, citrus_id, 7),
    (libre_id, floral_id, 10),
    (libre_id, woody_id, 8),
    (libre_id, musk_id, 7);

  -- Good Girl - Mysterious, Bold, Sophisticated
  INSERT INTO perfume_moods (perfume_id, mood_id, strength) VALUES
    (goodgirl_id, mysterious_id, 10),
    (goodgirl_id, bold_id, 8),
    (goodgirl_id, romantic_id, 6);
  
  INSERT INTO perfume_personas (perfume_id, persona_id, match_score) VALUES
    (goodgirl_id, sophisticated_persona_id, 10),
    (goodgirl_id, visionary_persona_id, 8);
  
  INSERT INTO perfume_notes (perfume_id, note_id, prominence) VALUES
    (goodgirl_id, floral_id, 9),
    (goodgirl_id, gourmand_id, 10),
    (goodgirl_id, amber_id, 8),
    (goodgirl_id, oriental_id, 7);

END $$;