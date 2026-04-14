import React from 'react';
import './Footer.css';
import { useTheme } from '../../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <footer className="app-footer" data-theme={theme}>
      <div className="footer-content">
        <p>© 2026 Marcador de Pontos - Por <a href="https://andre100.dev" target="_blank" rel="noopener noreferrer">André Luis Sehnem</a></p>
      </div>
    </footer>
  );
};

export default Footer;
