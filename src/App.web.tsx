import React, { useState, useEffect, lazy, Suspense } from 'react';
import './web/styles/global.css';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import Footer from './shared/components/Footer/Footer';
import { Analytics } from '@vercel/analytics/react';

const ListaJogos = lazy(() => import('./web/pages/ListaJogos/ListaJogos'));
const Landing = lazy(() => import('./web/pages/Landing/Landing'));
const Cacheta = lazy(() => import('./web/pages/Cacheta/Cacheta'));
const Truco = lazy(() => import('./web/pages/Truco/Truco'));
const Marcador = lazy(() => import('./web/pages/Marcador/Marcador'));
const Canastra = lazy(() => import('./web/pages/Canastra/Canastra'));
const ComoJogarTruco = lazy(() => import('./web/pages/ComoJogarTruco/ComoJogarTruco'));
const ComoJogarCacheta = lazy(() => import('./web/pages/ComoJogarCacheta/ComoJogarCacheta'));
const Institucional = lazy(() => import('./web/pages/Institucional/Institucional'));
const NaoEncontrada = lazy(() => import('./web/pages/NaoEncontrada/NaoEncontrada'));

type WebPage = 'landing' | 'listajogos' | 'truco' | 'cacheta' | 'marcador' | 'canastra' | 'como-jogar-truco' | 'como-jogar-cacheta' | 'sobre' | 'politica-de-privacidade' | 'contato' | 'nao-encontrada';

const CANONICAL_SITE_URL = 'https://marcadordepontos.com.br';

const SEO_BY_PAGE: Record<WebPage, { title: string; description: string; path: string }> = {
  landing: {
    title: 'Marcador de Pontos: Truco e Cacheta Online',
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
  marcador: {
    title: 'Marcador de Pontos Livre | Equipe A e B',
    description: 'Use um marcador de pontos livre para Equipe A e B com +1 e -1, nomes editáveis e salvamento automático.',
    path: '/marcador',
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
  canastra: {
    title: 'Marcador de Canastra Online',
    description: 'Marque pontos de Canastra com 2 times, configurações personalizáveis e histórico editável. Salva automaticamente.',
    path: '/canastra',
  },
  sobre: {
    title: 'Sobre | Marcador de Pontos',
    description: 'Conheça o Marcador de Pontos: marcadores gratuitos de Truco, Cacheta e Canastra no navegador e no app Android.',
    path: '/sobre',
  },
  'politica-de-privacidade': {
    title: 'Política de Privacidade | Marcador de Pontos',
    description: 'Saiba quais dados o Marcador de Pontos trata, como usamos cookies, estatísticas e anúncios, e quais são os seus direitos.',
    path: '/politica-de-privacidade',
  },
  contato: {
    title: 'Contato | Marcador de Pontos',
    description: 'Fale com o Marcador de Pontos para tirar dúvidas, relatar problemas ou sugerir novos jogos.',
    path: '/contato',
  },
  'nao-encontrada': {
    title: 'Página não encontrada | Marcador de Pontos',
    description: 'O endereço acessado não existe. Volte para a página inicial ou escolha um marcador na lista de jogos.',
    path: '/404',
  },
};

const resolvePage = (pathname: string): WebPage => {
  const path = pathname.replace(/\/$/, '') || '/';
  const pages = Object.keys(SEO_BY_PAGE) as WebPage[];
  return pages.find((page) => SEO_BY_PAGE[page].path === path) ?? 'nao-encontrada';
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

// `initialPage` só é passado na pré-renderização do build (scripts/prerender.js).
export default function App({ initialPage }: { initialPage?: WebPage }) {
  const [currentPage, setCurrentPage] = useState<WebPage>(
    () => initialPage ?? resolvePage(window.location.pathname)
  );

  useEffect(() => {
    const handleRouteChange = () => setCurrentPage(resolvePage(window.location.pathname));

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    const currentSeo = SEO_BY_PAGE[currentPage];
    const siteUrl = CANONICAL_SITE_URL;
    const canonicalUrl = `${siteUrl}${currentSeo.path}`;
    const isNotFound = currentPage === 'nao-encontrada';

    document.title = currentSeo.title;
    upsertMetaTag('name', 'description', currentSeo.description);
    upsertMetaTag('name', 'robots', isNotFound ? 'noindex' : 'index,follow');
    upsertMetaTag('property', 'og:title', currentSeo.title);
    upsertMetaTag('property', 'og:description', currentSeo.description);
    upsertMetaTag('property', 'og:type', 'website');
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('name', 'google-adsense-account', 'ca-pub-7478664676745892');
    // Script já está no index.html, não precisa reinjetar aqui
    if (!isNotFound) {
      upsertCanonical(canonicalUrl);
    }
  }, [currentPage]);

  const navigateTo = (page: WebPage) => {
    setCurrentPage(page);
    const path = page === 'landing' ? '/' : `/${page}`;
    window.history.pushState({}, '', path);
  };

  const navigateToTop = (page: WebPage) => {
    navigateTo(page);
    // No build web quem rola é o #root, não a janela.
    document.getElementById('root')?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      <ThemeProvider>
        <main style={{ flex: 1 }}>
          <Suspense fallback={null}>
            {currentPage === 'landing' && <Landing onNavigate={navigateTo} />}
            {currentPage === 'listajogos' && <ListaJogos onNavigate={navigateTo} />}
            {currentPage === 'truco' && <Truco onBack={() => navigateTo('listajogos')} />}
            {currentPage === 'marcador' && <Marcador onBack={() => navigateTo('listajogos')} />}
            {currentPage === 'canastra' && <Canastra onNavigate={navigateTo} />}
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
            {(currentPage === 'sobre' || currentPage === 'politica-de-privacidade' || currentPage === 'contato') && (
              <Institucional pagina={currentPage} onBack={() => navigateTo('landing')} />
            )}
            {currentPage === 'nao-encontrada' && <NaoEncontrada onNavigate={navigateToTop} />}
          </Suspense>
        </main>
        <Footer onNavigate={navigateToTop} fixo={currentPage === 'landing'} />
      </ThemeProvider>
      <Analytics />
    </div>
  );
}
