import React, { createContext, useContext, useState, useEffect } from 'react';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  useEffect(() => {
    // Check if user has seen the tutorial before
    const tutorialCompleted = localStorage.getItem('crypto-pro-tutorial-completed');
    setHasSeenTutorial(!!tutorialCompleted);
    
    // Clear tutorial state for testing (remove this in production)
    if (process.env.NODE_ENV === 'development') {
      // Uncomment the line below to reset tutorial state
      // localStorage.removeItem('crypto-pro-tutorial-completed');
      // setHasSeenTutorial(false);
    }
  }, []);

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  const resetTutorial = () => {
    localStorage.removeItem('crypto-pro-tutorial-completed');
    setHasSeenTutorial(false);
    setShowTutorial(false);
  };

  // Add global function for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.clearTutorial = resetTutorial;
    }
  }, []);

  const value = {
    showTutorial,
    hasSeenTutorial,
    startTutorial,
    closeTutorial,
    resetTutorial
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
