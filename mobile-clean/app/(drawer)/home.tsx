import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions, Svg
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/hooks/useAuth';
import { useSubjects } from '../../src/hooks/useSubjects';
import { colors } from '../../src/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// SVG circular progress ring
function CircularProgress({ percent, color }: { percent: number; color: string }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <View style={{ width: 48, height: 48, position: 'relative' }}>
      {/* We'll just do a simple View since SVG needs react-native-svg */}
      <View style={[styles.ringBg, { borderColor: colors.surfaceContainerHighest }]}>
        <Text style={[styles.ringText, { color }]}>{percent}%</Text>
      </View>
    </View>
  );
}

// Heatmap mini squares
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
  const router = useRouter();

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.semester}>Fall 2024 Semester</Text>
            <Text style={styles.greeting}>Good {getHour()}, {firstName}</Text>
            <Text style={styles.focusTasks}>You have {subjects.length || 0} active subjects.</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Active Subjects Horizontal Scroll ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>ACTIVE SUBJECTS</Text>
            <TouchableOpacity onPress={() => router.push('/subjects')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsScrollContent}
          >
            {subjects.length > 0 ? subjects.slice(0, 4).map((subject) => {
              const pct = subject.totalTopics
                ? Math.round((subject.completedTopics || 0) / subject.totalTopics * 100)
                : 0;
              const urgency = pct > 70 ? colors.error : pct > 40 ? colors.tertiary : colors.primary;
              return (
                <TouchableOpacity
                  key={subject._id}
                  style={styles.subjectCard}
                  onPress={() => router.push(`/subjects/${subject._id}`)}
                >
                  <View style={[styles.subjectGlow, { backgroundColor: urgency + '15' }]} />
                  <View style={styles.subjectCardTop}>
                    <View style={styles.ringBg}>
                      <Text style={[styles.ringText, { color: urgency }]}>{pct}%</Text>
                    </View>
                    <View style={[styles.daysBadge, { backgroundColor: urgency + '25' }]}>
                      <Text style={[styles.daysBadgeText, { color: urgency }]}>
                        {subject.examDate
                          ? `${Math.ceil((new Date(subject.examDate).getTime() - Date.now()) / 86400000)} Days`
                          : 'Set Date'
                        }
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.subjectName} numberOfLines={2}>{subject.name}</Text>
                    <Text style={styles.subjectTag}>{subject.professor || 'No professor set'}</Text>
                  </View>
                </TouchableOpacity>
              );
            }) : (
              <TouchableOpacity style={styles.emptyCard} onPress={() => router.push('/subjects/add')}>
                <Ionicons name="add-circle-outline" size={36} color={colors.primary + '80'} />
                <Text style={styles.emptyCardText}>Add your first subject</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* ── Today's Plan ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TODAY'S PLAN</Text>
          <View style={styles.planCard}>
            <View style={styles.planIconWrap}>
              <Ionicons name="book" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.planMeta}>
                <Text style={styles.planSubjectTag}>Thermodynamics</Text>
                <Text style={styles.planTime}>09:00 — 10:30 AM</Text>
              </View>
              <Text style={styles.planTopic}>Entropy & Second Law</Text>
            </View>
            <TouchableOpacity style={styles.startBtn}>
              <Text style={styles.startBtnText}>Start</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.planCard}>
            <View style={[styles.planIconWrap, { backgroundColor: colors.tertiary + '18' }]}>
              <Ionicons name="code-slash" size={22} color={colors.tertiary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.planMeta}>
                <Text style={[styles.planSubjectTag, { backgroundColor: colors.tertiary + '25', color: colors.tertiary }]}>Neural Networks</Text>
                <Text style={styles.planTime}>1:00 — 3:00 PM</Text>
              </View>
              <Text style={styles.planTopic}>Backpropagation Theory</Text>
            </View>
            <TouchableOpacity style={[styles.startBtn, { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }]}>
              <Text style={[styles.startBtnText, { color: colors.onSurface + '80' }]}>Queue</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Bottom bento: Streak + Heatmap ── */}
        <View style={styles.bentoRow}>
          {/* Streak */}
          <View style={styles.streakCard}>
            <View style={styles.streakTopRow}>
              <View style={styles.streakIconWrap}>
                <Ionicons name="flame" size={22} color="#fff" />
              </View>
              <Text style={styles.streakLabel}>MOMENTUM</Text>
            </View>
            <Text style={styles.streakValue}>7 Day</Text>
            <Text style={styles.streakSub}>Study streak maintained. Keep it up!</Text>
          </View>

          {/* Heatmap */}
          <View style={styles.heatmapCard}>
            <View style={styles.heatmapHeader}>
              <Text style={styles.sectionLabel}>STUDY ACTIVITY</Text>
              <Text style={styles.heatmapPeriod}>Past 3 Months</Text>
            </View>
            <View style={styles.heatmapGrid}>
              {HEAT_DATA.map((intensity, i) => (
                <View
                  key={i}
                  style={[styles.heatCell, { opacity: intensity }]}
                />
              ))}
            </View>
            <View style={styles.heatLegend}>
              <View style={[styles.heatCell, { opacity: 0.1 }]} />
              <Text style={styles.heatLegendText}>Low</Text>
              <View style={[styles.heatCell, { opacity: 0.9, marginLeft: 12 }]} />
              <Text style={styles.heatLegendText}>High</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/subjects/add')}>
        <Ionicons name="add" size={28} color={colors.onPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll:    { paddingBottom: 0 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  semester:    { fontSize: 10, fontWeight: '700', color: colors.primary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  greeting:    { fontSize: 28, fontWeight: '800', color: colors.onSurface, letterSpacing: -0.5 },
  focusTasks:  { fontSize: 13, color: colors.onSurface + '60', marginTop: 4 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },

  section:       { marginTop: 24, paddingHorizontal: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionLabel:  { fontSize: 10, fontWeight: '700', color: colors.onSurface + '60', letterSpacing: 2 },
  viewAll:       { fontSize: 12, fontWeight: '600', color: colors.primary },

  cardsScrollContent: { paddingRight: 24 },
  subjectCard: {
    width: 200,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 24,
    padding: 20,
    marginRight: 14,
    overflow: 'hidden',
    justifyContent: 'space-between',
    minHeight: 160,
  },
  subjectGlow: {
    position: 'absolute', top: 0, right: 0,
    width: 100, height: 100, borderRadius: 50,
  },
  subjectCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, zIndex: 1 },
  ringBg: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 3, borderColor: colors.surfaceContainerHighest,
    alignItems: 'center', justifyContent: 'center',
  },
  ringText:    { fontSize: 9, fontWeight: '800', color: colors.primary },
  daysBadge:   { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999 },
  daysBadgeText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  subjectName: { fontSize: 16, fontWeight: '700', color: colors.onSurface, lineHeight: 20 },
  subjectTag:  { fontSize: 11, color: colors.onSurface + '55', marginTop: 4 },

  emptyCard: {
    width: 200, height: 160,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 24, borderStyle: 'dashed',
    borderWidth: 2, borderColor: colors.outlineVariant + '50',
    alignItems: 'center', justifyContent: 'center',
  },
  emptyCardText: { color: colors.onSurface + '50', fontSize: 12, marginTop: 10, textAlign: 'center' },

  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHigh + '60',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  planIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primary + '18',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  planMeta:       { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  planSubjectTag: { fontSize: 9, fontWeight: '700', backgroundColor: colors.primary + '25', color: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, textTransform: 'uppercase', marginRight: 8 },
  planTime:       { fontSize: 10, color: colors.onSurface + '50', fontWeight: '700', letterSpacing: 0.5 },
  planTopic:      { fontSize: 15, fontWeight: '700', color: colors.onSurface },
  startBtn:       { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999, marginLeft: 8 },
  startBtnText:   { color: colors.onPrimary, fontWeight: '800', fontSize: 12 },

  bentoRow: { flexDirection: 'row', paddingHorizontal: 24, marginTop: 24, gap: 14 },
  streakCard: {
    flex: 1,
    backgroundColor: colors.primaryContainer,
    borderRadius: 24, padding: 20,
    justifyContent: 'space-between',
    minHeight: 160,
  },
  streakTopRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  streakIconWrap:{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  streakLabel:   { fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: 2 },
  streakValue:   { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  streakSub:     { fontSize: 11, color: 'rgba(255,255,255,0.8)', lineHeight: 16 },

  heatmapCard: {
    flex: 1.2,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 24, padding: 16,
    minHeight: 160,
  },
  heatmapHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  heatmapPeriod: { fontSize: 9, color: colors.onSurface + '40', fontWeight: '600' },
  heatmapGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  heatCell:      { width: 10, height: 10, borderRadius: 2, backgroundColor: colors.primary },
  heatLegend:    { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  heatLegendText:{ fontSize: 9, color: colors.onSurface + '50', fontWeight: '700', textTransform: 'uppercase', marginHorizontal: 4 },

  fab: {
    position: 'absolute', bottom: 90, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 10,
  },
});
