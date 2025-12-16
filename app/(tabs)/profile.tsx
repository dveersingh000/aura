import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Heart, Sparkles, Droplet, RefreshCw } from 'lucide-react-native';
import { useJourney } from '@/context/JourneyContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { mood, persona, selectedNotes, recommendations, resetJourney } =
    useJourney();

  const hasCompletedJourney =
    mood && persona && selectedNotes.length > 0 && recommendations.length > 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#1A1A2E', '#0A0A0F']}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#FF6B9D', '#C41E3A']}
                style={styles.avatarGradient}
              >
                <User size={48} color="#FFF" strokeWidth={2} />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Your Profile</Text>
            <Text style={styles.subtitle}>Your emotional fragrance identity</Text>
          </View>

          {hasCompletedJourney ? (
            <>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Heart size={24} color="#FF6B9D" />
                  <Text style={styles.sectionTitle}>Your Mood</Text>
                </View>
                <View
                  style={[
                    styles.moodCard,
                    {
                      backgroundColor: mood.color + '20',
                      borderColor: mood.color,
                    },
                  ]}
                >
                  <Text style={[styles.moodName, { color: mood.color }]}>
                    {mood.name}
                  </Text>
                  <Text style={styles.moodDescription}>
                    {mood.description}
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Sparkles size={24} color="#A8D5E2" />
                  <Text style={styles.sectionTitle}>Your Persona</Text>
                </View>
                <View style={styles.personaCard}>
                  <Text style={styles.personaName}>{persona.name}</Text>
                  <Text style={styles.personaDescription}>
                    {persona.description}
                  </Text>
                  <View style={styles.traits}>
                    {persona.characteristics.map((trait, index) => (
                      <View key={index} style={styles.traitBadge}>
                        <Text style={styles.traitText}>{trait}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Droplet size={24} color="#00CED1" />
                  <Text style={styles.sectionTitle}>Your Scent DNA</Text>
                </View>
                <View style={styles.notesContainer}>
                  {selectedNotes.map((note) => (
                    <View key={note.id} style={styles.noteChip}>
                      <Text style={styles.noteChipText}>{note.name}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.statsSection}>
                <Text style={styles.statsTitle}>Your Journey Stats</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {recommendations.length}
                    </Text>
                    <Text style={styles.statLabel}>Matches</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{selectedNotes.length}</Text>
                    <Text style={styles.statLabel}>Notes</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>1</Text>
                    <Text style={styles.statLabel}>Persona</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  resetJourney();
                  router.push('/journey');
                }}
                activeOpacity={0.8}
              >
                <RefreshCw size={20} color="#FFF" />
                <Text style={styles.resetText}>Start New Journey</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Sparkles size={64} color="#666" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>Begin Your Journey</Text>
              <Text style={styles.emptyDescription}>
                Discover your perfect fragrance by exploring your mood, persona,
                and scent preferences
              </Text>

              <TouchableOpacity
                style={styles.startButton}
                onPress={() => router.push('/journey')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FF6B9D', '#C41E3A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startGradient}
                >
                  <Sparkles size={24} color="#FFF" />
                  <Text style={styles.startText}>Start Journey</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
  content: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  moodCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
  },
  moodName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  moodDescription: {
    fontSize: 14,
    color: '#CCC',
    lineHeight: 20,
  },
  personaCard: {
    backgroundColor: '#1A1A2E',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  personaName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  personaDescription: {
    fontSize: 14,
    color: '#CCC',
    lineHeight: 20,
    marginBottom: 16,
  },
  traits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  traitBadge: {
    backgroundColor: '#2A2A3E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  traitText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A8D5E2',
  },
  notesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  noteChip: {
    backgroundColor: '#00CED120',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#00CED140',
  },
  noteChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00CED1',
  },
  statsSection: {
    marginBottom: 32,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    minWidth: 100,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF6B9D',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A3E',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
  },
  resetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  startGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 12,
  },
  startText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
