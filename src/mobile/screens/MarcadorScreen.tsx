import React, { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useKeepAwake } from 'expo-keep-awake';
// Importação lazy para evitar crash em builds sem o módulo nativo linkado
let ScreenOrientation: typeof import('expo-screen-orientation') | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ScreenOrientation = require('expo-screen-orientation');
} catch {
  ScreenOrientation = null;
}
import { useTheme } from '../../shared/contexts/ThemeContext';
import { useInterstitialAd } from '../../shared/components/AdMob/useInterstitialAd';

interface MarcadorScreenProps {
  onBack: () => void;
}

interface MarcadorMobileState {
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
}

const STORAGE_KEY = 'marcador-livre-mobile-v1';

const DEFAULT_STATE: MarcadorMobileState = {
  teamAName: 'EQUIPE A',
  teamBName: 'EQUIPE B',
  teamAScore: 0,
  teamBScore: 0,
};

const MarcadorScreen: React.FC<MarcadorScreenProps> = ({ onBack }) => {
  const { theme, colors } = useTheme();
  const { showInterstitialAd } = useInterstitialAd();
  const { width, height } = useWindowDimensions();
  useKeepAwake();

  const isDark = theme === 'dark';
  const isPortrait = height >= width;

  const [state, setState] = useState<MarcadorMobileState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<MarcadorMobileState>;
          setState({
            ...DEFAULT_STATE,
            ...parsed,
          });
        }
      } catch {
        setState(DEFAULT_STATE);
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

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  useEffect(() => {
    const lockLandscape = async () => {
      try {
        await ScreenOrientation?.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch {
        return;
      }
    };

    lockLandscape();

    return () => {
      ScreenOrientation?.unlockAsync().catch(() => undefined);
    };
  }, []);

  const updateTeamName = (team: 'A' | 'B', value: string) => {
    setState((prev) => {
      if (team === 'A') {
        return { ...prev, teamAName: value.toUpperCase() };
      }
      return { ...prev, teamBName: value.toUpperCase() };
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

  const handleBack = async () => {
    await showInterstitialAd();
    onBack();
  };

  const bgColor = isDark ? colors.background.dark : colors.background.light;
  const headerBg = isDark ? colors.background.dark2 : colors.surface;
  const textColor = isDark ? '#F8FAFC' : '#0B1324';
  const dividerColor = isDark ? 'rgba(255,255,255,0.16)' : 'rgba(15,23,42,0.18)';

  const teamASoft = isDark ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.32)';
  const teamAStrong = isDark ? 'rgba(14,165,233,0.68)' : 'rgba(14,165,233,0.58)';
  const teamBSoft = isDark ? 'rgba(252, 163, 100, 0.7)' : 'rgba(248, 149, 78, 0.62)';
  const teamBStrong = isDark ? 'rgba(249,115,22,0.7)' : 'rgba(249,115,22,0.62)';

  const scoreShadow = isDark ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.28)';
  const zoneTextColor = isDark ? 'rgba(255,255,255,0.86)' : 'rgba(10,18,36,0.82)';

  const nameFontSize = isPortrait ? 40 : 30;
  const nameInputWidth = isPortrait ? 240 : 280;
  const scoreFontSize = isPortrait ? 56 : 120  ;
  const deltaFontSize = isPortrait ? 42 : 32;
  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={bgColor}
        translucent={false}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor, paddingTop: topInset }]}>
        <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: dividerColor, borderTopColor: dividerColor }]}> 
          <TouchableOpacity onPress={handleBack} style={[styles.backButton, { borderColor: dividerColor }]}>
            <Text style={[styles.backText, { color: textColor }]}>← VOLTAR</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerChip, { color: isDark ? '#7fb2ff' : colors.secondaryDark }]}>MODO LIVRE</Text>
            <Text style={[styles.headerTitle, { color: textColor }]}>MARCADOR DE PONTOS</Text>
          </View>
          <View style={styles.headerRightSpacer} />
        </View>

        <View style={styles.mainArea}>
          <View style={[styles.teamSide, { borderRightColor: dividerColor }]}> 
            <View
              pointerEvents="box-none"
              style={[
                styles.overlayInfo,
                {
                  width: nameInputWidth,
                  transform: [{ translateX: -(nameInputWidth / 2) }],
                },
              ]}
            >
              <TextInput
                style={[
                  styles.teamInput,
                  {
                    color: textColor,
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    fontSize: nameFontSize,
                  },
                ]}
                value={state.teamAName}
                onChangeText={(value) => updateTeamName('A', value)}
                onBlur={() => normalizeTeamName('A')}
                autoCapitalize="characters"
                selectionColor={colors.primary}
              />
              <View pointerEvents="none">
                <Text
                  style={[
                    styles.scoreText,
                    { color: textColor, fontSize: scoreFontSize, textShadowColor: scoreShadow },
                  ]}
                >
                  {state.teamAScore}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.zoneButton, { backgroundColor: teamASoft, borderRightColor: dividerColor }]}
              onPress={() => changeScore('A', -1)}
            >
              <Text style={[styles.deltaText, { color: zoneTextColor, fontSize: deltaFontSize, textShadowColor: scoreShadow }]}>-1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.zoneButton, { backgroundColor: teamAStrong }]}
              onPress={() => changeScore('A', 1)}
            >
              <Text style={[styles.deltaText, { color: zoneTextColor, fontSize: deltaFontSize, textShadowColor: scoreShadow }]}>+1</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.teamSide}>
            <View
              pointerEvents="box-none"
              style={[
                styles.overlayInfo,
                {
                  width: nameInputWidth,
                  transform: [{ translateX: -(nameInputWidth / 2) }],
                },
              ]}
            >
              <TextInput
                style={[
                  styles.teamInput,
                  {
                    color: textColor,
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    fontSize: nameFontSize,
                  },
                ]}
                value={state.teamBName}
                onChangeText={(value) => updateTeamName('B', value)}
                onBlur={() => normalizeTeamName('B')}
                autoCapitalize="characters"
                selectionColor={colors.primary}
              />
              <View pointerEvents="none">
                <Text
                  style={[
                    styles.scoreText,
                    { color: textColor, fontSize: scoreFontSize, textShadowColor: scoreShadow },
                  ]}
                >
                  {state.teamBScore}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.zoneButton, { backgroundColor: teamBSoft, borderRightColor: dividerColor }]}
              onPress={() => changeScore('B', -1)}
            >
              <Text style={[styles.deltaText, { color: zoneTextColor, fontSize: deltaFontSize, textShadowColor: scoreShadow }]}>-1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.zoneButton, { backgroundColor: teamBStrong }]}
              onPress={() => changeScore('B', 1)}
            >
              <Text style={[styles.deltaText, { color: zoneTextColor, fontSize: deltaFontSize, textShadowColor: scoreShadow }]}>+1</Text>
            </TouchableOpacity>
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
  header: {
    minHeight: 64,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  backButton: {
    minWidth: 92,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
  },
  headerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  headerChip: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  headerRightSpacer: {
    width: 92,
  },
  mainArea: {
    flex: 1,
    flexDirection: 'row',
  },
  teamSide: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    borderRightWidth: 2,
  },
  overlayInfo: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    alignItems: 'center',
    zIndex: 5,
  },
  teamInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    textAlign: 'center',
    fontWeight: '700',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  scoreText: {
    marginTop: 6,
    fontWeight: '800',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  zoneButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  deltaText: {
    fontWeight: '800',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
});

export default MarcadorScreen;
