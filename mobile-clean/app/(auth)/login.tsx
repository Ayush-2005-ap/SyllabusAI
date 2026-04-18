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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        await login(res.data.token, res.data.user);
        router.replace('/(drawer)/home');
      }
    } catch (err: any) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Ambient blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <Ionicons name="book" size={22} color={colors.primary} />
            <Text style={styles.logoText}>SyllabusAI</Text>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your academic workspace.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                placeholder="dean@university.edu"
                placeholderTextColor={colors.onSurface + '40'}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <View style={styles.inputUnderline} />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.onSurface + '40'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.onSurfaceVariant}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputUnderline} />
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>FORGOT PASSWORD?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.signInBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.signInBtnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
            </TouchableOpacity>
          </View>

          {/* Switch to signup */}
          <TouchableOpacity style={styles.switchRow} onPress={() => router.push('/signup')}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <Text style={styles.switchLink}>Create one</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  blob1: {
    position: 'absolute', top: 60, right: 20,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: colors.primary, opacity: 0.04,
  },
  blob2: {
    position: 'absolute', bottom: 80, left: 20,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: colors.tertiary, opacity: 0.04,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 48,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.5,
    marginLeft: 6,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.onSurface,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.onSurface + '60',
    marginTop: 6,
  },
  form: {
    marginBottom: 32,
  },
  fieldGroup: {
    marginBottom: 28,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: colors.onSurface,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  inputUnderline: {
    height: 1,
    backgroundColor: colors.outlineVariant + '60',
    marginTop: 2,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotBtn: {
    alignSelf: 'flex-start',
    marginBottom: 32,
  },
  forgotText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1,
  },
  signInBtn: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant + '40',
  },
  signInBtnText: {
    color: colors.onSurface,
    fontSize: 15,
    fontWeight: '800',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  switchText: {
    color: colors.onSurface + '60',
    fontSize: 14,
  },
  switchLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
