import React from 'react';
import './Footer.css';
import { useTheme } from '../../contexts/ThemeContext';

type FooterPage = 'sobre' | 'politica-de-privacidade' | 'contato';

const LINKS: { page: FooterPage; label: string }[] = [
  { page: 'sobre', label: 'Sobre' },
  { page: 'politica-de-privacidade', label: 'Política de Privacidade' },
  { page: 'contato', label: 'Contato' },
];

interface FooterProps {
  onNavigate?: (page: FooterPage) => void;
  /** Mantém o rodapé preso na base da tela enquanto a página rola. */
  fixo?: boolean;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, fixo }) => {
  const { theme } = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, page: FooterPage) => {
    if (!onNavigate) {
      return;
    }
    event.preventDefault();
    onNavigate(page);
  };

  return (
    <footer className={`app-footer${fixo ? ' app-footer-fixo' : ''}`} data-theme={theme}>
      <div className="footer-content">
        <nav className="footer-links" aria-label="Links institucionais">
          {LINKS.map(({ page, label }) => (
            <a key={page} href={`/${page}`} onClick={(event) => handleClick(event, page)}>
              {label}
            </a>
          ))}
        </nav>
        <p>© 2026 Marcador de Pontos - Por <a href="https://andre100.dev" target="_blank" rel="noopener noreferrer">André Luis Sehnem</a></p>
      </div>
    </footer>
  );
};

export default Footer;
