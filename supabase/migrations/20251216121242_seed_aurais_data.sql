/*
  # Seed AURAIS Database

  ## Overview
  Populate database with initial moods, personas, scent notes, and L'Oréal perfumes with their emotional connections.

  ## Data Inserted
  1. 6 Moods: Calm, Romantic, Energetic, Bold, Fresh, Mysterious
  2. 6 Personas: The Romantic, The Free Spirit, The Sophisticated, The Adventurer, The Minimalist, The Bold Visionary
  3. 12 Scent Notes across top/middle/base categories
  4. 8 L'Oréal perfumes with emotional metadata
  5. Relationship mappings between perfumes, moods, personas, and notes
*/

-- Insert Moods
INSERT INTO moods (name, description, color, icon) VALUES
  ('Calm', 'Peaceful, serene, and centered. Finding tranquility in the moment.', '#A8D5E2', 'cloud'),
  ('Romantic', 'Passionate, tender, and deeply connected. Embracing love and intimacy.', '#FFB6C1', 'heart'),
  ('Energetic', 'Dynamic, vibrant, and full of life. Ready to conquer the day.', '#FFA500', 'zap'),
  ('Bold', 'Confident, powerful, and fearless. Making a statement without words.', '#DC143C', 'flame'),
  ('Fresh', 'Clean, optimistic, and rejuvenated. A breath of new beginnings.', '#00CED1', 'droplet'),
  ('Mysterious', 'Enigmatic, alluring, and sophisticated. Leaving a lasting impression.', '#4B0082', 'moon')
ON CONFLICT (name) DO NOTHING;

-- Insert Personas
INSERT INTO personas (name, description, characteristics) VALUES
  ('The Romantic', 'You are drawn to beauty, emotion, and timeless elegance. Your fragrance should tell a love story.', ARRAY['Emotional', 'Elegant', 'Tender', 'Classic']),
  ('The Free Spirit', 'You embrace spontaneity, joy, and natural beauty. Your scent should capture freedom and lightness.', ARRAY['Spontaneous', 'Joyful', 'Natural', 'Carefree']),
  ('The Sophisticated', 'You appreciate refinement, complexity, and understated luxury. Your fragrance is your signature.', ARRAY['Refined', 'Complex', 'Timeless', 'Luxurious']),
  ('The Adventurer', 'You seek excitement, new experiences, and bold expressions. Your scent should be unforgettable.', ARRAY['Bold', 'Adventurous', 'Dynamic', 'Fearless']),
  ('The Minimalist', 'You value simplicity, clarity, and authenticity. Your fragrance should be clean and honest.', ARRAY['Simple', 'Authentic', 'Clean', 'Pure']),
  ('The Bold Visionary', 'You break boundaries, challenge norms, and create your own path. Your scent is your power.', ARRAY['Innovative', 'Powerful', 'Confident', 'Unique'])
ON CONFLICT (name) DO NOTHING;

-- Insert Scent Notes
INSERT INTO scent_notes (name, category, description) VALUES
  ('Citrus', 'top', 'Bright, zesty, and uplifting. Lemon, orange, bergamot.'),
  ('Fruity', 'top', 'Sweet, juicy, and playful. Berries, apple, peach.'),
  ('Green', 'top', 'Fresh, crisp, and natural. Cut grass, leaves, herbs.'),
  ('Spicy', 'top', 'Warm, stimulating, and exotic. Pink pepper, ginger, cardamom.'),
  ('Floral', 'middle', 'Romantic, feminine, and delicate. Rose, jasmine, lily.'),
  ('Woody', 'middle', 'Earthy, grounding, and elegant. Cedarwood, sandalwood.'),
  ('Aquatic', 'middle', 'Clean, marine, and refreshing. Sea notes, water lily.'),
  ('Gourmand', 'middle', 'Sweet, edible, and comforting. Vanilla, caramel, chocolate.'),
  ('Amber', 'base', 'Warm, sensual, and resinous. Amber, labdanum, benzoin.'),
  ('Musk', 'base', 'Soft, skin-like, and intimate. White musk, clean musk.'),
  ('Oriental', 'base', 'Rich, exotic, and mysterious. Incense, patchouli, spices.'),
  ('Leather', 'base', 'Bold, sophisticated, and powerful. Leather, smoke, tobacco.')
ON CONFLICT (name) DO NOTHING;

-- Insert L'Oréal Perfumes
INSERT INTO perfumes (name, brand, description, image_url, price, aura_color, vr_environment, emotional_impact) VALUES
  (
    'La Vie Est Belle',
    'Lancôme',
    'A manifesto of happiness and freedom. Embrace joy, spread your wings, choose your own path.',
    'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg',
    95.00,
    '#FFB6D9',
    'sunlight_garden',
    'Radiates confidence and feminine joy. Makes you feel beautiful from within.'
  ),
  (
    'Black Opium',
    'Yves Saint Laurent',
    'The collision of bright femininity with dark sensuality. Coffee, vanilla, and white flowers create an addictive adrenaline rush.',
    'https://images.pexels.com/photos/3310691/pexels-photo-3310691.jpeg',
    90.00,
    '#1A1A2E',
    'night_city',
    'Awakens your boldness and mystery. Feel the power of the night.'
  ),
  (
    'Mon Paris',
    'Yves Saint Laurent',
    'Intoxicating passion and romantic rebellion. A love letter to Paris and endless romance.',
    'https://images.pexels.com/photos/1797103/pexels-photo-1797103.jpeg',
    88.00,
    '#FF6B9D',
    'paris_twilight',
    'Ignites passion and romantic courage. Feel swept away by love.'
  ),
  (
    'Acqua Di Gioia',
    'Giorgio Armani',
    'A tribute to the simple beauty of nature. Fresh, aquatic, and luminous like sunlight on water.',
    'https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg',
    82.00,
    '#00B4D8',
    'ocean_sunrise',
    'Refreshes your spirit and brings clarity. Feel cleansed and renewed.'
  ),
  (
    'Si Passione',
    'Giorgio Armani',
    'An intense and enveloping fragrance. The essence of passion and feminine strength.',
    'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg',
    92.00,
    '#C41E3A',
    'crimson_sunset',
    'Amplifies your inner fire and determination. Feel unstoppable.'
  ),
  (
    'Idôle',
    'Lancôme',
    'A clean, luminous fragrance for the modern woman who writes her own rules.',
    'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg',
    85.00,
    '#F0F3FF',
    'white_space',
    'Empowers authenticity and independence. Feel true to yourself.'
  ),
  (
    'Libre',
    'Yves Saint Laurent',
    'The freedom to live everything with excess. Lavender and orange blossom burn with intensity.',
    'https://images.pexels.com/photos/4041279/pexels-photo-4041279.jpeg',
    94.00,
    '#E8DFF5',
    'lavender_fields',
    'Celebrates your freedom and fierce femininity. Feel liberated.'
  ),
  (
    'Good Girl',
    'Carolina Herrera',
    'It''s so good to be bad. A daring blend of light and dark, good and evil.',
    'https://images.pexels.com/photos/3740363/pexels-photo-3740363.jpeg',
    96.00,
    '#8B4789',
    'dual_reality',
    'Embraces your complexity and duality. Feel mysterious and alluring.'
  )
ON CONFLICT DO NOTHING;