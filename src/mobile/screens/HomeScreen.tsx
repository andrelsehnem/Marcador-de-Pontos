import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../shared/contexts/ThemeContext';
import { useInterstitialAd } from '../../shared/components/AdMob/useInterstitialAd';
import { RemoveAdsPurchaseButton } from '../../shared/components/RemoveAdsPurchaseButton';
import { usePurchase } from '../../shared/contexts/PurchaseContext';

interface HomeScreenProps {
  onOpenTruco: () => void;
  onOpenCacheta: () => void;
  onOpenMarcador: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenTruco, onOpenCacheta, onOpenMarcador }) => {
  const { theme, toggleTheme, colors } = useTheme();
  const { showInterstitialAd } = useInterstitialAd();
  const { refreshPurchaseStatus } = usePurchase();
  
  const isDark = theme === 'dark';
  const bgColor = isDark ? colors.background.dark : colors.background.light;
  const textColor = isDark ? colors.text.dark : colors.text.light;
  const subtitleColor = isDark ? colors.text.dark : colors.text.secondary;
  const primaryColor = isDark ? colors.primary : colors.secondaryDark;

  useEffect(() => {
    refreshPurchaseStatus();
  }, [refreshPurchaseStatus]);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Botão de Tema no topo */}
      <TouchableOpacity 
        style={[styles.themeButton, { 
          backgroundColor: isDark ? colors.background.dark2 : colors.surface,
          borderColor: primaryColor 
        }]}
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>Marcador de pontos</Text>
        <Text style={[styles.subtitle, { color: subtitleColor }]}>
          Acompanhe suas mãos e jogadas com facilidade!
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: primaryColor }]} onPress={handleOpenTruco}>
            <Text style={styles.buttonText}>Truco</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton, { 
            backgroundColor: bgColor,
            borderColor: primaryColor 
          }]} onPress={handleOpenCacheta}>
            <Text style={[styles.buttonTextSecondary, { color: primaryColor }]}>Cacheta</Text>
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
              borderColor: primaryColor 
            }]}
            onPress={toggleTheme}
          >
            <Text style={[styles.buttonTextSecondary, { color: primaryColor }]}>
              {isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
            </Text>
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
  themeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  themeIcon: {
    fontSize: 24,
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
