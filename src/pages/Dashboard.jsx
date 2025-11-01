import React, { useEffect } from 'react';
import Card from '../components/Card';
import ProBanner from '../components/ProBanner';
import TopMovers from '../components/TopMovers';
import PortfolioOverview from '../components/PortfolioOverview';
import PortfolioRiskScore from '../components/PortfolioRiskScore';
import Watchlist from '../components/Watchlist';
import ConnectWalletCard from '../components/ConnectWalletCard';
import { useWallet } from '../context/WalletContext';
import { useOnboarding } from '../context/OnboardingContext';
import { usePortfolioData } from '../hooks/usePortfolioData';

const Stat = ({ label, value, tone = 'default' }) => (
  <Card className="p-4">
    <div className="text-xs text-secondary">{label}</div>
    <div className="mt-1 text-xl font-semibold text-primary">{value}</div>
  </Card>
);

const Dashboard = () => {
  const { isConnected } = useWallet();
  const { hasSeenTutorial, startTutorial } = useOnboarding();
  const portfolioQuery = usePortfolioData();

  useEffect(() => {
    if (!hasSeenTutorial) {
      const timer = setTimeout(() => startTutorial(), 1200);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial, startTutorial]);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Portfolio Value" value="$—" />
        <Stat label="24h Change" value="—%" />
        <Stat label="Risk Score" value="—/100" />
        <Stat label="Active Tokens" value="—" />
      </div>

      {/* Connect Wallet prompt */}
      {!isConnected && <ConnectWalletCard />}

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-2" id="portfolio">
          <PortfolioOverview portfolioQuery={portfolioQuery} />
        </div>
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <TopMovers />
            <PortfolioRiskScore portfolioQuery={portfolioQuery} />
          </div>
          <div id="watchlist">
            <Watchlist />
          </div>
        </div>
      </div>

      {/* Pro banner + Sponsored */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2" id="upgrade-section">
          <ProBanner onUpgrade={() => window.dispatchEvent(new CustomEvent('open-upgrade-modal'))} />
        </div>
        <Card>
          <div className="text-sm text-secondary mb-2">Sponsored</div>
          <div className="text-xs text-secondary">Ad slot placeholder</div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
