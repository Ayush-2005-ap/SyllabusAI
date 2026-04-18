import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSubjects } from '../../../src/hooks/useSubjects';
import { InputField } from '../../../src/components/common/InputField';
import { colors } from '../../../src/utils/colors';

export default function AddSubjectScreen() {
  const router = useRouter();
  const { addSubject } = useSubjects();
  
  const [form, setForm] = useState({
    name: '',
    code: '',
    professor: '',
    creditHours: '',
    examDate: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.code || !form.creditHours) {
      Alert.alert('Error', 'Please fill all required fields (Name, Code, Credits)');
      return;
    }

    setLoading(true);
    try {
      await addSubject({
        name: form.name,
        code: form.code,
        professor: form.professor,
        creditHours: parseInt(form.creditHours, 10) || 3,
        examDate: form.examDate || new Date().toISOString(),
      });
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to add subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <InputField
          label="Subject Name *"
          placeholder="e.g. Advanced Algorithms"
          value={form.name}
          onChangeText={(v) => setForm({...form, name: v})}
        />
        <InputField
          label="Course Code *"
          placeholder="e.g. CS401"
          value={form.code}
          onChangeText={(v) => setForm({...form, code: v})}
        />
        <InputField
          label="Professor"
          placeholder="e.g. Dr. Smith"
          value={form.professor}
          onChangeText={(v) => setForm({...form, professor: v})}
        />
        <InputField
          label="Credit Hours *"
          placeholder="e.g. 3"
          keyboardType="numeric"
          value={form.creditHours}
          onChangeText={(v) => setForm({...form, creditHours: v})}
        />
        <InputField
          label="Exam Date"
          placeholder="YYYY-MM-DD"
          value={form.examDate}
          onChangeText={(v) => setForm({...form, examDate: v})}
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Adding...' : 'Add Subject'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
