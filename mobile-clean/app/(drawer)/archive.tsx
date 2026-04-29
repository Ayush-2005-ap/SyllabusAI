import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/hooks/useColors';

const ARCHIVED_SEMESTERS = [
  { term: 'Spring 2026', subjects: 5, grade: '3.9' },
  { term: 'Autumn 2025', subjects: 6, grade: '3.7' },
];

export default function ArchiveScreen() {
  const router = useRouter();
  const c = useColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={c.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: c.onSurface }]}>Archive</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.emptyState}>
          <Ionicons name="archive-outline" size={64} color={c.primary} style={{ marginBottom: 16 }} />
          <Text style={[styles.emptyTitle, { color: c.onSurface }]}>Semester Archive</Text>
          <Text style={[styles.emptyDesc, { color: c.onSurface + '80' }]}>
            Past semesters and completed subjects will be stored here safely. You can always come back to review old notes, AI chat histories, and PYQ analysis.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: c.onSurface + '80' }]}>PREVIOUS TERMS</Text>

        {ARCHIVED_SEMESTERS.map((sem, i) => (
          <TouchableOpacity 
            key={sem.term} 
            style={[styles.archiveCard, { backgroundColor: c.surfaceContainerLow, borderColor: c.outlineVariant + '30' }]}
          >
            <View style={styles.cardLeft}>
              <View style={[styles.iconWrap, { backgroundColor: c.primaryContainer }]}>
                <Ionicons name="library-outline" size={20} color={c.primary} />
              </View>
              <View>
                <Text style={[styles.termText, { color: c.onSurface }]}>{sem.term}</Text>
                <Text style={[styles.subText, { color: c.onSurface + '70' }]}>{sem.subjects} Subjects Completed</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              <Text style={[styles.gpaText, { color: c.primary }]}>{sem.grade}</Text>
              <Text style={[styles.gpaLabel, { color: c.onSurface + '50' }]}>GPA</Text>
            </View>
          </TouchableOpacity>
        ))}

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
  emptyState: { alignItems: 'center', paddingVertical: 40, marginBottom: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 16, marginLeft: 4 },
  archiveCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 12 },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  termText: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  subText: { fontSize: 13 },
  cardRight: { alignItems: 'center' },
  gpaText: { fontSize: 18, fontWeight: '900' },
  gpaLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
});
