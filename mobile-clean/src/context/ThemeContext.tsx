import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeMode>('dark');

  // Load saved preference on mount
  useEffect(() => {
    AsyncStorage.getItem('app_theme').then(saved => {
      if (saved === 'light' || saved === 'dark') setThemeState(saved);
    });
  }, []);

  const setTheme = async (t: ThemeMode) => {
    setThemeState(t);
    await AsyncStorage.setItem('app_theme', t);
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
