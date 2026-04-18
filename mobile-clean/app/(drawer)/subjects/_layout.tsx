import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../../src/utils/colors';

export default function SubjectsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '800', fontSize: 18, color: colors.onSurface },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Academic Inventory', headerShown: false }} />
      <Stack.Screen name="add" options={{ title: 'New Subject', presentation: 'modal', headerShown: true }} />
      <Stack.Screen name="[id]" options={{ title: '', headerShown: false }} />
    </Stack>
  );
}
