import React, { useState } from 'react';
import './Home.css';
import Button from '../../shared/components/Button';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { useThemeStyles } from '../../shared/hooks/useThemeStyles';
import { useResponsive } from '../../shared/hooks/useResponsive';
import Cacheta from './Cacheta';

const Home: React.FC = () => {
  const [showCacheta, setShowCacheta] = useState(false);
  const { toggleTheme, theme } = useTheme();
  const themeStyles = useThemeStyles();
  const responsive = useResponsive();

  if (showCacheta) {
    return <Cacheta onBack={() => setShowCacheta(false)} />;
  }

  return (
    <div
      className="home-container"
      style={{
        backgroundColor: themeStyles.containerBg,
        color: themeStyles.textPrimary,
      }}
    >
      <div className="home-content">
        <h1 className="home-title" style={{ color: themeStyles.textPrimary }}>
          Marcador de baralho
        </h1>
        <p className="home-subtitle" style={{ color: themeStyles.textSecondary }}>
          Acompanhe suas mãos e jogadas com facilidade!
        </p>

        <div className="button-container">
          <Button
            text="Truco"
            backgroundColor={themeStyles.buttonPrimary.bg}
            textColor={themeStyles.buttonPrimary.text}
            onClick={() => console.log('Novo Jogo')}
          />

          <Button
            text={responsive.isMobile ? 'Cacheta' : 'Cacheta'}
            backgroundColor={themeStyles.buttonPrimaryAlt.bg}
            textColor={themeStyles.buttonPrimaryAlt.text}
            onClick={() => setShowCacheta(true)}
            className="button-secondary"
            borderColor={themeStyles.buttonSecondary.border}
            borderWidth={themeStyles.buttonSecondary.borderWidth}
          />

          <Button
            text={`${theme === 'dark' ? '☀️' : '🌙'}`}
            backgroundColor={themeStyles.buttonSecondary.bg}
            textColor={themeStyles.buttonSecondary.text}
            onClick={toggleTheme}
            className="button-theme"
            borderColor={themeStyles.buttonSecondary.border}
            borderWidth={themeStyles.buttonSecondary.borderWidth}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
