import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Heart, User, Droplet, Award } from 'lucide-react-native';
import { useJourney } from '@/context/JourneyContext';

export default function JourneyScreen() {
  const router = useRouter();
  const { mood, persona, selectedNotes, recommendations } = useJourney();

  const journeySteps = [
    {
      id: 'moodscan',
      title: 'MoodScan',
      description: 'Discover your emotional state',
      icon: Heart,
      route: '/moodscan',
      completed: !!mood,
      color: '#FF6B9D',
    },
    {
      id: 'persona',
      title: 'Your Persona',
      description: 'Reveal your fragrance personality',
      icon: User,
      route: '/persona',
      completed: !!persona,
      color: '#A8D5E2',
      disabled: !mood,
    },
    {
      id: 'preferences',
      title: 'Scent DNA',
      description: 'Build your unique fragrance profile',
      icon: Droplet,
      route: '/preferences',
      completed: selectedNotes.length > 0,
      color: '#00CED1',
      disabled: !persona,
    },
    {
      id: 'recommendations',
      title: 'Your Matches',
      description: 'Discover your perfect perfumes',
      icon: Award,
      route: '/recommendations',
      completed: recommendations.length > 0,
      color: '#FFA500',
      disabled: selectedNotes.length === 0,
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#1A1A2E', '#0A0A0F']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Sparkles size={32} color="#FF6B9D" />
          <Text style={styles.title}>Your Fragrance Journey</Text>
          <Text style={styles.subtitle}>
            Let emotions guide you to the perfect scent
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          {journeySteps.map((step, index) => {
            const Icon = step.icon;
            const isDisabled = step.disabled;

            return (
              <TouchableOpacity
                key={step.id}
                style={[
                  styles.stepCard,
                  isDisabled && styles.stepCardDisabled,
                ]}
                onPress={() => !isDisabled && router.push(step.route as any)}
                disabled={isDisabled}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    isDisabled
                      ? ['#1A1A2E', '#1A1A2E']
                      : step.completed
                        ? [step.color + '40', step.color + '20']
                        : ['#1A1A2E', '#2A2A3E']
                  }
                  style={styles.stepGradient}
                >
                  <View style={styles.stepHeader}>
                    <View
                      style={[
                        styles.stepNumber,
                        { backgroundColor: step.color + '30' },
                        isDisabled && styles.stepNumberDisabled,
                      ]}
                    >
                      <Text
                        style={[
                          styles.stepNumberText,
                          { color: step.color },
                          isDisabled && styles.stepNumberTextDisabled,
                        ]}
                      >
                        {index + 1}
                      </Text>
                    </View>
                    {step.completed && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>✓</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.stepIcon}>
                    <Icon
                      size={48}
                      color={isDisabled ? '#444' : step.color}
                      strokeWidth={1.5}
                    />
                  </View>

                  <Text
                    style={[
                      styles.stepTitle,
                      isDisabled && styles.stepTitleDisabled,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text
                    style={[
                      styles.stepDescription,
                      isDisabled && styles.stepDescriptionDisabled,
                    ]}
                  >
                    {step.description}
                  </Text>

                  {isDisabled && (
                    <Text style={styles.lockedText}>Complete previous step</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 40,
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
  stepsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  stepCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  stepCardDisabled: {
    opacity: 0.5,
  },
  stepGradient: {
    padding: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberDisabled: {
    backgroundColor: '#2A2A3E',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
  },
  stepNumberTextDisabled: {
    color: '#444',
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  stepIcon: {
    alignItems: 'center',
    marginVertical: 16,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepTitleDisabled: {
    color: '#666',
  },
  stepDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  stepDescriptionDisabled: {
    color: '#555',
  },
  lockedText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
