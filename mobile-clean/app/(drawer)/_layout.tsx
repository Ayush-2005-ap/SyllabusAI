import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/utils/colors';

const TAB_ITEMS = [
  { name: 'home',     label: 'Home',     icon: 'home',         iconActive: 'home' },
  { name: 'subjects', label: 'Subjects', icon: 'library-outline',iconActive: 'library' },
  { name: 'schedule', label: 'Schedule', icon: 'calendar-outline',iconActive: 'calendar' },
  { name: 'chat',     label: 'Chat',     icon: 'chatbubble-ellipses-outline', iconActive: 'chatbubble-ellipses' },
  { name: 'profile',  label: 'Profile',  icon: 'person-outline',iconActive: 'person' },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background + 'CC' },
        headerTintColor: colors.onSurface,
        headerTitleStyle: { fontWeight: '800', fontSize: 18 },
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurface + '55',
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} iconName={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="subjects"
        options={{
          title: 'Subjects',
          tabBarLabel: 'Subjects',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} iconName={focused ? 'library' : 'library-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarLabel: 'Schedule',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} iconName={focused ? 'calendar' : 'calendar-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI Guru',
          tabBarLabel: 'Chat',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} iconName={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} iconName={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ focused, iconName, color }: { focused: boolean; iconName: any; color: string }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons name={iconName} size={22} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background + 'E6',
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    paddingBottom: 12,
    paddingTop: 6,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 20,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  tabItem: {
    paddingTop: 4,
  },
  iconWrap: {
    padding: 6,
    borderRadius: 20,
  },
  iconWrapActive: {
    backgroundColor: colors.primaryContainer + '30',
  },
});
