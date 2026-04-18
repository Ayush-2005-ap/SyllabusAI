import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSubjects } from '../../../src/hooks/useSubjects';
import { colors } from '../../../src/utils/colors';
import { Ionicons } from '@expo/vector-icons';

export default function SubjectsScreen() {
  const router = useRouter();
  const { subjects, loading, fetchSubjects } = useSubjects();

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  if (loading && subjects.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.semester}>Fall 2024 Semester</Text>
          <Text style={styles.title}>Academic Inventory</Text>
          <Text style={styles.subtitle}>Curating your success path.</Text>
        </View>
      </View>

      {/* Bento grid of subjects */}
      <FlatList
        data={subjects}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        numColumns={1}
        renderItem={({ item, index }) => {
          const pct = item.totalTopics
            ? Math.round((item.completedTopics || 0) / item.totalTopics * 100)
            : 0;
          const isWide = index % 3 === 0;
          return (
            <TouchableOpacity
              style={[styles.card, isWide && styles.cardWide]}
              onPress={() => router.push(`/subjects/${item._id}`)}
              activeOpacity={0.85}
            >
              {item.totalTopics > 0 && (
                <View style={styles.cardPYQBadge}>
                  <Text style={styles.cardPYQText}>PYQ AVAILABLE</Text>
                </View>
              )}
              <View style={styles.cardBody}>
                <View>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardProf}>{item.professor || 'No professor set'}</Text>
                </View>
                <View style={styles.cardFooter}>
                  <View>
                    {item.examDate && (
                      <View style={styles.examRow}>
                        <Ionicons name="calendar-outline" size={12} color={colors.tertiary} />
                        <Text style={styles.examText}>
                          Exam: {new Date(item.examDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Text>
                      </View>
                    )}
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressBar, { width: `${pct}%` as any }]} />
                    </View>
                  </View>
                  <View style={styles.pctBlock}>
                    <Text style={styles.pctValue}>{pct}<Text style={styles.pctSign}>%</Text></Text>
                    <Text style={styles.pctLabel}>SYLLABUS DEPTH</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="library-outline" size={56} color={colors.outlineVariant} />
            <Text style={styles.emptyTitle}>No subjects yet</Text>
            <Text style={styles.emptySub}>Add your first course to get started.</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/subjects/add')}>
        <Ionicons name="add" size={28} color={colors.onPrimary} />
      </TouchableOpacity>

      <View style={{ height: 80 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  semester: { fontSize: 10, fontWeight: '700', color: colors.primary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  title: { fontSize: 30, fontWeight: '900', color: colors.onSurface, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: colors.onSurfaceVariant, marginTop: 4 },

  list: { paddingHorizontal: 20, paddingBottom: 120 },

  card: {
    backgroundColor: 'rgba(22,27,43,0.7)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    minHeight: 140,
    justifyContent: 'space-between',
  },
  cardWide: { minHeight: 160 },
  cardPYQBadge: {
    position: 'absolute', top: 16, right: 16,
    backgroundColor: colors.primary + '25',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 9999,
  },
  cardPYQText: { fontSize: 8, fontWeight: '800', color: colors.primary, letterSpacing: 1 },
  cardBody: { flex: 1, justifyContent: 'space-between' },
  cardTitle: { fontSize: 22, fontWeight: '800', color: colors.onSurface, letterSpacing: -0.5, marginTop: 4 },
  cardProf: { fontSize: 13, color: colors.primary, fontWeight: '500', marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20 },
  examRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  examText: { fontSize: 10, fontWeight: '700', color: colors.onSurface + '80', letterSpacing: 0.5, marginLeft: 4, textTransform: 'uppercase' },
  progressTrack: { width: 140, height: 4, backgroundColor: colors.surfaceContainerHighest, borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: colors.primary, borderRadius: 2, shadowColor: colors.primary, shadowOpacity: 0.6, shadowRadius: 6 },
  pctBlock: { alignItems: 'flex-end' },
  pctValue: { fontSize: 36, fontWeight: '900', color: colors.onSurface, letterSpacing: -1 },
  pctSign: { fontSize: 18, opacity: 0.4 },
  pctLabel: { fontSize: 8, fontWeight: '800', color: colors.onSurface + '60', letterSpacing: 1.5 },

  emptyContainer: { alignItems: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.onSurface, marginTop: 16, marginBottom: 8 },
  emptySub: { fontSize: 13, color: colors.onSurface + '60', textAlign: 'center' },

  fab: {
    position: 'absolute', bottom: 90, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 10,
  },
});
