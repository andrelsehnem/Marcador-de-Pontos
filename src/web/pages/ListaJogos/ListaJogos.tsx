import React from 'react';
import './ListaJogos.css';
import Button from '../../../shared/components/Button';
import ThemeToggle from '../../../shared/components/ThemeToggle/ThemeToggle';
import { useThemeStyles } from '../../../shared/hooks/useThemeStyles';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import AdSense from '../../../shared/components/AdSense/AdSense';

const ListaJogos: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const themeStyles = useThemeStyles();
  const responsive = useResponsive();

  return (
    <div
      className="home-container"
      style={{
        backgroundColor: themeStyles.containerBg,
        color: themeStyles.textPrimary,
      }}
    >
      <ThemeToggle />
      <div className="home-content">
        <h1 className="home-title" style={{ color: themeStyles.textPrimary }}>
          Marcador de Baralho Online
        </h1>
        <p className="home-subtitle" style={{ color: themeStyles.textSecondary }}>
          Acompanhe suas mãos e jogadas com facilidade!
        </p>

        {/* AdSense */}
        <AdSense />

        <div className="button-container">
          <Button
            text="Truco"
            backgroundColor={themeStyles.buttonPrimary.bg}
            textColor={themeStyles.buttonPrimary.text}
            onClick={() => onNavigate('truco')}
          />

          <Button
            text={responsive.isMobile ? 'Cacheta' : 'Cacheta'}
            backgroundColor={themeStyles.buttonPrimaryAlt.bg}
            textColor={themeStyles.buttonPrimaryAlt.text}
            onClick={() => onNavigate('cacheta')}
            className="button-secondary"
            borderColor={themeStyles.buttonSecondary.border}
            borderWidth={themeStyles.buttonSecondary.borderWidth}
          />

          <Button
            text="Como jogar truco"
            backgroundColor={themeStyles.buttonSecondary.bg}
            textColor={themeStyles.buttonSecondary.text}
            onClick={() => onNavigate('como-jogar-truco')}
            className="button-secondary"
            borderColor={themeStyles.buttonSecondary.border}
            borderWidth={themeStyles.buttonSecondary.borderWidth}
          />

          <Button
            text="Como jogar cacheta"
            backgroundColor={themeStyles.buttonSecondary.bg}
            textColor={themeStyles.buttonSecondary.text}
            onClick={() => onNavigate('como-jogar-cacheta')}
            className="button-secondary"
            borderColor={themeStyles.buttonSecondary.border}
            borderWidth={themeStyles.buttonSecondary.borderWidth}
          />
        </div>
      </div>
    </div>
  );
};

export default ListaJogos;
