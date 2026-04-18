import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/hooks/useAuth';
import { useTheme } from '../../src/context/ThemeContext';
import { darkColors, lightColors } from '../../src/utils/colors';

const STATS = [
  { value: '142', label: 'Total Hours' },
  { value: '6',   label: 'Subjects' },
  { value: '24',  label: 'Quizzes' },
  { value: '12',  label: 'Day Streak' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isDark, setTheme, theme } = useTheme();
  const router = useRouter();

  const c = isDark ? darkColors : lightColors;

  const styles = makeStyles(c);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push('/(drawer)/edit-profile')}
          >
            <Ionicons name="pencil" size={16} color={c.primary} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── Profile Card ── */}
        <View style={styles.profileCard}>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push('/(drawer)/edit-profile')}
          >
            <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'A'}</Text>
            <View style={styles.avatarEdit}>
              <Ionicons name="camera" size={12} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{user?.name || 'Alex Harrington'}</Text>
          <Text style={styles.email}>{user?.email || 'student@university.edu'}</Text>
        </View>

        {/* ── Stats Row ── */}
        <View style={styles.statsCard}>
          {STATS.map((stat, i) => (
            <View key={stat.label} style={[styles.statItem, i < STATS.length - 1 && { borderRightWidth: 1, borderRightColor: c.outlineVariant + '40' }]}>
              <Text style={[styles.statValue, { color: c.onSurface }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: c.onSurface + '60' }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Appearance — Theme Toggle ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.onSurface + '55' }]}>APPEARANCE</Text>

          <View style={styles.themeRow}>
            {/* Dark Mode button */}
            <TouchableOpacity
              style={[
                styles.themeBtn,
                theme === 'dark' && styles.themeBtnActive,
                { backgroundColor: theme === 'dark' ? c.primaryContainer : c.surfaceContainerHigh },
              ]}
              onPress={() => setTheme('dark')}
            >
              <Ionicons
                name="moon"
                size={22}
                color={theme === 'dark' ? '#fff' : c.onSurface + '80'}
              />
              <Text style={[styles.themeBtnLabel, { color: theme === 'dark' ? '#fff' : c.onSurface + '80' }]}>Dark</Text>
              {theme === 'dark' && (
                <View style={styles.themeActiveDot} />
              )}
            </TouchableOpacity>

            {/* Light Mode button */}
            <TouchableOpacity
              style={[
                styles.themeBtn,
                theme === 'light' && styles.themeBtnActive,
                { backgroundColor: theme === 'light' ? '#f5a623' : c.surfaceContainerHigh },
              ]}
              onPress={() => setTheme('light')}
            >
              <Ionicons
                name="sunny"
                size={22}
                color={theme === 'light' ? '#fff' : c.onSurface + '80'}
              />
              <Text style={[styles.themeBtnLabel, { color: theme === 'light' ? '#fff' : c.onSurface + '80' }]}>Light</Text>
              {theme === 'light' && (
                <View style={[styles.themeActiveDot, { backgroundColor: '#fff' }]} />
              )}
            </TouchableOpacity>
          </View>

          {/* Quick toggle row */}
          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuLeft}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={c.primary} />
              <Text style={[styles.menuText, { color: c.onSurface }]}>
                {isDark ? 'Dark Mode' : 'Light Mode'} Active
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={val => setTheme(val ? 'dark' : 'light')}
              trackColor={{ false: c.outlineVariant, true: c.primaryContainer }}
              thumbColor={isDark ? c.primary : '#f4f3f4'}
              ios_backgroundColor={c.outlineVariant}
            />
          </View>
        </View>

        {/* ── Academic Engine ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.onSurface + '55' }]}>ACADEMIC ENGINE</Text>
          <View style={[styles.infoCard, { backgroundColor: c.surfaceContainerLow, borderColor: c.outlineVariant + '30' }]}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="sparkles" size={18} color={c.primary} />
              <Text style={[styles.infoCardTitle, { color: c.onSurface }]}>AI Personality Profile</Text>
            </View>
            <Text style={[styles.infoCardDesc, { color: c.onSurface + '70' }]}>
              The AI is currently set to{' '}
              <Text style={{ color: c.primary, fontWeight: '700' }}>Socratic Method</Text>
              . It will ask guiding questions to improve long-term retention.
            </Text>
          </View>
        </View>

        {/* ── System Settings ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.onSurface + '55' }]}>SYSTEM</Text>

          {[
            { icon: 'settings-outline', label: 'Academic Settings' },
            { icon: 'notifications-outline', label: 'Notification Preferences' },
            { icon: 'archive-outline', label: 'Archive' },
          ].map(item => (
            <TouchableOpacity key={item.label} style={[styles.menuItem, { borderBottomColor: c.outlineVariant + '25' }]}>
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon as any} size={20} color={c.onSurface} />
                <Text style={[styles.menuText, { color: c.onSurface }]}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={c.outlineVariant} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Danger Zone ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.onSurface + '55' }]}>DANGER ZONE</Text>
          <View style={[styles.dangerCard, { backgroundColor: c.errorContainer + '20', borderColor: c.error + '25' }]}>
            <View style={styles.dangerCardTop}>
              <Ionicons name="flash" size={18} color={c.error} />
              <Text style={[styles.dangerTitle, { color: c.error }]}>Panic Mode Settings</Text>
            </View>
            <Text style={[styles.dangerDesc, { color: c.onSurface + '70' }]}>
              Configure how the app reacts when you fall behind 20%+ of your semester goals.
            </Text>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color={c.error} />
            <Text style={[styles.logoutText, { color: c.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (c: typeof darkColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  scroll:    { paddingBottom: 0 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8,
  },
  pageTitle: { fontSize: 28, fontWeight: '900', color: c.onSurface, letterSpacing: -0.5 },
  editBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: c.primary + '18',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 9999,
  },
  editBtnText: { fontSize: 13, fontWeight: '700', color: c.primary, marginLeft: 6 },

  profileCard: { alignItems: 'center', paddingVertical: 20 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: c.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 3, borderColor: c.primary + '40',
  },
  avatarText:  { fontSize: 36, fontWeight: '900', color: '#fff' },
  avatarEdit: {
    position: 'absolute', bottom: 4, right: 4,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: c.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: c.background,
  },
  name:  { fontSize: 22, fontWeight: '800', color: c.onSurface, letterSpacing: -0.5 },
  email: { fontSize: 13, color: c.onSurface + '60', marginTop: 4 },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: c.surfaceContainerLow,
    marginHorizontal: 20, borderRadius: 20,
    paddingVertical: 20, marginBottom: 8,
    borderWidth: 1, borderColor: c.outlineVariant + '30',
  },
  statItem:  { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '900' },
  statLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, marginTop: 4, textTransform: 'uppercase' },

  section:       { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle:  { fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 12 },

  // Theme selector
  themeRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  themeBtn: {
    flex: 1, paddingVertical: 18,
    borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  themeBtnActive: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  themeBtnLabel: { fontSize: 13, fontWeight: '700', marginTop: 8 },
  themeActiveDot: {
    position: 'absolute', bottom: 10,
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },

  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuText: { fontSize: 15, marginLeft: 14 },

  infoCard: {
    borderRadius: 20, padding: 20,
    borderWidth: 1,
  },
  infoCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  infoCardTitle:  { fontSize: 15, fontWeight: '700', marginLeft: 10 },
  infoCardDesc:   { fontSize: 13, lineHeight: 20 },

  dangerCard: {
    borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 1,
  },
  dangerCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dangerTitle:   { fontSize: 15, fontWeight: '700', marginLeft: 10 },
  dangerDesc:    { fontSize: 13, lineHeight: 18 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  logoutText: { fontSize: 15, fontWeight: '700', marginLeft: 14 },
});
