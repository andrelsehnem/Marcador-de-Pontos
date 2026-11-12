import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import ThemeToggle from '../../../shared/components/ThemeToggle/ThemeToggle';
import { CanastraConfig, CanastraGame, DEFAULT_CONFIG, DEFAULT_GAME, Score } from './types';
import './Canastra.css';

interface CanastraProps { onNavigate: (page: string) => void; }
type TeamId = 'time1' | 'time2';
type EditingScore = { timeId: TeamId; scoreId: string } | null;

const STORAGE_KEY = 'canastra-web-v1';
const createDefaultGame = (): CanastraGame => ({
  ...DEFAULT_GAME,
  tempoAbertura: Date.now(),
  configPadrao: { ...DEFAULT_CONFIG, atalhosPontuacao: [...DEFAULT_CONFIG.atalhosPontuacao] },
  pontosTime1: [],
  pontosTime2: [],
});

const toFiniteNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const migrateGame = (value: unknown): CanastraGame => {
  const fallback = createDefaultGame();
  if (!value || typeof value !== 'object') return fallback;
  const saved = value as Partial<CanastraGame>;
  const savedConfig = saved.configPadrao as Partial<CanastraConfig> | undefined;
  const savedShortcuts = savedConfig?.atalhosPontuacao;
  const shortcuts = [0, 1, 2].map((index) =>
    toFiniteNumber(savedShortcuts?.[index], DEFAULT_CONFIG.atalhosPontuacao[index])
  ) as [number, number, number];

  return {
    tempoAbertura: toFiniteNumber(saved.tempoAbertura, fallback.tempoAbertura),
    configPadrao: {
      pontosFinais: Math.max(100, toFiniteNumber(savedConfig?.pontosFinais, DEFAULT_CONFIG.pontosFinais)),
      pontosMaras: Math.max(0, toFiniteNumber(savedConfig?.pontosMaras, DEFAULT_CONFIG.pontosMaras)),
      atalhosPontuacao: shortcuts,
    },
    nomeTime1: typeof saved.nomeTime1 === 'string' && saved.nomeTime1.trim() ? saved.nomeTime1 : fallback.nomeTime1,
    nomeTime2: typeof saved.nomeTime2 === 'string' && saved.nomeTime2.trim() ? saved.nomeTime2 : fallback.nomeTime2,
    pontosTime1: Array.isArray(saved.pontosTime1) ? saved.pontosTime1 : [],
    pontosTime2: Array.isArray(saved.pontosTime2) ? saved.pontosTime2 : [],
    vencedor: saved.vencedor === 'time1' || saved.vencedor === 'time2' ? saved.vencedor : null,
  };
};

const loadGame = (): CanastraGame => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? migrateGame(JSON.parse(saved)) : createDefaultGame();
  } catch { return createDefaultGame(); }
};

const calcTotal = (scores: Score[]): number => scores.reduce((sum, score) => sum + score.valor, 0);
const formatSigned = (value: number): string => `${value > 0 ? '+' : ''}${value}`;

const Canastra: React.FC<CanastraProps> = ({ onNavigate }) => {
  const { appearance } = useTheme();
  const [game, setGame] = useState<CanastraGame>(loadGame);
  const [showConfigModal, setShowConfigModal] = useState(
    () => game.vencedor === null && game.pontosTime1.length === 0 && game.pontosTime2.length === 0
  );
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [editingScoreId, setEditingScoreId] = useState<EditingScore>(null);
  const [editingValue, setEditingValue] = useState('');
  const [tempConfig, setTempConfig] = useState<CanastraConfig>(game.configPadrao);
  const [inputs, setInputs] = useState<Record<TeamId, string>>({ time1: '', time2: '' });
  const totalTime1 = useMemo(() => calcTotal(game.pontosTime1), [game.pontosTime1]);
  const totalTime2 = useMemo(() => calcTotal(game.pontosTime2), [game.pontosTime2]);

  const checkWinner = (time1: number, time2: number, config: CanastraConfig): TeamId | null => {
    if (time1 >= config.pontosFinais) return 'time1';
    if (time2 >= config.pontosFinais) return 'time2';
    return null;
  };

  useEffect(() => { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(game)); }, [game]);
  useEffect(() => { if (game.vencedor) setShowFinishModal(true); }, [game.vencedor]);

  const updateScores = (timeId: TeamId, update: (scores: Score[]) => Score[]) => {
    setGame((previous) => {
      const pontosTime1 = timeId === 'time1' ? update(previous.pontosTime1) : previous.pontosTime1;
      const pontosTime2 = timeId === 'time2' ? update(previous.pontosTime2) : previous.pontosTime2;
      return { ...previous, pontosTime1, pontosTime2, vencedor: checkWinner(calcTotal(pontosTime1), calcTotal(pontosTime2), previous.configPadrao) };
    });
  };

  const addScore = (timeId: TeamId, value: number) => {
    if (!Number.isFinite(value) || value === 0 || game.vencedor) return;
    const score: Score = { id: `${Date.now()}-${Math.random()}`, valor: value, timestamp: Date.now() };
    updateScores(timeId, (scores) => [...scores, score]);
  };

  const submitScore = (event: FormEvent, timeId: TeamId) => {
    event.preventDefault();
    const value = Number(inputs[timeId].trim().replace(',', '.'));
    if (!Number.isFinite(value) || value === 0) return;
    addScore(timeId, value);
    setInputs((previous) => ({ ...previous, [timeId]: '' }));
  };

  const editScore = (timeId: TeamId, scoreId: string, value: number) => {
    if (!Number.isFinite(value) || game.vencedor) return;
    updateScores(timeId, (scores) => scores.map((score) => score.id === scoreId ? { ...score, valor: value } : score));
    setEditingScoreId(null);
  };

  const deleteScore = (timeId: TeamId, scoreId: string) => {
    if (!game.vencedor) updateScores(timeId, (scores) => scores.filter((score) => score.id !== scoreId));
  };

  const updateTeamName = (timeId: TeamId, value: string) => {
    setGame((previous) => timeId === 'time1'
      ? { ...previous, nomeTime1: value }
      : { ...previous, nomeTime2: value });
  };

  const normalizeTeamName = (timeId: TeamId) => {
    setGame((previous) => timeId === 'time1'
      ? { ...previous, nomeTime1: previous.nomeTime1.trim() || 'Nós' }
      : { ...previous, nomeTime2: previous.nomeTime2.trim() || 'Eles' });
  };

  const openConfig = () => {
    setTempConfig({ ...game.configPadrao, atalhosPontuacao: [...game.configPadrao.atalhosPontuacao] });
    setShowConfigModal(true);
  };

  const applyConfig = () => {
    const config: CanastraConfig = {
      pontosFinais: Math.max(100, toFiniteNumber(tempConfig.pontosFinais, DEFAULT_CONFIG.pontosFinais)),
      pontosMaras: Math.max(0, toFiniteNumber(tempConfig.pontosMaras, DEFAULT_CONFIG.pontosMaras)),
      atalhosPontuacao: tempConfig.atalhosPontuacao.map((value, index) =>
        toFiniteNumber(value, DEFAULT_CONFIG.atalhosPontuacao[index])) as [number, number, number],
    };
    setGame((previous) => ({ ...previous, configPadrao: config, vencedor: checkWinner(totalTime1, totalTime2, config) }));
    setShowConfigModal(false);
  };

  const startNewGame = () => {
    setGame((previous) => ({ ...previous, tempoAbertura: Date.now(), pontosTime1: [], pontosTime2: [], vencedor: null }));
    setEditingScoreId(null);
    setShowFinishModal(false);
  };

  const rootStyle = {
    '--canastra-page-bg': appearance.background,
    '--canastra-surface': appearance.surface,
    '--canastra-text': appearance.text,
    '--canastra-surface-text': appearance.surfaceText,
    '--canastra-muted': appearance.mutedText,
    '--canastra-action': appearance.action,
    '--canastra-on-action': appearance.onAction,
    '--canastra-border': appearance.border,
    '--canastra-danger': appearance.danger,
    '--canastra-warning': appearance.warning,
  } as React.CSSProperties;

  const renderTeam = (timeId: TeamId, suit: string) => {
    const isFirst = timeId === 'time1';
    const name = isFirst ? game.nomeTime1 : game.nomeTime2;
    const scores = isFirst ? game.pontosTime1 : game.pontosTime2;
    const total = isFirst ? totalTime1 : totalTime2;
    const progress = Math.min(100, Math.max(0, total / Math.max(1, game.configPadrao.pontosFinais) * 100));
    const isInMara = game.configPadrao.pontosMaras > 0 && total >= game.configPadrao.pontosMaras;
    return (
      <section className={`canastra-team canastra-team-${isFirst ? '1' : '2'} ${isInMara ? 'is-in-mara' : ''}`} aria-label={`Placar ${name}`}>
        <div className="canastra-team-heading">
          <span className="canastra-suit" aria-hidden="true">{suit}</span>
          <input className="canastra-team-name" value={name} maxLength={24} aria-label={`Nome do ${isFirst ? 'primeiro' : 'segundo'} time`} onChange={(event) => updateTeamName(timeId, event.target.value)} onBlur={() => normalizeTeamName(timeId)} />
        </div>
        <div className="canastra-scoreboard">
          {isInMara && <span className="canastra-mara-badge" role="status">◆ Na mara</span>}
          <output className="canastra-team-total" aria-label={`${name}: ${total} pontos`}>{total}</output>
          <div className="canastra-progress" role="progressbar" aria-valuemin={0} aria-valuemax={game.configPadrao.pontosFinais} aria-valuenow={Math.min(game.configPadrao.pontosFinais, Math.max(0, total))}><span style={{ width: `${progress}%` }} /></div>
          <span className="canastra-goal-label">meta {game.configPadrao.pontosFinais}</span>
        </div>
        <div className="canastra-history-wrap">
          <div className="canastra-history-label"><span>Histórico</span><span>{scores.length} {scores.length === 1 ? 'rodada' : 'rodadas'}</span></div>
          <div className="canastra-historico">
            {scores.length === 0 ? <p className="canastra-empty">Os pontos aparecem aqui</p> : scores.slice().reverse().map((score) => (
              <div key={score.id} className="canastra-score-item">
                {editingScoreId?.timeId === timeId && editingScoreId.scoreId === score.id ? (
                  <input className="canastra-score-edit" autoFocus type="number" value={editingValue} aria-label="Editar pontuação" onChange={(event) => setEditingValue(event.target.value)} onBlur={() => editScore(timeId, score.id, Number(editingValue))} onKeyDown={(event) => { if (event.key === 'Enter') editScore(timeId, score.id, Number(editingValue)); if (event.key === 'Escape') setEditingScoreId(null); }} />
                ) : (
                  <button className={`canastra-score-value ${score.valor < 0 ? 'is-negative' : ''}`} onClick={() => { setEditingScoreId({ timeId, scoreId: score.id }); setEditingValue(String(score.valor)); }} aria-label={`Editar lançamento ${formatSigned(score.valor)}`}>{formatSigned(score.valor)}</button>
                )}
                <button className="canastra-delete-btn" onClick={() => deleteScore(timeId, score.id)} aria-label={`Excluir lançamento ${formatSigned(score.valor)}`}>×</button>
              </div>
            ))}
          </div>
        </div>
        <div className="canastra-controls">
          <div className="canastra-shortcuts" aria-label={`Atalhos de pontos para ${name}`}>
            {game.configPadrao.atalhosPontuacao.map((shortcut, index) => <button key={`${shortcut}-${index}`} onClick={() => addScore(timeId, shortcut)} disabled={Boolean(game.vencedor)}>{formatSigned(shortcut)}</button>)}
          </div>
          <form className="canastra-input-section" onSubmit={(event) => submitScore(event, timeId)}>
            <input className="canastra-input" type="text" inputMode="numeric" value={inputs[timeId]} placeholder="pontos" aria-label={`Pontuação para ${name}`} onChange={(event) => setInputs((previous) => ({ ...previous, [timeId]: event.target.value }))} />
            <button className="canastra-add-btn" type="submit" disabled={Boolean(game.vencedor)}><span className="canastra-add-full">Somar</span><span className="canastra-add-compact">+</span></button>
          </form>
        </div>
      </section>
    );
  };

  return (
    <div className="canastra-page" style={rootStyle}>
      <h1 className="sr-only">Marcador de Canastra</h1>
      <header className="canastra-header">
        <button className="canastra-back" onClick={() => onNavigate('listajogos')} aria-label="Voltar para jogos"><span aria-hidden="true">←</span><span className="canastra-back-label"> Voltar</span></button>
        <span className="canastra-header-title">Canastra</span>
        <div className="canastra-header-tools"><button className="canastra-config-btn" onClick={openConfig} aria-label="Configurações da partida">⚙</button><ThemeToggle /></div>
      </header>
      <main className="canastra-board">
        {renderTeam('time1', '♥')}
        <button className="canastra-center-config" onClick={openConfig} aria-label="Abrir configurações">⚙</button>
        {renderTeam('time2', '♠')}
      </main>

      {showConfigModal && (
        <div className="canastra-modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowConfigModal(false); }}>
          <div className="canastra-modal" role="dialog" aria-modal="true" aria-labelledby="canastra-config-title">
            <h2 className="canastra-modal-title" id="canastra-config-title">Regras da partida</h2>
            <div className="canastra-config-grid">
              <label>Pontos para vencer<input type="number" min="100" value={tempConfig.pontosFinais} onChange={(event) => setTempConfig((previous) => ({ ...previous, pontosFinais: Number(event.target.value) }))} /></label>
              <label>Entrada na mara<input type="number" min="0" value={tempConfig.pontosMaras} onChange={(event) => setTempConfig((previous) => ({ ...previous, pontosMaras: Number(event.target.value) }))} /></label>
            </div>
            <fieldset className="canastra-shortcut-config"><legend>Atalhos de pontuação</legend><div>
              {tempConfig.atalhosPontuacao.map((shortcut, index) => <label key={index}>Atalho {index + 1}<input type="number" value={shortcut} onChange={(event) => { const next = [...tempConfig.atalhosPontuacao] as [number, number, number]; next[index] = Number(event.target.value); setTempConfig((previous) => ({ ...previous, atalhosPontuacao: next })); }} /></label>)}
            </div></fieldset>
            <div className="canastra-modal-actions"><button className="canastra-btn-secondary" onClick={() => setShowConfigModal(false)}>Cancelar</button><button className="canastra-btn-primary" onClick={applyConfig}>Salvar</button></div>
          </div>
        </div>
      )}

      {showFinishModal && game.vencedor && (
        <div className="canastra-modal-overlay"><div className="canastra-modal canastra-modal-finish" role="dialog" aria-modal="true" aria-labelledby="canastra-winner-title">
          <span className="canastra-winner-mark" aria-hidden="true">♛</span><p className="canastra-finish-label">Fim de partida</p>
          <h2 className="canastra-finish-name" id="canastra-winner-title">{game.vencedor === 'time1' ? game.nomeTime1 : game.nomeTime2} venceu!</h2>
          <div className="canastra-finish-scores"><span>{game.nomeTime1} <strong>{totalTime1}</strong></span><span>{game.nomeTime2} <strong>{totalTime2}</strong></span></div>
          <div className="canastra-modal-actions"><button className="canastra-btn-secondary" onClick={() => setShowFinishModal(false)}>Ver placar</button><button className="canastra-btn-primary" onClick={startNewGame}>Nova partida</button></div>
        </div></div>
      )}
    </div>
  );
};

export default Canastra;
