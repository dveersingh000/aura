import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Eye, Play } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Perfume } from '@/types/database';

export default function ARExperienceScreen() {
  const router = useRouter();
  const { perfumeId } = useLocalSearchParams();
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const pulseAnim = useState(new Animated.Value(1))[0];
  const glowAnim = useState(new Animated.Value(0))[0];
  const rotateAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (perfumeId) {
      fetchPerfume();
    }
  }, [perfumeId]);

  const fetchPerfume = async () => {
    const { data } = await supabase
      .from('perfumes')
      .select('*')
      .eq('id', perfumeId)
      .maybeSingle();

    if (data) {
      setPerfume(data);
    }
  };

  const startAnimation = () => {
    setIsPlaying(true);

    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopAnimation = () => {
    setIsPlaying(false);
    pulseAnim.setValue(1);
    glowAnim.setValue(0);
    rotateAnim.setValue(0);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!perfume) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
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
            <Eye size={32} color={perfume.aura_color} />
            <Text style={styles.title}>Aura Experience</Text>
            <Text style={styles.subtitle}>
              Feel the emotional essence of {perfume.name}
            </Text>
          </View>

          <View style={styles.arContainer}>
            <View style={styles.perfumeContainer}>
              {perfume.image_url && (
                <Image
                  source={{ uri: perfume.image_url }}
                  style={styles.perfumeImage}
                  resizeMode="contain"
                />
              )}

              <Animated.View
                style={[
                  styles.auraRing1,
                  {
                    borderColor: perfume.aura_color,
                    transform: [{ scale: pulseAnim }, { rotate: spin }],
                    opacity: glowAnim,
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.auraRing2,
                  {
                    borderColor: perfume.aura_color,
                    transform: [
                      { scale: Animated.multiply(pulseAnim, 1.3) },
                      { rotate: spin },
                    ],
                    opacity: Animated.multiply(glowAnim, 0.6),
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.auraRing3,
                  {
                    borderColor: perfume.aura_color,
                    transform: [
                      { scale: Animated.multiply(pulseAnim, 1.6) },
                      { rotate: spin },
                    ],
                    opacity: Animated.multiply(glowAnim, 0.3),
                  },
                ]}
              />

              <View
                style={[
                  styles.centerGlow,
                  { backgroundColor: perfume.aura_color },
                ]}
              />
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.perfumeName}>{perfume.name}</Text>
            <Text style={styles.perfumeBrand}>{perfume.brand}</Text>

            <View
              style={[
                styles.colorBadge,
                { backgroundColor: perfume.aura_color + '30' },
              ]}
            >
              <Text style={[styles.colorText, { color: perfume.aura_color }]}>
                Emotional Aura Color
              </Text>
            </View>

            <Text style={styles.impactDescription}>
              {perfume.emotional_impact}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.playButton}
            onPress={isPlaying ? stopAnimation : startAnimation}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[perfume.aura_color, perfume.aura_color + '80']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.playGradient}
            >
              {isPlaying ? (
                <>
                  <Text style={styles.playText}>Stop Experience</Text>
                </>
              ) : (
                <>
                  <Play size={24} color="#FFF" />
                  <Text style={styles.playText}>Start Experience</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.vrButton}
            onPress={() =>
              router.push({
                pathname: '/vr-experience',
                params: { perfumeId: perfume.id },
              } as any)
            }
            activeOpacity={0.8}
          >
            <Text style={styles.vrButtonText}>Enter VR World</Text>
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
    marginBottom: 40,
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
  },
  arContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  perfumeContainer: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  perfumeImage: {
    width: 120,
    height: 120,
    zIndex: 5,
  },
  auraRing1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderStyle: 'dashed',
  },
  auraRing2: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderStyle: 'dotted',
  },
  auraRing3: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
  },
  centerGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  perfumeName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  perfumeBrand: {
    fontSize: 14,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  colorBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 16,
  },
  colorText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  impactDescription: {
    fontSize: 14,
    color: '#CCC',
    textAlign: 'center',
    lineHeight: 20,
  },
  playButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  playGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  playText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  vrButton: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  vrButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
