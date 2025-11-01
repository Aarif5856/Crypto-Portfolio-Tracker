import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  LineChart,
  Coins,
  Layers3,
  Images,
  ReceiptText,
  ArrowLeftRight,
  Compass,
  Settings,
  Crown,
} from 'lucide-react';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'analytics', label: 'Analytics', icon: LineChart },
  { key: 'assets', label: 'Assets', icon: Coins },
  { key: 'defi', label: 'DeFi', icon: Layers3 },
  { key: 'nfts', label: 'NFTs', icon: Images },
  { key: 'transactions', label: 'Transactions', icon: ReceiptText },
  { key: 'swap', label: 'Swap', icon: ArrowLeftRight },
  { key: 'market', label: 'Discover', icon: Compass },
  { key: 'pricing', label: 'Pricing', icon: Crown },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ route, onNavigate }) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const handle = () => setCollapsed(mq.matches);
    handle();
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  return (
    <div className="h-full">
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: collapsed ? 76 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 z-30 h-screen border-r border-white/10 bg-[#0D0D0D]"
      >
        <div className="flex h-16 items-center gap-2 px-4">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
            C
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="truncate"
              >
                <div className="text-white font-semibold">CryptoPro</div>
                <div className="text-xs text-secondary">Portfolio Tracker</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="mt-2">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const active = route === key;
            return (
              <button
                key={key}
                title={label}
                onClick={() => onNavigate(key)}
                className={`group relative flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors ${
                  active ? 'text-white' : 'text-secondary'
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                    active
                      ? 'border-white/20 bg-white/10 text-white'
                      : 'border-white/10 bg-white/5 text-secondary group-hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      className="truncate"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-3 left-0 right-0 px-3">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 text-xs text-secondary hover:text-white hover:bg-white/10 transition-colors"
          >
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </motion.aside>
    </div>
  );
};

export default Sidebar;
