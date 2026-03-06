import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../shared/contexts/ThemeContext';

type Winner = 'nos' | 'eles' | null;

interface TrucoScreenProps {
  onBack: () => void;
}

const STORAGE_KEYS = {
  nosScore: 'truco-nosScore-mobile',
  elesScore: 'truco-elesScore-mobile',
  pontosRodada: 'truco-pontosRodada-mobile',
  winner: 'truco-winner-mobile',
};

const TrucoScreen: React.FC<TrucoScreenProps> = ({ onBack }) => {
  const { theme, colors } = useTheme();
  const { width, height } = useWindowDimensions();

  const isDark = theme === 'dark';
  const isPortrait = height >= width;
  const shortSide = Math.min(width, height);
  const isSmallDevice = shortSide < 360;
  const isCompactLandscape = !isPortrait && height < 430;
  const isUltraCompactLandscape = !isPortrait && height < 390;
  const bgColor = isDark ? colors.background.dark : colors.background.light;
  const cardColor = isDark ? colors.background.dark2 : colors.surface;
  const textColor = isDark ? colors.text.dark : colors.text.light;
  const primaryColor = isDark ? colors.primary : colors.secondaryDark;
  const winnerBgColor = '#1f7a4c';
  const loserBgColor = '#a93232';
  const winnerBorderColor = '#27ae60';
  const loserBorderColor = '#e74c3c';
  const scoreFontSize = isPortrait
    ? (isSmallDevice ? 64 : 74)
    : (isUltraCompactLandscape ? 34 : isCompactLandscape ? 40 : 46);
  const teamFontSize = isPortrait ? (isSmallDevice ? 16 : 18) : (isCompactLandscape ? 12 : 14);
  const roundFontSize = isPortrait ? (isSmallDevice ? 14 : 16) : (isCompactLandscape ? 10 : 12);
  const actionFontSize = isPortrait ? (isSmallDevice ? 15 : 16) : (isCompactLandscape ? 12 : 13);
  const containerPadding = isCompactLandscape ? 10 : isPortrait ? 16 : 12;

  const getRoundButtonLabel = (value: number) => {
    if (isUltraCompactLandscape) {
      return `${value}`;
    }

    if (isCompactLandscape) {
      return `${value} pt`;
    }

    return `${value} ponto${value > 1 ? 's' : ''}`;
  };

  const [nosScore, setNosScore] = useState(0);
  const [elesScore, setElesScore] = useState(0);
  const [pontosRodada, setPontosRodada] = useState(1);
  const [winner, setWinner] = useState<Winner>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [nos, eles, rodada, currentWinner] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.nosScore),
          AsyncStorage.getItem(STORAGE_KEYS.elesScore),
          AsyncStorage.getItem(STORAGE_KEYS.pontosRodada),
          AsyncStorage.getItem(STORAGE_KEYS.winner),
        ]);

        setNosScore(nos ? parseInt(nos, 10) : 0);
        setElesScore(eles ? parseInt(eles, 10) : 0);
        setPontosRodada(rodada ? parseInt(rodada, 10) : 1);

        if (currentWinner === 'nos' || currentWinner === 'eles') {
          setWinner(currentWinner);
        }
      } finally {
        setLoaded(true);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const persistData = async () => {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.nosScore, String(nosScore)),
        AsyncStorage.setItem(STORAGE_KEYS.elesScore, String(elesScore)),
        AsyncStorage.setItem(STORAGE_KEYS.pontosRodada, String(pontosRodada)),
        AsyncStorage.setItem(STORAGE_KEYS.winner, winner ?? ''),
      ]);
    };

    persistData();
  }, [nosScore, elesScore, pontosRodada, winner, loaded]);

  const resetGame = () => {
    setNosScore(0);
    setElesScore(0);
    setPontosRodada(1);
    setWinner(null);
  };

  const addScore = (team: 'nos' | 'eles') => {
    if (winner) {
      return;
    }

    if (team === 'nos') {
      const newScore = nosScore + pontosRodada;
      setNosScore(newScore);
      if (newScore >= 12) {
        setWinner('nos');
      }
    } else {
      const newScore = elesScore + pontosRodada;
      setElesScore(newScore);
      if (newScore >= 12) {
        setWinner('eles');
      }
    }

    setPontosRodada(1);
  };

  const removeOnePoint = (team: 'nos' | 'eles') => {
    if (team === 'nos') {
      const newScore = Math.max(0, nosScore - 1);
      setNosScore(newScore);
      if (newScore < 12 && elesScore < 12) {
        setWinner(null);
      }
      return;
    }

    const newScore = Math.max(0, elesScore - 1);
    setElesScore(newScore);
    if (newScore < 12 && nosScore < 12) {
      setWinner(null);
    }
  };

  const getCardStyle = (team: 'nos' | 'eles') => {
    if (!winner) {
      return { backgroundColor: cardColor, borderColor: primaryColor };
    }

    if (winner === team) {
      return { backgroundColor: winnerBgColor, borderColor: winnerBorderColor };
    }

    return { backgroundColor: loserBgColor, borderColor: loserBorderColor };
  };

  const getCardTextColor = (team: 'nos' | 'eles') => {
    if (!winner) {
      return { label: textColor, score: primaryColor, round: textColor };
    }

    if (winner === team) {
      return { label: '#d4f5e4', score: '#ffffff', round: '#d4f5e4' };
    }

    return { label: '#ffd6d6', score: '#ffffff', round: '#ffd6d6' };
  };

  const nosTextColors = getCardTextColor('nos');
  const elesTextColors = getCardTextColor('eles');

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={bgColor}
        translucent
      />
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={[styles.content, { padding: containerPadding }]}>
          <View style={[styles.header, !isPortrait && styles.headerLandscape, isCompactLandscape && styles.headerCompactLandscape]}>
        <TouchableOpacity onPress={onBack} style={[styles.backButton, { borderColor: primaryColor }]}> 
          <Text style={[styles.backText, { color: primaryColor }]}>Voltar</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Truco</Text>
      </View>

      <View style={[styles.mainContent, !isPortrait && styles.mainContentLandscape]}>
      <View style={[styles.scoreSection, !isPortrait && styles.scoreSectionLandscape]}>
        <TouchableOpacity
          style={[
            styles.scoreCard,
            !isPortrait && styles.scoreCardLandscape,
            isCompactLandscape && styles.scoreCardCompactLandscape,
            getCardStyle('nos'),
            winner === 'nos' && styles.winnerCard,
            winner === 'eles' && styles.loserCard,
          ]}
          onPress={() => addScore('nos')}
        >
          <Text style={[styles.teamLabel, { color: nosTextColors.label, fontSize: teamFontSize }]}>NÓS</Text>
          <Text style={[styles.scoreValue, { color: nosTextColors.score, fontSize: scoreFontSize }]}>{nosScore}</Text>
          <Text style={[styles.roundValue, { color: nosTextColors.round, fontSize: roundFontSize }]}>+{pontosRodada}</Text>
          {winner === 'nos' && <Text style={styles.statusWin}>VENCEU</Text>}
          {winner === 'eles' && <Text style={styles.statusLose}>DERROTA</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.scoreCard,
            !isPortrait && styles.scoreCardLandscape,
            isCompactLandscape && styles.scoreCardCompactLandscape,
            getCardStyle('eles'),
            winner === 'eles' && styles.winnerCard,
            winner === 'nos' && styles.loserCard,
          ]}
          onPress={() => addScore('eles')}
        >
          <Text style={[styles.teamLabel, { color: elesTextColors.label, fontSize: teamFontSize }]}>ELES</Text>
          <Text style={[styles.scoreValue, { color: elesTextColors.score, fontSize: scoreFontSize }]}>{elesScore}</Text>
          <Text style={[styles.roundValue, { color: elesTextColors.round, fontSize: roundFontSize }]}>+{pontosRodada}</Text>
          {winner === 'eles' && <Text style={styles.statusWin}>VENCEU</Text>}
          {winner === 'nos' && <Text style={styles.statusLose}>DERROTA</Text>}
        </TouchableOpacity>
      </View>

      <View style={[styles.actionsSection, !isPortrait && styles.actionsSectionLandscape, isCompactLandscape && styles.actionsSectionCompactLandscape]}>
        <View style={[styles.rowButtons, styles.pointsGrid]}>
          {[1, 3, 6, 12].map((value) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.actionButton,
                styles.pointButton,
                { backgroundColor: value === pontosRodada ? primaryColor : cardColor, borderColor: primaryColor },
              ]}
              onPress={() => setPontosRodada(value)}
            >
              <Text style={[styles.actionText, { color: value === pontosRodada ? '#fff' : textColor, fontSize: actionFontSize }]}>
                {getRoundButtonLabel(value)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.penaltyRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.halfButton,
              { backgroundColor: cardColor, borderColor: primaryColor },
            ]}
            onPress={() => removeOnePoint('nos')}
          >
            <Text style={[styles.actionText, { color: textColor, fontSize: actionFontSize }]}>NÓS -1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.halfButton,
              { backgroundColor: cardColor, borderColor: primaryColor },
            ]}
            onPress={() => removeOnePoint('eles')}
          >
            <Text style={[styles.actionText, { color: textColor, fontSize: actionFontSize }]}>ELES -1</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resetRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.halfButton,
              { backgroundColor: cardColor, borderColor: colors.danger },
            ]}
            onPress={resetGame}
          >
            <Text style={[styles.actionText, { color: colors.danger, fontSize: actionFontSize }]}>Reiniciar partida</Text>
          </TouchableOpacity>
        </View>
        </View>
        </View>
      </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  mainContentLandscape: {
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingTop: 20,
  },
  headerLandscape: {
    marginBottom: 10,
  },
  headerCompactLandscape: {
    marginBottom: 6,
  },
  backButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  scoreSection: {
    flexDirection: 'row',
    gap: 12,
  },
  scoreSectionLandscape: {
    gap: 8,
  },
  scoreCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 26,
    alignItems: 'center',
  },
  scoreCardLandscape: {
    paddingVertical: 18,
    borderRadius: 12,
  },
  scoreCardCompactLandscape: {
    paddingVertical: 18,
  },
  winnerCard: {
    opacity: 1,
  },
  loserCard: {
    opacity: 0.6,
  },
  teamLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: '900',
    marginVertical: 6,
  },
  roundValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusWin: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '800',
    color: '#d4f5e4',
    letterSpacing: 0.8,
  },
  statusLose: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '800',
    color: '#ffd6d6',
    letterSpacing: 0.8,
  },
  actionsSection: {
    marginTop: 14,
    gap: 8,
  },
  actionsSectionLandscape: {
    marginTop: 6,
    gap: 6,
  },
  actionsSectionCompactLandscape: {
    marginTop: 6,
    gap: 6,
  },
  rowButtons: {
    flexDirection: 'column',
    gap: 6,
  },
  penaltyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  resetRow: {
    alignItems: 'center',
  },
  rowButtonsLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pointsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 0,
  },
  pointButton: {
    width: '48.5%',
    marginBottom: 6,
  },
  rowButtonsLandscapeFour: {
    justifyContent: 'space-between',
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    minHeight: 44,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonLandscape: {
    width: '48.5%',
    paddingVertical: 6,
    borderRadius: 7,
    minHeight: 40,
  },
  halfButton: {
    width: '48.5%',
  },
  actionButtonLandscapeCompact: {
    width: '23.5%',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    minHeight: 34,
  },
  actionText: {
    fontWeight: '800',
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

export default TrucoScreen;
