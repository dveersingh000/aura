import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, Maximize2, Sparkles } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Perfume } from '@/types/database';

const { width } = Dimensions.get('window');

export default function ExperiencesScreen() {
  const router = useRouter();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const fetchPerfumes = async () => {
    const { data } = await supabase
      .from('perfumes')
      .select('*')
      .order('name');
    if (data) setPerfumes(data);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#1A1A2E', '#0A0A0F']}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Eye size={40} color="#FF6B9D" />
            <Text style={styles.title}>Immersive Experiences</Text>
            <Text style={styles.subtitle}>
              Feel fragrance through sight and emotion
            </Text>
          </View>

          <View style={styles.experienceTypes}>
            <View style={styles.typeCard}>
              <LinearGradient
                colors={['#FF6B9D40', '#FF6B9D20']}
                style={styles.typeGradient}
              >
                <Eye size={32} color="#FF6B9D" />
                <Text style={styles.typeName}>AR Aura</Text>
                <Text style={styles.typeDescription}>
                  See the emotional essence radiating from each perfume
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.typeCard}>
              <LinearGradient
                colors={['#00CED140', '#00CED120']}
                style={styles.typeGradient}
              >
                <Maximize2 size={32} color="#00CED1" />
                <Text style={styles.typeName}>VR Worlds</Text>
                <Text style={styles.typeDescription}>
                  Step into immersive mood environments for every fragrance
                </Text>
              </LinearGradient>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Explore All Fragrances</Text>

          <View style={styles.perfumeGrid}>
            {perfumes.map((perfume) => (
              <TouchableOpacity
                key={perfume.id}
                style={styles.perfumeCard}
                activeOpacity={0.9}
                onPress={() => {}}
              >
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
                  <Text style={styles.perfumeName}>{perfume.name}</Text>
                  <Text style={styles.perfumeBrand}>{perfume.brand}</Text>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.miniButton}
                      onPress={() =>
                        router.push({
                          pathname: '/ar-experience',
                          params: { perfumeId: perfume.id },
                        } as any)
                      }
                    >
                      <Eye size={16} color="#FF6B9D" />
                      <Text style={styles.miniButtonText}>AR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.miniButton}
                      onPress={() =>
                        router.push({
                          pathname: '/vr-experience',
                          params: { perfumeId: perfume.id },
                        } as any)
                      }
                    >
                      <Maximize2 size={16} color="#00CED1" />
                      <Text style={styles.miniButtonText}>VR</Text>
                    </TouchableOpacity>
                  </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
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
  experienceTypes: {
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 16,
  },
  typeCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  typeGradient: {
    padding: 20,
    alignItems: 'center',
  },
  typeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 12,
    marginBottom: 8,
  },
  typeDescription: {
    fontSize: 13,
    color: '#CCC',
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    paddingHorizontal: 24,
    marginBottom: 20,
    letterSpacing: 1,
  },
  perfumeGrid: {
    paddingHorizontal: 24,
    gap: 16,
  },
  perfumeCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
    flexDirection: 'row',
  },
  imageContainer: {
    width: 120,
    height: 120,
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
    height: 60,
  },
  perfumeInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  perfumeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  perfumeBrand: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  miniButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A3E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  miniButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
  auraGlow: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 50,
    height: 50,
    borderRadius: 25,
    opacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
  },
});
