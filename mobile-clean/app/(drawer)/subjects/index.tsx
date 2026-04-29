import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSubjects } from '../../../src/hooks/useSubjects';
import { useColors } from '../../../src/hooks/useColors';
import { Ionicons } from '@expo/vector-icons';

export default function SubjectsScreen() {
  const router = useRouter();
  const { subjects, loading, fetchSubjects, deleteSubject } = useSubjects();
  const c = useColors();

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  if (loading && subjects.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: c.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.semester, { color: c.primary }]}>Fall 2024 Semester</Text>
        <Text style={[styles.title, { color: c.onSurface }]}>Academic Inventory</Text>
        <Text style={[styles.subtitle, { color: c.onSurfaceVariant }]}>Curating your success path.</Text>
      </View>

      <FlatList
        data={subjects}
        keyExtractor={item => item._id}
        contentContainerStyle={[styles.list, { paddingBottom: 120 }]}
        renderItem={({ item, index }) => {
          const pct = item.totalTopics
            ? Math.round((item.completedTopics || 0) / item.totalTopics * 100)
            : 0;
          return (
            <View style={{ position: 'relative' }}>
              <TouchableOpacity
                style={[styles.card, { backgroundColor: c.cardBackground, borderColor: c.outlineVariant + '30' }]}
                onPress={() => router.push(`/subjects/${item._id}`)}
                onLongPress={() => {
                  Alert.alert(
                    'Delete Subject',
                    `Remove "${item.name}" and all its topics? This cannot be undone.`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            await deleteSubject(item._id);
                          } catch {
                            Alert.alert('Error', 'Failed to delete subject.');
                          }
                        }
                      }
                    ]
                  );
                }}
                activeOpacity={0.85}
              >
                {/* Card header row: PYQ badge + delete button */}
                <View style={styles.cardHeader}>
                  {item.totalTopics > 0 ? (
                    <View style={[styles.pyqBadge, { backgroundColor: c.primary + '25' }]}>
                      <Text style={[styles.pyqText, { color: c.primary }]}>PYQ AVAILABLE</Text>
                    </View>
                  ) : <View />}
                  <TouchableOpacity
                    style={[styles.deleteBtn, { backgroundColor: '#FF453A15' }]}
                    onPress={() => {
                      Alert.alert(
                        'Delete Subject',
                        `Remove "${item.name}" and all its topics? This cannot be undone.`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: async () => {
                              try {
                                await deleteSubject(item._id);
                              } catch {
                                Alert.alert('Error', 'Failed to delete subject.');
                              }
                            }
                          }
                        ]
                      );
                    }}
                  >
                    <Ionicons name="trash-outline" size={14} color="#FF453A" />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.cardTitle, { color: c.onSurface }]}>{item.name}</Text>
                <Text style={[styles.cardProf, { color: c.primary }]}>{item.professor || 'No professor set'}</Text>
                <View style={styles.cardFooter}>
                  <View>
                    {item.examDate && (
                      <View style={styles.examRow}>
                        <Ionicons name="calendar-outline" size={12} color={c.tertiary} />
                        <Text style={[styles.examText, { color: c.onSurface + '80' }]}>
                          Exam: {new Date(item.examDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Text>
                      </View>
                    )}
                    <View style={[styles.progressTrack, { backgroundColor: c.surfaceContainerHighest }]}>
                      <View style={[styles.progressBar, { width: `${pct}%` as any, backgroundColor: c.primary }]} />
                    </View>
                  </View>
                  <View style={styles.pctBlock}>
                    <Text style={[styles.pctValue, { color: c.onSurface }]}>
                      {pct}<Text style={[styles.pctSign, { color: c.onSurface + '40' }]}>%</Text>
                    </Text>
                    <Text style={[styles.pctLabel, { color: c.onSurface + '60' }]}>DEPTH</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="library-outline" size={56} color={c.outlineVariant} />
            <Text style={[styles.emptyTitle, { color: c.onSurface }]}>No subjects yet</Text>
            <Text style={[styles.emptySub, { color: c.onSurface + '60' }]}>Add your first course to get started.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: c.primaryContainer }]}
        onPress={() => router.push('/subjects/add')}
      >
        <Ionicons name="add" size={28} color={c.onPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  semester: { fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  title: { fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 4 },
  list: { paddingHorizontal: 20 },
  card: { borderRadius: 24, padding: 24, marginBottom: 14, borderWidth: 1, overflow: 'hidden', minHeight: 140, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  pyqBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999 },
  pyqText: { fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  deleteBtn: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5, marginTop: 4 },
  cardProf: { fontSize: 13, fontWeight: '500', marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20 },
  examRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  examText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginLeft: 4, textTransform: 'uppercase' },
  progressTrack: { width: 140, height: 4, borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 2 },
  pctBlock: { alignItems: 'flex-end' },
  pctValue: { fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  pctSign: { fontSize: 18 },
  pctLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1.5 },
  emptyContainer: { alignItems: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  emptySub: { fontSize: 13, textAlign: 'center' },
  fab: { position: 'absolute', bottom: 90, right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#a0caff', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10 },
});

