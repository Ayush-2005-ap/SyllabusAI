import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/hooks/useAuth';
import { useSubjects } from '../../src/hooks/useSubjects';
import { useColors } from '../../src/hooks/useColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const HEAT_DATA = [0.1, 0.3, 0.6, 0.1, 0.1, 0.4, 0.1, 0.9, 0.1, 0.3, 0.1, 0.6, 0.1, 0.1,
  0.4, 0.1, 0.1, 0.1, 0.1, 0.6, 0.1, 0.1, 0.4, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3, 0.6,
  0.1, 0.1, 0.4, 0.1, 0.9, 0.1, 0.3, 0.1, 0.6, 0.1, 0.1, 0.4, 0.1, 0.1, 0.1, 0.1, 0.6, 0.1];

const getHour = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { subjects, fetchSubjects } = useSubjects();
  const c = useColors();
  const router = useRouter();

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 0 }} showsVerticalScrollIndicator={false}>

        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.semester, { color: c.primary }]}>Fall 2024 Semester</Text>
            <Text style={[styles.greeting, { color: c.onSurface }]}>Good {getHour()}, {firstName}</Text>
            <Text style={[styles.focusTasks, { color: c.onSurface + '60' }]}>
              You have {subjects.length || 0} active subjects.
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <View style={[styles.avatar, { backgroundColor: c.primaryContainer }]}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Active Subjects ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: c.onSurface + '60' }]}>ACTIVE SUBJECTS</Text>
            <TouchableOpacity onPress={() => router.push('/subjects')}>
              <Text style={[styles.viewAll, { color: c.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24 }}>
            {subjects.length > 0 ? subjects.slice(0, 4).map((subject) => {
              const pct = subject.totalTopics
                ? Math.round((subject.completedTopics || 0) / subject.totalTopics * 100)
                : 0;
              const urgency = pct > 70 ? c.error : pct > 40 ? c.tertiary : c.primary;
              return (
                <TouchableOpacity
                  key={subject._id}
                  style={[styles.subjectCard, { backgroundColor: c.surfaceContainerLow }]}
                  onPress={() => router.push(`/subjects/${subject._id}`)}
                >
                  <View style={[styles.subjectGlow, { backgroundColor: urgency + '15' }]} />
                  <View style={styles.subjectCardTop}>
                    <View style={[styles.ringBg, { borderColor: c.surfaceContainerHighest }]}>
                      <Text style={[styles.ringText, { color: urgency }]}>{pct}%</Text>
                    </View>
                    <View style={[styles.daysBadge, { backgroundColor: urgency + '25' }]}>
                      <Text style={[styles.daysBadgeText, { color: urgency }]}>
                        {subject.examDate
                          ? `${Math.ceil((new Date(subject.examDate).getTime() - Date.now()) / 86400000)} Days`
                          : 'Set Date'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.subjectName, { color: c.onSurface }]} numberOfLines={2}>
                    {subject.name}
                  </Text>
                  <Text style={[styles.subjectTag, { color: c.onSurface + '55' }]}>
                    {subject.professor || 'No professor set'}
                  </Text>
                </TouchableOpacity>
              );
            }) : (
              <TouchableOpacity
                style={[styles.emptyCard, { backgroundColor: c.surfaceContainerLow, borderColor: c.outlineVariant + '50' }]}
                onPress={() => router.push('/subjects/add')}
              >
                <Ionicons name="add-circle-outline" size={36} color={c.primary + '80'} />
                <Text style={[styles.emptyCardText, { color: c.onSurface + '50' }]}>Add your first subject</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* ── Today's Plan ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: c.onSurface + '60' }]}>TODAY'S PLAN</Text>
          {[
            { icon: 'book', iconBg: c.primary + '18', iconColor: c.primary, tag: 'Thermodynamics', tagBg: c.primary + '25', tagColor: c.primary, time: '09:00 — 10:30 AM', topic: 'Entropy & Second Law', btnLabel: 'Start', btnBg: c.primary, btnColor: c.onPrimary },
            { icon: 'code-slash', iconBg: c.tertiary + '18', iconColor: c.tertiary, tag: 'Neural Networks', tagBg: c.tertiary + '25', tagColor: c.tertiary, time: '1:00 — 3:00 PM', topic: 'Backpropagation Theory', btnLabel: 'Queue', btnBg: 'rgba(128,128,128,0.12)', btnColor: c.onSurface + '80' },
          ].map((item, i) => (
            <View key={i} style={[styles.planCard, { backgroundColor: c.surfaceContainerHigh + '60' }]}>
              <View style={[styles.planIconWrap, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.planMeta}>
                  <Text style={[styles.planSubjectTag, { backgroundColor: item.tagBg, color: item.tagColor }]}>{item.tag}</Text>
                  <Text style={[styles.planTime, { color: c.onSurface + '50' }]}>{item.time}</Text>
                </View>
                <Text style={[styles.planTopic, { color: c.onSurface }]}>{item.topic}</Text>
              </View>
              <TouchableOpacity style={[styles.startBtn, { backgroundColor: item.btnBg }]}>
                <Text style={[styles.startBtnText, { color: item.btnColor }]}>{item.btnLabel}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ── Streak + Heatmap bento ── */}
        <View style={styles.bentoRow}>
          <View style={[styles.streakCard, { backgroundColor: c.primaryContainer }]}>
            <View style={styles.streakTopRow}>
              <View style={styles.streakIconWrap}>
                <Ionicons name="flame" size={22} color="#fff" />
              </View>
              <Text style={styles.streakLabel}>MOMENTUM</Text>
            </View>
            <Text style={styles.streakValue}>7 Day</Text>
            <Text style={styles.streakSub}>Study streak maintained. Keep it up!</Text>
          </View>

          <View style={[styles.heatmapCard, { backgroundColor: c.surfaceContainerLow }]}>
            <View style={styles.heatmapHeader}>
              <Text style={[styles.sectionLabel, { color: c.onSurface + '60' }]}>STUDY ACTIVITY</Text>
              <Text style={[styles.heatmapPeriod, { color: c.onSurface + '40' }]}>Past 3 Months</Text>
            </View>
            <View style={styles.heatmapGrid}>
              {HEAT_DATA.map((intensity, i) => (
                <View key={i} style={[styles.heatCell, { backgroundColor: c.primary, opacity: intensity }]} />
              ))}
            </View>
            <View style={styles.heatLegend}>
              <View style={[styles.heatCell, { backgroundColor: c.primary, opacity: 0.1 }]} />
              <Text style={[styles.heatLegendText, { color: c.onSurface + '50' }]}>Low</Text>
              <View style={[styles.heatCell, { backgroundColor: c.primary, opacity: 0.9, marginLeft: 12 }]} />
              <Text style={[styles.heatLegendText, { color: c.onSurface + '50' }]}>High</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* FAB */}
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
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  semester: { fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  greeting: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  focusTasks: { fontSize: 13, marginTop: 4 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },

  section: { marginTop: 24, paddingHorizontal: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  viewAll: { fontSize: 12, fontWeight: '600' },

  subjectCard: { width: 200, borderRadius: 24, padding: 20, marginRight: 14, overflow: 'hidden', justifyContent: 'space-between', minHeight: 160 },
  subjectGlow: { position: 'absolute', top: 0, right: 0, width: 100, height: 100, borderRadius: 50 },
  subjectCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, zIndex: 1 },
  ringBg: { width: 44, height: 44, borderRadius: 22, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  ringText: { fontSize: 9, fontWeight: '800' },
  daysBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999 },
  daysBadgeText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  subjectName: { fontSize: 16, fontWeight: '700', lineHeight: 20 },
  subjectTag: { fontSize: 11, marginTop: 4 },

  emptyCard: { width: 200, height: 160, borderRadius: 24, borderStyle: 'dashed', borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  emptyCardText: { fontSize: 12, marginTop: 10, textAlign: 'center' },

  planCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12 },
  planIconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  planMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  planSubjectTag: { fontSize: 9, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, textTransform: 'uppercase', marginRight: 8 },
  planTime: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  planTopic: { fontSize: 15, fontWeight: '700' },
  startBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999, marginLeft: 8 },
  startBtnText: { fontWeight: '800', fontSize: 12 },

  bentoRow: { flexDirection: 'row', paddingHorizontal: 24, marginTop: 24, gap: 14 },
  streakCard: { flex: 1, borderRadius: 24, padding: 20, justifyContent: 'space-between', minHeight: 160 },
  streakTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  streakIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  streakLabel: { fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: 2 },
  streakValue: { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  streakSub: { fontSize: 11, color: 'rgba(255,255,255,0.85)', lineHeight: 16 },

  heatmapCard: { flex: 1.2, borderRadius: 24, padding: 16, minHeight: 160 },
  heatmapHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  heatmapPeriod: { fontSize: 9, fontWeight: '600' },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  heatCell: { width: 10, height: 10, borderRadius: 2 },
  heatLegend: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  heatLegendText: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', marginHorizontal: 4 },

  fab: { position: 'absolute', bottom: 90, right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#a0caff', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10 },
});
