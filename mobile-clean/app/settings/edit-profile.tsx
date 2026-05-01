import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/hooks/useAuth';
import { useTheme } from '../../src/context/ThemeContext';
import { darkColors, lightColors } from '../../src/utils/colors';

const UNIVERSITY_OPTIONS = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur',
  'BITS Pilani', 'NIT Trichy', 'DTU Delhi', 'VIT Vellore', 'Other',
];

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const c = isDark ? darkColors : lightColors;
  const styles = makeStyles(c);

  const [name, setName] = useState(user?.name || '');
  const [university, setUniversity] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    setSaving(true);
    // TODO: connect to PATCH /api/auth/profile
    setTimeout(() => {
      setSaving(false);
      Alert.alert('Saved!', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={c.onSurface} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Edit Profile</Text>
          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* ── Avatar Section ── */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{name.charAt(0)?.toUpperCase() || 'A'}</Text>
              <View style={styles.avatarOverlay}>
                <Ionicons name="camera" size={24} color="#fff" />
                <Text style={styles.avatarOverlayText}>Change Photo</Text>
              </View>
            </View>
            <Text style={styles.avatarHint}>Tap to change profile photo</Text>
          </View>

          {/* ── Fields ── */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>PERSONAL INFO</Text>

            <Field
              label="FULL NAME"
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              c={c}
            />

            <Field
              label="EMAIL"
              value={user?.email || ''}
              onChangeText={() => {}}
              placeholder="your@email.com"
              editable={false}
              note="Email cannot be changed"
              c={c}
            />

            <Field
              label="UNIVERSITY / INSTITUTION"
              value={university}
              onChangeText={setUniversity}
              placeholder="e.g. IIT Bombay"
              c={c}
            />

            <Field
              label="COURSE / PROGRAM"
              value={course}
              onChangeText={setCourse}
              placeholder="e.g. B.Tech Computer Science"
              c={c}
            />

            <Field
              label="ACADEMIC YEAR"
              value={year}
              onChangeText={setYear}
              placeholder="e.g. 3rd Year"
              c={c}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>ABOUT YOU</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>BIO</Text>
              <TextInput
                style={[styles.input, styles.textArea, { color: c.onSurface, borderColor: c.outlineVariant + '60' }]}
                placeholder="Write a short bio..."
                placeholderTextColor={c.onSurface + '40'}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* ── Academic Preferences ── */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>ACADEMIC PREFERENCES</Text>

            <View style={styles.chipSection}>
              <Text style={styles.fieldLabel}>STUDY STYLE</Text>
              <View style={styles.chipRow}>
                {['Socratic', 'Direct', 'Collaborative', 'Self-paced'].map(opt => (
                  <TouchableOpacity key={opt} style={styles.chip}>
                    <Text style={styles.chipText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.chipSection}>
              <Text style={styles.fieldLabel}>DAILY STUDY GOAL</Text>
              <View style={styles.chipRow}>
                {['1h', '2h', '3h', '4h', '5h+'].map(opt => (
                  <TouchableOpacity key={opt} style={styles.chip}>
                    <Text style={styles.chipText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label, value, onChangeText, placeholder, editable = true, note, c
}: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder: string; editable?: boolean; note?: string; c: typeof darkColors;
}) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 10, fontWeight: '700', color: c.primary, letterSpacing: 1.5, marginBottom: 8 }}>
        {label}
      </Text>
      <TextInput
        style={{
          fontSize: 16, color: editable ? c.onSurface : c.onSurface + '60',
          paddingVertical: 10, paddingHorizontal: 0,
          borderBottomWidth: 1, borderBottomColor: editable ? c.outlineVariant + '60' : c.outlineVariant + '30',
          backgroundColor: 'transparent',
        }}
        placeholder={placeholder}
        placeholderTextColor={c.onSurface + '35'}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
      />
      {note && (
        <Text style={{ fontSize: 10, color: c.onSurface + '50', marginTop: 4 }}>{note}</Text>
      )}
    </View>
  );
}

const makeStyles = (c: typeof darkColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: c.outlineVariant + '25',
  },
  backBtn:  { padding: 4 },
  topTitle: { fontSize: 17, fontWeight: '800', color: c.onSurface, letterSpacing: -0.3 },
  saveBtn:  {
    backgroundColor: c.primary,
    paddingHorizontal: 20, paddingVertical: 9,
    borderRadius: 9999,
  },
  saveBtnText: { color: c.onPrimary, fontWeight: '800', fontSize: 14 },

  avatarSection: { alignItems: 'center', paddingVertical: 28 },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: c.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: c.primary + '40',
    overflow: 'hidden',
  },
  avatarText: { fontSize: 40, fontWeight: '900', color: '#fff' },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarOverlayText: { color: '#fff', fontSize: 10, fontWeight: '700', marginTop: 4 },
  avatarHint: { fontSize: 12, color: c.onSurface + '50', marginTop: 10 },

  formSection: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 10, fontWeight: '700', color: c.onSurface + '55',
    letterSpacing: 2, marginBottom: 20,
  },
  fieldGroup: { marginBottom: 24 },
  fieldLabel: { fontSize: 10, fontWeight: '700', color: c.primary, letterSpacing: 1.5, marginBottom: 8 },
  input: {
    fontSize: 16, paddingVertical: 10,
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 14,
    backgroundColor: c.surfaceContainerLow,
  },
  textArea: { height: 100, textAlignVertical: 'top' },

  chipSection: { marginBottom: 24 },
  chipRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 9999,
    backgroundColor: c.surfaceContainerHigh,
    borderWidth: 1, borderColor: c.outlineVariant + '40',
  },
  chipText: { fontSize: 13, fontWeight: '600', color: c.onSurface + '80' },
});
