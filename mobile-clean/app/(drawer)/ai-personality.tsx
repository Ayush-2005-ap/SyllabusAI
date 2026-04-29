import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/hooks/useColors';

const PERSONALITIES = [
  {
    id: 'socratic',
    name: 'Socratic Method',
    icon: 'school-outline',
    desc: 'Guides you to the answer with questions instead of just giving it to you. Best for long-term retention.',
    preview: 'That is an interesting thought! But what happens to the velocity if we double the mass? Think about the equation we just discussed.'
  },
  {
    id: 'friendly',
    name: 'Friendly Tutor',
    icon: 'happy-outline',
    desc: 'Encouraging, patient, and uses simple analogies. Great for learning completely new topics.',
    preview: 'Great job! You almost got it. Think of it like a water pipe: if you make the pipe wider, more water flows through. Let\'s try one more time!'
  },
  {
    id: 'strict',
    name: 'Strict Professor',
    icon: 'briefcase-outline',
    desc: 'No-nonsense, direct, and rigorous. Focuses heavily on precise terminology and proofs.',
    preview: 'Incorrect. Your assumption violates the Second Law of Thermodynamics. Review chapter 4 and state the formal definition before proceeding.'
  },
  {
    id: 'panic',
    name: 'Panic Mode',
    icon: 'warning-outline',
    desc: 'High-stress, extremely concise, and skips pleasantries. Only uses this when you are cramming 12 hours before an exam.',
    preview: 'Wrong. Memorize this now: F=ma. Next question. We do not have time for mistakes, your exam is in 8 hours.'
  }
];

export default function AiPersonalityScreen() {
  const router = useRouter();
  const c = useColors();
  const [active, setActive] = useState('socratic');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={c.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: c.onSurface }]}>AI Personality</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.subtitle, { color: c.onSurface + '80' }]}>
          Choose how the AI Guru interacts with you during chat sessions. This affects its tone, verbosity, and teaching style.
        </Text>

        {PERSONALITIES.map(p => {
          const isActive = active === p.id;
          const borderColor = isActive ? c.primary : c.outlineVariant + '30';
          const bgColor = isActive ? c.primaryContainer + '20' : c.surfaceContainerLow;
          
          return (
            <TouchableOpacity 
              key={p.id} 
              style={[styles.card, { borderColor, backgroundColor: bgColor }]}
              onPress={() => setActive(p.id)}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrap, { backgroundColor: isActive ? c.primary : c.surfaceContainerHigh }]}>
                  <Ionicons name={p.icon as any} size={20} color={isActive ? '#fff' : c.onSurface} />
                </View>
                <View style={styles.cardTitleWrap}>
                  <Text style={[styles.cardTitle, { color: c.onSurface }]}>{p.name}</Text>
                </View>
                {isActive && <Ionicons name="checkmark-circle" size={24} color={c.primary} />}
              </View>
              
              <Text style={[styles.cardDesc, { color: c.onSurface + '80' }]}>{p.desc}</Text>
              
              {isActive && (
                <View style={[styles.previewBubble, { backgroundColor: c.surfaceContainerHigh }]}>
                  <Text style={[styles.previewLabel, { color: c.primary }]}>PREVIEW</Text>
                  <Text style={[styles.previewText, { color: c.onSurface }]}>"{p.preview}"</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: c.primary }]} onPress={() => router.back()}>
          <Text style={styles.saveBtnText}>Save Preferences</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontWeight: '800' },
  content: { padding: 20 },
  subtitle: { fontSize: 14, lineHeight: 22, marginBottom: 24 },
  card: { borderWidth: 2, borderRadius: 20, padding: 20, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  cardTitleWrap: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '800' },
  cardDesc: { fontSize: 13, lineHeight: 20, marginBottom: 16 },
  previewBubble: { padding: 16, borderRadius: 16, borderTopLeftRadius: 4 },
  previewLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
  previewText: { fontSize: 14, lineHeight: 22, fontStyle: 'italic' },
  saveBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
