import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSubjects } from '../../../src/hooks/useSubjects';
import { InputField } from '../../../src/components/common/InputField';
import { colors } from '../../../src/utils/colors';
import { Ionicons } from '@expo/vector-icons';

export default function AddSubjectScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;
  const { addSubject, updateSubject, subjects } = useSubjects();
  
  const [form, setForm] = useState({
    name: '',
    code: '',
    professor: '',
    creditHours: '',
    examDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const subject = subjects.find(s => s._id === id);
      if (subject) {
        setForm({
          name: subject.name,
          code: subject.code,
          professor: subject.professor || '',
          creditHours: subject.creditHours?.toString() || '',
          examDate: subject.examDate ? new Date(subject.examDate).toISOString().split('T')[0] : '',
        });
      }
    }
  }, [id, isEditing, subjects]);

  const handleSubmit = async () => {
    if (!form.name || !form.code || !form.creditHours) {
      Alert.alert('Error', 'Please fill all required fields (Name, Code, Credits)');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        code: form.code,
        professor: form.professor,
        creditHours: parseInt(form.creditHours, 10) || 3,
        examDate: form.examDate || new Date().toISOString(),
      };

      if (isEditing) {
        await updateSubject(id as string, payload);
        Alert.alert('Success', 'Subject updated successfully');
      } else {
        await addSubject(payload);
        Alert.alert('Success', 'Subject added successfully');
      }
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} subject`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Subject' : 'Add New Subject'}</Text>
      </View>

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
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{isEditing ? 'Save Changes' : 'Add Subject'}</Text>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backBtn: {
    marginRight: 16,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
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
