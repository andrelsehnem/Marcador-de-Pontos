import React, { useState, useEffect } from 'react';
import './Landing.css';
import ThemeToggle from '../../../shared/components/ThemeToggle/ThemeToggle';
import AdSense from '../../../shared/components/AdSense/AdSense';

const LandingPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < 50; i++) {
      newStars.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3
      });
    }
    setStars(newStars);
  }, []);

  return (
    <div className="landing-page">
     
      {/* Stars */}
      <div className="stars">
        {stars.map(star => (
          <div
            key={star.id}
            className="star"
            style={{ left: `${star.left}%`, top: `${star.top}%`, animationDelay: `${star.delay}s` }}
          />
        ))}
      </div>

      <div className="landing-container">
        {/* Hero */}
        <div className="hero">
          <div className="logo">
            🎴
          </div>
          <h1 className="title">
            Marcador de Baralho
          </h1>
          <p className="subtitle">
            Marcar suas pontuações em jogos de baralho nunca foi tão fácil e divertido!
          </p>

          {/* Cards Display */}
          <div className="cards">
            {['♠️', '♥️', '♣️', '♦️'].map((suit, i) => (
              <div
                key={i}
                className="card-flip"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {suit}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta">
          <div className="cta-card">
            <div className="cta-card-header">
              <span className="cta-card-icon">🌐</span>
              <h2 className="cta-card-title">Jogar Online</h2>
            </div>
            <p className="cta-card-description">
              <br />
              Acesse agora e escolha entre diversos jogos de baralho. Marque pontos, salve partidas e divirta-se!
              <br />
            </p>
            <div className="game-buttons">
              <button 
                className="game-button cacheta-btn"
                onClick={() => onNavigate('cacheta')}
              >
                🃏 Cacheta
              </button>
              <button 
                className="game-button truco-btn"
                onClick={() => onNavigate('truco')}
              >
                🎯 Truco
              </button>
              <button 
                className="game-button full-list-btn"
                onClick={() => onNavigate('listajogos')}
              >
                📋 Acessar lista completa
              </button>
            </div>
          </div>

          <CTACard
            icon="📱"
            title="Aplicativo Android"
            description="Leve seus jogos para qualquer lugar! Baixe nosso app e jogue offline quando quiser.
              Aplicativo em desenvolvimento, disponível na Google Play Store."
            buttonText="Abrir na Play Store"
            buttonStyle={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}
            onClick={() => window.open('https://play.google.com/store/apps/details?id=dev.andre100.marcadorPontos', '_blank')}
          />
        </div>

        {/* AdSense */}
        <AdSense />

        {/* Features */}
        <div className="features">
          <h2 className="features-title">
            ✨ Por que escolher nosso marcador?
          </h2>
          <div className="features-grid">
            <Feature icon="⚡" text="Rápido e Intuitivo" />
            <Feature icon="🎯" text="Múltiplos Jogos" />
            <Feature icon="💾" text="Sair não perde o jogo" />
           {/* <Feature icon="🏆" text="Histórico Completo" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const CTACard = ({ icon, title, description, buttonText, buttonStyle, onClick }) => {
  return (
    <div className="cta-card" onClick={onClick}>
      <div className="cta-card-header">
        <span className="cta-card-icon">{icon}</span>
        <h2 className="cta-card-title">{title}</h2>
      </div>
      <p className="cta-card-description"><br />{description}<br /></p>
      <button className="cta-button" style={buttonStyle}>{buttonText}</button>
    </div>
  );
};

const Feature = ({ icon, text }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <div className="feature-text">{text}</div>
    </div>
  );
};

export default LandingPage;