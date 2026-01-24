import React, { useState, useEffect } from 'react';
import './Truco.css';
import { useThemeStyles } from '../../../shared/hooks/useThemeStyles';
import ThemeToggle from '../../../shared/components/ThemeToggle/ThemeToggle';

interface Team {
    id: number;
    name: string;
    score: number;
}

const Truco: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const themeStyles = useThemeStyles();
    const [teams, setTeams] = useState<Team[]>([
        { id: 1, name: 'Nós', score: 0 },
        { id: 2, name: 'Eles', score: 0 },
    ]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [maxScore] = useState(12);

    // Carrega os dados do localStorage ao montar o componente
    useEffect(() => {
        const savedTeams = localStorage.getItem('truco_teams');
        if (savedTeams) {
            try {
                setTeams(JSON.parse(savedTeams));
            } catch (error) {
                console.error('Erro ao carregar equipes do cache:', error);
            }
        }
    }, []);

    // Salva as equipes no localStorage sempre que elas mudam
    useEffect(() => {
        localStorage.setItem('truco_teams', JSON.stringify(teams));
    }, [teams]);

    // Verifica se alguma equipe ganhou
    useEffect(() => {
        const winner = teams.find(team => team.score >= maxScore);
        if (winner) {
            setTimeout(() => {
                alert(`🎉 ${winner.name} venceu com ${winner.score} pontos!`);
            }, 100);
        }
    }, [teams, maxScore]);

    const updateScore = (teamId: number, points: number) => {
        setTeams(teams.map(t =>
            t.id === teamId ? { ...t, score: Math.max(0, t.score + points) } : t
        ));
    };

    const startEditingName = (team: Team) => {
        setEditingId(team.id);
        setEditingName(team.name);
    };

    const saveName = (teamId: number) => {
        setTeams(teams.map(t =>
            t.id === teamId ? { ...t, name: editingName } : t
        ));
        setEditingId(null);
        setEditingName('');
    };

    const resetGame = () => {
        setTeams(teams.map(t => ({ ...t, score: 0 })));
    };

    const resetTeams = () => {
        setTeams([
            { id: 1, name: 'Nós', score: 0 },
            { id: 2, name: 'Eles', score: 0 },
        ]);
    };

    return (
        <div
            className="truco-container"
            style={{ backgroundColor: themeStyles.containerBg }}
        >
            <ThemeToggle />
            
            {/* Sidebar */}
            <div 
                className={`truco-sidebar ${sidebarOpen ? 'open' : ''}`}
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
            <div className="truco-header" style={{ backgroundColor: themeStyles.buttonPrimary.bg }}>
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
                    className="truco-title"
                    style={{ color: themeStyles.buttonPrimary.text }}
                >
                    Truco
                </h1>
            </div>

            <div className="truco-scoreboard">
                {teams.map(team => (
                    <div
                        key={team.id}
                        className={`team-card ${team.score >= maxScore ? 'winner' : ''}`}
                        style={{ backgroundColor: themeStyles.surface }}
                    >
                        <div className="team-header">
                            {editingId === team.id ? (
                                <input
                                    type="text"
                                    className="team-name-input"
                                    style={{
                                        borderColor: themeStyles.buttonPrimary.bg,
                                        color: '#000000',
                                        backgroundColor: '#ffffff'
                                    }}
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onBlur={() => saveName(team.id)}
                                    onKeyPress={(e) => e.key === 'Enter' && saveName(team.id)}
                                    autoFocus
                                />
                            ) : (
                                <h2
                                    className="team-name"
                                    style={{ color: themeStyles.textPrimary }}
                                    onClick={() => startEditingName(team)}
                                    title="Clique para editar"
                                >
                                    {team.name}
                                </h2>
                            )}
                        </div>
                        <div
                            className="team-score"
                            style={{ color: team.score >= maxScore ? '#20c997' : themeStyles.buttonPrimary.bg }}
                        >
                            {team.score}
                        </div>
                        <div className="score-bar-container">
                            <div 
                                className="score-bar"
                                style={{ 
                                    width: `${(team.score / maxScore) * 100}%`,
                                    backgroundColor: team.score >= maxScore ? '#20c997' : themeStyles.buttonPrimary.bg
                                }}
                            />
                        </div>
                        <div className="button-group">
                            <button
                                className="score-button subtract-button"
                                onClick={() => updateScore(team.id, -3)}
                                style={{ backgroundColor: themeStyles.buttonSecondary.bg }}
                            >
                                -3
                            </button>
                            <button
                                className="score-button subtract-button"
                                onClick={() => updateScore(team.id, -1)}
                                style={{ backgroundColor: themeStyles.buttonSecondary.bg }}
                            >
                                -1
                            </button>
                            <button
                                className="score-button add-button"
                                onClick={() => updateScore(team.id, 1)}
                                style={{ backgroundColor: themeStyles.buttonPrimary.bg }}
                            >
                                +1
                            </button>
                            <button
                                className="score-button add-button"
                                onClick={() => updateScore(team.id, 3)}
                                style={{ backgroundColor: themeStyles.buttonPrimary.bg }}
                            >
                                +3
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Truco;
