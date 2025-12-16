import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Mood, Persona, ScentNote, Perfume } from '@/types/database';

interface JourneyContextType {
  mood: Mood | null;
  setMood: (mood: Mood | null) => void;
  persona: Persona | null;
  setPersona: (persona: Persona | null) => void;
  selectedNotes: ScentNote[];
  setSelectedNotes: (notes: ScentNote[]) => void;
  recommendations: Perfume[];
  setRecommendations: (perfumes: Perfume[]) => void;
  resetJourney: () => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(
  undefined
);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState<Mood | null>(null);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<ScentNote[]>([]);
  const [recommendations, setRecommendations] = useState<Perfume[]>([]);

  const resetJourney = () => {
    setMood(null);
    setPersona(null);
    setSelectedNotes([]);
    setRecommendations([]);
  };

  return (
    <JourneyContext.Provider
      value={{
        mood,
        setMood,
        persona,
        setPersona,
        selectedNotes,
        setSelectedNotes,
        recommendations,
        setRecommendations,
        resetJourney,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}
