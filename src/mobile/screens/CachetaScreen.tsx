import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { useInterstitialAd } from '../../shared/components/AdMob/useInterstitialAd';

interface Player {
  id: number;
  name: string;
  score: number;
}

interface CachetaScreenProps {
  onBack: () => void;
}

const STORAGE_KEY = 'cacheta-players-mobile';

const CachetaScreen: React.FC<CachetaScreenProps> = ({ onBack }) => {
  const { theme, colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const { showInterstitialAd } = useInterstitialAd();

  const isDark = theme === 'dark';
  const isPortrait = height >= width;
  const bgColor = isDark ? colors.background.dark : colors.background.light;
  const cardColor = isDark ? colors.background.dark2 : colors.surface;
  const textColor = isDark ? colors.text.dark : colors.text.light;
  const primaryColor = isDark ? colors.primary : colors.secondaryDark;
  const containerPadding = isPortrait ? 16 : 12;

  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Jogador 1', score: 10 },
    { id: 2, name: 'Jogador 2', score: 10 },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [loaded, setLoaded] = useState(false);
  const [initialScore, setInitialScore] = useState<string>('10');
  const [initialScoreFocused, setInitialScoreFocused] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setPlayers(JSON.parse(saved));
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
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    };

    persistData();
  }, [players, loaded]);

  const updateScore = (playerId: number, points: number) => {
    setPlayers(players.map(p =>
      p.id === playerId ? { ...p, score: p.score + points } : p
    ));
  };

  const addPlayer = () => {
    const newId = Math.max(...players.map(p => p.id), 10) + 1;
    const scoreValue = parseInt(initialScore) || 10;
    setPlayers([...players, { id: newId, name: `Jogador ${newId}`, score: scoreValue }]);
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
    if (editingName.trim()) {
      setPlayers(players.map(p =>
        p.id === playerId ? { ...p, name: editingName.trim() } : p
      ));
    }
    setEditingId(null);
    setEditingName('');
  };

  const resetGame = () => {
    const scoreValue = parseInt(initialScore) || 10;
    setPlayers(players.map(p => ({ ...p, score: scoreValue })));
  };

  const resetPlayers = () => {
    const scoreValue = parseInt(initialScore) || 10;
    setPlayers([
      { id: 1, name: 'Jogador 1', score: scoreValue },
      { id: 2, name: 'Jogador 2', score: scoreValue },
    ]);
  };

  const handleBack = async () => {
    await showInterstitialAd();
    onBack();
  };

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={bgColor}
        translucent
      />
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={[styles.content, { padding: containerPadding }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={[styles.backButton, { borderColor: primaryColor }]}>
              <Text style={[styles.backText, { color: primaryColor }]}>Voltar</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textColor }]}>Cacheta</Text>
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {players.map((player) => (
              <View
                key={player.id}
                style={[
                  styles.playerCard,
                  { backgroundColor: cardColor, borderColor: primaryColor }
                ]}
              >
                <View style={styles.playerHeader}>
                  {editingId === player.id ? (
                    <TextInput
                      style={[
                        styles.playerNameInput,
                        { 
                          borderColor: primaryColor,
                          color: textColor,
                          backgroundColor: isDark ? colors.background.dark : '#fff'
                        }
                      ]}
                      value={editingName}
                      onChangeText={setEditingName}
                      onBlur={() => saveName(player.id)}
                      onSubmitEditing={() => saveName(player.id)}
                      autoFocus
                      selectTextOnFocus
                    />
                  ) : (
                    <TouchableOpacity onPress={() => startEditingName(player)}>
                      <Text style={[styles.playerName, { color: textColor }]}>
                        {player.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {players.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removePlayer(player.id)}
                      style={[styles.removeButton, { backgroundColor: colors.danger }]}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={[styles.playerScore, { color: primaryColor }]}>
                  {player.score}
                </Text>

                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    style={[styles.scoreButton, styles.subtractButton, { 
                      backgroundColor: cardColor,
                      borderColor: colors.danger 
                    }]}
                    onPress={() => updateScore(player.id, -2)}
                  >
                    <Text style={[styles.scoreButtonText, { color: colors.danger }]}>-2</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.scoreButton, styles.subtractButton, { 
                      backgroundColor: cardColor,
                      borderColor: colors.danger 
                    }]}
                    onPress={() => updateScore(player.id, -1)}
                  >
                    <Text style={[styles.scoreButtonText, { color: colors.danger }]}>-1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.scoreButton, styles.addButton, { 
                      backgroundColor: primaryColor,
                      borderColor: primaryColor 
                    }]}
                    onPress={() => updateScore(player.id, 1)}
                  >
                    <Text style={[styles.scoreButtonText, { color: '#fff' }]}>+1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.scoreButton, styles.addButton, { 
                      backgroundColor: primaryColor,
                      borderColor: primaryColor 
                    }]}
                    onPress={() => updateScore(player.id, 2)}
                  >
                    <Text style={[styles.scoreButtonText, { color: '#fff' }]}>+2</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.addPlayerButton, { backgroundColor: primaryColor }]}
              onPress={addPlayer}
            >
              <Text style={styles.addPlayerButtonText}>+ Adicionar Jogador</Text>
            </TouchableOpacity>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, { 
                  backgroundColor: cardColor,
                  borderColor: primaryColor 
                }]}
                onPress={resetGame}
              >
                <Text style={[styles.actionButtonText, { color: primaryColor }]}>Zerar Placar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { 
                  backgroundColor: cardColor,
                  borderColor: colors.danger 
                }]}
                onPress={resetPlayers}
              >
                <Text style={[styles.actionButtonText, { color: colors.danger }]}>Reiniciar Jogo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.initialScoreContainer}>
              <Text style={[styles.initialScoreLabel, { color: textColor }]}>
                Pontuação Inicial
              </Text>
              <View style={[
                styles.initialScoreInputWrapper,
                { borderColor: initialScoreFocused ? primaryColor : '#ccc' }
              ]}>
                <TouchableOpacity
                  onPress={() => {
                    const value = Math.max(parseInt(initialScore) || 0, 0);
                    setInitialScore(Math.max(value - 1, 0).toString());
                  }}
                  style={[styles.initialScoreButton, { opacity: 0.7 }]}
                >
                  <Text style={[styles.initialScoreButtonText, { color: textColor }]}>−</Text>
                </TouchableOpacity>
                <TextInput
                  style={[
                    styles.initialScoreInput,
                    {
                      color: textColor,
                    }
                  ]}
                  value={initialScore}
                  onChangeText={setInitialScore}
                  onFocus={() => setInitialScoreFocused(true)}
                  onBlur={() => {
                    setInitialScoreFocused(false);
                    const value = parseInt(initialScore) || 0;
                    setInitialScore(Math.max(value, 0).toString());
                  }}
                  keyboardType="number-pad"
                  maxLength={3}
                  placeholder="Ex: 10"
                  placeholderTextColor={isDark ? '#666' : '#aaa'}
                />
                <TouchableOpacity
                  onPress={() => {
                    const value = Math.max(parseInt(initialScore) || 0, 0);
                    setInitialScore((value + 1).toString());
                  }}
                  style={[styles.initialScoreButton, { opacity: 0.7 }]}
                >
                  <Text style={[styles.initialScoreButtonText, { color: textColor }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 12,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  playerCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '700',
  },
  playerNameInput: {
    fontSize: 18,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 150,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  playerScore: {
    fontSize: 48,
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  scoreButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtractButton: {},
  addButton: {},
  scoreButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
  addPlayerButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  addPlayerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  initialScoreContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  initialScoreLabel: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  initialScoreInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 6,
  },
  initialScoreButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialScoreButtonText: {
    fontSize: 20,
    fontWeight: '700',
  },
  initialScoreInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    padding: 0,
  },
});

export default CachetaScreen;
