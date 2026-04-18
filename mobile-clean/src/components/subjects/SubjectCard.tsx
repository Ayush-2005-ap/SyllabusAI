import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Subject } from '../../types/subject.types';
import { colors } from '../../utils/colors';
import { Ionicons } from '@expo/vector-icons';

interface SubjectCardProps {
  subject: Subject;
  onPress: () => void;
}

export const SubjectCard = React.memo(({ subject, onPress }: SubjectCardProps) => {
  const pct = subject.totalTopics
    ? Math.round((subject.completedTopics || 0) / subject.totalTopics * 100)
    : 0;
  const urgency = pct > 70 ? colors.error : pct > 40 ? colors.tertiary : colors.primary;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.glow, { backgroundColor: urgency + '15' }]} />

      {/* Top row: ring + days badge */}
      <View style={styles.topRow}>
        <View style={[styles.ring, { borderColor: colors.surfaceContainerHighest }]}>
          <Text style={[styles.ringText, { color: urgency }]}>{pct}%</Text>
        </View>
        {subject.examDate && (
          <View style={[styles.daysBadge, { backgroundColor: urgency + '25' }]}>
            <Text style={[styles.daysText, { color: urgency }]}>
              {Math.max(0, Math.ceil((new Date(subject.examDate).getTime() - Date.now()) / 86400000))} Days
            </Text>
          </View>
        )}
      </View>

      {/* Title + Prof */}
      <Text style={styles.title} numberOfLines={2}>{subject.name}</Text>
      <Text style={styles.prof}>{subject.professor || subject.code}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
    overflow: 'hidden',
    minHeight: 150,
    justifyContent: 'space-between',
  },
  glow: {
    position: 'absolute', top: 0, right: 0,
    width: 100, height: 100, borderRadius: 50,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    zIndex: 1,
  },
  ring: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 3,
    alignItems: 'center', justifyContent: 'center',
  },
  ringText: { fontSize: 9, fontWeight: '900' },
  daysBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999 },
  daysText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  title: { fontSize: 18, fontWeight: '800', color: colors.onSurface, lineHeight: 22, marginBottom: 4 },
  prof: { fontSize: 12, color: colors.primary, fontWeight: '500' },
});
