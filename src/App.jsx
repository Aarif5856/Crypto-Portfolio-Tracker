import React from 'react';
import { WalletProvider } from './context/WalletContext';
import { ThemeProvider } from './context/ThemeContext';
import { OnboardingProvider } from './context/OnboardingContext';
import EnterpriseLayout from './layout/EnterpriseLayout';
import { RouteView, useHashRoute } from './router';
import OnboardingTutorial from './components/OnboardingTutorial';
import './index.css';

function App() {
  const { route, navigate } = useHashRoute('dashboard');

  return (
    <ThemeProvider>
      <WalletProvider>
        <OnboardingProvider>
          <EnterpriseLayout route={route} onNavigate={navigate}>
            <RouteView route={route} />
            <OnboardingTutorial />
          </EnterpriseLayout>
        </OnboardingProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;

