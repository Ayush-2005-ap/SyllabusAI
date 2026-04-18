import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../../src/utils/colors';

export default function SubjectsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'My Subjects', headerShown: true }} />
      <Stack.Screen name="add" options={{ title: 'Add Subject', presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: 'Subject Details' }} />
    </Stack>
  );
}
