import React from 'react';
import { Moon, Sun, Wallet, LogOut, HelpCircle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useTheme } from '../context/ThemeContext';
import { useOnboarding } from '../context/OnboardingContext';
import { appConfig } from '../config/appConfig';
import ProBadge from './ProBadge';

const Header = ({ onNavigateToLanding }) => {
  const { account, isConnected, connectWallet, disconnectWallet } = useWallet();
  const { isDark, toggleTheme } = useTheme();
  const { startTutorial } = useOnboarding();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateToLanding}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-bg rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm sm:text-base">
                  {appConfig.appName.charAt(0)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                  {appConfig.appName}
                </h1>
                <ProBadge isPro={true} showText={true} />
              </div>
            </button>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Upgrade to Pro Button - Hidden on mobile */}
            <button className="hidden sm:block text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
              Upgrade to Pro
            </button>

            {/* Help Button */}
            <button
              onClick={startTutorial}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Show tutorial"
              title="Show tutorial"
            >
              <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Theme Toggle - Pill Style */}
            <button
              onClick={toggleTheme}
              className="relative flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 w-16 h-8 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              <div className={`absolute top-0.5 left-0.5 w-7 h-7 bg-white dark:bg-gray-800 rounded-full shadow-sm transform transition-transform duration-300 ${
                isDark ? 'translate-x-8' : 'translate-x-0'
              }`}>
                <div className="flex items-center justify-center h-full">
                  {isDark ? (
                    <Sun className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-gray-600" />
                  )}
                </div>
              </div>
            </button>

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    {formatAddress(account)}
                  </span>
                </div>
                <div className="sm:hidden flex items-center space-x-1 px-2 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">
                    {formatAddress(account)}
                  </span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="p-1.5 sm:p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors duration-200"
                  aria-label="Disconnect wallet"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="btn-primary flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
              >
                <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

