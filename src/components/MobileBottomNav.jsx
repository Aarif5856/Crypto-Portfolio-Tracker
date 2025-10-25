import React from 'react';
import { Wallet, BarChart3, Star, Home } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const MobileBottomNav = () => {
  const { isConnected } = useWallet();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      href: '#',
      active: true
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: BarChart3,
      href: '#portfolio',
      active: false
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      href: '#analytics',
      active: false
    },
    {
      id: 'watchlist',
      label: 'Watchlist',
      icon: Star,
      href: '#watchlist',
      active: false
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: Wallet,
      href: '#wallet',
      active: false,
      connected: isConnected
    }
  ];

  const handleNavClick = (item) => {
    if (item.onClick) {
      item.onClick();
      return;
    }
    
    // Scroll to section
    if (item.href.startsWith('#')) {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;
          const isItemConnected = item.connected;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center space-y-1 px-2 py-2 transition-colors duration-200 ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                {isItemConnected && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
