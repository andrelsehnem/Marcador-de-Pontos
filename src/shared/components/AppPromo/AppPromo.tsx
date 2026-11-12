import React, { useState } from 'react';
import './AppPromo.css';

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=dev.andre100.marcadorPontos';

const CHAVE_FAIXA_FECHADA = 'app-promo-faixa-fechada';

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

/** Abre a Play Store e registra o clique no Google Analytics (evento `clique_baixar_app`). */
export const abrirPlayStore = (origem: string) => {
  (window as GtagWindow).gtag?.('event', 'clique_baixar_app', { origem });
  window.open(PLAY_STORE_URL, '_blank', 'noopener,noreferrer');
};

interface AppPromoProps {
  /** `faixa`: barra fina no topo, pode ser fechada. `card`: destaque dentro do conteúdo. */
  variante: 'faixa' | 'card';
  /** Identifica de onde veio o clique no Analytics. */
  origem: string;
}

const AppPromo: React.FC<AppPromoProps> = ({ variante, origem }) => {
  const [fechada, setFechada] = useState(
    () => variante === 'faixa' && sessionStorage.getItem(CHAVE_FAIXA_FECHADA) === '1'
  );

  if (fechada) {
    return null;
  }

  const fechar = () => {
    sessionStorage.setItem(CHAVE_FAIXA_FECHADA, '1');
    setFechada(true);
  };

  if (variante === 'faixa') {
    return (
      <div className="app-promo-faixa" role="region" aria-label="Baixar aplicativo Android">
        <span className="app-promo-faixa-icone" aria-hidden="true">♠</span>
        <div className="app-promo-faixa-texto">
          <strong>Marcador de Pontos para Android</strong>
          <span>Grátis · funciona sem internet</span>
        </div>
        <button className="app-promo-botao" onClick={() => abrirPlayStore(origem)}>Baixar</button>
        <button className="app-promo-fechar" onClick={fechar} aria-label="Fechar aviso do aplicativo">×</button>
      </div>
    );
  }

  return (
    <section className="app-promo-card" aria-label="Baixar aplicativo Android">
      <span className="app-promo-selo">Novo jeito de jogar</span>
      <div className="app-promo-card-corpo">
        <div className="app-promo-card-icone" aria-hidden="true">📱</div>
        <div className="app-promo-card-texto">
          <h2>Leve o marcador no bolso</h2>
          <p>Baixe o app grátis para Android: funciona sem internet, mantém a tela ligada e salva suas partidas.</p>
        </div>
      </div>
      <button className="app-promo-botao app-promo-botao-grande" onClick={() => abrirPlayStore(origem)}>
        Baixar grátis na Play Store
      </button>
    </section>
  );
};

export default AppPromo;
