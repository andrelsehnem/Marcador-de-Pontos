import { useMemo } from 'react';
import { useTheme, ThemeType } from '../contexts/ThemeContext';
import { COLORS } from '../constants/colors';

export const useThemeStyles = () => {
  const { theme } = useTheme();

  return useMemo(() => {
    const isDark = theme === 'dark';

    return {
      theme,
      isDark,
      containerBg: isDark ? COLORS.background.dark : COLORS.background.light,
      containerBg2: isDark ? COLORS.background.dark2 : COLORS.background.light2,
      textPrimary: isDark ? COLORS.text.dark : COLORS.text.light,
      textSecondary: isDark ? COLORS.text.dark : COLORS.text.light,
      buttonPrimary: {
        bg: COLORS.primary,
        text: '#ffffff',
      },
      buttonPrimaryAlt: {
        bg: COLORS.primaryLight,
        text: '#ffffff',
      },
      buttonSecondary: {
        bg: isDark ? COLORS.background.dark2 : COLORS.background.light2,
        text: isDark ? COLORS.text.dark : COLORS.text.primary,
        border: COLORS.border,
        borderWidth: 1,
      },
      surface: isDark ? COLORS.background.dark2 : COLORS.surface,
    };
  }, [theme]);
};
