import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';

export type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: typeof COLORS;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_STORAGE_KEY = 'app-theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('dark');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeType | null;
          if (savedTheme === 'light' || savedTheme === 'dark') {
            setTheme(savedTheme);
          }
          return;
        }

        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        }
      } catch {
        setTheme('dark');
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    const persistTheme = async () => {
      try {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.localStorage.setItem(THEME_STORAGE_KEY, theme);
          return;
        }

        await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch {
        return;
      }
    };

    persistTheme();
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: COLORS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
