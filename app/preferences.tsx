import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowRight, Droplet } from 'lucide-react-native';
// import { supabase } from '@/lib/supabase';
import { getNotes } from '@/lib/api';
import { ScentNote } from '@/types/database';
import { useJourney } from '@/context/JourneyContext';

export default function PreferencesScreen() {
  const router = useRouter();
  const { persona, selectedNotes, setSelectedNotes } = useJourney();
  const [allNotes, setAllNotes] = useState<ScentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>(
    selectedNotes.map((n) => n.id)
  );

  useEffect(() => {
    if (!persona) {
      router.replace('/journey');
      return;
    }
    fetchNotes();
  }, [persona]);

  // const fetchNotes = async () => {
  //   const { data } = await supabase
  //     .from('scent_notes')
  //     .select('*')
  //     .order('category');
  //   if (data) setAllNotes(data);
  // };

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      const normalizedNotes = data.map((note: any) => ({
        ...note,
        id: note._id || note.id,
      }));
      setAllNotes(normalizedNotes);
    } catch (err) {
      console.error('Failed to load notes', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleNote = (noteId: string) => {
    setSelected((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleContinue = () => {
    const selectedNoteObjects = allNotes.filter((note) =>
      selected.includes(note.id)
    );
    setSelectedNotes(selectedNoteObjects);
    router.push('/recommendations');
  };

  const groupedNotes = {
    top: allNotes.filter((n) => n.category === 'top'),
    middle: allNotes.filter((n) => n.category === 'middle'),
    base: allNotes.filter((n) => n.category === 'base'),
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      top: '#FFD700',
      middle: '#FF6B9D',
      base: '#8B4789',
    };
    return colors[category as keyof typeof colors] || '#FF6B9D';
  };

  const themeColor = '#00CED1';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#1A1A2E', '#0A0A0F']}
        style={styles.gradient}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={28} color="#FFF" />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Droplet size={40} color={themeColor} />
            <Text style={styles.title}>Build Your Scent DNA</Text>
            <Text style={styles.subtitle}>
              Select the notes that call to your soul
            </Text>
          </View>

          <View style={styles.selectedCount}>
            <Text style={[styles.countText, { color: themeColor }]}>
              {selected.length} {selected.length === 1 ? 'note' : 'notes'} selected
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={themeColor} style={{ marginTop: 40 }} />
          ) : (
            Object.entries(groupedNotes).map(([category, notes]) => (
              <View key={category} style={styles.categorySection}>
                <View style={styles.categoryHeader}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryColor(category) + '30' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        { color: getCategoryColor(category) },
                      ]}
                    >
                      {category.toUpperCase()} NOTES
                    </Text>
                  </View>
                </View>

                <View style={styles.notesGrid}>
                  {notes.map((note) => {
                    const isSelected = selected.includes(note.id);
                    const color = getCategoryColor(category);

                    return (
                      <TouchableOpacity
                        key={note.id}
                        style={[
                          styles.noteCard,
                          isSelected && { borderColor: color, borderWidth: 2 },
                        ]}
                        onPress={() => toggleNote(note.id)}
                        activeOpacity={0.7}
                      >
                        <LinearGradient
                          colors={
                            isSelected
                              ? [color + '40', color + '10']
                              : ['#2A2A3E', '#1A1A2E']
                          }
                          style={styles.noteGradient}
                        >
                          {isSelected && (
                            <View style={[styles.checkmark, { backgroundColor: color }]}>
                              <Text style={styles.checkmarkText}>✓</Text>
                            </View>
                          )}
                          <Text
                            style={[
                              styles.noteName,
                              isSelected && { color: color },
                            ]}
                          >
                            {note.name}
                          </Text>
                          <Text style={styles.noteDescription} numberOfLines={2}>
                            {note.description}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))
          )}

          {!loading && (
            <TouchableOpacity
              style={[
                styles.continueButton,
                selected.length === 0 && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={selected.length === 0}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  selected.length === 0
                    ? ['#2A2A3E', '#1A1A2E']
                    : [themeColor, '#00B4D8']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueGradient}
              >
                <Text
                  style={[
                    styles.continueText,
                    selected.length === 0 && styles.continueTextDisabled,
                  ]}
                >
                  Discover Your Matches
                </Text>
                <ArrowRight
                  size={24}
                  color={selected.length === 0 ? '#666' : '#FFF'}
                />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  gradient: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 16,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedCount: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    alignSelf: 'center',
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00CED1',
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  noteCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2A2A3E',
  },
  noteCardSelected: {
    borderColor: 'transparent',
  },
  noteGradient: {
    padding: 16,
    position: 'relative',
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  noteName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 6,
  },
  noteDescription: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  continueButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  continueText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  continueTextDisabled: {
    color: '#666',
  },
});
