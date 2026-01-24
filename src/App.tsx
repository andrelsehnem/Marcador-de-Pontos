import React, { useState, useEffect } from 'react';
import './web/styles/global.css';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import ListaJogos from './web/pages/ListaJogos/ListaJogos';
import Landing from './web/pages/Landing/Landing';
import Cacheta from './web/pages/Cacheta/Cacheta';
import Truco from './web/pages/Truco/Truco';
import { Analytics } from "@vercel/analytics/react"

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  // Sincronizar com pathname da URL
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path === '/listajogos') setCurrentPage('listajogos');
      else if (path === '/cacheta') setCurrentPage('cacheta');
      else if (path === '/truco') setCurrentPage('truco');
      else setCurrentPage('landing');
    };

    handleRouteChange(); // Carregar página inicial baseada no path
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    const path = page === 'landing' ? '/' : `/${page}`;
    window.history.pushState({}, '', path);
  };

  return (
    <div style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}>
      <ThemeProvider>
        {currentPage === 'landing' && <Landing onNavigate={navigateTo} />}
        {currentPage === 'listajogos' && <ListaJogos onNavigate={navigateTo} />}
        {currentPage === 'truco' && <Truco onBack={() => navigateTo('listajogos')} />}
        {currentPage === 'cacheta' && <Cacheta onBack={() => navigateTo('listajogos')} />}
      </ThemeProvider>
      <Analytics />
    </div>
  );
}
