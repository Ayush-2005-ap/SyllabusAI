import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../src/hooks/useAuth';
import { colors } from '../../src/utils/colors';

export default function SplashScreen() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();

  useEffect(() => {
    const checkNavigation = async () => {
      if (isLoading) return;

      if (user && token) {
        // User is authenticated
        router.replace('/(drawer)/home');
      } else {
        // Check if onboarding is complete
        const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
        if (hasOnboarded) {
          router.replace('/login');
        } else {
          router.replace('/onboarding');
        }
      }
    };

    // Small delay for branding visibility
    const timer = setTimeout(checkNavigation, 1500);
    return () => clearTimeout(timer);
  }, [isLoading, user, token]);

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>SyllabusAI</Text>
      <Text style={styles.tagline}>Your Personal Academic OS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
