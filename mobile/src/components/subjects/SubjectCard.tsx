import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Subject } from '../../types/subject.types';
import { colors } from '../../utils/colors';

interface SubjectCardProps {
  subject: Subject;
  onPress: () => void;
}

export const SubjectCard = React.memo(({ subject, onPress }: SubjectCardProps) => {
  const percentComplete = subject.totalTopics ? Math.round((subject.completedTopics || 0) / subject.totalTopics * 100) : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{subject.name}</Text>
          <Text style={styles.code}>{subject.code}</Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{percentComplete}%</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        {subject.professor && (
          <Text style={styles.detailText}>Prof: {subject.professor}</Text>
        )}
        <Text style={styles.detailText}>Credits: {subject.creditHours}</Text>
      </View>
      
      {subject.examDate && (
        <View style={styles.footer}>
          <Text style={styles.examText}>Exam: {new Date(subject.examDate).toLocaleDateString()}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  code: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  progressContainer: {
    backgroundColor: 'rgba(74, 144, 217, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  progressText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 12,
  },
  examText: {
    color: colors.warning,
    fontSize: 14,
    fontWeight: '500',
  },
});
