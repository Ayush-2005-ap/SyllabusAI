import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Animated, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/hooks/useColors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PANIC_KEY = '@panic_mode_state';

export default function PanicModeScreen() {
  const router = useRouter();
  const c = useColors();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const [isActive, setIsActive] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [blockSocials, setBlockSocials] = useState(true);
  const [strictGuru, setStrictGuru] = useState(true);
  const [insomniaMode, setInsomniaMode] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await AsyncStorage.getItem(PANIC_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          setIsActive(data.isActive ?? false);
          setEnabled(data.enabled ?? true);
          setBlockSocials(data.blockSocials ?? true);
          setStrictGuru(data.strictGuru ?? true);
          setInsomniaMode(data.insomniaMode ?? false);
        }
      } catch (e) {
        console.error('Failed to load panic state', e);
      }
    };
    loadState();
  }, []);

  // Save state whenever anything changes
  const saveState = async (overrides = {}) => {
    const state = { isActive, enabled, blockSocials, strictGuru, insomniaMode, ...overrides };
    try {
      await AsyncStorage.setItem(PANIC_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save panic state', e);
    }
  };

  // Pulse animation for active state
  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.04, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isActive]);

  const handleTrigger = () => {
    if (isActive) {
      Alert.alert(
        '🟢 Deactivate Panic Mode?',
        'Are you sure you want to stand down? Panic Mode will be disabled.',
        [
          { text: 'Stay in Panic', style: 'cancel' },
          {
            text: 'Deactivate',
            style: 'destructive',
            onPress: () => {
              setIsActive(false);
              saveState({ isActive: false });
              Vibration.vibrate(100);
              Alert.alert('✅ Panic Mode Off', 'Good work! Keep up the momentum.');
            }
          }
        ]
      );
    } else {
      const measures = [
        blockSocials && '• Block Distractions',
        strictGuru && '• Ruthless Guru Mode',
        insomniaMode && '• Insomnia Revision Blocks',
      ].filter(Boolean).join('\n');

      Alert.alert(
        '⚡ Activate Panic Mode?',
        `This will enforce:\n${measures || '• No measures selected'}\n\nAre you ready to grind?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'ACTIVATE',
            style: 'destructive',
            onPress: () => {
              setIsActive(true);
              saveState({ isActive: true });
              Vibration.vibrate([0, 200, 100, 200]);
              Alert.alert('🔴 PANIC MODE ACTIVE', 'You are now in emergency study protocol. No excuses. Get to work!');
            }
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={c.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: c.onSurface }]}>Panic Mode</Text>
        <View style={[styles.statusDot, { backgroundColor: isActive ? '#FF3B30' : c.outlineVariant }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <View style={[
            styles.heroCard,
            { backgroundColor: isActive ? '#FF3B3015' : c.errorContainer, borderColor: isActive ? '#FF3B30' : c.error }
          ]}>
            <Ionicons name="flash" size={48} color={isActive ? '#FF3B30' : c.error} style={styles.heroIcon} />
            <Text style={[styles.heroTitle, { color: isActive ? '#FF3B30' : c.error }]}>
              {isActive ? '🔴 PANIC ACTIVE' : 'Emergency Protocol'}
            </Text>
            <Text style={[styles.heroDesc, { color: c.onErrorContainer }]}>
              {isActive
                ? 'You are currently in emergency study mode. All panic measures are in effect. Stay focused!'
                : 'When you fall behind more than 20% of your academic goals, Panic Mode takes over to get you back on track by enforcing extreme productivity measures.'}
            </Text>
            
            <View style={styles.masterToggle}>
              <Text style={[styles.masterToggleText, { color: isActive ? '#FF3B30' : c.error }]}>Enable Auto-Panic</Text>
              <Switch
                value={enabled}
                onValueChange={(v) => { setEnabled(v); saveState({ enabled: v }); }}
                trackColor={{ false: c.outlineVariant, true: '#FF3B30' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </Animated.View>

        <Text style={[styles.sectionTitle, { color: c.onSurface + '80' }]}>PANIC MEASURES</Text>

        <View style={[styles.settingsCard, { backgroundColor: c.surfaceContainerLow, borderColor: c.outlineVariant + '30' }]}>
          <SettingRow
            icon="logo-instagram"
            title="Block Distractions"
            desc="Block social media during study blocks."
            value={blockSocials}
            onToggle={(v: boolean) => { setBlockSocials(v); saveState({ blockSocials: v }); }}
            c={c}
          />
          <SettingRow
            icon="chatbubbles-outline"
            title="Ruthless Guru"
            desc="AI Guru becomes brutally honest and strict."
            value={strictGuru}
            onToggle={(v: boolean) => { setStrictGuru(v); saveState({ strictGuru: v }); }}
            c={c}
          />
          <SettingRow
            icon="moon-outline"
            title="Insomnia Mode"
            desc="Schedule revision blocks between 12 AM and 3 AM."
            value={insomniaMode}
            onToggle={(v: boolean) => { setInsomniaMode(v); saveState({ insomniaMode: v }); }}
            c={c}
            isLast
          />
        </View>

        <TouchableOpacity
          style={[styles.activateBtn, { backgroundColor: isActive ? '#34C759' : '#FF3B30' }]}
          onPress={handleTrigger}
          activeOpacity={0.85}
        >
          <Ionicons name={isActive ? 'checkmark-circle-outline' : 'warning-outline'} size={20} color="#fff" />
          <Text style={styles.activateBtnText}>
            {isActive ? 'DEACTIVATE PANIC MODE' : 'Trigger Panic Mode Now'}
          </Text>
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
        trackColor={{ false: c.outlineVariant, true: '#FF3B30' }}
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
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  content: { padding: 20, paddingBottom: 40 },
  heroCard: { padding: 24, borderRadius: 24, borderWidth: 2, alignItems: 'center', marginBottom: 32 },
  heroIcon: { marginBottom: 12 },
  heroTitle: { fontSize: 24, fontWeight: '900', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  heroDesc: { textAlign: 'center', fontSize: 14, lineHeight: 22, marginBottom: 24 },
  masterToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', backgroundColor: 'rgba(255,255,255,0.2)', padding: 16, borderRadius: 16 },
  masterToggleText: { fontSize: 16, fontWeight: '800' },
  sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 2, marginBottom: 12, marginLeft: 4 },
  settingsCard: { borderRadius: 24, borderWidth: 1, paddingHorizontal: 16, marginBottom: 32 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  settingIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  settingText: { flex: 1, marginRight: 16 },
  settingTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  settingDesc: { fontSize: 12, lineHeight: 18 },
  activateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 16, shadowColor: '#ff0000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  activateBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', marginLeft: 8 },
});
