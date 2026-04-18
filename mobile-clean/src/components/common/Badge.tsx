import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';

interface BadgeProps {
  label: string;
  type?: 'primary' | 'success' | 'warning' | 'danger';
}

export const Badge = ({ label, type = 'primary' }: BadgeProps) => {
  const getColors = () => {
    switch (type) {
      case 'success': return { bg: 'rgba(46, 204, 113, 0.2)', text: colors.success };
      case 'warning': return { bg: 'rgba(245, 166, 35, 0.2)', text: colors.warning };
      case 'danger': return { bg: 'rgba(231, 76, 60, 0.2)', text: colors.danger };
      default: return { bg: 'rgba(74, 144, 217, 0.2)', text: colors.primary };
    }
  };

  const stylesColors = getColors();

  return (
    <View style={[styles.container, { backgroundColor: stylesColors.bg }]}>
      <Text style={[styles.text, { color: stylesColors.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
