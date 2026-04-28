import React, { useState } from 'react';
import './ListaJogos.css';
import ThemeToggle from '../../../shared/components/ThemeToggle/ThemeToggle';

const ListaJogos: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [expandContent, setExpandContent] = useState(false);

  return (
    <div className="lista-page">
      <div className="lista-toggle">
        <ThemeToggle />
      </div>

      <div className="lista-stars" aria-hidden="true">
        {Array.from({ length: 28 }).map((_, index) => (
          <span
            key={index}
            className="lista-star"
            style={{
              left: `${(index * 17) % 100}%`,
              top: `${(index * 29) % 100}%`,
              animationDelay: `${(index % 7) * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="lista-content">
        <header className="lista-hero">
          <span className="lista-badge">Lista de jogos</span>
          <h1 className="lista-title">
            Escolha sua <span>partida</span>
          </h1>
          <p className="lista-subtitle">
            Acesse os marcadores e guias de cada jogo em uma experiência rápida e elegante.
          </p>
        </header>

        <section className="lista-group" aria-label="Seção de jogos">
          <h2 className="lista-group-title">Jogos</h2>
          <div className="lista-grid">
            <button className="lista-card card-gold" onClick={() => onNavigate('truco')}>
              <div className="lista-card-icon">🎯</div>
              <div className="lista-card-title">Truco</div>
              <div className="lista-card-text">Abrir marcador de pontos</div>
            </button>

            <button className="lista-card card-blue" onClick={() => onNavigate('cacheta')}>
              <div className="lista-card-icon">🃏</div>
              <div className="lista-card-title">Cacheta</div>
              <div className="lista-card-text">Abrir marcador de pontos</div>
            </button>

            <button className="lista-card card-blue" onClick={() => onNavigate('marcador')}>
              <div className="lista-card-icon">🧮</div>
              <div className="lista-card-title">Marcador Livre</div>
              <div className="lista-card-text">Equipe A x Equipe B com +1 e -1</div>
            </button>
          </div>
        </section>

        <section className="lista-group" aria-label="Seção de como jogar">
          <h2 className="lista-group-title">Como jogar</h2>
          <div className="lista-grid">
            <button className="lista-card card-outline" onClick={() => onNavigate('como-jogar-truco')}>
              <div className="lista-card-icon">📘</div>
              <div className="lista-card-title">Como jogar Truco</div>
              <div className="lista-card-text">Regras e dicas rápidas</div>
            </button>

            <button className="lista-card card-outline" onClick={() => onNavigate('como-jogar-cacheta')}>
              <div className="lista-card-icon">📗</div>
              <div className="lista-card-title">Como jogar Cacheta</div>
              <div className="lista-card-text">Regras e dicas rápidas</div>
            </button>
          </div>
        </section>

        <div className="lista-section-toggle">
          <button
            className="lista-expand-button"
            onClick={() => setExpandContent(!expandContent)}
          >
            {expandContent ? '▼ Ocultar Informações' : '► Sobre os Jogos'}
          </button>
        </div>

        {expandContent && (
          <section className="lista-info" aria-live="polite">
            <h2>
              Jogos Disponíveis
            </h2>
            <p>
              Bem-vindo ao melhor marcador de pontos do Brasil! Aqui você encontra ferramentas inteligentes para marcar pontos de forma rápida, prática e totalmente gratuita. Escolha entre os jogos mais populares e comece a jogar agora mesmo:
            </p>

            <div className="lista-info-card info-truco">
              <h3>🎯 Truco Paulista</h3>
              <p>
                O jogo clássico de cartas que reúne estratégia, blefe e adrenalina. Marque os clássicos 1 ponto, truco (3), seis (6), nove (9) e doze (12) pontos. Perfeito para duplas e competições acirradas.
              </p>
            </div>

            <div className="lista-info-card info-cacheta">
              <h3>🃏 Cacheta</h3>
              <p>
                Um jogo de combinações onde o planejamento é essencial. Organize suas cartas em trincas e sequências. Suporta múltiplos jogadores e pontuações personalizadas para qualquer mesa.
              </p>
            </div>

            <p>
              Ambos os marcadores foram desenvolvidos para serem intuitivos, rápidos e responsivos em qualquer dispositivo. Salve suas partidas automaticamente, mude de tema conforme sua preferência e aproveite uma experiência sem anúncios agressivos.
            </p>

            <h2>
              Por que usar nosso marcador?
            </h2>
            <ul>
              <li>✓ <strong>Totalmente gratuito</strong> - Sem custos ocultos ou necessidade de cadastro</li>
              <li>✓ <strong>Funciona online e offline</strong> - Jogue a qualquer hora e lugar</li>
              <li>✓ <strong>Sincronização automática</strong> - Seus dados salvos no navegador</li>
              <li>✓ <strong>Tema escuro e claro</strong> - Escolha o modo que melhor funciona para você</li>
              <li>✓ <strong>Responsivo</strong> - Funciona perfeitamente em celular, tablet e computador</li>
              <li>✓ <strong>Sem distrações</strong> - Interface simples e focada apenas no jogo</li>
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default ListaJogos;
