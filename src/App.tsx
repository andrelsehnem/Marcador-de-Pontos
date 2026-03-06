import React, { useState } from 'react';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import HomeScreen from './mobile/screens/HomeScreen';
import TrucoScreen from './mobile/screens/TrucoScreen';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'truco'>('home');

  return (
    <ThemeProvider>
      {currentPage === 'home' && <HomeScreen onOpenTruco={() => setCurrentPage('truco')} />}
      {currentPage === 'truco' && <TrucoScreen onBack={() => setCurrentPage('home')} />}
    </ThemeProvider>
  );
}
