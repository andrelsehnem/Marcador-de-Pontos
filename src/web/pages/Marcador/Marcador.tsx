import React, { useEffect, useMemo, useState } from 'react';
import ThemeToggle from '../../../shared/components/ThemeToggle/ThemeToggle';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import './Marcador.css';

interface MarcadorProps {
  onBack: () => void;
}

const STORAGE_KEY = 'marcador-livre-web-v1';

interface MarcadorState {
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
}

const DEFAULT_STATE: MarcadorState = {
  teamAName: 'EQUIPE A',
  teamBName: 'EQUIPE B',
  teamAScore: 0,
  teamBScore: 0,
};

const Marcador: React.FC<MarcadorProps> = ({ onBack }) => {
  const { theme, colors } = useTheme();

  const [state, setState] = useState<MarcadorState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return DEFAULT_STATE;
    }

    try {
      return {
        ...DEFAULT_STATE,
        ...(JSON.parse(saved) as Partial<MarcadorState>),
      };
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const isDark = theme === 'dark';

  const palette = useMemo(() => {
    const baseText = isDark ? colors.text.dark : colors.text.light;

    return {
      headerBg: isDark
        ? `linear-gradient(135deg, ${colors.background.dark2} 0%, #111c35 100%)`
        : `linear-gradient(135deg, ${colors.surface} 0%, #e9eef8 100%)`,
      headerBorder: isDark ? '#2f3d61' : '#c7d2e5',
      headerAccent: isDark ? '#7fb2ff' : colors.secondaryDark,
      pageBg: isDark ? colors.background.dark : colors.background.light,
      teamATintSoft: isDark ? 'rgba(59,130,246,0.38)' : 'rgba(59,130,246,0.3)',
      teamATintStrong: isDark ? 'rgba(14,165,233,0.66)' : 'rgba(14,165,233,0.58)',
      teamBTintSoft: isDark ? 'rgba(252, 163, 100, 0.7)' : 'rgba(248, 149, 78, 0.62)',
      teamBTintStrong: isDark ? 'rgba(249,115,22,0.68)' : 'rgba(249,115,22,0.6)',
      text: baseText,
      zoneText: isDark ? 'rgba(255,255,255,0.82)' : 'rgba(15,23,42,0.76)',
      divider: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.16)',
      inputBg: isDark ? 'rgba(15,23,42,0.62)' : 'rgba(255,255,255,0.82)',
      inputBorder: isDark ? 'rgba(255,255,255,0.34)' : 'rgba(15,23,42,0.32)',
      scoreTextShadow: isDark ? '0 2px 12px rgba(0,0,0,0.45)' : '0 2px 8px rgba(0,0,0,0.2)',
    };
  }, [isDark, colors]);

  const updateTeamName = (team: 'A' | 'B', value: string) => {
    setState((prev) => {
      if (team === 'A') {
        return { ...prev, teamAName: value };
      }
      return { ...prev, teamBName: value };
    });
  };

  const normalizeTeamName = (team: 'A' | 'B') => {
    setState((prev) => {
      if (team === 'A') {
        const nextName = prev.teamAName.trim() || DEFAULT_STATE.teamAName;
        return { ...prev, teamAName: nextName };
      }

      const nextName = prev.teamBName.trim() || DEFAULT_STATE.teamBName;
      return { ...prev, teamBName: nextName };
    });
  };

  const changeScore = (team: 'A' | 'B', delta: number) => {
    setState((prev) => {
      if (team === 'A') {
        return { ...prev, teamAScore: Math.max(0, prev.teamAScore + delta) };
      }
      return { ...prev, teamBScore: Math.max(0, prev.teamBScore + delta) };
    });
  };

  const rootStyle = {
    '--marcador-header-bg': palette.headerBg,
    '--marcador-header-border': palette.headerBorder,
    '--marcador-header-accent': palette.headerAccent,
    '--marcador-page-bg': palette.pageBg,
    '--marcador-team-a-soft': palette.teamATintSoft,
    '--marcador-team-a-strong': palette.teamATintStrong,
    '--marcador-team-b-soft': palette.teamBTintSoft,
    '--marcador-team-b-strong': palette.teamBTintStrong,
    '--marcador-text': palette.text,
    '--marcador-zone-text': palette.zoneText,
    '--marcador-divider': palette.divider,
    '--marcador-input-bg': palette.inputBg,
    '--marcador-input-border': palette.inputBorder,
    '--marcador-score-shadow': palette.scoreTextShadow,
  } as React.CSSProperties;

  return (
    <div className="marcador-page" style={rootStyle}>
      <h1 className="sr-only">Marcador de Pontos Livre</h1>

      <header className="marcador-header">
        <button className="marcador-back" onClick={onBack}>
          ← Voltar
        </button>

        <div className="marcador-header-center">
          <span className="marcador-header-chip">MODO LIVRE</span>
          <span className="marcador-header-title">MARCADOR DE PONTOS</span>
        </div>

        <div className="marcador-header-tools">
          <ThemeToggle />
        </div>
      </header>

      <main className="marcador-main">
        <section className="marcador-team marcador-team-a">
          <div className="marcador-team-label-wrap">
            <input
              className="marcador-team-input"
              value={state.teamAName}
              maxLength={18}
              onChange={(event) => updateTeamName('A', event.target.value.toUpperCase())}
              onBlur={() => normalizeTeamName('A')}
              aria-label="Nome da equipe A"
            />
            <div className="marcador-team-score">{state.teamAScore}</div>
          </div>

          <button className="marcador-zone marcador-zone-soft" onClick={() => changeScore('A', -1)}>
            <span className="marcador-zone-value">-1</span>
          </button>

          <button className="marcador-zone marcador-zone-strong" onClick={() => changeScore('A', 1)}>
            <span className="marcador-zone-value">+1</span>
          </button>
        </section>

        <section className="marcador-team marcador-team-b">
          <div className="marcador-team-label-wrap">
            <input
              className="marcador-team-input"
              value={state.teamBName}
              maxLength={18}
              onChange={(event) => updateTeamName('B', event.target.value.toUpperCase())}
              onBlur={() => normalizeTeamName('B')}
              aria-label="Nome da equipe B"
            />
            <div className="marcador-team-score">{state.teamBScore}</div>
          </div>

          <button className="marcador-zone marcador-zone-soft" onClick={() => changeScore('B', -1)}>
            <span className="marcador-zone-value">-1</span>
          </button>

          <button className="marcador-zone marcador-zone-strong" onClick={() => changeScore('B', 1)}>
            <span className="marcador-zone-value">+1</span>
          </button>
        </section>
      </main>
    </div>
  );
};

export default Marcador;
