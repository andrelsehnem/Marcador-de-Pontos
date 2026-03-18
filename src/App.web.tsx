import React, { useState, useEffect } from 'react';
import './web/styles/global.css';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import ListaJogos from './web/pages/ListaJogos/ListaJogos';
import Landing from './web/pages/Landing/Landing';
import Cacheta from './web/pages/Cacheta/Cacheta';
import Truco from './web/pages/Truco/Truco';
import ComoJogarTruco from './web/pages/ComoJogarTruco/ComoJogarTruco';
import ComoJogarCacheta from './web/pages/ComoJogarCacheta/ComoJogarCacheta';
import Footer from './shared/components/Footer/Footer';
import { Analytics } from '@vercel/analytics/react';

type WebPage = 'landing' | 'listajogos' | 'truco' | 'cacheta' | 'como-jogar-truco' | 'como-jogar-cacheta';

const CANONICAL_SITE_URL = 'https://marcadordepontos.com.br';

const SEO_BY_PAGE: Record<WebPage, { title: string; description: string; path: string }> = {
  landing: {
    title: 'Marcador de Baralho: Truco e Cacheta Online',
    description: 'Marque pontos de Truco e Cacheta online, grátis e rápido. Salve partidas e jogue no celular sem instalar nada.',
    path: '/',
  },
  listajogos: {
    title: 'Jogos de Baralho Online | Marcador de Pontos',
    description: 'Escolha Truco ou Cacheta e acompanhe pontuação em tempo real com um marcador de baralho simples e otimizado para celular.',
    path: '/listajogos',
  },
  truco: {
    title: 'Marcador de Truco Online',
    description: 'Controle pontos do Truco com placar rápido, rodadas de 1, 3, 6 e 12 e salvamento local automático.',
    path: '/truco',
  },
  'como-jogar-truco': {
    title: 'Como Jogar Truco | Guia Rápido para Iniciantes',
    description: 'Aprenda as regras básicas do Truco Paulista: objetivo, pontuação, truco, seis, nove e doze.',
    path: '/como-jogar-truco',
  },
  'como-jogar-cacheta': {
    title: 'Como Jogar Cacheta | Regras e Estratégias',
    description: 'Aprenda como jogar Cacheta com regras básicas, combinações e dicas práticas para iniciantes e intermediários.',
    path: '/como-jogar-cacheta',
  },
  cacheta: {
    title: 'Marcador de Cacheta Online',
    description: 'Marque pontos da Cacheta com vários jogadores, edição de nomes e placar salvo automaticamente no navegador.',
    path: '/cacheta',
  },
};

const upsertMetaTag = (attr: 'name' | 'property', key: string, value: string) => {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', value);
};

const upsertScript = (src: string, options?: { async?: boolean; crossOrigin?: 'anonymous' | 'use-credentials' }) => {
  let scriptTag = document.head.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;

  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.src = src;
    document.head.appendChild(scriptTag);
  }

  if (options?.async !== undefined) {
    scriptTag.async = options.async;
  }

  if (options?.crossOrigin) {
    scriptTag.crossOrigin = options.crossOrigin;
  }
};

const upsertCanonical = (href: string) => {
  let canonicalTag = document.head.querySelector('link[rel="canonical"]');
  if (!canonicalTag) {
    canonicalTag = document.createElement('link');
    canonicalTag.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalTag);
  }
  canonicalTag.setAttribute('href', href);
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<WebPage>('landing');

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      if (path === '/listajogos') setCurrentPage('listajogos');
      else if (path === '/cacheta') setCurrentPage('cacheta');
      else if (path === '/truco') setCurrentPage('truco');
      else if (path === '/como-jogar-truco') setCurrentPage('como-jogar-truco');
      else if (path === '/como-jogar-cacheta') setCurrentPage('como-jogar-cacheta');
      else setCurrentPage('landing');
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    const currentSeo = SEO_BY_PAGE[currentPage];
    const siteUrl = CANONICAL_SITE_URL;
    const canonicalUrl = `${siteUrl}${currentSeo.path}`;

    document.title = currentSeo.title;
    upsertMetaTag('name', 'description', currentSeo.description);
    upsertMetaTag('name', 'robots', 'index,follow');
    upsertMetaTag('property', 'og:title', currentSeo.title);
    upsertMetaTag('property', 'og:description', currentSeo.description);
    upsertMetaTag('property', 'og:type', 'website');
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('name', 'google-adsense-account', 'ca-pub-7478664676745892');
    upsertScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7478664676745892', {
      async: true,
      crossOrigin: 'anonymous',
    });
    upsertCanonical(canonicalUrl);
  }, [currentPage]);

  const navigateTo = (page: WebPage) => {
    setCurrentPage(page);
    const path = page === 'landing' ? '/' : `/${page}`;
    window.history.pushState({}, '', path);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      <ThemeProvider>
        <div style={{ flex: 1 }}>
          {currentPage === 'landing' && <Landing onNavigate={navigateTo} />}
          {currentPage === 'listajogos' && <ListaJogos onNavigate={navigateTo} />}
          {currentPage === 'truco' && <Truco onBack={() => navigateTo('listajogos')} />}
          {currentPage === 'como-jogar-truco' && (
            <ComoJogarTruco
              onBack={() => navigateTo('listajogos')}
              onPlayTruco={() => navigateTo('truco')}
            />
          )}
          {currentPage === 'como-jogar-cacheta' && (
            <ComoJogarCacheta
              onBack={() => navigateTo('listajogos')}
              onPlayCacheta={() => navigateTo('cacheta')}
            />
          )}
          {currentPage === 'cacheta' && <Cacheta onBack={() => navigateTo('listajogos')} />}
        </div>
        <Footer />
      </ThemeProvider>
      <Analytics />
    </div>
  );
}
