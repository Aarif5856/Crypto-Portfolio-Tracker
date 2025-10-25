import React, { useEffect } from 'react';
import { X, Wallet, ExternalLink } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const WalletConnectModal = ({ isOpen, onClose }) => {
  const { connectWallet, isConnecting, error, isConnected } = useWallet();

  useEffect(() => {
    if (isOpen && isConnected) {
      onClose();
    }
  }, [isConnected, isOpen, onClose]);

  const handleConnect = async () => {
    await connectWallet();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Connect Wallet</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Select an available wallet to continue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close wallet modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Restrict to MetaMask until multi-wallet support is ready */}
        <div className="space-y-4 p-6">
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex w-full items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 text-left text-blue-700 transition-all duration-200 hover:border-blue-400 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:border-blue-600"
          >
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm dark:bg-blue-900/40">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">MetaMask</div>
                <div className="text-sm text-blue-600/80 dark:text-blue-200/80">
                  Connect using the MetaMask browser extension.
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isConnecting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              ) : (
                <ExternalLink className="h-5 w-5" />
              )}
            </div>
          </button>

          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
            WalletConnect, Coinbase Wallet, Rainbow, and other connectors are coming soon. Follow our Discord for
            updates.
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-center">
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">New to crypto wallets?</p>
            <a
              href="https://ethereum.org/en/wallets/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span>Learn more about wallets</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;
