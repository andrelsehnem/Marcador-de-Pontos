import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../constants/colors';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { toggleTheme, theme } = useTheme();

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Alternar tema"
      title={`Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
      style={{
        background: theme === 'dark' 
          ? `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`
          : `linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.primary} 100%)`,
        border: `2px solid ${theme === 'dark' ? COLORS.primaryLight : COLORS.primaryDark}`
      }}
    >
      <div className="theme-toggle-inner">
        <span className="theme-toggle-icon">
          {theme === 'dark' ? '☀️' : '🌙'}
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;