import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={c.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: c.onSurface }]}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: c.surfaceContainerLow, borderColor: c.outlineVariant + '30' }]}>
          
          <SettingRow 
            icon="sunny-outline" 
            title="Daily Morning Brief" 
            desc="Get a summary of what you need to study today at 8:00 AM."
            value={dailyCheckin}
            onToggle={setDailyCheckin}
            c={c}
          />
          
          <SettingRow 
            icon="school-outline" 
            title="Quiz Reminders" 
            desc="Notifications to take practice quizzes for upcoming topics."
            value={quizReminders}
            onToggle={setQuizReminders}
            c={c}
          />

          <SettingRow 
            icon="hourglass-outline" 
            title="Exam Countdowns" 
            desc="Weekly alerts on how many days are left until your exams."
            value={examCountdowns}
            onToggle={setExamCountdowns}
            c={c}
          />
          
          <SettingRow 
            icon="alert-circle-outline" 
            title="Overdue Alerts" 
            desc="Get notified when you miss scheduled study blocks."
            value={overdueAlerts}
            onToggle={setOverdueAlerts}
            c={c}
            isLast
          />

        </View>

        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: c.primary }]} onPress={() => router.back()}>
          <Text style={styles.saveBtnText}>Save Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ icon, title, desc, value, onToggle, c, isLast = false }: any) {
  return (
    <View style={[styles.settingRow, !isLast && { borderBottomWidth: 1, borderBottomColor: c.outlineVariant + '20' }]}>
      <View style={[styles.settingIcon, { backgroundColor: c.primaryContainer }]}>
        <Ionicons name={icon} size={20} color={c.primary} />
      </View>
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, { color: c.onSurface }]}>{title}</Text>
        <Text style={[styles.settingDesc, { color: c.onSurface + '70' }]}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: c.outlineVariant, true: c.primary }}
        thumbColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontWeight: '800' },
  content: { padding: 20 },
  card: { borderRadius: 24, borderWidth: 1, paddingHorizontal: 16, marginBottom: 32 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20 },
  settingIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  settingText: { flex: 1, marginRight: 16 },
  settingTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  settingDesc: { fontSize: 13, lineHeight: 18 },
  saveBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
