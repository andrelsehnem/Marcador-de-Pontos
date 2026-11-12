import React, { useState, useEffect } from 'react';
import { RotateCcw, Menu, Clock, ArrowLeft } from 'lucide-react';
import './Truco.css';
import ThemeToggle from '../../../shared/components/ThemeToggle/ThemeToggle';
import { useTheme } from '../../../shared/contexts/ThemeContext';


export default function TrucoPaulista({ onBack }: { onBack: () => void }) {
    const { theme } = useTheme();
    const [expandContent, setExpandContent] = useState(false);
    const [nosScore, setNosScore] = useState(() => {
        const saved = localStorage.getItem('truco-nosScore');
        return saved ? parseInt(saved) : 0;
    });
    const [elesScore, setElesScore] = useState(() => {
        const saved = localStorage.getItem('truco-elesScore');
        return saved ? parseInt(saved) : 0;
    });
    const [pontosRodada, setPontosRodada] = useState(() => {
        const saved = localStorage.getItem('truco-pontosRodada');
        return saved ? parseInt(saved) : 1;
    });
    const [winner, setWinner] = useState<'nos' | 'eles' | null>(() => {
        const saved = localStorage.getItem('truco-winner');
        return saved ? (saved as 'nos' | 'eles') : null;
    });

    // Salvar no localStorage sempre que os estados mudarem
    useEffect(() => {
        localStorage.setItem('truco-nosScore', nosScore.toString());
        localStorage.setItem('truco-elesScore', elesScore.toString());
        localStorage.setItem('truco-pontosRodada', pontosRodada.toString());
        localStorage.setItem('truco-winner', winner || '');
    }, [nosScore, elesScore, pontosRodada, winner]);

    const resetGame = () => {
        setNosScore(0);
        setElesScore(0);
        setPontosRodada(1);
        setWinner(null);
    };

    const handlePonto1 = () => {
        setPontosRodada(1);
    };

    const handleTruco3 = () => {
        setPontosRodada(3);
    };

    const handleTruco6 = () => {
        setPontosRodada(6);
    };

    const handleTruco12 = () => {
        setPontosRodada(12);
    };

    const handleAddNosScore = () => {
        if (winner) return; 
        const newScore = nosScore + pontosRodada;
        setNosScore(newScore);
        setPontosRodada(1);
        if (newScore >= 12) {
            setWinner('nos');
        }
    };

    const handleAddElesScore = () => {
        if (winner) return; 
        const newScore = elesScore + pontosRodada;
        setElesScore(newScore);
        setPontosRodada(1);
        if (newScore >= 12) {
            setWinner('eles');
        }
    };

    return (
        <div className="truco-container" data-theme={theme}>
            <h1 className="sr-only">Marcador de Truco Paulista Online</h1>

            {/* Header */}
            <div className="truco-header">
                <button className="truco-back-btn" onClick={() => window.history.back()}>
                    <ArrowLeft size={24} />
                </button>
                
            </div>

            <ThemeToggle />

            {/* Score Cards */}
            <div className="truco-score-section">
                {/* Nós Card */}
                <div 
                    className={`truco-score-card ${winner === 'nos' ? 'winner' : winner === 'eles' ? 'loser' : ''}`}
                    onClick={handleAddNosScore}
                >
                    <div className="truco-score-card-content">
                        <div className="truco-team-label">NÓS</div>
                        <div className="truco-score">{nosScore}</div>
                        <div className="truco-rounds">+{pontosRodada}</div>
                    </div>
                </div>

                {/* Eles Card */}
                <div 
                    className={`truco-score-card ${winner === 'eles' ? 'winner' : winner === 'nos' ? 'loser' : ''}`}
                    onClick={handleAddElesScore}
                >
                    <div className="truco-score-card-content">
                        <div className="truco-team-label">ELES</div>
                        <div className="truco-score">{elesScore}</div>
                        <div className="truco-rounds">+{pontosRodada}</div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="truco-actions">
                <button
                    onClick={handlePonto1}
                    className="truco-btn-primary"
                >
                    <span className="truco-btn-emoji">🃏</span>
                    1 PONTO
                    <span className="truco-btn-emoji">🃏</span>
                </button>

                <button
                    onClick={handleTruco3}
                    className="truco-btn-primary"
                >
                    <span className="truco-btn-emoji">🔥</span>
                    TRUCO 3 PONTOS
                    <span className="truco-btn-emoji">🔥</span>
                </button>

                <button
                    onClick={handleTruco6}
                    className="truco-btn-primary"
                >
                    <span className="truco-btn-emoji">🔪</span>
                    TRUCO 6 PONTOS
                    <span className="truco-btn-emoji">🔪</span>
                </button>


                <button
                    onClick={handleTruco12}
                    className="truco-btn-primary"
                >
                    <span className="truco-btn-emoji">🌡</span>
                    TRUCO 12 PONTOS
                    <span className="truco-btn-emoji">🌡</span>
                </button>

                <div className="truco-btn-row">
                    <button
                        onClick={() => {
                            const newScore = Math.max(0, nosScore - 1);
                            setNosScore(newScore);
                            if (newScore < 12 && elesScore < 12) {
                                setWinner(null);
                            }
                        }}
                        className="truco-btn-secondary"
                    >
                        NÓS -1 Ponto
                    </button>
                    <button
                        onClick={() => {
                            const newScore = Math.max(0, elesScore - 1);
                            setElesScore(newScore);
                            if (newScore < 12 && nosScore < 12) {
                                setWinner(null);
                            }
                        }}
                        className="truco-btn-secondary"
                    >
                        ELES -1 Ponto
                    </button>
                </div>

                <button
                    onClick={resetGame}
                    className="truco-btn-reset"
                >
                    <RotateCcw />
                    Reiniciar Rodada
                </button>
            </div>

            {/* Botão para expandir conteúdo educacional */}
            <button
              onClick={() => setExpandContent(!expandContent)}
              style={{
                margin: '30px 20px 20px 20px',
                padding: '10px 20px',
                backgroundColor: theme === 'dark' ? '#444' : '#ddd',
                color: theme === 'dark' ? '#fff' : '#000',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.95em',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                width: 'calc(100% - 40px)',
                maxWidth: '800px'
              }}
            >
              {expandContent ? '▼ Ocultar Informações' : '► Sobre o Truco'}
            </button>

            {/* Conteúdo educacional recolhível */}
            {expandContent && (
              <div style={{ 
                maxWidth: '800px',
                margin: '0 auto',
                padding: '20px',
                marginBottom: '30px',
                fontSize: '0.95em',
                lineHeight: '1.6',
                color: theme === 'dark' ? '#e0e0e0' : '#333',
                opacity: expandContent ? 1 : 0,
                transition: 'opacity 0.3s'
              }}>
                <h2 style={{ 
                  color: theme === 'dark' ? '#fff' : '#000',
                  marginBottom: '15px',
                  fontSize: '1.3em'
                }}>
                  📊 Marcador de Truco Online
                </h2>
                <p style={{ marginBottom: '15px' }}>
                  Use este marcador de <strong>Truco Paulista</strong> para controlar a pontuação em suas partidas. O Truco é o jogo de cartas mais popular do Brasil e combina estratégia, blefe e adrenalina. A primeira dupla a atingir <strong>12 pontos</strong> vence a rodada.
                </p>

                <h3 style={{ 
                  color: theme === 'dark' ? '#fff' : '#000',
                  marginBottom: '10px',
                  fontSize: '1.1em'
                }}>
                  Como usar este marcador:
                </h3>
                <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>Clique nos cartões para adicionar pontos direto</li>
                  <li style={{ marginBottom: '8px' }}>Use os botões para selecionar o valor: 1 ponto, Truco (3), Seis (6), Nove (9) ou Doze (12)</li>
                  <li style={{ marginBottom: '8px' }}>Corrija com os botões "-1 Ponto" se necessário</li>
                  <li>Reinicie a rodada ou partida completa com um clique</li>
                </ul>

                <h3 style={{ 
                  color: theme === 'dark' ? '#fff' : '#000',
                  marginBottom: '10px',
                  fontSize: '1.1em'
                }}>
                  Pontuação:
                </h3>
                <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}><strong>1 Ponto:</strong> Mão comum, ninguém fez truco</li>
                  <li style={{ marginBottom: '8px' }}><strong>Truco (3 pontos):</strong> Alguém aumentou apostando "Truco"</li>
                  <li style={{ marginBottom: '8px' }}><strong>Seis (6 pontos):</strong> Resposta com "Seis" após o Truco</li>
                  <li style={{ marginBottom: '8px' }}><strong>Nove (9 pontos):</strong> Resposta com "Nove" após o Seis</li>
                  <li><strong>Doze (12 pontos):</strong> O máximo da rodada, pedido com "Doze"</li>
                </ul>
              </div>
            )}
        </div>
    );
}