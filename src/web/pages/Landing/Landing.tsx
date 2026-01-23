import React, { useState, useEffect } from 'react';
import Home from '../Home';
import './Landing.css';

const LandingPage = () => {
  const [showHome, setShowHome] = useState(false);
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

  if (showHome) {
    return <Home />;
  }

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
          <CTACard
            icon="🌐"
            title="Jogar Online"
            description="Acesse agora e escolha entre diversos jogos de baralho. Marque pontos, salve partidas e divirta-se!"
            buttonText="Acessar Jogos"
            buttonStyle={{ background: 'white', color: '#667eea' }}
            onClick={() => setShowHome(true)}
          />

          <CTACard
            icon="📱"
            title="Baixar App"
            description="Leve seus jogos para qualquer lugar! Baixe nosso app e jogue offline quando quiser."
            buttonText="Em breve..."
            buttonStyle={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}
            onClick={() => {}}
          />
        </div>

        {/* Features */}
        <div className="features">
          <h3 className="features-title">
            ✨ Por que escolher nosso marcador?
          </h3>
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
      <span className="cta-card-icon">{icon}</span>
      <h2 className="cta-card-title">{title}</h2>
      <p className="cta-card-description">{description}</p>
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