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
    
    // For demo purposes, skip tutorial by default
    // Users can still access it via the help button
    if (!tutorialCompleted) {
      localStorage.setItem('crypto-pro-tutorial-completed', 'true');
      setHasSeenTutorial(true);
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
    if (import.meta.env && import.meta.env.DEV) {
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
