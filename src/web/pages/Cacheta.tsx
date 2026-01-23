import React, { useState, useEffect } from 'react';
import './Cacheta.css';
import { useThemeStyles } from '../../shared/hooks/useThemeStyles';

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
            <div className="cacheta-header" style={{ backgroundColor: themeStyles.buttonPrimary.bg }}>
                <button
                    className="back-button"
                    onClick={onBack}
                    style={{ color: themeStyles.buttonPrimary.text }}
                >
                    ← Voltar
                </button>
                <h1
                    className="cacheta-title"
                    style={{ color: themeStyles.buttonPrimary.text }}
                >
                    Cacheta
                </h1>

                <div className="header-buttons">

                    <button
                        className="reset-button"
                        onClick={addPlayer}
                        style={{ backgroundColor: themeStyles.buttonPrimaryAlt.bg }}
                    >
                        + Adicionar Jogador
                    </button>

                    <button
                        className="reset-button"
                        onClick={resetGame}
                        style={{ color: themeStyles.buttonPrimary.text }}
                        title="Resetar placar"
                    >
                        Resetar
                    </button>
                    <button
                        className="reset-button"
                        onClick={resetPlayers}
                        style={{ color: themeStyles.buttonPrimary.text }}
                        title="Resetar jogadores"
                    >
                        Reset Jogadores
                    </button>
                </div>

            </div>

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
