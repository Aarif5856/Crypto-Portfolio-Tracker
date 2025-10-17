import React, { useState } from 'react';
import { X, Wallet, ExternalLink, Check } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const WalletConnectModal = ({ isOpen, onClose }) => {
  const { connectWallet, isConnecting } = useWallet();
  const [selectedConnector, setSelectedConnector] = useState(null);

  // Mock connectors for the modal
  const connectors = [
    { id: 'metaMask', name: 'MetaMask' },
    { id: 'walletConnect', name: 'WalletConnect' },
    { id: 'coinbaseWallet', name: 'Coinbase Wallet' },
    { id: 'phantom', name: 'Phantom' },
    { id: 'rainbow', name: 'Rainbow' },
    { id: 'trust', name: 'Trust Wallet' },
  ];

  const handleConnect = async (connectorId) => {
    setSelectedConnector(connectorId);
    await connectWallet();
    onClose();
  };

  const walletIcons = {
    metaMask: '🦊',
    walletConnect: '🔗',
    coinbaseWallet: '🔵',
    phantom: '👻',
    rainbow: '🌈',
    trust: '🛡️',
  };

  const getWalletIcon = (connectorName) => {
    const name = connectorName.toLowerCase();
    if (name.includes('metamask')) return walletIcons.metaMask;
    if (name.includes('walletconnect')) return walletIcons.walletConnect;
    if (name.includes('coinbase')) return walletIcons.coinbaseWallet;
    if (name.includes('phantom')) return walletIcons.phantom;
    if (name.includes('rainbow')) return walletIcons.rainbow;
    if (name.includes('trust')) return walletIcons.trust;
    return '💳';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Connect Wallet
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose your preferred wallet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wallet List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector.id)}
                disabled={isConnecting}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getWalletIcon(connector.name)}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {connector.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {connector.id === 'metaMask' && 'Connect using browser extension'}
                      {connector.id === 'walletConnect' && 'Connect using mobile app'}
                      {connector.id === 'coinbaseWallet' && 'Connect using Coinbase Wallet'}
                      {connector.id === 'phantom' && 'Connect using Phantom wallet'}
                      {connector.id === 'rainbow' && 'Connect using Rainbow wallet'}
                      {connector.id === 'trust' && 'Connect using Trust Wallet'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {selectedConnector === connector.id && isConnecting ? (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              New to crypto wallets?
            </p>
            <a
              href="https://ethereum.org/en/wallets/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center justify-center space-x-1"
            >
              <span>Learn more about wallets</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;

