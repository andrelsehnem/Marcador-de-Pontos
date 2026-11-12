import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { useInterstitialAd } from '../../shared/components/AdMob/useInterstitialAd';
import {
  CanastraConfig,
  CanastraGame,
  CanastraScore,
  createDefaultCanastraGame,
  DEFAULT_CANASTRA_CONFIG,
} from '../../shared/types/Canastra';

interface CanastraScreenProps { onBack: () => void; }
type TeamId = 'time1' | 'time2';
type EditingScore = { teamId: TeamId; scoreId: string } | null;

const STORAGE_KEY = 'canastra-mobile-v1';

const finiteNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const migrateGame = (value: unknown): CanastraGame => {
  const fallback = createDefaultCanastraGame();
  if (!value || typeof value !== 'object') return fallback;
  const saved = value as Partial<CanastraGame>;
  const config = saved.configPadrao as Partial<CanastraConfig> | undefined;
  const shortcuts = config?.atalhosPontuacao;
  return {
    tempoAbertura: finiteNumber(saved.tempoAbertura, fallback.tempoAbertura),
    configPadrao: {
      pontosFinais: Math.max(100, finiteNumber(config?.pontosFinais, DEFAULT_CANASTRA_CONFIG.pontosFinais)),
      pontosMaras: Math.max(0, finiteNumber(config?.pontosMaras, DEFAULT_CANASTRA_CONFIG.pontosMaras)),
      atalhosPontuacao: [0, 1, 2].map((index) =>
        finiteNumber(shortcuts?.[index], DEFAULT_CANASTRA_CONFIG.atalhosPontuacao[index])) as [number, number, number],
    },
    nomeTime1: typeof saved.nomeTime1 === 'string' && saved.nomeTime1.trim() ? saved.nomeTime1 : fallback.nomeTime1,
    nomeTime2: typeof saved.nomeTime2 === 'string' && saved.nomeTime2.trim() ? saved.nomeTime2 : fallback.nomeTime2,
    pontosTime1: Array.isArray(saved.pontosTime1) ? saved.pontosTime1 : [],
    pontosTime2: Array.isArray(saved.pontosTime2) ? saved.pontosTime2 : [],
    vencedor: saved.vencedor === 'time1' || saved.vencedor === 'time2' ? saved.vencedor : null,
  };
};

const totalScores = (scores: CanastraScore[]) => scores.reduce((sum, score) => sum + score.valor, 0);
const signed = (value: number) => `${value > 0 ? '+' : ''}${value}`;

const CanastraScreen: React.FC<CanastraScreenProps> = ({ onBack }) => {
  const { effectiveTheme, appearance } = useTheme();
  const { showInterstitialAd } = useInterstitialAd();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const isSmall = Math.min(width, height) < 380;
  const [game, setGame] = useState(createDefaultCanastraGame);
  const [loaded, setLoaded] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [tempConfig, setTempConfig] = useState<CanastraConfig>(DEFAULT_CANASTRA_CONFIG);
  const [inputs, setInputs] = useState<Record<TeamId, string>>({ time1: '', time2: '' });
  const [editing, setEditing] = useState<EditingScore>(null);
  const [editingValue, setEditingValue] = useState('');
  const total1 = useMemo(() => totalScores(game.pontosTime1), [game.pontosTime1]);
  const total2 = useMemo(() => totalScores(game.pontosTime2), [game.pontosTime2]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => { if (saved) setGame(migrateGame(JSON.parse(saved))); })
      .catch(() => setGame(createDefaultCanastraGame()))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(game)).catch(() => undefined);
  }, [game, loaded]);

  useEffect(() => { if (game.vencedor) setShowWinner(true); }, [game.vencedor]);

  const winnerFor = (time1: number, time2: number, config: CanastraConfig): TeamId | null => {
    if (time1 >= config.pontosFinais) return 'time1';
    if (time2 >= config.pontosFinais) return 'time2';
    return null;
  };

  const updateScores = (teamId: TeamId, update: (scores: CanastraScore[]) => CanastraScore[]) => {
    setGame((previous) => {
      const pontosTime1 = teamId === 'time1' ? update(previous.pontosTime1) : previous.pontosTime1;
      const pontosTime2 = teamId === 'time2' ? update(previous.pontosTime2) : previous.pontosTime2;
      return { ...previous, pontosTime1, pontosTime2, vencedor: winnerFor(totalScores(pontosTime1), totalScores(pontosTime2), previous.configPadrao) };
    });
  };

  const addScore = (teamId: TeamId, value: number) => {
    if (!Number.isFinite(value) || value === 0 || game.vencedor) return;
    updateScores(teamId, (scores) => [...scores, { id: `${Date.now()}-${Math.random()}`, valor: value, timestamp: Date.now() }]);
  };

  const submitScore = (teamId: TeamId) => {
    const value = Number(inputs[teamId].trim().replace(',', '.'));
    if (!Number.isFinite(value) || value === 0) return;
    addScore(teamId, value);
    setInputs((previous) => ({ ...previous, [teamId]: '' }));
  };

  const commitEdit = (teamId: TeamId, scoreId: string) => {
    const value = Number(editingValue.trim().replace(',', '.'));
    if (!Number.isFinite(value) || game.vencedor) { setEditing(null); return; }
    updateScores(teamId, (scores) => scores.map((score) => score.id === scoreId ? { ...score, valor: value } : score));
    setEditing(null);
  };

  const openConfig = () => {
    setTempConfig({ ...game.configPadrao, atalhosPontuacao: [...game.configPadrao.atalhosPontuacao] });
    setShowConfig(true);
  };

  const saveConfig = () => {
    const config: CanastraConfig = {
      pontosFinais: Math.max(100, finiteNumber(tempConfig.pontosFinais, DEFAULT_CANASTRA_CONFIG.pontosFinais)),
      pontosMaras: Math.max(0, finiteNumber(tempConfig.pontosMaras, DEFAULT_CANASTRA_CONFIG.pontosMaras)),
      atalhosPontuacao: tempConfig.atalhosPontuacao.map((value, index) => finiteNumber(value, DEFAULT_CANASTRA_CONFIG.atalhosPontuacao[index])) as [number, number, number],
    };
    setGame((previous) => ({ ...previous, configPadrao: config, vencedor: winnerFor(total1, total2, config) }));
    setShowConfig(false);
  };

  const newGame = () => {
    setGame((previous) => ({ ...previous, tempoAbertura: Date.now(), pontosTime1: [], pontosTime2: [], vencedor: null }));
    setEditing(null);
    setShowWinner(false);
  };

  const resetFromConfig = () => {
    newGame();
    setShowConfig(false);
  };

  const handleBack = async () => { await showInterstitialAd(); onBack(); };
  const colors = {
    background: appearance.background,
    surface: appearance.surface,
    text: appearance.text,
    surfaceText: appearance.surfaceText,
    muted: appearance.mutedText,
    action: appearance.action,
    onAction: appearance.onAction,
    border: appearance.border,
    danger: appearance.danger,
  };
  const panelGap = isSmall ? 3 : 5;
  const scoreSize = isPortrait ? (isSmall ? 48 : 58) : 76;

  const renderTeam = (teamId: TeamId, suit: string) => {
    const first = teamId === 'time1';
    const name = first ? game.nomeTime1 : game.nomeTime2;
    const scores = first ? game.pontosTime1 : game.pontosTime2;
    const total = first ? total1 : total2;
    const inMara = game.configPadrao.pontosMaras > 0 && total >= game.configPadrao.pontosMaras;
    const progress = Math.min(100, Math.max(0, total / Math.max(1, game.configPadrao.pontosFinais) * 100));
    return (
      <View style={[styles.team, { backgroundColor: first ? colors.surface : colors.background, borderColor: inMara ? colors.action : colors.border, marginRight: first ? panelGap / 2 : 0, marginLeft: first ? 0 : panelGap / 2 }]} accessibilityLabel={`Placar ${name}`}>
        <View style={styles.teamHeading}>
          <Text style={[styles.suit, { color: colors.action }]}>{suit}</Text>
          <TextInput
            value={name}
            maxLength={24}
            onChangeText={(value) => setGame((previous) => first ? { ...previous, nomeTime1: value } : { ...previous, nomeTime2: value })}
            onBlur={() => setGame((previous) => first ? { ...previous, nomeTime1: previous.nomeTime1.trim() || 'Nós' } : { ...previous, nomeTime2: previous.nomeTime2.trim() || 'Eles' })}
            style={[styles.teamName, { color: first ? colors.surfaceText : colors.text, fontSize: isSmall ? 13 : 15 }]}
            autoCapitalize="characters"
            selectTextOnFocus
            accessibilityLabel={`Nome do ${first ? 'primeiro' : 'segundo'} time`}
          />
        </View>
        <View style={styles.scoreArea}>
          {inMara && <View style={[styles.maraBadge, { backgroundColor: colors.action }]}><Text style={[styles.maraText, { color: colors.onAction }]}>◆ NA MARA</Text></View>}
          <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.total, { color: first ? colors.surfaceText : colors.text, fontSize: scoreSize }]}>{total}</Text>
          <View style={[styles.progress, { backgroundColor: colors.border }]}><View style={[styles.progressFill, { backgroundColor: colors.action, width: `${progress}%` }]} /></View>
          <Text style={[styles.goal, { color: colors.muted }]}>META {game.configPadrao.pontosFinais}</Text>
        </View>
        <FlatList
          style={[styles.history, { borderTopColor: colors.border }]}
          data={[...scores].reverse()}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={<Text style={[styles.empty, { color: colors.muted }]}>Os pontos aparecem aqui</Text>}
          renderItem={({ item }) => (
            <View style={[styles.historyItem, { borderColor: colors.border }]}>
              {editing?.teamId === teamId && editing.scoreId === item.id ? (
                <TextInput autoFocus value={editingValue} onChangeText={setEditingValue} onBlur={() => commitEdit(teamId, item.id)} onSubmitEditing={() => commitEdit(teamId, item.id)} keyboardType="numbers-and-punctuation" style={[styles.editInput, { color: first ? colors.surfaceText : colors.text, borderColor: colors.action }]} />
              ) : (
                <TouchableOpacity style={styles.historyValueButton} onPress={() => { setEditing({ teamId, scoreId: item.id }); setEditingValue(String(item.valor)); }} accessibilityLabel={`Editar lançamento ${signed(item.valor)}`}>
                  <Text style={[styles.historyValue, { color: item.valor < 0 ? colors.danger : colors.action }]}>{signed(item.valor)}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.deleteButton} onPress={() => !game.vencedor && updateScores(teamId, (items) => items.filter((score) => score.id !== item.id))} accessibilityLabel={`Excluir lançamento ${signed(item.valor)}`}><Text style={[styles.deleteText, { color: colors.danger }]}>×</Text></TouchableOpacity>
            </View>
          )}
        />
        <View style={styles.controls}>
          <View style={styles.shortcuts}>{game.configPadrao.atalhosPontuacao.map((shortcut, index) => (
            <TouchableOpacity key={`${shortcut}-${index}`} disabled={Boolean(game.vencedor)} onPress={() => addScore(teamId, shortcut)} style={[styles.shortcut, { borderColor: colors.border }]} accessibilityLabel={`Adicionar ${signed(shortcut)} pontos`}><Text numberOfLines={1} adjustsFontSizeToFit style={[styles.shortcutText, { color: first ? colors.surfaceText : colors.text }]}>{signed(shortcut)}</Text></TouchableOpacity>
          ))}</View>
          <View style={styles.inputRow}>
            <TextInput value={inputs[teamId]} onChangeText={(value) => setInputs((previous) => ({ ...previous, [teamId]: value }))} onSubmitEditing={() => submitScore(teamId)} placeholder="pontos" placeholderTextColor={colors.muted} keyboardType="numbers-and-punctuation" returnKeyType="done" style={[styles.scoreInput, { color: first ? colors.surfaceText : colors.text, borderColor: colors.border }]} accessibilityLabel={`Pontuação para ${name}`} />
            <TouchableOpacity disabled={Boolean(game.vencedor)} onPress={() => submitScore(teamId)} style={[styles.addButton, { backgroundColor: colors.action }]} accessibilityLabel={`Somar pontos para ${name}`}><Text style={[styles.addText, { color: colors.onAction }]}>{isSmall || isPortrait ? '+' : 'Somar'}</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const numericConfig = (key: 'pontosFinais' | 'pontosMaras', value: string) => setTempConfig((previous) => ({ ...previous, [key]: Number(value) }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={effectiveTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleBack} style={styles.headerButton} accessibilityLabel="Voltar"><Text style={[styles.headerButtonText, { color: colors.surfaceText }]}>←{!isSmall ? ' Voltar' : ''}</Text></TouchableOpacity>
          <Text style={[styles.title, { color: colors.action }]}>CANASTRA</Text>
          <TouchableOpacity onPress={openConfig} style={styles.headerButton} accessibilityLabel="Configurações"><Text style={[styles.gearText, { color: colors.action }]}>⚙</Text></TouchableOpacity>
        </View>
        <View style={[styles.board, { padding: panelGap }]}>
          {renderTeam('time1', '♥')}
          {renderTeam('time2', '♠')}
          <TouchableOpacity activeOpacity={1} onPress={openConfig} style={[styles.centerGear, { backgroundColor: colors.surface, borderColor: colors.action }]} accessibilityLabel="Abrir configurações"><Text style={[styles.centerGearText, { color: colors.action }]}>⚙</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={showConfig} transparent animationType="fade" onRequestClose={() => setShowConfig(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.action }]}>
            <Text style={[styles.modalTitle, { color: colors.action }]}>Regras da partida</Text>
            <View style={styles.configRow}>
              <View style={styles.configField}><Text style={[styles.configLabel, { color: colors.muted }]}>Pontos para vencer</Text><TextInput value={String(tempConfig.pontosFinais)} onChangeText={(value) => numericConfig('pontosFinais', value)} keyboardType="number-pad" style={[styles.configInput, { color: colors.surfaceText, borderColor: colors.border }]} /></View>
              <View style={styles.configField}><Text style={[styles.configLabel, { color: colors.muted }]}>Entrada na mara</Text><TextInput value={String(tempConfig.pontosMaras)} onChangeText={(value) => numericConfig('pontosMaras', value)} keyboardType="number-pad" style={[styles.configInput, { color: colors.surfaceText, borderColor: colors.border }]} /></View>
            </View>
            <Text style={[styles.configLegend, { color: colors.action }]}>ATALHOS DE PONTUAÇÃO</Text>
            <View style={styles.configRow}>{tempConfig.atalhosPontuacao.map((shortcut, index) => (
              <View key={index} style={styles.configField}><Text style={[styles.configLabel, { color: colors.muted }]}>Atalho {index + 1}</Text><TextInput value={String(shortcut)} onChangeText={(value) => { const next = [...tempConfig.atalhosPontuacao] as [number, number, number]; next[index] = Number(value); setTempConfig((previous) => ({ ...previous, atalhosPontuacao: next })); }} keyboardType="numbers-and-punctuation" style={[styles.configInput, { color: colors.surfaceText, borderColor: colors.border }]} /></View>
            ))}</View>
            <TouchableOpacity onPress={resetFromConfig} style={[styles.resetButton, { borderColor: colors.danger }]} accessibilityLabel="Zerar o placar e iniciar nova partida"><Text style={[styles.resetButtonText, { color: colors.danger }]}>Zerar placar</Text></TouchableOpacity>
            <View style={styles.modalActions}><TouchableOpacity onPress={() => setShowConfig(false)} style={[styles.modalButton, { borderColor: colors.border }]}><Text style={{ color: colors.surfaceText, fontWeight: '800' }}>Cancelar</Text></TouchableOpacity><TouchableOpacity onPress={saveConfig} style={[styles.modalButton, { backgroundColor: colors.action, borderColor: colors.action }]}><Text style={{ color: colors.onAction, fontWeight: '800' }}>Salvar</Text></TouchableOpacity></View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showWinner && Boolean(game.vencedor)} transparent animationType="fade" onRequestClose={() => setShowWinner(false)}>
        <View style={styles.modalOverlay}><View style={[styles.modalCard, styles.winnerCard, { backgroundColor: colors.surface, borderColor: colors.action }]}>
          <Text style={[styles.crown, { color: colors.action }]}>♛</Text><Text style={[styles.winnerEyebrow, { color: colors.muted }]}>FIM DE PARTIDA</Text>
          <Text style={[styles.winnerName, { color: colors.action }]}>{game.vencedor === 'time1' ? game.nomeTime1 : game.nomeTime2} venceu!</Text>
          <View style={styles.winnerScores}><Text style={[styles.winnerScore, { color: colors.surfaceText }]}>{game.nomeTime1}{'\n'}{total1}</Text><Text style={[styles.winnerScore, { color: colors.surfaceText }]}>{game.nomeTime2}{'\n'}{total2}</Text></View>
          <View style={styles.modalActions}><TouchableOpacity onPress={() => setShowWinner(false)} style={[styles.modalButton, { borderColor: colors.border }]}><Text style={{ color: colors.surfaceText, fontWeight: '800' }}>Ver placar</Text></TouchableOpacity><TouchableOpacity onPress={newGame} style={[styles.modalButton, { backgroundColor: colors.action, borderColor: colors.action }]}><Text style={{ color: colors.onAction, fontWeight: '800' }}>Nova partida</Text></TouchableOpacity></View>
        </View></View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 7, borderBottomWidth: 1 },
  headerButton: { minWidth: 58, minHeight: 42, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  headerButtonText: { fontSize: 14, fontWeight: '700' },
  gearText: { fontSize: 20 },
  title: { fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }), fontSize: 17, fontWeight: '900', letterSpacing: 2 },
  board: { flex: 1, flexDirection: 'row', position: 'relative' },
  team: { flex: 1, minWidth: 0, borderWidth: 1, borderRadius: 15, padding: 6, overflow: 'hidden' },
  teamHeading: { minHeight: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  suit: { fontSize: 19, marginRight: 3 },
  teamName: { flex: 1, minWidth: 0, textAlign: 'center', fontWeight: '800', letterSpacing: 1, paddingVertical: 2 },
  scoreArea: { alignItems: 'center', minHeight: 104 },
  maraBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 2 },
  maraText: { fontSize: 9, fontWeight: '900', letterSpacing: .7 },
  total: { width: '100%', textAlign: 'center', fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }), fontWeight: '900', lineHeight: 78 },
  progress: { width: '86%', height: 6, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%' },
  goal: { marginTop: 4, fontSize: 10, fontWeight: '800' },
  history: { flex: 1, minHeight: 48, marginTop: 6, paddingTop: 5, borderTopWidth: 1 },
  empty: { textAlign: 'center', fontSize: 12, marginTop: 18 },
  historyItem: { minHeight: 39, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, marginBottom: 5, paddingLeft: 8 },
  historyValueButton: { flex: 1, minHeight: 37, justifyContent: 'center' },
  historyValue: { fontSize: 16, fontWeight: '900' },
  editInput: { flex: 1, minHeight: 31, borderWidth: 1, borderRadius: 6, paddingHorizontal: 5 },
  deleteButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  deleteText: { fontSize: 21 },
  controls: { marginTop: 4 },
  shortcuts: { flexDirection: 'row', gap: 3 },
  shortcut: { flex: 1, minWidth: 0, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 9, paddingHorizontal: 2 },
  shortcutText: { fontSize: 13, fontWeight: '900' },
  inputRow: { flexDirection: 'row', gap: 4, marginTop: 5 },
  scoreInput: { flex: 1, minWidth: 0, height: 46, borderWidth: 1, borderRadius: 9, textAlign: 'center', paddingHorizontal: 4, fontSize: 15 },
  addButton: { minWidth: 46, height: 46, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  addText: { fontWeight: '900', fontSize: 20 },
  centerGear: { position: 'absolute', width: 44, height: 44, left: '50%', marginLeft: -22, top: '40%', borderRadius: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  centerGearText: { fontSize: 17 },
  modalOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18, backgroundColor: 'rgba(0,0,0,0.68)' },
  modalCard: { width: '100%', maxWidth: 440, borderWidth: 1, borderRadius: 18, padding: 18 },
  modalTitle: { textAlign: 'center', fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }), fontSize: 20, fontWeight: '900', marginBottom: 18 },
  configRow: { flexDirection: 'row', gap: 7 },
  configField: { flex: 1, minWidth: 0 },
  configLabel: { fontSize: 10, fontWeight: '700', marginBottom: 5 },
  configInput: { minHeight: 42, borderWidth: 1, borderRadius: 9, textAlign: 'center', paddingHorizontal: 5 },
  configLegend: { marginTop: 18, marginBottom: 8, fontSize: 11, fontWeight: '900', letterSpacing: .7 },
  resetButton: { minHeight: 44, marginTop: 18, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  resetButtonText: { fontSize: 14, fontWeight: '900' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 20 },
  modalButton: { minHeight: 44, minWidth: 105, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  winnerCard: { alignItems: 'center' },
  crown: { fontSize: 38 },
  winnerEyebrow: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  winnerName: { fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }), fontSize: 25, fontWeight: '900', textAlign: 'center', marginVertical: 12 },
  winnerScores: { width: '100%', flexDirection: 'row', justifyContent: 'space-around' },
  winnerScore: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '800', lineHeight: 25 },
});

export default CanastraScreen;
