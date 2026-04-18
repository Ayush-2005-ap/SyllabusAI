import { useTheme } from '../context/ThemeContext';
import { darkColors, lightColors } from '../utils/colors';

/**
 * Returns the correct color palette based on the current theme.
 * Use this in every screen instead of importing `colors` directly.
 *
 * Usage:
 *   const c = useColors();
 *   <View style={{ backgroundColor: c.background }} />
 */
export const useColors = () => {
  const { isDark } = useTheme();
  return isDark ? darkColors : lightColors;
};
