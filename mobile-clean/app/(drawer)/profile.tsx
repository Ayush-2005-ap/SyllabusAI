import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../src/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/hooks/useAuth';

const STATS = [
  { value: '142', label: 'Total Hours' },
  { value: '6',   label: 'Subjects' },
  { value: '24',  label: 'Quizzes' },
  { value: '12',  label: 'Day Streak' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Profile Header ── */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'A'}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Alex Harrington'}</Text>
          <Text style={styles.institution}>{user?.email || 'Stanford University • Computer Science'}</Text>
        </View>

        {/* ── Stats row ── */}
        <View style={styles.statsCard}>
          {STATS.map((stat, i) => (
            <View key={stat.label} style={[styles.statItem, i < STATS.length - 1 && styles.statDivider]}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Academic Engine ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACADEMIC ENGINE</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="sparkles" size={18} color={colors.primary} />
              <Text style={styles.infoCardTitle}>AI Personality Profile</Text>
            </View>
            <Text style={styles.infoCardDesc}>
              The AI is currently set to{' '}
              <Text style={{ color: colors.primary, fontWeight: '700' }}>Socratic Method</Text>. It will ask guiding questions rather than providing direct answers to improve long-term retention.
            </Text>
          </View>
        </View>

        {/* ── Settings ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SYSTEM</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="settings-outline" size={20} color={colors.onSurface} />
              <Text style={styles.menuText}>Academic Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.outlineVariant} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.onSurface} />
              <Text style={styles.menuText}>Notification Preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.outlineVariant} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="archive-outline" size={20} color={colors.onSurface} />
              <Text style={styles.menuText}>Archive</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.outlineVariant} />
          </TouchableOpacity>
        </View>

        {/* ── Danger Zone ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DANGER ZONE</Text>
          <View style={styles.dangerCard}>
            <View style={styles.dangerCardTop}>
              <Ionicons name="flash" size={18} color={colors.error} />
              <Text style={styles.dangerTitle}>Panic Mode Settings</Text>
            </View>
            <Text style={styles.dangerDesc}>
              Configure how the app reacts when you fall behind 20%+ of your semester goals.
            </Text>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 0 },

  profileHeader: { alignItems: 'center', paddingTop: 24, paddingBottom: 28 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 3, borderColor: colors.primary + '30',
  },
  avatarText: { fontSize: 36, fontWeight: '900', color: '#fff' },
  name: { fontSize: 22, fontWeight: '800', color: colors.onSurface, letterSpacing: -0.5 },
  institution: { fontSize: 12, color: colors.onSurface + '60', marginTop: 4 },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLow,
    marginHorizontal: 20, borderRadius: 20,
    paddingVertical: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { borderRightWidth: 1, borderRightColor: colors.outlineVariant + '30' },
  statValue: { fontSize: 20, fontWeight: '900', color: colors.onSurface },
  statLabel: { fontSize: 9, fontWeight: '700', color: colors.onSurface + '55', letterSpacing: 1, marginTop: 4, textTransform: 'uppercase' },

  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionTitle: { fontSize: 10, fontWeight: '700', color: colors.onSurface + '55', letterSpacing: 2, marginBottom: 12 },

  infoCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  infoCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  infoCardTitle: { fontSize: 15, fontWeight: '700', color: colors.onSurface, marginLeft: 10 },
  infoCardDesc: { fontSize: 13, color: colors.onSurface + '70', lineHeight: 20 },

  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '25',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuText: { fontSize: 15, color: colors.onSurface, marginLeft: 14 },

  dangerCard: {
    backgroundColor: colors.errorContainer + '20',
    borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: colors.error + '25',
  },
  dangerCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dangerTitle: { fontSize: 15, fontWeight: '700', color: colors.error, marginLeft: 10 },
  dangerDesc: { fontSize: 13, color: colors.onSurface + '70', lineHeight: 18 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  logoutText: { fontSize: 15, color: colors.error, fontWeight: '700', marginLeft: 14 },
});
