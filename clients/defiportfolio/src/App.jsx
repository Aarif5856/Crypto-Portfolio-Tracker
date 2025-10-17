import React from 'react';
import { WalletProvider } from './context/WalletContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <div className="App">
          <Dashboard />
        </div>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;

