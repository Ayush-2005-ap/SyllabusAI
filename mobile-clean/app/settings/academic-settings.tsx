import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/hooks/useColors';
import { useAppContext } from '../../src/hooks/useAppContext';

export default function AcademicSettingsScreen() {
  const router = useRouter();
  const c = useColors();
  const { settings, updateSettings } = useAppContext();
  
  const [targetGpa, setTargetGpa] = useState(settings.targetGpa);
  const [dailyHours, setDailyHours] = useState(settings.dailyHours);
  const [semesterWeeks, setSemesterWeeks] = useState(settings.semesterWeeks);

  useEffect(() => {
    setTargetGpa(settings.targetGpa);
    setDailyHours(settings.dailyHours);
    setSemesterWeeks(settings.semesterWeeks);
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings({
        targetGpa,
        dailyHours,
        semesterWeeks
      });
      Alert.alert('Success', 'Settings updated successfully.');
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save settings.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.surfaceContainerHigh }]}>
          <Ionicons name="chevron-back" size={24} color={c.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: c.onSurface }]}>Academic Setup</Text>
        <TouchableOpacity 
          style={[styles.saveBtnTop, { backgroundColor: c.primaryContainer }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveBtnTextTop, { color: c.onPrimaryContainer }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroSection}>
            <View style={[styles.heroIconWrap, { backgroundColor: c.primary + '15' }]}>
              <Ionicons name="school" size={40} color={c.primary} />
            </View>
            <Text style={[styles.heroTitle, { color: c.onSurface }]}>Define Your Goals</Text>
            <Text style={[styles.heroDesc, { color: c.onSurface + '60' }]}>
              Customize how SyllabusAI calculates your study blocks and predicted grades.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: c.primary }]}>CORE TARGETS</Text>
            
            <SettingInput
              icon="star"
              label="Target GPA"
              desc="Your desired GPA for this semester"
              value={targetGpa}
              onChangeText={setTargetGpa}
              keyboardType="decimal-pad"
              c={c}
            />

            <SettingInput
              icon="time"
              label="Daily Study Hours"
              desc="Time allocated for auto-scheduling"
              value={dailyHours}
              onChangeText={setDailyHours}
              keyboardType="number-pad"
              c={c}
              isLast
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: c.primary }]}>TIMELINE</Text>
            
            <SettingInput
              icon="calendar"
              label="Semester Length"
              desc="Total weeks in your current term"
              value={semesterWeeks}
              onChangeText={setSemesterWeeks}
              keyboardType="number-pad"
              c={c}
              isLast
            />
          </View>

          <View style={[styles.infoBox, { backgroundColor: c.tertiaryContainer + '20', borderColor: c.tertiary + '30' }]}>
            <Ionicons name="information-circle" size={20} color={c.tertiary} />
            <Text style={[styles.infoText, { color: c.onTertiaryContainer }]}>
              These values help our AI optimize your study momentum. You can change them anytime.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.mainSaveBtn, { backgroundColor: c.primary }]} 
            onPress={handleSave}
          >
            <Text style={styles.mainSaveBtnText}>Confirm Changes</Text>
          </TouchableOpacity>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SettingInput({ icon, label, desc, value, onChangeText, keyboardType, c, isLast = false }: any) {
  return (
    <View style={[styles.settingItem, !isLast && { borderBottomWidth: 1, borderBottomColor: c.outlineVariant + '20' }]}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: c.surfaceContainerHighest }]}>
          <Ionicons name={icon} size={18} color={c.primary} />
        </View>
        <View style={styles.settingTextWrap}>
          <Text style={[styles.settingLabel, { color: c.onSurface }]}>{label}</Text>
          <Text style={[styles.settingDesc, { color: c.onSurface + '50' }]}>{desc}</Text>
        </View>
      </View>
      <TextInput
        style={[styles.input, { color: c.onSurface, backgroundColor: c.surfaceContainerLow, borderColor: c.outlineVariant + '40' }]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder="0"
        placeholderTextColor={c.onSurface + '30'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '800' },
  saveBtnTop: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  saveBtnTextTop: { fontSize: 14, fontWeight: '700' },
  
  content: { padding: 24 },
  heroSection: { alignItems: 'center', marginBottom: 32 },
  heroIconWrap: { width: 80, height: 80, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 24, fontWeight: '900', marginBottom: 8 },
  heroDesc: { textAlign: 'center', fontSize: 14, lineHeight: 22, paddingHorizontal: 20 },
  
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase' },
  
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  settingTextWrap: { flex: 1, marginRight: 10 },
  settingLabel: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  settingDesc: { fontSize: 12 },
  
  input: { width: 70, height: 44, borderRadius: 12, borderWidth: 1, textAlign: 'center', fontSize: 16, fontWeight: '800' },
  
  infoBox: { flexDirection: 'row', padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'flex-start', marginBottom: 32 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 18, marginLeft: 12 },
  
  mainSaveBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  mainSaveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
