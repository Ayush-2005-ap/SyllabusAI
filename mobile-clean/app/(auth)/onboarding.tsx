import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Dimensions, Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../src/utils/colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'document-text' as const,
    iconColor: colors.primary,
    title: 'Upload syllabus',
    description: 'Turn static PDFs into dynamic study paths. One upload, total clarity.',
  },
  {
    id: '2',
    icon: 'bulb' as const,
    iconColor: colors.tertiary,
    title: 'AI predicts exams',
    description: 'Our models analyze historical patterns to pinpoint exactly what you need to master.',
  },
  {
    id: '3',
    icon: 'calendar' as const,
    iconColor: colors.primary,
    title: 'Study smarter',
    description: 'Automated schedules that adapt to your pace and peak energy hours.',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleComplete = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    router.replace('/login');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next });
      setCurrentIndex(next);
    } else {
      handleComplete();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Ambient background blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      {/* Hero logo */}
      <View style={styles.logoRow}>
        <Ionicons name="book" size={28} color={colors.primary} />
        <Text style={styles.logoText}>SyllabusAI</Text>
      </View>

      <Text style={styles.heroSubtitle}>Your unfair academic advantage</Text>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(idx);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.slideIconWrap, { backgroundColor: item.iconColor + '18' }]}>
              <Ionicons name={item.icon} size={56} color={item.iconColor} />
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideDesc}>{item.description}</Text>
          </View>
        )}
        style={{ flexGrow: 0 }}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.skipBtn} onPress={handleComplete}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      {/* Security badge */}
      <View style={styles.badge}>
        <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.badgeTitle}>Secure Academic Workspace</Text>
          <Text style={styles.badgeSub}>Encrypted syllabus parsing & private AI.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
  },
  blob1: {
    position: 'absolute', top: '10%', left: '15%',
    width: 280, height: 280,
    borderRadius: 140,
    backgroundColor: colors.primary,
    opacity: 0.05,
    // blur not available in RN, simulated via large rounded view
  },
  blob2: {
    position: 'absolute', bottom: '20%', right: '10%',
    width: 200, height: 200,
    borderRadius: 100,
    backgroundColor: colors.primaryContainer,
    opacity: 0.07,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.5,
    marginLeft: 8,
  },
  heroSubtitle: {
    textAlign: 'center',
    color: colors.onSurface + 'aa',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginTop: 4,
    marginBottom: 24,
  },
  slide: {
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  slideIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 12,
  },
  slideDesc: {
    fontSize: 15,
    color: colors.onSurface + '99',
    textAlign: 'center',
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.outlineVariant,
    marginHorizontal: 3,
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 32,
    marginBottom: 16,
  },
  skipBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  skipText: {
    color: colors.onSurface + '70',
    fontSize: 15,
    fontWeight: '600',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 9999,
  },
  nextBtnText: {
    color: colors.onPrimary,
    fontWeight: '800',
    fontSize: 15,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHighest + '80',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  badgeTitle: {
    color: colors.onSurface,
    fontWeight: '700',
    fontSize: 13,
  },
  badgeSub: {
    color: colors.onSurface + '66',
    fontSize: 11,
    marginTop: 2,
  },
});
