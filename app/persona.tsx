import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowRight, Sparkles } from 'lucide-react-native';
import { useJourney } from '@/context/JourneyContext';

export default function PersonaScreen() {
  const router = useRouter();
  const { mood, persona } = useJourney();

  useEffect(() => {
    if (!mood || !persona) {
      router.replace('/journey');
    }
  }, [mood, persona]);

  if (!mood || !persona) return null;

  // Use the color from the detected mood, or a safe default
  const themeColor = mood.color || '#FF6B9D';

  // const getPersonaColor = (personaName: string) => {
  //   const colors: { [key: string]: string } = {
  //     'The Romantic': '#FFB6C1',
  //     'The Free Spirit': '#00CED1',
  //     'The Sophisticated': '#8B4789',
  //     'The Adventurer': '#DC143C',
  //     'The Minimalist': '#F0F3FF',
  //     'The Bold Visionary': '#FFA500',
  //   };
  //   return colors[personaName] || '#FF6B9D';
  // };

  // const personaColor = getPersonaColor(persona.name);

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
            <View
              style={[
                styles.moodBadge,
                { backgroundColor: themeColor + '20', borderColor: themeColor },
              ]}
            >
              <Text style={[styles.moodText, { color: themeColor }]}>
                {mood.name} Aura
              </Text>
            </View>
          </View>

          <View style={styles.personaCircle}>
            <LinearGradient
              colors={[themeColor + '60', themeColor + '10']}
              style={styles.personaGradient}
            >
              {persona.image_url ? (
                <Image
                  source={{ uri: persona.image_url }}
                  style={styles.personaImage}
                  resizeMode="cover"
                />
              ) : (
                <Sparkles size={64} color={themeColor} strokeWidth={1.5} />
              )}
            </LinearGradient>

            <View
              style={[styles.glow, { backgroundColor: themeColor }]}
            />
          </View>

          <Text style={styles.title}>You are</Text>
          <Text style={[styles.personaName, { color: themeColor }]}>
            {persona.name}
          </Text>

          <Text style={styles.description}>{persona.description}</Text>

          <View style={styles.characteristicsContainer}>
            <Text style={styles.characteristicsTitle}>Your Traits</Text>
            <View style={styles.characteristics}>
              {persona.characteristics.map((trait, index) => (
                <View
                  key={index}
                  style={[
                    styles.traitBadge,
                    { backgroundColor: themeColor + '15', borderColor: themeColor + '30', borderWidth: 1 },
                  ]}
                >
                  <Text style={[styles.traitText, { color: themeColor }]}>
                    {trait}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.insightBox}>
            <Text style={[styles.insightTitle, { color: themeColor }]}>Fragrance Insight</Text>
            <Text style={styles.insightText}>
              As {persona.name}, you're drawn to scents that express your
              unique emotional landscape. Your fragrance should feel like an
              extension of your soul - authentic, meaningful, and deeply
              personal.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.push('/preferences')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[themeColor, themeColor + 'CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>Build Your Scent DNA</Text>
              <ArrowRight size={24} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
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
  moodBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  moodText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  personaCircle: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginBottom: 32,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personaGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    zIndex: 2,
  },
  personaImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.3,
    top: 10,
    left: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50,
  },
  title: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  personaName: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 1,
  },
  description: {
    fontSize: 16,
    color: '#CCC',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  characteristicsContainer: {
    marginBottom: 32,
  },
  characteristicsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  characteristics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  traitBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  traitText: {
    fontSize: 14,
    fontWeight: '600',
  },
  insightBox: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B9D',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#CCC',
    lineHeight: 22,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
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
});
