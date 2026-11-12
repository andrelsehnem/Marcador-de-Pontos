import React, { useState, useEffect } from 'react';
import './Cacheta.css';
import { useThemeStyles } from '../../../shared/hooks/useThemeStyles';
import ThemeToggle from '../../../shared/components/ThemeToggle/ThemeToggle';


interface Player {
    id: number;
    name: string;
    score: number;
}

interface CachetaStorageData {
    players: Player[];
    dealerId: number | null;
    initialScore?: number;
}

const Cacheta: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const themeStyles = useThemeStyles();
    const [expandContent, setExpandContent] = useState(false);
    const [players, setPlayers] = useState<Player[]>([
        { id: 1, name: 'Jogador 1', score: 10 },
        { id: 2, name: 'Jogador 2', score: 10 },
    ]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dealerId, setDealerId] = useState<number | null>(null);
    const [initialScore, setInitialScore] = useState<string>('10');
    const [initialScoreFocused, setInitialScoreFocused] = useState(false);

    const getSanitizedInitialScore = (value: string): number => {
        const parsed = Number.parseInt(value, 10);
        if (Number.isNaN(parsed)) {
            return 0;
        }

        return Math.max(parsed, 0);
    };

    // Carrega os dados do localStorage ao montar o componente
    useEffect(() => {
        const savedPlayers = localStorage.getItem('cacheta_players');
        if (savedPlayers) {
            try {
                const parsed = JSON.parse(savedPlayers) as Player[] | CachetaStorageData;
                if (Array.isArray(parsed)) {
                    setPlayers(parsed);
                    setDealerId(null);
                } else {
                    setPlayers(parsed.players ?? []);
                    setDealerId(parsed.dealerId ?? null);
                    setInitialScore((parsed.initialScore ?? 10).toString());
                }
            } catch (error) {
                console.error('Erro ao carregar jogadores do cache:', error);
            }
        }
    }, []);

    // Salva os jogadores no localStorage sempre que eles mudam
    useEffect(() => {
        const payload: CachetaStorageData = {
            players,
            dealerId,
            initialScore: getSanitizedInitialScore(initialScore),
        };
        localStorage.setItem('cacheta_players', JSON.stringify(payload));
    }, [players, dealerId, initialScore]);

    const updateScore = (playerId: number, points: number) => {
        setPlayers(players.map(p =>
            p.id === playerId ? { ...p, score: p.score + points } : p
        ));
    };

    const addPlayer = () => {
        const newId = Math.max(...players.map(p => p.id), 0) + 1;
        const scoreValue = getSanitizedInitialScore(initialScore);
        setPlayers([...players, { id: newId, name: `Jogador ${newId}`, score: scoreValue }]);
    };

    const removePlayer = (playerId: number) => {
        if (players.length > 1) {
            setPlayers(players.filter(p => p.id !== playerId));
            if (dealerId === playerId) {
                setDealerId(null);
            }
        }
    };

    const toggleDealer = (playerId: number) => {
        setDealerId(currentDealerId => (currentDealerId === playerId ? null : playerId));
    };

    const startEditingName = (player: Player) => {
        setEditingId(player.id);
        setEditingName(player.name);
    };

    const saveName = (playerId: number) => {
        setPlayers(players.map(p =>
            p.id === playerId ? { ...p, name: editingName } : p
        ));
        setEditingId(null);
        setEditingName('');
    };

    const resetGame = () => {
        const scoreValue = getSanitizedInitialScore(initialScore);
        setPlayers(players.map(p => ({ ...p, score: scoreValue })));
    };

    const resetPlayers = () => {
        const scoreValue = getSanitizedInitialScore(initialScore);
        setPlayers([
            { id: 1, name: 'Jogador 1', score: scoreValue },
            { id: 2, name: 'Jogador 2', score: scoreValue },
        ]);
        setDealerId(null);
    };

    return (
        <div
            className="cacheta-container"
            style={{ backgroundColor: themeStyles.containerBg }}
        >
            <ThemeToggle />
            
            {/* Sidebar */}
            <div 
                className={`cacheta-sidebar ${sidebarOpen ? 'open' : ''}`}
                style={{ backgroundColor: themeStyles.buttonPrimary.bg }}
            >
                <div className="sidebar-header">
                    <h2 style={{ color: themeStyles.buttonPrimary.text }}>Menu</h2>
                    <button
                        className="sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                        style={{ color: themeStyles.buttonPrimary.text }}
                    >
                        ✕
                    </button>
                </div>
                <div className="sidebar-content">
                    <button
                        className="sidebar-button"
                        onClick={() => {
                            onBack();
                            setSidebarOpen(false);
                        }}
                        style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: themeStyles.buttonPrimary.text 
                        }}
                    >
                        <span className="sidebar-button-icon">←</span>
                        <span>Voltar</span>
                    </button>
                    <button
                        className="sidebar-button"
                        onClick={() => {
                            addPlayer();
                            setSidebarOpen(false);
                        }}
                        style={{ 
                            backgroundColor: themeStyles.buttonPrimaryAlt.bg,
                            color: '#ffffff'
                        }}
                    >
                        <span className="sidebar-button-icon">+</span>
                        <span>Adicionar Jogador</span>
                    </button>
                    <button
                        className="sidebar-button"
                        onClick={() => {
                            resetGame();
                            setSidebarOpen(false);
                        }}
                        style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: themeStyles.buttonPrimary.text 
                        }}
                    >
                        <span className="sidebar-button-icon">🔄</span>
                        <span>Zerar Placar</span>
                    </button>
                    <button
                        className="sidebar-button"
                        onClick={() => {
                            resetPlayers();
                            setSidebarOpen(false);
                        }}
                        style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: themeStyles.buttonPrimary.text 
                        }}
                    >
                        <span className="sidebar-button-icon">🔃</span>
                        <span>Reiniciar Jogo</span>
                    </button>

                    <div className="sidebar-initial-score">
                        <span className="sidebar-initial-score-label">
                            🎯 Pontuação Inicial
                        </span>
                        <div
                            className="sidebar-score-controls"
                            style={{
                                borderColor: initialScoreFocused
                                    ? 'rgba(255, 255, 255, 0.9)'
                                    : 'rgba(255, 255, 255, 0.35)',
                                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                            }}
                        >
                            <button
                                type="button"
                                className="initial-score-button"
                                onClick={() => {
                                    const value = getSanitizedInitialScore(initialScore);
                                    setInitialScore(Math.max(value - 1, 0).toString());
                                }}
                                style={{ color: themeStyles.buttonPrimary.text }}
                            >
                                −
                            </button>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={3}
                                className="initial-score-input"
                                value={initialScore}
                                onChange={(e) => setInitialScore(e.target.value)}
                                onFocus={() => setInitialScoreFocused(true)}
                                onBlur={() => {
                                    setInitialScoreFocused(false);
                                    setInitialScore(getSanitizedInitialScore(initialScore).toString());
                                }}
                                placeholder="Ex: 10"
                                aria-label="Pontuação Inicial"
                                style={{ color: themeStyles.buttonPrimary.text }}
                            />
                            <button
                                type="button"
                                className="initial-score-button"
                                onClick={() => {
                                    const value = getSanitizedInitialScore(initialScore);
                                    setInitialScore((value + 1).toString());
                                }}
                                style={{ color: themeStyles.buttonPrimary.text }}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div 
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Header */}
            <div className="cacheta-header" style={{ backgroundColor: themeStyles.buttonPrimary.bg }}>
                <button
                    className="burger-button"
                    onClick={() => setSidebarOpen(true)}
                    style={{ color: themeStyles.buttonPrimary.text }}
                >
                    <div className="burger-line"></div>
                    <div className="burger-line"></div>
                    <div className="burger-line"></div>
                </button>
                <h1
                    className="cacheta-title"
                    style={{ color: themeStyles.buttonPrimary.text }}
                >
                    Marcador de Cacheta Online
                </h1>
            </div>

            <div className="cacheta-scoreboard">
                {players.map(player => (
                    <div
                        key={player.id}
                        className="player-card"
                        style={{ backgroundColor: themeStyles.surface }}
                    >
                        <div className="player-header">
                            <div className="player-name-container">
                                {editingId === player.id ? (
                                    <input
                                        type="text"
                                        className="player-name-input"
                                        style={{
                                            borderColor: themeStyles.buttonPrimary.bg,
                                            color: '#000000',
                                            backgroundColor: '#ffffff'
                                        }}
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onBlur={() => saveName(player.id)}
                                        onKeyPress={(e) => e.key === 'Enter' && saveName(player.id)}
                                        autoFocus
                                    />
                                ) : (
                                    <h2
                                        className="player-name"
                                        style={{ color: themeStyles.textPrimary }}
                                        onClick={() => startEditingName(player)}
                                        title="Clique para editar"
                                    >
                                        {player.name}
                                    </h2>
                                )}
                                <button
                                    className="dealer-button"
                                    onClick={() => toggleDealer(player.id)}
                                    style={{
                                        borderColor: themeStyles.buttonPrimary.bg,
                                        backgroundColor: dealerId === player.id ? themeStyles.buttonPrimary.bg : 'transparent',
                                        color: dealerId === player.id ? '#ffffff' : themeStyles.buttonPrimary.bg,
                                    }}
                                >
                                    {dealerId === player.id ? '🚩 Deu carta' : 'Deu carta'}
                                </button>
                            </div>
                            {players.length > 1 && (
                                <button
                                    className="remove-button"
                                    onClick={() => removePlayer(player.id)}
                                    title="Remover jogador"
                                    style={{ backgroundColor: themeStyles.buttonSecondary.bg }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        <div
                            className="player-score"
                            style={{ color: themeStyles.buttonPrimary.bg }}
                        >
                            {player.score}
                        </div>
                        <div className="button-group">
                            <button
                                className="score-button subtract-button"
                                onClick={() => updateScore(player.id, -2)}
                                style={{ backgroundColor: themeStyles.buttonSecondary.bg }}
                            >
                                -2
                            </button>
                            <button
                                className="score-button subtract-button"
                                onClick={() => updateScore(player.id, -1)}
                                style={{ backgroundColor: themeStyles.buttonSecondary.bg }}
                            >
                                -1
                            </button>
                            <button
                                className="score-button add-button"
                                onClick={() => updateScore(player.id, 1)}
                                style={{ backgroundColor: themeStyles.buttonPrimary.bg }}
                            >
                                +1
                            </button>
                            <button
                                className="score-button add-button"
                                onClick={() => updateScore(player.id, 2)}
                                style={{ backgroundColor: themeStyles.buttonPrimary.bg }}
                            >
                                +2
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    className="add-player-button"
                    onClick={addPlayer}
                    style={{ backgroundColor: themeStyles.buttonPrimaryAlt.bg }}
                >
                    + Adicionar Jogador
                </button>
            </div>

            {/* Botão para expandir conteúdo educacional */}
            <button
              onClick={() => setExpandContent(!expandContent)}
              style={{
                margin: '30px 20px 20px 20px',
                padding: '10px 20px',
                backgroundColor: themeStyles.buttonSecondary.bg,
                color: themeStyles.buttonSecondary.text,
                border: `1px solid ${themeStyles.buttonSecondary.border}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.95em',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                width: '200px',
                maxWidth: '800px'
              }}
            >
              {expandContent ? '▼ Ocultar Informações' : '► Sobre a Cacheta'}
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
                color: themeStyles.textPrimary,
                opacity: expandContent ? 1 : 0,
                transition: 'opacity 0.3s'
              }}>
                <h2 style={{ 
                  color: themeStyles.textPrimary,
                  marginBottom: '15px',
                  fontSize: '1.3em'
                }}>
                  🃏 Marcador de Cacheta Online
                </h2>
                <p style={{ marginBottom: '15px' }}>
                  Bem-vindo ao melhor marcador de <strong>Cacheta</strong>! Este é um jogo de estratégia e combinação de cartas muito popular no Brasil, particularmente entre amigos e famílias. Organize suas mãos em trincas (cartas do mesmo valor) ou sequências do mesmo naipe para bater antes dos adversários.
                </p>

                <h3 style={{ 
                  color: themeStyles.textPrimary,
                  marginBottom: '10px',
                  fontSize: '1.1em'
                }}>
                  Como usar este marcador:
                </h3>
                <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>Adicione todos os jogadores da mesa clicando em "+ Adicionar Jogador"</li>
                  <li style={{ marginBottom: '8px' }}>Clique nos nomes para personalizar o nome de cada jogador</li>
                  <li style={{ marginBottom: '8px' }}>Use os botões +1 e +2 para aumentar a pontuação (ou -1 e -2 para corrigir)</li>
                  <li style={{ marginBottom: '8px' }}>Suporta de 2 a 6 jogadores dependendo de sua mesa</li>
                  <li>Use o menu para zerar placar ou reiniciar a partida completa</li>
                </ul>

                <h3 style={{ 
                  color: themeStyles.textPrimary,
                  marginBottom: '10px',
                  fontSize: '1.1em'
                }}>
                  Objetivo do Jogo:
                </h3>
                <p style={{ marginBottom: '20px' }}>
                  Na Cacheta, o objetivo é ser o primeiro a organizar sua mão em <strong>combinações válidas</strong> (trincas ou sequências) e bater. Cada jogador compra e descarta cartas estrategicamente para montar suas combinações. Quem entender melhor a lógica das cartas e planejar seus movimentos com antecedência tende a vencer mais rodadas.
                </p>

                <h3 style={{ 
                  color: themeStyles.textPrimary,
                  marginBottom: '10px',
                  fontSize: '1.1em'
                }}>
                  Dicas para novos jogadores:
                </h3>
                <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}><strong>Observe o descarte:</strong> As cartas que seus adversários descartam revelam informações preciosas</li>
                  <li style={{ marginBottom: '8px' }}><strong>Planeje sequências:</strong> Sempre tente conectar cartas do mesmo naipe para facilitar compras</li>
                  <li style={{ marginBottom: '8px' }}><strong>Gestão de risco:</strong> Nem sempre vale a pena comprar do lixo; às vezes é melhor descartar algo seguro</li>
                  <li><strong>Bata na hora certa:</strong> Ter 2-3 combinações já é o suficiente para bater em muitas mesas</li>
                </ul>
              </div>
            )}
        </div>
    );
};

export default Cacheta;
