export interface Perfume {
  id: string;
  name: string;
  brand: string;
  description: string;
  image_url: string | null;
  price: number;
  aura_color: string;
  vr_environment: string;
  emotional_impact: string;
  created_at: string;
}

export interface Mood {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
}

export interface ScentNote {
  id: string;
  name: string;
  category: 'top' | 'middle' | 'base';
  description: string;
}

export interface PerfumeWithRelations extends Perfume {
  moods?: { mood: Mood; strength: number }[];
  personas?: { persona: Persona; match_score: number }[];
  notes?: { note: ScentNote; prominence: number }[];
}

export interface UserProfile {
  id: string;
  detected_mood: string | null;
  detected_persona: string | null;
  selected_notes: string[];
  created_at: string;
}

export interface UserJourney {
  mood?: Mood;
  persona?: Persona;
  selectedNotes: ScentNote[];
  recommendations?: Perfume[];
}
