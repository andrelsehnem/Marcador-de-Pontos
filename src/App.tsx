import React, { useState } from 'react';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import HomeScreen from './mobile/screens/HomeScreen';
import TrucoScreen from './mobile/screens/TrucoScreen';
import CachetaScreen from './mobile/screens/CachetaScreen';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'truco' | 'cacheta'>('home');

  return (
    <ThemeProvider>
      {currentPage === 'home' && (
        <HomeScreen 
          onOpenTruco={() => setCurrentPage('truco')}
          onOpenCacheta={() => setCurrentPage('cacheta')}
        />
      )}
      {currentPage === 'truco' && <TrucoScreen onBack={() => setCurrentPage('home')} />}
      {currentPage === 'cacheta' && <CachetaScreen onBack={() => setCurrentPage('home')} />}
    </ThemeProvider>
  );
}
