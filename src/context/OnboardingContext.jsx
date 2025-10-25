import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'crypto-pro-tutorial-completed';
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
    // Ensure the tutorial opens once for first-time visitors only
    let timer;
    if (typeof window !== 'undefined') {
      const tutorialCompleted = localStorage.getItem(STORAGE_KEY) === 'true';
      setHasSeenTutorial(tutorialCompleted);
      if (!tutorialCompleted) {
        timer = window.setTimeout(() => setShowTutorial(true), 600);
      }
    }
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  const markTutorialCompleted = () => {
    // Persist tutorial completion once the user finishes or dismisses it
    localStorage.setItem(STORAGE_KEY, 'true');
    setHasSeenTutorial(true);
    setShowTutorial(false);
  };

  const skipTutorial = () => {
    markTutorialCompleted();
  };

  const completeTutorial = () => {
    markTutorialCompleted();
  };

  const resetTutorial = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasSeenTutorial(false);
    setShowTutorial(false);
  };

  // Expose reset helper in dev builds for easier QA
  useEffect(() => {
    if (import.meta.env?.DEV) {
      window.clearTutorial = resetTutorial;
    }
  }, []);

  const value = {
    showTutorial,
    hasSeenTutorial,
    startTutorial,
    closeTutorial,
    skipTutorial,
    completeTutorial,
    resetTutorial,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
