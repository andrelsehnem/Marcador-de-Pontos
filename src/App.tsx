import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import { PurchaseProvider } from './shared/contexts/PurchaseContext';
import HomeScreen from './mobile/screens/HomeScreen';
import TrucoScreen from './mobile/screens/TrucoScreen';
import CachetaScreen from './mobile/screens/CachetaScreen';
import { initializeAdMob } from './shared/services/admob';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'truco' | 'cacheta'>('home');

  useEffect(() => {
    // Inicializar AdMob quando o app carrega
    initializeAdMob();
  }, []);

  return (
    <ThemeProvider>
      <PurchaseProvider>
        {currentPage === 'home' && (
          <HomeScreen 
            onOpenTruco={() => setCurrentPage('truco')}
            onOpenCacheta={() => setCurrentPage('cacheta')}
          />
        )}
        {currentPage === 'truco' && <TrucoScreen onBack={() => setCurrentPage('home')} />}
        {currentPage === 'cacheta' && <CachetaScreen onBack={() => setCurrentPage('home')} />}
      </PurchaseProvider>
    </ThemeProvider>
  );
}
