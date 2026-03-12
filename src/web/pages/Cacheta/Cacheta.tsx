import React, { useState, useEffect } from 'react';
import './Cacheta.css';
import { useThemeStyles } from '../../../shared/hooks/useThemeStyles';
import ThemeToggle from '../../../shared/components/ThemeToggle/ThemeToggle';
import AdSense from '../../../shared/components/AdSense/AdSense';

interface Player {
    id: number;
    name: string;
    score: number;
}

const Cacheta: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const themeStyles = useThemeStyles();
    const [players, setPlayers] = useState<Player[]>([
        { id: 1, name: 'Jogador 1', score: 0 },
        { id: 2, name: 'Jogador 2', score: 0 },
    ]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Carrega os dados do localStorage ao montar o componente
    useEffect(() => {
        const savedPlayers = localStorage.getItem('cacheta_players');
        if (savedPlayers) {
            try {
                setPlayers(JSON.parse(savedPlayers));
            } catch (error) {
                console.error('Erro ao carregar jogadores do cache:', error);
            }
        }
    }, []);

    // Salva os jogadores no localStorage sempre que eles mudam
    useEffect(() => {
        localStorage.setItem('cacheta_players', JSON.stringify(players));
    }, [players]);

    const updateScore = (playerId: number, points: number) => {
        setPlayers(players.map(p =>
            p.id === playerId ? { ...p, score: p.score + points } : p
        ));
    };

    const addPlayer = () => {
        const newId = Math.max(...players.map(p => p.id), 0) + 1;
        setPlayers([...players, { id: newId, name: `Jogador ${newId}`, score: 0 }]);
    };

    const removePlayer = (playerId: number) => {
        if (players.length > 1) {
            setPlayers(players.filter(p => p.id !== playerId));
        }
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
        setPlayers(players.map(p => ({ ...p, score: 0 })));
    };

    const resetPlayers = () => {
        setPlayers([
            { id: 1, name: 'Jogador 1', score: 0 },
            { id: 2, name: 'Jogador 2', score: 0 },
        ]);
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

            {/* AdSense */}
            <AdSense />

            <div className="cacheta-scoreboard">
                {players.map(player => (
                    <div
                        key={player.id}
                        className="player-card"
                        style={{ backgroundColor: themeStyles.surface }}
                    >
                        <div className="player-header">
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
        </div>
    );
};

export default Cacheta;
