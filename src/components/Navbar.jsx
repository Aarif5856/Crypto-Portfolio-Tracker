import React from 'react';
import { Wallet, Bell, ChevronDown } from 'lucide-react';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import { useWallet } from '../context/WalletContext';

const Navbar = ({ onAssetSelect }) => {
  const { isConnected, connectWallet, account, networkName } = useWallet();

  const short = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '');

  return (
    <header className="fixed left-0 right-0 top-0 z-20 h-16 border-b border-white/10 bg-[#0D0D0D]/80 backdrop-blur">
      <div className="pl-[76px] lg:pl-[260px]">
        <div className="flex h-16 items-center justify-between px-4">
          <SearchBar onSelect={onAssetSelect} />

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <div className="hidden sm:flex items-center gap-2">
              <button className="badge">{networkName || 'Network'}</button>
              <button
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-secondary hover:text-white hover:bg-white/10"
                onClick={() => window.dispatchEvent(new CustomEvent('sync-all'))}
              >
                Sync All
              </button>
              <button className="p-2 rounded-lg border border-white/10 bg-white/5 text-secondary hover:text-white hover:bg-white/10">
                <Bell size={16} />
              </button>
            </div>

            {isConnected ? (
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-sm">
                <span className="hidden sm:block text-secondary">{networkName}</span>
                <span className="text-primary">{short(account)}</span>
                <ChevronDown size={16} className="text-secondary" />
              </div>
            ) : (
              <button onClick={connectWallet} className="btn-gradient flex items-center gap-2">
                <Wallet size={16} /> Connect
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
