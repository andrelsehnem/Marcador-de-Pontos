import React, { useState } from 'react';
import './ListaJogos.css';
import Button from '../../../shared/components/Button';
import ThemeToggle from '../../../shared/components/ThemeToggle/ThemeToggle';
import { useThemeStyles } from '../../../shared/hooks/useThemeStyles';
import { useResponsive } from '../../../shared/hooks/useResponsive';
const ListaJogos: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const themeStyles = useThemeStyles();
  const responsive = useResponsive();
  const [expandContent, setExpandContent] = useState(false);

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

        {/* Botão para expandir conteúdo educacional */}
        <button
          onClick={() => setExpandContent(!expandContent)}
          style={{
            marginTop: '30px',
            marginBottom: '20px',
            padding: '10px 20px',
            backgroundColor: themeStyles.buttonSecondary.bg,
            color: themeStyles.buttonSecondary.text,
            border: `1px solid ${themeStyles.buttonSecondary.border}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.95em',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            width: '100%'
          }}
        >
          {expandContent ? '▼ Ocultar Informações' : '► Sobre os Jogos'}
        </button>

        {expandContent && (
          <section style={{ marginTop: '20px', marginBottom: '30px', opacity: expandContent ? 1 : 0, transition: 'opacity 0.3s' }}>
            <h2 style={{ color: themeStyles.textPrimary, marginBottom: '15px', fontSize: '1.3em' }}>
              Jogos de Baralho Disponíveis
            </h2>
            <p style={{ color: themeStyles.textSecondary, lineHeight: '1.6', marginBottom: '15px' }}>
              Bem-vindo ao melhor marcador de baralho do Brasil! Aqui você encontra ferramentas inteligentes para marcar pontos de forma rápida, prática e totalmente gratuita. Escolha entre os jogos mais populares e comece a jogar agora mesmo:
            </p>

            <div style={{ 
              backgroundColor: themeStyles.surface,
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              borderLeft: `4px solid ${themeStyles.buttonPrimary.bg}`
            }}>
              <h3 style={{ color: themeStyles.textPrimary, marginBottom: '8px' }}>🎯 Truco Paulista</h3>
              <p style={{ color: themeStyles.textSecondary, fontSize: '0.95em' }}>
                O jogo clássico de cartas que reúne estratégia, blefe e adrenalina. Marque os clássicos 1 ponto, truco (3), seis (6), nove (9) e doze (12) pontos. Perfeito para duplas e competições acirradas.
              </p>
            </div>

            <div style={{ 
              backgroundColor: themeStyles.surface,
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              borderLeft: `4px solid ${themeStyles.buttonPrimaryAlt.bg}`
            }}>
              <h3 style={{ color: themeStyles.textPrimary, marginBottom: '8px' }}>🃏 Cacheta</h3>
              <p style={{ color: themeStyles.textSecondary, fontSize: '0.95em' }}>
                Um jogo de combinações onde o planejamento é essencial. Organize suas cartas em trincas e sequências. Suporta múltiplos jogadores e pontuações personalizadas para qualquer mesa.
              </p>
            </div>

            <p style={{ color: themeStyles.textSecondary, lineHeight: '1.6', fontSize: '0.95em' }}>
              Ambos os marcadores foram desenvolvidos para serem intuitivos, rápidos e responsivos em qualquer dispositivo. Salve suas partidas automaticamente, mude de tema conforme sua preferência e aproveite uma experiência sem anúncios agressivos.
            </p>

            <h2 style={{ color: themeStyles.textPrimary, marginTop: '30px', marginBottom: '15px', fontSize: '1.3em' }}>
              Por que usar nosso marcador?
            </h2>
            <ul style={{ color: themeStyles.textSecondary, lineHeight: '1.8', listStyleType: 'none', paddingLeft: 0 }}>
              <li style={{ marginBottom: '10px' }}>✓ <strong>Totalmente gratuito</strong> - Sem custos ocultos ou necessidade de cadastro</li>
              <li style={{ marginBottom: '10px' }}>✓ <strong>Funciona online e offline</strong> - Jogue a qualquer hora e lugar</li>
              <li style={{ marginBottom: '10px' }}>✓ <strong>Sincronização automática</strong> - Seus dados salvos no navegador</li>
              <li style={{ marginBottom: '10px' }}>✓ <strong>Tema escuro e claro</strong> - Escolha o modo que melhor funciona para você</li>
              <li style={{ marginBottom: '10px' }}>✓ <strong>Responsivo</strong> - Funciona perfeitamente em celular, tablet e computador</li>
              <li>✓ <strong>Sem distrações</strong> - Interface simples e focada apenas no jogo</li>
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default ListaJogos;
