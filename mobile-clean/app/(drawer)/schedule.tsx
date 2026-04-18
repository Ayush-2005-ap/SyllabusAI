import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../src/utils/colors';
import { Ionicons } from '@expo/vector-icons';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MOCK_BLOCKS = [
  { id: '1', subject: 'Advanced Thermodynamics', topic: 'Entropy & Second Law', time: '09:00 AM — 10:30 AM', type: 'study', color: colors.primary },
  { id: '2', subject: 'Neurobiology Foundations', topic: 'Synaptic Plasticity & Memory', time: '11:00 AM — 12:30 PM', type: 'revision', color: colors.tertiary },
  { id: '3', subject: 'Organic Chemistry Lab', topic: 'Synthesis of Salicylic Acid', time: '02:00 PM — 03:30 PM', type: 'study', color: colors.primary },
];

export default function ScheduleScreen() {
  const [selectedDay, setSelectedDay] = useState('Thu');
  const [showConfidence, setShowConfidence] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const handleComplete = (id: string) => {
    setSelectedBlock(id);
    setShowConfidence(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.semester}>AUTUMN TERM • WEEK 8</Text>
        <Text style={styles.title}>Schedule</Text>
      </View>

      {/* Week strip */}
      <View style={styles.weekStrip}>
        {DAYS.map(day => (
          <TouchableOpacity
            key={day}
            onPress={() => setSelectedDay(day)}
            style={[styles.dayBtn, selectedDay === day && styles.dayBtnActive]}
          >
            <Text style={[styles.dayText, selectedDay === day && styles.dayTextActive]}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Study blocks */}
      <FlatList
        data={MOCK_BLOCKS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.blockCard}>
            <View style={[styles.blockAccent, { backgroundColor: item.color }]} />
            <View style={styles.blockContent}>
              <View style={styles.blockMeta}>
                <Text style={[styles.blockSubject, { color: item.color }]}>{item.subject}</Text>
                <Text style={styles.blockTime}>{item.time}</Text>
              </View>
              <Text style={styles.blockTopic}>{item.topic}</Text>
            </View>
            <TouchableOpacity
              style={styles.completeBtn}
              onPress={() => handleComplete(item.id)}
            >
              <Ionicons name="checkmark-circle-outline" size={30} color={colors.outlineVariant} />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Confidence Modal */}
      {showConfidence && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Session Complete! 🎉</Text>
            <Text style={styles.modalSub}>
              How confident are you with the{'\n'}topics discussed today?
            </Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map(n => (
                <TouchableOpacity
                  key={n}
                  style={styles.ratingBtn}
                  onPress={() => setShowConfidence(false)}
                >
                  <Text style={styles.ratingNum}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.ratingLabels}>
              <Text style={styles.ratingLabelText}>Not at all</Text>
              <Text style={styles.ratingLabelText}>Fully confident</Text>
            </View>
            <TouchableOpacity onPress={() => setShowConfidence(false)} style={styles.skipRating}>
              <Text style={styles.skipRatingText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{ height: 90 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  semester: { fontSize: 10, fontWeight: '700', color: colors.primary, letterSpacing: 2, marginBottom: 4 },
  title: { fontSize: 30, fontWeight: '900', color: colors.onSurface, letterSpacing: -0.5 },

  weekStrip: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: colors.outlineVariant + '30',
    marginBottom: 8,
  },
  dayBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9999 },
  dayBtnActive: { backgroundColor: colors.primaryContainer },
  dayText: { fontSize: 13, fontWeight: '700', color: colors.onSurface + '60' },
  dayTextActive: { color: '#fff' },

  list: { paddingHorizontal: 20, paddingTop: 12 },
  blockCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerHigh + '50',
    borderRadius: 20,
    marginBottom: 14,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  blockAccent: { width: 4, alignSelf: 'stretch' },
  blockContent: { flex: 1, padding: 18 },
  blockMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  blockSubject: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  blockTime: { fontSize: 10, color: colors.onSurface + '50', fontWeight: '600' },
  blockTopic: { fontSize: 17, fontWeight: '700', color: colors.onSurface },
  completeBtn: { padding: 18, borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.06)' },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  modal: {
    backgroundColor: colors.surfaceContainer,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    paddingBottom: 48,
  },
  modalTitle: { fontSize: 22, fontWeight: '900', color: colors.onSurface, textAlign: 'center', marginBottom: 8 },
  modalSub: { fontSize: 14, color: colors.onSurface + '70', textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  ratingBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.outlineVariant + '40',
  },
  ratingNum: { fontSize: 18, fontWeight: '800', color: colors.onSurface },
  ratingLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  ratingLabelText: { fontSize: 9, color: colors.onSurface + '50', fontWeight: '700', letterSpacing: 0.5 },
  skipRating: { alignSelf: 'center' },
  skipRatingText: { color: colors.primary, fontSize: 13, fontWeight: '700' },
});
