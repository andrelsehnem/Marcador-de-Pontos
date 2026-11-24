import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import { ThemeProvider, useTheme } from './shared/contexts/ThemeContext';
import { PurchaseProvider, usePurchase } from './shared/contexts/PurchaseContext';
import HomeScreen from './mobile/screens/HomeScreen';
import TrucoScreen from './mobile/screens/TrucoScreen';
import CachetaScreen from './mobile/screens/CachetaScreen';
import CanastraScreen from './mobile/screens/CanastraScreen';
import MarcadorScreen from './mobile/screens/MarcadorScreen';
import SettingsScreen from './mobile/screens/SettingsScreen';
import { initializeAdMob } from './shared/services/admob';
import { AndreSplash } from './shared/components/AndreSplash/AndreSplash';

type Page = 'home' | 'truco' | 'cacheta' | 'canastra' | 'marcador' | 'settings';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showSplash, setShowSplash] = useState(true);
  const { ready: themeReady } = useTheme();
  const { ready: purchaseReady } = usePurchase();

  return (
    <>
      {currentPage === 'home' && (
        <HomeScreen
          onOpenTruco={() => setCurrentPage('truco')}
          onOpenCacheta={() => setCurrentPage('cacheta')}
          onOpenCanastra={() => setCurrentPage('canastra')}
          onOpenMarcador={() => setCurrentPage('marcador')}
          onOpenSettings={() => setCurrentPage('settings')}
        />
      )}
      {currentPage === 'truco' && <TrucoScreen onBack={() => setCurrentPage('home')} />}
      {currentPage === 'cacheta' && <CachetaScreen onBack={() => setCurrentPage('home')} />}
      {currentPage === 'canastra' && <CanastraScreen onBack={() => setCurrentPage('home')} />}
      {currentPage === 'marcador' && <MarcadorScreen onBack={() => setCurrentPage('home')} />}
      {currentPage === 'settings' && <SettingsScreen onBack={() => setCurrentPage('home')} />}
      {showSplash && (
        <AndreSplash
          appName="Marcador de Pontos"
          appIcon={require('../assets/icons/playstore.png')}
          appBackground="#5a8f7e"
          // Segura o splash até tema/cores e status de compra estarem carregados
          hold={!(themeReady && purchaseReady)}
          onFinish={() => setShowSplash(false)}
        />
      )}
    </>
  );
}

export default function App() {
  // Manter a tela acordada enquanto o app estiver aberto (lock liberado ao desmontar)
  useKeepAwake();

  useEffect(() => {
    // Inicializar AdMob quando o app carrega
    initializeAdMob();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <PurchaseProvider>
            <AppContent />
          </PurchaseProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
