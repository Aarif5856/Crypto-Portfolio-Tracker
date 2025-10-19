import React, { useState } from 'react';
import { WalletProvider } from './context/WalletContext';
import { ThemeProvider } from './context/ThemeContext';
import { OnboardingProvider } from './context/OnboardingContext';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import OnboardingTutorial from './components/OnboardingTutorial';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const navigateToDashboard = () => setCurrentPage('dashboard');
  const navigateToLanding = () => setCurrentPage('landing');

  return (
    <ThemeProvider>
      <WalletProvider>
        <OnboardingProvider>
          <div className="App">
            {currentPage === 'landing' ? (
              <Landing onNavigateToDashboard={navigateToDashboard} />
            ) : (
              <>
                <Dashboard onNavigateToLanding={navigateToLanding} />
                <OnboardingTutorial />
              </>
            )}
          </div>
        </OnboardingProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;


