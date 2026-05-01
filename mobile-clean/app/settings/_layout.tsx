import React from 'react';
import { Stack } from 'expo-router';
import { useColors } from '../../src/hooks/useColors';

export default function SettingsLayout() {
  const c = useColors();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: c.background },
      }}
    >
      <Stack.Screen name="edit-profile" options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="panic-mode" options={{ title: 'Panic Mode' }} />
      <Stack.Screen name="academic-settings" options={{ title: 'Academic Settings' }} />
      <Stack.Screen name="ai-personality" options={{ title: 'AI Guru Personality' }} />
      <Stack.Screen name="notification-prefs" options={{ title: 'Notifications' }} />
      <Stack.Screen name="archive" options={{ title: 'Archive' }} />
    </Stack>
  );
}
