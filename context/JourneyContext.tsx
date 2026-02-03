import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Mood, Persona, ScentNote, Perfume } from '@/types/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface JourneyContextType {
  mood: Mood | null;
  persona: Persona | null;
  selectedNotes: ScentNote[];
  recommendations: Perfume[];
  isLoading: boolean;
  setMood: (mood: Mood | null) => void;
  setPersona: (persona: Persona | null) => void;
  setSelectedNotes: (notes: ScentNote[]) => void;
  setRecommendations: (perfumes: Perfume[]) => void;
  resetJourney: () => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(
  undefined
);

const STORAGE_KEYS = {
  MOOD: 'aurais_mood',
  PERSONA: 'aurais_persona',
  NOTES: 'aurais_notes',
  RECS: 'aurais_recommendations'
};

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [mood, setMoodState] = useState<Mood | null>(null);
  const [persona, setPersonaState] = useState<Persona | null>(null);
  const [selectedNotes, setSelectedNotesState] = useState<ScentNote[]>([]);
  const [recommendations, setRecommendationsState] = useState<Perfume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJourney = async () => {
      try {
        const [savedMood, savedPersona, savedNotes, savedRecs] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.MOOD),
          AsyncStorage.getItem(STORAGE_KEYS.PERSONA),
          AsyncStorage.getItem(STORAGE_KEYS.NOTES),
          AsyncStorage.getItem(STORAGE_KEYS.RECS),
        ]);

        if (savedMood) setMoodState(JSON.parse(savedMood));
        if (savedPersona) setPersonaState(JSON.parse(savedPersona));
        if (savedNotes) setSelectedNotesState(JSON.parse(savedNotes));
        if (savedRecs) setRecommendationsState(JSON.parse(savedRecs));
      } catch (e) {
        console.error("Failed to load journey state", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadJourney();
  }, []);

  const setMood = (newMood: Mood | null) => {
    setMoodState(newMood);
    if (newMood) AsyncStorage.setItem(STORAGE_KEYS.MOOD, JSON.stringify(newMood));
    else AsyncStorage.removeItem(STORAGE_KEYS.MOOD);
  };

  const setPersona = (newPersona: Persona | null) => {
    setPersonaState(newPersona);
    if (newPersona) AsyncStorage.setItem(STORAGE_KEYS.PERSONA, JSON.stringify(newPersona));
    else AsyncStorage.removeItem(STORAGE_KEYS.PERSONA);
  };

  const setSelectedNotes = (newNotes: ScentNote[]) => {
    setSelectedNotesState(newNotes);
    if (newNotes.length > 0) AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(newNotes));
    else AsyncStorage.removeItem(STORAGE_KEYS.NOTES);
  };

  const setRecommendations = (newRecs: Perfume[]) => {
    setRecommendationsState(newRecs);
    if (newRecs.length > 0) AsyncStorage.setItem(STORAGE_KEYS.RECS, JSON.stringify(newRecs));
    else AsyncStorage.removeItem(STORAGE_KEYS.RECS);
  };

  const resetJourney = async () => {
    setMoodState(null);
    setPersonaState(null);
    setSelectedNotesState([]);
    setRecommendationsState([]);

    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.MOOD,
        STORAGE_KEYS.PERSONA,
        STORAGE_KEYS.NOTES,
        STORAGE_KEYS.RECS
      ]);
    } catch (e) {
      console.error("Failed to clear storage", e);
    }
  };

  return (
    <JourneyContext.Provider
      value={{
        mood,
        persona,
        selectedNotes,
        recommendations,
        isLoading,
        setMood,
        setPersona,
        setSelectedNotes,
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
