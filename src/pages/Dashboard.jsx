import React, { useEffect } from 'react';
import Header from '../components/Header';
import PortfolioOverview from '../components/PortfolioOverview';
import UpgradeToPro from '../components/UpgradeToPro';
import AdBanner from '../components/AdBanner';
import Footer from '../components/Footer';
import TopMovers from '../components/TopMovers';
import Watchlist from '../components/Watchlist';
import PortfolioRiskScore from '../components/PortfolioRiskScore';
// import PortfolioAnalytics from '../components/PortfolioAnalytics';
import MobileBottomNav from '../components/MobileBottomNav';
import ConnectWalletCard from '../components/ConnectWalletCard';
import { useWallet } from '../context/WalletContext';
import { useOnboarding } from '../context/OnboardingContext';

const Dashboard = ({ onNavigateToLanding }) => {
  const { isConnected } = useWallet();
  const { hasSeenTutorial, startTutorial } = useOnboarding();

  // Show tutorial for first-time users
  useEffect(() => {
    if (!hasSeenTutorial) {
      const timer = setTimeout(() => {
        startTutorial();
      }, 2000); // Small delay to let the page load
      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial, startTutorial]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onNavigateToLanding={onNavigateToLanding} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 md:pb-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Welcome Section */}
          <div className="text-center px-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Your Portfolio
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Track your crypto investments in real-time
            </p>
          </div>

          {/* Ad Banner */}
          <AdBanner />

          {/* Connect Wallet Card - Show when not connected */}
          {!isConnected && (
            <div className="mb-8">
              <ConnectWalletCard />
            </div>
          )}

          {/* Pro Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Portfolio - Takes 2 columns on XL screens */}
            <div className="xl:col-span-2" id="portfolio">
              <PortfolioOverview />
            </div>

            {/* Pro Widgets - Takes 2 columns on XL screens */}
            <div className="xl:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TopMovers />
                <PortfolioRiskScore portfolioValue={0} tokenBalances={[]} />
              </div>
              <div id="watchlist">
                <Watchlist />
              </div>
            </div>
          </div>

          {/* Portfolio Analytics - Temporarily disabled */}
          {/* {isConnected && (
            <div className="mt-8" id="analytics">
              <PortfolioAnalytics 
                portfolioValue={portfolioValue} 
                tokenBalances={tokenBalances} 
              />
            </div>
          )} */}

          {/* Secondary Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upgrade to Pro */}
            <div className="lg:col-span-1">
              <UpgradeToPro />
            </div>

            {/* Quick Stats */}
            <div className="lg:col-span-1">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Market Cap</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      $2.1T
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">24h Volume</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      $45.2B
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Active Coins</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      8,945
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market News */}
            <div className="lg:col-span-1">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Market News
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      Bitcoin Reaches New Heights
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      BTC breaks through $50K resistance level...
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      DeFi TVL Surges
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Total value locked in DeFi protocols hits new record...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Dashboard;

