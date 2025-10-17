import React from 'react';
import Header from '../components/Header';
import PortfolioOverview from '../components/PortfolioOverview';
import UpgradeToPro from '../components/UpgradeToPro';
import AdBanner from '../components/AdBanner';
import Footer from '../components/Footer';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Portfolio Overview - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <PortfolioOverview />
            </div>

            {/* Sidebar - Takes 1 column on large screens */}
            <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
              <UpgradeToPro />
              
              {/* Additional widgets can be added here */}
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

              {/* Market News Placeholder */}
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
    </div>
  );
};

export default Dashboard;

