import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ImageBackground,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Maximize2 } from 'lucide-react-native';
// import { supabase } from '@/lib/supabase';
import { getPerfumeById } from '@/lib/api';
import { Perfume } from '@/types/database';

const VR_ENVIRONMENTS = {
  sunlight_garden: {
    name: 'Sunlight Garden',
    description: 'A luminous garden bathed in golden light',
    gradient: ['#FFD700', '#FFA500', '#FF6B9D'],
    image: 'https://images.pexels.com/photos/1086828/pexels-photo-1086828.jpeg',
  },
  night_city: {
    name: 'Night City',
    description: 'Electric energy of the urban night',
    gradient: ['#1A1A2E', '#0A0A0F', '#1A1A2E'],
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
  },
  paris_twilight: {
    name: 'Paris at Twilight',
    description: 'Romantic Parisian evening glow',
    gradient: ['#FFB6C1', '#FF6B9D', '#C41E3A'],
    image:
      'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg',
  },
  ocean_sunrise: {
    name: 'Ocean Sunrise',
    description: 'Fresh dawn over crystalline waters',
    gradient: ['#00CED1', '#00B4D8', '#A8D5E2'],
    image: 'https://images.pexels.com/photos/457881/pexels-photo-457881.jpeg',
  },
  crimson_sunset: {
    name: 'Crimson Sunset',
    description: 'Passionate fire of the setting sun',
    gradient: ['#DC143C', '#C41E3A', '#8B0000'],
    image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg',
  },
  white_space: {
    name: 'White Space',
    description: 'Pure, minimalist tranquility',
    gradient: ['#F0F3FF', '#FFFFFF', '#E8E8E8'],
    image:
      'https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg',
  },
  lavender_fields: {
    name: 'Lavender Fields',
    description: 'Endless fields of purple freedom',
    gradient: ['#E8DFF5', '#B19CD9', '#8B7BA8'],
    image:
      'https://images.pexels.com/photos/1166644/pexels-photo-1166644.jpeg',
  },
  dual_reality: {
    name: 'Dual Reality',
    description: 'Where light meets shadow',
    gradient: ['#8B4789', '#4B0082', '#1A1A2E'],
    image:
      'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg',
  },
};

export default function VRExperienceScreen() {
  const router = useRouter();
  const { perfumeId } = useLocalSearchParams();
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [isImmersed, setIsImmersed] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];

  useEffect(() => {
    if (perfumeId) {
      fetchPerfume();
    }
  }, [perfumeId]);

  useEffect(() => {
    if (isImmersed) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isImmersed]);

  // const fetchPerfume = async () => {
  //   const { data } = await supabase
  //     .from('perfumes')
  //     .select('*')
  //     .eq('id', perfumeId)
  //     .maybeSingle();

  //   if (data) {
  //     setPerfume(data);
  //   }
  // };

  const fetchPerfume = async () => {
  try {
    if (!perfumeId) return;
    const data = await getPerfumeById(perfumeId as string);
    setPerfume(data);
  } catch (error) {
    console.error('Error fetching perfume (VR):', error);
  }
};


  if (!perfume) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const environment =
    VR_ENVIRONMENTS[
      perfume.vr_environment as keyof typeof VR_ENVIRONMENTS
    ] || VR_ENVIRONMENTS.sunlight_garden;

  if (isImmersed) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: environment.image }}
          style={styles.immersiveBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={[
              environment.gradient[0],
              environment.gradient[1],
              environment.gradient[2],
              environment.gradient[0],
            ]}
            style={styles.immersiveOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity
              style={styles.exitButton}
              onPress={() => setIsImmersed(false)}
            >
              <X size={32} color="#FFF" />
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.immersiveContent,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text style={styles.environmentName}>{environment.name}</Text>
              <Text style={styles.environmentDescription}>
                {environment.description}
              </Text>

              <View style={styles.perfumeDetails}>
                <Text style={styles.immersivePerfumeName}>{perfume.name}</Text>
                <Text style={styles.immersiveImpact}>
                  {perfume.emotional_impact}
                </Text>
              </View>
            </Animated.View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  }

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

        <View style={styles.content}>
          <View style={styles.header}>
            <Maximize2 size={32} color={perfume.aura_color} />
            <Text style={styles.title}>VR Experience</Text>
            <Text style={styles.subtitle}>
              Step into the emotional world of {perfume.name}
            </Text>
          </View>

          <View style={styles.previewContainer}>
            <ImageBackground
              source={{ uri: environment.image }}
              style={styles.previewImage}
              resizeMode="cover"
            >
              <LinearGradient
                colors={[
                  'rgba(10, 10, 15, 0.3)',
                  'rgba(10, 10, 15, 0.7)',
                  'rgba(10, 10, 15, 0.9)',
                ]}
                style={styles.previewOverlay}
              >
                <View style={styles.previewInfo}>
                  <Text style={styles.previewTitle}>{environment.name}</Text>
                  <Text style={styles.previewDescription}>
                    {environment.description}
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Your VR World</Text>
            <Text style={styles.infoText}>
              Every fragrance has an emotional landscape. {perfume.name} takes
              you to {environment.name.toLowerCase()}, where you can truly feel
              its essence beyond scent.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.enterButton}
            onPress={() => setIsImmersed(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[
                environment.gradient[0],
                environment.gradient[1],
                environment.gradient[2],
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.enterGradient}
            >
              <Maximize2 size={24} color="#FFF" />
              <Text style={styles.enterText}>Enter VR World</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  previewContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#2A2A3E',
  },
  previewImage: {
    flex: 1,
  },
  previewOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  previewInfo: {
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 15,
    color: '#CCC',
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B9D',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#CCC',
    lineHeight: 20,
  },
  enterButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  enterGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  enterText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  immersiveBackground: {
    flex: 1,
  },
  immersiveOverlay: {
    flex: 1,
    opacity: 0.85,
  },
  exitButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  immersiveContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  environmentName: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  environmentDescription: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  perfumeDetails: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  immersivePerfumeName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  immersiveImpact: {
    fontSize: 15,
    color: '#EEE',
    textAlign: 'center',
    lineHeight: 22,
  },
});
