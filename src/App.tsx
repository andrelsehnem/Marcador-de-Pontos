import React from 'react';
import './web/styles/global.css';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import Home from './web/pages/Home';

export default function App() {
  return (
    <div style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}>
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    </div>
  );
}
