import React from 'react';
import { WalletProvider } from './context/WalletContext';
import { ThemeProvider } from './context/ThemeContext';
import { OnboardingProvider } from './context/OnboardingContext';
import Dashboard from './pages/Dashboard';
import OnboardingTutorial from './components/OnboardingTutorial';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <OnboardingProvider>
          <div className="App">
            <Dashboard />
            <OnboardingTutorial />
          </div>
        </OnboardingProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;


