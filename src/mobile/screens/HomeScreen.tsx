import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { useInterstitialAd } from '../../shared/components/AdMob/useInterstitialAd';
import { RemoveAdsPurchaseButton } from '../../shared/components/RemoveAdsPurchaseButton';
import { usePurchase } from '../../shared/contexts/PurchaseContext';
import { COLOR_THEMES } from '../../shared/constants/colors';

interface HomeScreenProps {
  onOpenTruco: () => void;
  onOpenCacheta: () => void;
  onOpenCanastra: () => void;
  onOpenMarcador: () => void;
  onOpenSettings: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenTruco, onOpenCacheta, onOpenCanastra, onOpenMarcador, onOpenSettings }) => {
  const { appearance, colorTheme, setColorTheme } = useTheme();
  const { showInterstitialAd } = useInterstitialAd();
  const { isPurchased, loading: purchaseStatusLoading, refreshPurchaseStatus } = usePurchase();
  
  const bgColor = appearance.background;
  const textColor = appearance.text;
  const subtitleColor = appearance.mutedText;
  const primaryColor = appearance.action;
  const primaryTextColor = appearance.onAction;

  useEffect(() => {
    refreshPurchaseStatus();
  }, [refreshPurchaseStatus]);

  useEffect(() => {
    const isTeamTheme = COLOR_THEMES[colorTheme].fixedMode !== null;
    if (!purchaseStatusLoading && !isPurchased && isTeamTheme) {
      setColorTheme('default');
    }
  }, [colorTheme, isPurchased, purchaseStatusLoading, setColorTheme]);

  const handleOpenTruco = async () => {
    await showInterstitialAd();
    onOpenTruco();
  };

  const handleOpenCacheta = async () => {
    await showInterstitialAd();
    onOpenCacheta();
  };

  const handleOpenMarcador = async () => {
    await showInterstitialAd();
    onOpenMarcador();
  };

  const handleOpenCanastra = async () => {
    await showInterstitialAd();
    onOpenCanastra();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>Marcador de pontos</Text>
        <Text style={[styles.subtitle, { color: subtitleColor }]}>
          Acompanhe suas mãos e jogadas com facilidade!
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: primaryColor }]} onPress={handleOpenTruco}>
            <Text style={[styles.buttonText, { color: primaryTextColor }]}>Truco</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton, { 
            backgroundColor: bgColor,
            borderColor: primaryColor 
          }]} onPress={handleOpenCacheta}>
            <Text style={[styles.buttonTextSecondary, { color: primaryColor }]}>Cacheta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton, {
            backgroundColor: bgColor,
            borderColor: primaryColor,
          }]} onPress={handleOpenCanastra}>
            <Text style={[styles.buttonTextSecondary, { color: primaryColor }]}>Canastra</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton, { 
            backgroundColor: bgColor,
            borderColor: primaryColor 
          }]} onPress={handleOpenMarcador}>
            <Text style={[styles.buttonTextSecondary, { color: primaryColor }]}>Marcador Livre</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, {
              backgroundColor: bgColor,
              borderColor: primaryColor,
            }]}
            onPress={onOpenSettings}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Abrir configurações"
          >
            <Text style={[styles.buttonTextSecondary, { color: primaryColor }]}>Configurações</Text>
          </TouchableOpacity>

          <RemoveAdsPurchaseButton style={styles.purchaseButton} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  purchaseButton: {
    borderRadius: 12,
    paddingVertical: 16,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
