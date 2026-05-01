import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/hooks/useColors';
import { useAppContext } from '../../src/hooks/useAppContext';

const PERSONALITIES = [
  {
    id: 'socratic',
    name: 'Socratic Method',
    icon: 'school',
    desc: 'Guides you with questions instead of giving answers. Best for deep learning.',
    preview: 'Interesting thought! What happens if we double the mass? Think about the equation.',
    color: '#6366f1'
  },
  {
    id: 'friendly',
    name: 'Friendly Tutor',
    icon: 'happy',
    desc: 'Encouraging and uses simple analogies. Great for new topics.',
    preview: 'Great job! Think of it like a water pipe: wider pipe means more flow. Let\'s try!',
    color: '#f59e0b'
  },
  {
    id: 'strict',
    name: 'Strict Professor',
    icon: 'briefcase',
    desc: 'No-nonsense and rigorous. Focuses on precise terminology.',
    preview: 'Incorrect. Your assumption violates the Second Law. Review chapter 4 before proceeding.',
    color: '#475569'
  },
  {
    id: 'panic',
    name: 'Panic Mode',
    icon: 'flash',
    desc: 'Extremely concise. Use this when cramming 12 hours before an exam.',
    preview: 'Wrong. Memorize this: F=ma. Next. No time for mistakes, exam is in 8 hours.',
    color: '#ef4444'
  }
];

export default function AiPersonalityScreen() {
  const router = useRouter();
  const c = useColors();
  const { settings, updateSettings } = useAppContext();
  const [active, setActive] = useState(settings.personality);

  useEffect(() => {
    setActive(settings.personality);
  }, [settings.personality]);

  const handleSave = async () => {
    try {
      await updateSettings({ personality: active });
      Alert.alert('Success', 'AI Personality updated.');
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save personality.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.surfaceContainerHigh }]}>
          <Ionicons name="chevron-back" size={24} color={c.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: c.onSurface }]}>Guru Persona</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={[styles.heroIconWrap, { backgroundColor: c.primary + '15' }]}>
            <Ionicons name="sparkles" size={40} color={c.primary} />
          </View>
          <Text style={[styles.heroTitle, { color: c.onSurface }]}>Choose Your Guide</Text>
          <Text style={[styles.heroDesc, { color: c.onSurface + '60' }]}>
            This affects how the AI Guru interacts with you, its tone, and its teaching style.
          </Text>
        </View>

        {PERSONALITIES.map(p => {
          const isActive = active === p.id;
          return (
            <TouchableOpacity 
              key={p.id} 
              style={[
                styles.card, 
                { backgroundColor: c.surfaceContainerLow, borderColor: isActive ? p.color : c.outlineVariant + '30' },
                isActive && { borderWidth: 2 }
              ]}
              onPress={() => setActive(p.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardTop}>
                <View style={[styles.iconWrap, { backgroundColor: isActive ? p.color : c.surfaceContainerHighest }]}>
                  <Ionicons name={p.icon as any} size={20} color={isActive ? '#fff' : c.onSurface + '60'} />
                </View>
                <View style={styles.textWrap}>
                  <Text style={[styles.cardName, { color: c.onSurface }]}>{p.name}</Text>
                  <Text style={[styles.cardDesc, { color: c.onSurface + '60' }]}>{p.desc}</Text>
                </View>
                {isActive && <Ionicons name="checkmark-circle" size={22} color={p.color} />}
              </View>

              {isActive && (
                <View style={[styles.preview, { backgroundColor: p.color + '10', borderColor: p.color + '20' }]}>
                  <Text style={[styles.previewLabel, { color: p.color }]}>GURU SAYS:</Text>
                  <Text style={[styles.previewText, { color: c.onSurface }]}>"{p.preview}"</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity 
          style={[styles.mainSaveBtn, { backgroundColor: c.primary }]} 
          onPress={handleSave}
        >
          <Text style={styles.mainSaveBtnText}>Save Preferences</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '800' },
  
  content: { padding: 24 },
  heroSection: { alignItems: 'center', marginBottom: 32 },
  heroIconWrap: { width: 80, height: 80, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 24, fontWeight: '900', marginBottom: 8 },
  heroDesc: { textAlign: 'center', fontSize: 14, lineHeight: 22, paddingHorizontal: 20 },
  
  card: { borderRadius: 24, padding: 16, marginBottom: 16, borderWidth: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  textWrap: { flex: 1, marginRight: 12 },
  cardName: { fontSize: 17, fontWeight: '800', marginBottom: 4 },
  cardDesc: { fontSize: 12, lineHeight: 18 },
  
  preview: { marginTop: 16, padding: 16, borderRadius: 16, borderWidth: 1 },
  previewLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1, marginBottom: 6 },
  previewText: { fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
  
  mainSaveBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4, marginTop: 16 },
  mainSaveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
