import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, Alert, KeyboardAvoidingView,
  Platform, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/hooks/useAuth';
import api from '../../src/services/api';
import { colors } from '../../src/utils/colors';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data.success) {
        await login(res.data.token, res.data.user);
        router.replace('/(drawer)/home');
      }
    } catch (err: any) {
      Alert.alert('Signup Failed', err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <Ionicons name="book" size={22} color={colors.primary} />
            <Text style={styles.logoText}>SyllabusAI</Text>
          </View>

          {/* Glass card */}
          <View style={styles.card}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Join the next generation of top performers.</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>NAME</Text>
              <TextInput style={styles.input} placeholder="Julian Dean" placeholderTextColor={colors.onSurface + '40'}
                value={name} onChangeText={setName} autoCapitalize="words" />
              <View style={styles.underline} />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput style={styles.input} placeholder="dean@university.edu" placeholderTextColor={colors.onSurface + '40'}
                value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
              <View style={styles.underline} />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={colors.onSurface + '40'}
                value={password} onChangeText={setPassword} secureTextEntry />
              <View style={styles.underline} />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CONFIRM PASSWORD</Text>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={colors.onSurface + '40'}
                value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
              <View style={styles.underline} />
            </View>

            <TouchableOpacity
              style={[styles.createBtn, loading && { opacity: 0.7 }]}
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.createBtnText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.switchRow} onPress={() => router.push('/login')}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <Text style={styles.switchLink}>Sign In</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  blob1: { position: 'absolute', top: 40, right: 20, width: 200, height: 200, borderRadius: 100, backgroundColor: colors.primary, opacity: 0.04 },
  blob2: { position: 'absolute', bottom: 60, left: 20, width: 160, height: 160, borderRadius: 80, backgroundColor: colors.tertiary, opacity: 0.04 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 28 },
  logoText: { fontSize: 20, fontWeight: '900', color: colors.primary, letterSpacing: -0.5, marginLeft: 6 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.onSurface, letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontSize: 13, color: colors.onSurface + '60', marginBottom: 28 },
  fieldGroup: { marginBottom: 24 },
  label: { fontSize: 10, fontWeight: '700', color: colors.primary, letterSpacing: 1.5, marginBottom: 8 },
  input: { fontSize: 16, color: colors.onSurface, paddingVertical: 6, backgroundColor: 'transparent' },
  underline: { height: 1, backgroundColor: colors.outlineVariant + '60', marginTop: 2 },
  createBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: 'center',
    marginTop: 8,
  },
  createBtnText: { color: colors.onPrimary, fontSize: 16, fontWeight: '800' },
  switchRow: { flexDirection: 'row', justifyContent: 'center' },
  switchText: { color: colors.onSurface + '60', fontSize: 14 },
  switchLink: { color: colors.primary, fontSize: 14, fontWeight: '700' },
});
