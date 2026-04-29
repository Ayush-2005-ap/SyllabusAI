import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/hooks/useColors';

export default function AcademicSettingsScreen() {
  const router = useRouter();
  const c = useColors();
  
  const [targetGpa, setTargetGpa] = useState('3.8');
  const [dailyHours, setDailyHours] = useState('4');
  const [semesterWeeks, setSemesterWeeks] = useState('16');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={c.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: c.onSurface }]}>Academic Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={[styles.section, { backgroundColor: c.surfaceContainerLow, borderColor: c.outlineVariant + '30' }]}>
          <Text style={[styles.sectionTitle, { color: c.onSurface + '80' }]}>GOALS</Text>
          
          <View style={[styles.inputRow, { borderBottomColor: c.outlineVariant + '20' }]}>
            <View>
              <Text style={[styles.inputLabel, { color: c.onSurface }]}>Target GPA</Text>
              <Text style={[styles.inputDesc, { color: c.onSurface + '60' }]}>What are you aiming for?</Text>
            </View>
            <TextInput 
              style={[styles.input, { color: c.onSurface, backgroundColor: c.surfaceContainerHigh }]} 
              value={targetGpa}
              onChangeText={setTargetGpa}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.inputRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1, paddingRight: 16 }}>
              <Text style={[styles.inputLabel, { color: c.onSurface }]}>Default Study Hours</Text>
              <Text style={[styles.inputDesc, { color: c.onSurface + '60' }]}>Daily hours allocated to auto-scheduling</Text>
            </View>
            <TextInput 
              style={[styles.input, { color: c.onSurface, backgroundColor: c.surfaceContainerHigh }]} 
              value={dailyHours}
              onChangeText={setDailyHours}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: c.surfaceContainerLow, borderColor: c.outlineVariant + '30' }]}>
          <Text style={[styles.sectionTitle, { color: c.onSurface + '80' }]}>SEMESTER DETAILS</Text>
          
          <View style={[styles.inputRow, { borderBottomWidth: 0 }]}>
            <View>
              <Text style={[styles.inputLabel, { color: c.onSurface }]}>Semester Length</Text>
              <Text style={[styles.inputDesc, { color: c.onSurface + '60' }]}>Total weeks in current term</Text>
            </View>
            <TextInput 
              style={[styles.input, { color: c.onSurface, backgroundColor: c.surfaceContainerHigh }]} 
              value={semesterWeeks}
              onChangeText={setSemesterWeeks}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: c.primary }]} onPress={() => router.back()}>
          <Text style={styles.saveBtnText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontWeight: '800' },
  content: { padding: 20 },
  section: { padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 24 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  inputLabel: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  inputDesc: { fontSize: 12 },
  input: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, fontSize: 16, fontWeight: '700', minWidth: 80, textAlign: 'center' },
  saveBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
