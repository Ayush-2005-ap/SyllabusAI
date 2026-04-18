import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/utils/colors';
import { useSubjects } from '../../../src/hooks/useSubjects';
import { Badge } from '../../../src/components/common/Badge';

const TABS = ['Topics', 'PYQ Analysis', 'Schedule', 'Quiz'];

export default function SubjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const { subjects, fetchTopics, topics } = useSubjects();
  const [activeTab, setActiveTab] = useState('Topics');
  const router = useRouter();

  const subject = subjects.find(s => s._id === id);
  const subjectTopics = topics[id as string] || [];

  useEffect(() => {
    if (id) fetchTopics(id as string);
  }, [id, fetchTopics]);

  if (!subject) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Subject not found</Text>
      </View>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Topics':
        return (
          <View style={styles.tabContent}>
            {subjectTopics.length > 0 ? (
              subjectTopics.map((topic, index) => (
                <View key={topic._id || index} style={styles.topicItem}>
                  <View style={styles.topicInfo}>
                    <Text style={styles.topicName}>{topic.name}</Text>
                    <View style={styles.topicMeta}>
                      <Badge label={topic.difficulty} type={topic.difficulty === 'Hard' ? 'danger' : 'success'} />
                      <Text style={styles.topicHours}>{topic.estimatedHours}h estimated</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.topicAction}>
                    <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No topics extracted yet</Text>
                <TouchableOpacity style={styles.uploadBtn}>
                  <Text style={styles.uploadBtnText}>Upload Syllabus PDF</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      case 'PYQ Analysis':
        return (
          <View style={styles.tabContent}>
            <View style={styles.analysisCard}>
              <Text style={styles.analysisTitle}>Frequency vs Probability</Text>
              <Text style={styles.analysisDesc}>Upload past year questions to see which topics are most likely to appear in your exam.</Text>
              <TouchableOpacity style={styles.uploadBtn}>
                <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.uploadBtnText}>Upload PYQ Papers</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.center}>
            <Text style={{ color: colors.textSecondary }}>Coming Soon</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.subjectCode}>{subject.code}</Text>
          <Text style={styles.subjectName}>{subject.name}</Text>
        </View>
      </View>

      {/* Hero Stats */}
      <View style={styles.heroStats}>
        <View style={styles.heroStat}>
          <Text style={styles.heroValue}>{subject.completedTopics}/{subject.totalTopics}</Text>
          <Text style={styles.heroLabel}>Topics Done</Text>
        </View>
        <View style={[styles.heroStat, styles.heroDivider]}>
          <Text style={styles.heroValue}>82%</Text>
          <Text style={styles.heroLabel}>Confidence</Text>
        </View>
        <View style={styles.heroStat}>
          <Text style={styles.heroValue}>12</Text>
          <Text style={styles.heroLabel}>Days Left</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {TABS.map(tab => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backBtn: {
    marginRight: 16,
    padding: 4,
  },
  subjectCode: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subjectName: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
  },
  heroDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.cardBorder,
  },
  heroValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  heroLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  tabsContainer: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  tabsScroll: {
    paddingHorizontal: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  topicItem: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  topicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicHours: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 10,
  },
  topicAction: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 20,
  },
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  analysisCard: {
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  analysisTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  analysisDesc: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  }
});
