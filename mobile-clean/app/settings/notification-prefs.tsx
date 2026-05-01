import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/hooks/useColors';

export default function NotificationPrefsScreen() {
  const router = useRouter();
  const c = useColors();
  
  const [dailyCheckin, setDailyCheckin] = useState(true);
  const [quizReminders, setQuizReminders] = useState(true);
  const [examCountdowns, setExamCountdowns] = useState(true);
  const [overdueAlerts, setOverdueAlerts] = useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.surfaceContainerHigh }]}>
          <Ionicons name="chevron-back" size={24} color={c.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: c.onSurface }]}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={[styles.heroIconWrap, { backgroundColor: c.primary + '15' }]}>
            <Ionicons name="notifications-outline" size={40} color={c.primary} />
          </View>
          <Text style={[styles.heroTitle, { color: c.onSurface }]}>Stay Informed</Text>
          <Text style={[styles.heroDesc, { color: c.onSurface + '60' }]}>
            Control when and how SyllabusAI sends you study reminders and exam alerts.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: c.primary }]}>CORE REMINDERS</Text>
          <View style={[styles.card, { backgroundColor: c.surfaceContainerLow, borderColor: c.outlineVariant + '30' }]}>
            <SettingRow 
              icon="sunny" 
              title="Daily Morning Brief" 
              desc="Summary of your study day at 8:00 AM."
              value={dailyCheckin}
              onToggle={setDailyCheckin}
              c={c}
            />
            
            <SettingRow 
              icon="school" 
              title="Quiz Reminders" 
              desc="Alerts for practice quizzes."
              value={quizReminders}
              onToggle={setQuizReminders}
              c={c}
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: c.primary }]}>ALERTS & URGENCY</Text>
          <View style={[styles.card, { backgroundColor: c.surfaceContainerLow, borderColor: c.outlineVariant + '30' }]}>
            <SettingRow 
              icon="hourglass" 
              title="Exam Countdowns" 
              desc="Weekly alerts for upcoming exams."
              value={examCountdowns}
              onToggle={setExamCountdowns}
              c={c}
            />
            
            <SettingRow 
              icon="alert-circle" 
              title="Overdue Alerts" 
              desc="Notifications for missed study blocks."
              value={overdueAlerts}
              onToggle={setOverdueAlerts}
              c={c}
              isLast
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.mainSaveBtn, { backgroundColor: c.primary }]} 
          onPress={() => router.back()}
        >
          <Text style={styles.mainSaveBtnText}>Save Preferences</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ icon, title, desc, value, onToggle, c, isLast = false }: any) {
  return (
    <View style={[styles.settingRow, !isLast && { borderBottomWidth: 1, borderBottomColor: c.outlineVariant + '20' }]}>
      <View style={[styles.settingIcon, { backgroundColor: c.surfaceContainerHighest }]}>
        <Ionicons name={icon} size={18} color={c.primary} />
      </View>
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, { color: c.onSurface }]}>{title}</Text>
        <Text style={[styles.settingDesc, { color: c.onSurface + '50' }]}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: c.outlineVariant, true: c.primary }}
        thumbColor="#fff"
        ios_backgroundColor={c.outlineVariant + '40'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '800' },
  
  content: { padding: 24 },
  heroSection: { alignItems: 'center', marginBottom: 32 },
  heroIconWrap: { width: 80, height: 80, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 24, fontWeight: '900', marginBottom: 8 },
  heroDesc: { textAlign: 'center', fontSize: 14, lineHeight: 22, paddingHorizontal: 20 },
  
  section: { marginBottom: 32 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase' },
  card: { borderRadius: 24, borderWidth: 1, paddingHorizontal: 16 },
  
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20 },
  settingIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  settingText: { flex: 1, marginRight: 16 },
  settingTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  settingDesc: { fontSize: 12, lineHeight: 18 },
  
  mainSaveBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  mainSaveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
