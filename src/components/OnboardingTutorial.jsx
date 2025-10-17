import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Wallet, Eye, Crown, CheckCircle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useOnboarding } from '../context/OnboardingContext';

const OnboardingTutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { isConnected } = useWallet();
  const { showTutorial, closeTutorial } = useOnboarding();

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to CryptoPro!',
      description: 'Your professional crypto portfolio tracker',
      icon: <Crown className="w-12 h-12 text-primary-500" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Let's get you started with a quick tour of the platform
          </p>
          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
            <p className="text-sm text-primary-700 dark:text-primary-300">
              This tutorial will show you how to connect your wallet, view your portfolio, and unlock Pro features.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'connect-wallet',
      title: 'Connect Your Wallet',
      description: 'Step 1: Connect your MetaMask or other Web3 wallet',
      icon: <Wallet className="w-12 h-12 text-primary-500" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">How to connect:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Click the "Connect Wallet" button in the top right</li>
              <li>Select your preferred wallet (MetaMask, WalletConnect, etc.)</li>
              <li>Approve the connection in your wallet</li>
              <li>Your wallet address will appear in the header</li>
            </ol>
          </div>
          {isConnected ? (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Wallet connected successfully!</span>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect your wallet to continue with the tutorial
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'view-portfolio',
      title: 'View Your Portfolio',
      description: 'Step 2: Explore your token balances and portfolio value',
      icon: <Eye className="w-12 h-12 text-primary-500" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Portfolio Overview</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Total portfolio value in USD</li>
                <li>• Individual token balances</li>
                <li>• Real-time price updates</li>
                <li>• 24h change tracking</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pro Features</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Top Movers widget</li>
                <li>• Personal watchlist</li>
                <li>• Risk score analysis</li>
                <li>• Advanced analytics</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'upgrade-pro',
      title: 'Upgrade to Pro',
      description: 'Step 3: Unlock advanced features and analytics',
      icon: <Crown className="w-12 h-12 text-primary-500" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-6 rounded-lg border border-primary-200 dark:border-primary-700">
            <h4 className="font-bold text-primary-900 dark:text-primary-100 mb-3">Pro Features Include:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary-600" />
                <span className="text-sm text-primary-800 dark:text-primary-200">Advanced Portfolio Analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary-600" />
                <span className="text-sm text-primary-800 dark:text-primary-200">Price Alerts & Notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary-600" />
                <span className="text-sm text-primary-800 dark:text-primary-200">Risk Assessment Tools</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary-600" />
                <span className="text-sm text-primary-800 dark:text-primary-200">Export Data & Reports</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Start your free trial today - no credit card required!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Start tracking your crypto portfolio like a pro',
      icon: <CheckCircle className="w-12 h-12 text-green-500" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            You now know how to use all the key features of CryptoPro
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              💡 <strong>Pro Tip:</strong> You can always access this tutorial again from the settings menu
            </p>
          </div>
          <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>• Connect wallet</span>
            <span>• View portfolio</span>
            <span>• Upgrade to Pro</span>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const nextStep = () => {
    if (isLastStep) {
      closeTutorial();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipTutorial = () => {
    localStorage.setItem('crypto-pro-tutorial-completed', 'true');
    setCurrentStep(0); // Reset to first step
    closeTutorial();
  };

  const completeTutorial = () => {
    localStorage.setItem('crypto-pro-tutorial-completed', 'true');
    setCurrentStep(0); // Reset to first step
    closeTutorial();
  };

  // Auto-advance from wallet connection step when wallet is connected
  useEffect(() => {
    if (currentStep === 1 && isConnected) {
      const timer = setTimeout(() => {
        setCurrentStep(2);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isConnected]);

  if (!showTutorial) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          skipTutorial();
        }
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {currentStepData.icon}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentStepData.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentStepData.description}
              </p>
            </div>
          </div>
          <button
            onClick={skipTutorial}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isFirstStep
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-primary-500'
                    : index < currentStep
                    ? 'bg-primary-300'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={isLastStep ? completeTutorial : nextStep}
            className="btn-primary flex items-center space-x-2"
          >
            <span>{isLastStep ? 'Get Started' : 'Next'}</span>
            {!isLastStep && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;
