import React, { Suspense, useEffect, useMemo, useState } from 'react';

// Lazy pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Assets = React.lazy(() => import('./pages/Assets'));
const DeFi = React.lazy(() => import('./pages/DeFi'));
const NFTs = React.lazy(() => import('./pages/NFTs'));
const Transactions = React.lazy(() => import('./pages/Transactions'));
const Swap = React.lazy(() => import('./pages/Swap'));
const Market = React.lazy(() => import('./pages/Market'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Pricing = React.lazy(() => import('./pages/Pricing'));

const routes = {
  dashboard: Dashboard,
  analytics: Analytics,
  assets: Assets,
  defi: DeFi,
  nfts: NFTs,
  transactions: Transactions,
  swap: Swap,
  market: Market,
  settings: Settings,
  pricing: Pricing,
};

export const useHashRoute = (defaultRoute = 'dashboard') => {
  const [route, setRoute] = useState(defaultRoute);

  useEffect(() => {
    const parse = () => {
      const h = window.location.hash.replace('#', '').trim();
      setRoute(h || defaultRoute);
    };
    parse();
    window.addEventListener('hashchange', parse);
    return () => window.removeEventListener('hashchange', parse);
  }, [defaultRoute]);

  const navigate = (r) => {
    window.location.hash = r;
  };

  return { route, navigate };
};

export const RouteView = ({ route }) => {
  const Page = routes[route] || routes.dashboard;
  return (
    <Suspense fallback={<div className="card">Loading...</div>}>
      <Page />
    </Suspense>
  );
};

