import React, { useState, useEffect } from 'react';
import { RotateCcw, Menu, Clock, ArrowLeft } from 'lucide-react';
import './Truco.css';
import ThemeToggle from '../../../shared/components/ThemeToggle/ThemeToggle';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import AdSense from '../../../shared/components/AdSense/AdSense';

export default function TrucoPaulista({ onBack }: { onBack: () => void }) {
    const { theme } = useTheme();
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

            {/* AdSense */}
            <AdSense />

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
        </div>
    );
}