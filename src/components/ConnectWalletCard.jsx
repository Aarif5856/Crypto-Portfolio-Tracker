import React, { useState } from 'react';
import { Wallet, ArrowRight } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import WalletConnectModal from './WalletConnectModal';

const ConnectWalletCard = () => {
  const { isConnected, error } = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);

  if (isConnected) {
    return null; // Don't show if wallet is already connected
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Replaced corrupted glyph with a proper wallet icon */}
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/15 text-blue-600 dark:bg-blue-500/15">
        <Wallet className="h-9 w-9" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
        Connect Your Wallet
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
        Connect MetaMask or WalletConnect to view your portfolio and unlock advanced features.
      </p>
      <button
        onClick={() => setShowWalletModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 mx-auto"
      >
        <Wallet className="w-5 h-5" />
        <span>Connect Wallet</span>
        <ArrowRight className="w-4 h-4" />
      </button>
      <div className="mt-6 space-y-2 text-sm text-gray-500 dark:text-gray-400">
        <p>Supported today: MetaMask and WalletConnect.</p>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </div>
  );
};

export default ConnectWalletCard;

