import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLOR_THEMES, ColorPalette, ColorThemeType, getContrastTextColor, isColorThemeType, ThemeAppearance } from '../constants/colors';

export type ThemeType = 'light' | 'dark';
export type { ColorThemeType } from '../constants/colors';

interface ThemeContextType {
  theme: ThemeType;
  effectiveTheme: ThemeType;
  toggleTheme: () => void;
  colorTheme: ColorThemeType;
  setColorTheme: (colorTheme: ColorThemeType) => void;
  colors: ColorPalette;
  appearance: ThemeAppearance;
  isModeConfigurable: boolean;
  ready: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_STORAGE_KEY = 'app-theme';
const COLOR_THEME_STORAGE_KEY = 'app-color-theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [colorTheme, setColorTheme] = useState<ColorThemeType>('default');
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [colorThemeLoaded, setColorThemeLoaded] = useState(false);

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
      } finally {
        setThemeLoaded(true);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    const persistTheme = async () => {
      if (!themeLoaded) {
        return;
      }

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
  }, [theme, themeLoaded]);

  useEffect(() => {
    const loadColorTheme = async () => {
      try {
        const savedColorTheme = Platform.OS === 'web' && typeof window !== 'undefined'
          ? window.localStorage.getItem(COLOR_THEME_STORAGE_KEY)
          : await AsyncStorage.getItem(COLOR_THEME_STORAGE_KEY);

        if (isColorThemeType(savedColorTheme)) {
          setColorTheme(savedColorTheme);
        }
      } catch {
        setColorTheme('default');
      } finally {
        setColorThemeLoaded(true);
      }
    };

    loadColorTheme();
  }, []);

  useEffect(() => {
    const persistColorTheme = async () => {
      if (!colorThemeLoaded) {
        return;
      }

      try {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.localStorage.setItem(COLOR_THEME_STORAGE_KEY, colorTheme);
          return;
        }

        await AsyncStorage.setItem(COLOR_THEME_STORAGE_KEY, colorTheme);
      } catch {
        return;
      }
    };

    persistColorTheme();
  }, [colorTheme, colorThemeLoaded]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const themeDefinition = COLOR_THEMES[colorTheme];
  const colors = themeDefinition.palette;
  const effectiveTheme = themeDefinition.fixedMode ?? theme;
  const isModeConfigurable = themeDefinition.fixedMode === null;
  const fallbackAction = effectiveTheme === 'dark' ? colors.primary : colors.secondaryDark;
  const appearance: ThemeAppearance = themeDefinition.fixedAppearance ?? {
    background: effectiveTheme === 'dark' ? colors.background.dark : colors.background.light,
    surface: effectiveTheme === 'dark' ? colors.background.dark2 : colors.surface,
    text: effectiveTheme === 'dark' ? colors.text.dark : colors.text.light,
    surfaceText: effectiveTheme === 'dark' ? colors.text.dark : colors.text.light,
    mutedText: effectiveTheme === 'dark' ? colors.text.dark : colors.text.secondary,
    action: fallbackAction,
    onAction: getContrastTextColor(fallbackAction),
    border: colors.border,
    danger: colors.danger,
    warning: colors.warning,
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, toggleTheme, colorTheme, setColorTheme, colors, appearance, isModeConfigurable, ready: themeLoaded && colorThemeLoaded }}>
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
