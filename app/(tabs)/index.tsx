import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Sparkles } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Perfume } from '@/types/database';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const fetchPerfumes = async () => {
    try {
      const { data, error } = await supabase
        .from('perfumes')
        .select('*')
        .order('name');

      if (error) throw error;
      setPerfumes(data || []);
    } catch (error) {
      console.error('Error fetching perfumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPerfumes = perfumes.filter(
    (perfume) =>
      perfume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perfume.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perfume.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Text style={styles.title}>AURAIS</Text>
            <Text style={styles.subtitle}>Feel Your Fragrance</Text>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by mood, note, or name..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/journey')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF6B9D', '#C41E3A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Sparkles size={24} color="#FFF" />
              <Text style={styles.ctaText}>Choose Your Right Perfume</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.catalogSection}>
            <Text style={styles.sectionTitle}>Discover Perfumes</Text>
            <View style={styles.perfumeGrid}>
              {filteredPerfumes.map((perfume) => (
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
                      colors={['transparent', 'rgba(10, 10, 15, 0.9)']}
                      style={styles.imageOverlay}
                    />
                  </View>
                  <View style={styles.perfumeInfo}>
                    <Text style={styles.perfumeBrand}>{perfume.brand}</Text>
                    <Text style={styles.perfumeName}>{perfume.name}</Text>
                    <Text style={styles.perfumePrice}>
                      ${perfume.price.toFixed(2)}
                    </Text>
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
    marginBottom: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 8,
    textShadowColor: '#FF6B9D',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#FFF',
    fontSize: 15,
  },
  ctaButton: {
    marginHorizontal: 24,
    marginBottom: 40,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  ctaText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  catalogSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 20,
    letterSpacing: 1,
  },
  perfumeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  perfumeCard: {
    width: (width - 64) / 2,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  imageContainer: {
    width: '100%',
    height: 200,
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
    height: 80,
  },
  perfumeInfo: {
    padding: 12,
  },
  perfumeBrand: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  perfumeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  perfumePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  auraGlow: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.3,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
  },
});
