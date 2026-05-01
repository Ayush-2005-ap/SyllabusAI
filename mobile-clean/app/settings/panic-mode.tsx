import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Animated, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/hooks/useColors';
import { useAppContext } from '../../src/hooks/useAppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PANIC_KEY = '@panic_mode_state';

export default function PanicModeScreen() {
  const router = useRouter();
  const c = useColors();
  const { panicMode, setPanicMode } = useAppContext();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const [isActive, setIsActive] = useState(panicMode);
  const [enabled, setEnabled] = useState(true);
  const [blockSocials, setBlockSocials] = useState(true);
  const [strictGuru, setStrictGuru] = useState(true);
  const [insomniaMode, setInsomniaMode] = useState(false);

  useEffect(() => {
    setIsActive(panicMode);
  }, [panicMode]);

  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await AsyncStorage.getItem(PANIC_KEY);
        if (saved) {
          const data = JSON.parse(saved);
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

  const saveState = async (overrides = {}) => {
    const state = { isActive, enabled, blockSocials, strictGuru, insomniaMode, ...overrides };
    try {
      await AsyncStorage.setItem(PANIC_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save panic state', e);
    }
  };

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
            onPress: async () => {
              await setPanicMode(false);
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
            onPress: async () => {
              await setPanicMode(true);
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
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.surfaceContainerHigh }]}>
          <Ionicons name="chevron-back" size={24} color={c.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: c.onSurface }]}>Panic Protocol</Text>
        <View style={[styles.statusDot, { backgroundColor: isActive ? '#FF3B30' : c.outlineVariant }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <View style={[
            styles.heroCard,
            { backgroundColor: isActive ? '#FF3B3015' : c.errorContainer + '30', borderColor: isActive ? '#FF3B30' : c.error + '40' }
          ]}>
            <View style={[styles.heroIconWrap, { backgroundColor: isActive ? '#FF3B3020' : c.error + '20' }]}>
              <Ionicons name="flash" size={40} color={isActive ? '#FF3B30' : c.error} />
            </View>
            <Text style={[styles.heroTitle, { color: isActive ? '#FF3B30' : c.error }]}>
              {isActive ? '🔴 PANIC ACTIVE' : 'Emergency State'}
            </Text>
            <Text style={[styles.heroDesc, { color: c.onSurface + '70' }]}>
              {isActive
                ? 'Emergency study protocol is in full effect. All distractions are suppressed. Focus on the mission.'
                : 'Panic Mode activates automatically when you fall 20% behind your goals, or you can trigger it manually.'}
            </Text>
            
            <View style={[styles.masterToggle, { backgroundColor: c.surfaceContainerHighest + '80' }]}>
              <Text style={[styles.masterToggleText, { color: c.onSurface }]}>Enable Auto-Panic</Text>
              <Switch
                value={enabled}
                onValueChange={(v) => { setEnabled(v); saveState({ enabled: v }); }}
                trackColor={{ false: c.outlineVariant, true: '#FF3B30' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </Animated.View>

        <Text style={[styles.sectionLabel, { color: c.error }]}>PROTOCOL MEASURES</Text>

        <View style={[styles.card, { backgroundColor: c.surfaceContainerLow, borderColor: c.outlineVariant + '30' }]}>
          <SettingRow
            icon="logo-instagram"
            title="Block Distractions"
            desc="Suppress social media notifications."
            value={blockSocials}
            onToggle={(v: boolean) => { setBlockSocials(v); saveState({ blockSocials: v }); }}
            c={c}
          />
          <SettingRow
            icon="chatbubbles"
            title="Ruthless Guru"
            desc="AI becomes brutally honest & strict."
            value={strictGuru}
            onToggle={(v: boolean) => { setStrictGuru(v); saveState({ strictGuru: v }); }}
            c={c}
          />
          <SettingRow
            icon="moon"
            title="Insomnia Mode"
            desc="Allow 12 AM - 3 AM study blocks."
            value={insomniaMode}
            onToggle={(v: boolean) => { setInsomniaMode(v); saveState({ insomniaMode: v }); }}
            c={c}
            isLast
          />
        </View>

        <TouchableOpacity
          style={[styles.mainActionBtn, { backgroundColor: isActive ? '#34C759' : '#FF3B30' }]}
          onPress={handleTrigger}
          activeOpacity={0.85}
        >
          <Ionicons name={isActive ? 'checkmark-circle' : 'warning'} size={20} color="#fff" />
          <Text style={styles.mainActionText}>
            {isActive ? 'DEACTIVATE PROTOCOL' : 'TRIGGER PANIC MODE'}
          </Text>
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
        <Ionicons name={icon} size={18} color={c.error} />
      </View>
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, { color: c.onSurface }]}>{title}</Text>
        <Text style={[styles.settingDesc, { color: c.onSurface + '50' }]}>{desc}</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '800' },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  
  content: { padding: 24 },
  heroCard: { padding: 24, borderRadius: 32, borderWidth: 1, alignItems: 'center', marginBottom: 32 },
  heroIconWrap: { width: 80, height: 80, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 24, fontWeight: '900', marginBottom: 8, letterSpacing: 1 },
  heroDesc: { textAlign: 'center', fontSize: 14, lineHeight: 22, marginBottom: 24, paddingHorizontal: 10 },
  
  masterToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 16, borderRadius: 16 },
  masterToggleText: { fontSize: 15, fontWeight: '700' },
  
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase' },
  card: { borderRadius: 24, borderWidth: 1, paddingHorizontal: 16, marginBottom: 32 },
  
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20 },
  settingIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  settingText: { flex: 1, marginRight: 16 },
  settingTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  settingDesc: { fontSize: 12, lineHeight: 18 },
  
  mainActionBtn: { height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#ff0000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 },
  mainActionText: { color: '#fff', fontSize: 15, fontWeight: '900', marginLeft: 10, letterSpacing: 1 },
});
