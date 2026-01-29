import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Award, Eye, Sparkles, RefreshCw } from 'lucide-react-native';
import { getRecommendations } from '@/lib/api';
import { Perfume } from '@/types/database';
import { useJourney } from '@/context/JourneyContext';

const { width } = Dimensions.get('window');

export default function RecommendationsScreen() {
  const router = useRouter();
  const { mood, persona, selectedNotes, setRecommendations, resetJourney } = useJourney();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mood || !persona || selectedNotes.length === 0) {
      // router.replace('/journey'); 
      setLoading(false);
      return;
    }
    fetchRecommendations();
  }, [mood, persona, selectedNotes]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);

      const moodId = (mood as any)?._id || mood?.id;
      const personaId = (persona as any)?._id || persona?.id;

      const noteIds = selectedNotes.map((n) => (n as any)._id || n.id);

      if (!moodId || !personaId) {
        console.error("Missing IDs:", { moodId, personaId });
        return;
      }

      const data = await getRecommendations({
        moodId,
        personaId,
        noteIds,
      });

      setPerfumes(data);
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    resetJourney();
    router.push('/journey');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#1A1A2E', '#0A0A0F']}
        style={styles.gradient}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.push('/journey')}
        >
          <X size={28} color="#FFF" />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Award size={40} color="#FFA500" />
            <Text style={styles.title}>Your Perfect Matches</Text>
            <Text style={styles.subtitle}>
              Curated for your emotional essence
            </Text>
          </View>

          <View style={styles.journeyRecap}>
            <View style={styles.recapItem}>
              <Text style={styles.recapLabel}>Mood</Text>
              <Text style={[styles.recapValue, { color: mood?.color || '#FFF' }]}>
                {mood?.name}
              </Text>
            </View>
            <View style={styles.recapDivider} />
            <View style={styles.recapItem}>
              <Text style={styles.recapLabel}>Persona</Text>
              <Text style={styles.recapValue}>{persona?.name?.split(' ')[1] || 'You'}</Text>
            </View>
            <View style={styles.recapDivider} />
            <View style={styles.recapItem}>
              <Text style={styles.recapLabel}>Notes</Text>
              <Text style={styles.recapValue}>{selectedNotes.length}</Text>
            </View>
          </View>

          {loading ? (
            <View style={{ marginTop: 60, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#FF6B9D" />
              <Text style={styles.loadingText}>Analyzing your Scent DNA...</Text>
            </View>
          ) : perfumes.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={styles.noResults}>
                No matches found. Try adjusting your preferences.
              </Text>
              <TouchableOpacity onPress={handleRetake} style={styles.retryButton}>
                <Text style={styles.retryText}>Retake Journey</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Recommended For You</Text>
              <View style={styles.perfumesContainer}>
                {perfumes.map((perfume, index) => (
                  <TouchableOpacity
                    key={perfume.id || (perfume as any)._id}
                    style={styles.perfumeCard}
                    activeOpacity={0.9}
                    onPress={() => router.push(`/product-details?id=${perfume.id || (perfume as any)._id}`)}
                  >
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>#{index + 1}</Text>
                    </View>

                    <View style={styles.imageContainer}>
                      {perfume.image_url && (
                        <Image
                          source={{ uri: perfume.image_url }}
                          style={styles.perfumeImage}
                          resizeMode="cover"
                        />
                      )}
                      <LinearGradient
                        colors={['transparent', 'rgba(10, 10, 15, 0.95)']}
                        style={styles.imageOverlay}
                      />
                    </View>

                    <View style={styles.perfumeInfo}>
                      <Text style={styles.perfumeBrand}>{perfume.brand}</Text>
                      <Text style={styles.perfumeName}>{perfume.name}</Text>
                      <Text style={styles.perfumePrice}>
                        ${perfume.price.toFixed(2)}
                      </Text>

                      <View style={styles.emotionalImpact}>
                        <Sparkles size={16} color="#FF6B9D" />
                        <Text style={styles.impactText} numberOfLines={2}>
                          {perfume.emotional_impact}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.experienceButton}
                        onPress={() =>
                          router.push({
                            pathname: '/ar-experience',
                            params: { perfumeId: perfume.id || (perfume as any)._id },
                          } as any)
                        }
                      >
                        <Eye size={18} color="#FFF" />
                        <Text style={styles.experienceText}>
                          Experience Aura
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={[
                        styles.auraGlow,
                        { backgroundColor: perfume.aura_color },
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.retakeLink} onPress={handleRetake}>
                <RefreshCw size={16} color="#666" style={{ marginRight: 8 }} />
                <Text style={styles.retakeText}>Start New Journey</Text>
              </TouchableOpacity>
            </>
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  journeyRecap: {
    flexDirection: 'row',
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  recapItem: {
    flex: 1,
    alignItems: 'center',
  },
  recapLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  recapValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  recapDivider: {
    width: 1,
    backgroundColor: '#2A2A3E',
    marginHorizontal: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  noResults: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#2A2A3E',
    borderRadius: 8,
  },
  retryText: {
    color: '#FFF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 20,
    letterSpacing: 1,
  },
  perfumesContainer: {
    gap: 24,
  },
  perfumeCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
    position: 'relative',
  },
  rankBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: '#FFA500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  perfumeImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  perfumeInfo: {
    padding: 20,
  },
  perfumeBrand: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  perfumeName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  perfumePrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6B9D',
    marginBottom: 16,
  },
  emotionalImpact: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#0A0A0F',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  impactText: {
    flex: 1,
    fontSize: 13,
    color: '#CCC',
    lineHeight: 18,
  },
  experienceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A3E',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  experienceText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
  auraGlow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50,
  },
  retakeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 20,
    opacity: 0.7,
  },
  retakeText: {
    color: '#666',
    fontSize: 14,
  },
});