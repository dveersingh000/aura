import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Sparkles } from 'lucide-react-native';
// import { supabase } from '@/lib/supabase';
import { getMoods, getPersonaByName, analyzeMood } from '@/lib/api';
import { Mood, Persona } from '@/types/database';
import { useJourney } from '@/context/JourneyContext';

const emotionalPrompts = [
  {
    question: 'How do you want to feel today?',
    options: [
      { text: 'Peaceful and centered', moods: ['Calm', 'Fresh'] },
      { text: 'Confident and powerful', moods: ['Bold', 'Mysterious'] },
      { text: 'Joyful and romantic', moods: ['Romantic', 'Energetic'] },
      { text: 'Adventurous and free', moods: ['Energetic', 'Fresh'] },
    ],
  },
  {
    question: 'Which moment resonates with you?',
    options: [
      { text: 'Sunrise by the ocean', moods: ['Fresh', 'Calm'] },
      { text: 'Candlelit dinner date', moods: ['Romantic', 'Mysterious'] },
      { text: 'Dancing until dawn', moods: ['Energetic', 'Bold'] },
      { text: 'Walking through rain', moods: ['Calm', 'Mysterious'] },
    ],
  },
  {
    question: 'Your ideal escape is...',
    options: [
      { text: 'A quiet forest retreat', moods: ['Calm', 'Fresh'] },
      { text: 'A vibrant city adventure', moods: ['Bold', 'Energetic'] },
      { text: 'A romantic Parisian evening', moods: ['Romantic', 'Mysterious'] },
      { text: 'A beach at golden hour', moods: ['Fresh', 'Romantic'] },
    ],
  },
];

export default function MoodScanScreen() {
  const router = useRouter();
  const { setMood, setPersona } = useJourney();
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [moodScores, setMoodScores] = useState<{ [key: string]: number }>({});
  // const [moods, setMoods] = useState<Mood[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // useEffect(() => {
  //   fetchMoods();
  //   animateIn();
  // }, []);

  useEffect(() => {
    animateIn();
  }, [currentPrompt]);

  // const fetchMoods = async () => {
  //   const { data } = await supabase.from('moods').select('*');
  //   if (data) setMoods(data);
  // };
  // const fetchMoods = async () => {
  //   try {
  //     const data = await getMoods();
  //     setMoods(data);
  //   } catch (err) {
  //     console.error('Failed to load moods', err);
  //   }
  // };


  const animateIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const handleSelection = async (selectedMoods: string[]) => {
    if (isAnalyzing) return;

    const newScores = { ...moodScores };
    selectedMoods.forEach((moodName) => {
      newScores[moodName] = (newScores[moodName] || 0) + 1;
    });
    setMoodScores(newScores);

    if (currentPrompt < emotionalPrompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1);
    } else {
      await performAnalysis(newScores);
    }
  };

  const performAnalysis = async (scores: { [key: string]: number }) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeMood(scores);

      setMood(result.mood);
      setPersona(result.persona);

      router.push('/persona');
    } catch (err) {
      console.error('Analysis failed', err);
      Alert.alert('Error', 'Could not analyze your mood. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const prompt = emotionalPrompts[currentPrompt];

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
            <Sparkles size={40} color="#FF6B9D" />
            <Text style={styles.title}>MoodScan</Text>
            <Text style={styles.subtitle}>
              Let your emotions guide your fragrance
            </Text>
          </View>

          {isAnalyzing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B9D" />
              <Text style={styles.loadingText}>Analyzing your aura...</Text>
            </View>
          ) : (
            <>
              <View style={styles.progressContainer}>
                {emotionalPrompts.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.progressDot,
                      index <= currentPrompt && styles.progressDotActive,
                    ]}
                  />
                ))}
              </View>

              <Animated.View style={{ opacity: fadeAnim }}>
                <Text style={styles.question}>{prompt.question}</Text>

                <View style={styles.optionsContainer}>
                  {prompt.options.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.optionButton}
                      onPress={() => handleSelection(option.moods)}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={['#1A1A2E', '#2A2A3E']}
                        style={styles.optionGradient}
                      >
                        <Text style={styles.optionText}>{option.text}</Text>
                        <View style={styles.optionIndicator}>
                          <View style={styles.optionIndicatorInner} />
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2A2A3E',
  },
  progressDotActive: {
    backgroundColor: '#FF6B9D',
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  optionText: {
    flex: 1,
    fontSize: 17,
    color: '#FFF',
    fontWeight: '500',
  },
  optionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B9D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIndicatorInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 16,
    fontSize: 16,
  },
});
