import React, { createContext, useContext } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism, bsc } from 'wagmi/chains';

const WalletContextV2 = createContext();

export const useWalletV2 = () => {
  const context = useContext(WalletContextV2);
  if (!context) {
    throw new Error('useWalletV2 must be used within a WalletProviderV2');
  }
  return context;
};

export const WalletProviderV2 = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error: connectError, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  
  // Get ETH balance
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
  });

  const connectWallet = async (connectorId) => {
    try {
      const connector = connectors.find(c => c.id === connectorId);
      if (connector) {
        connect({ connector });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const getNetworkName = (chainId) => {
    const networks = {
      1: 'Ethereum Mainnet',
      3: 'Ropsten Testnet',
      5: 'Goerli Testnet',
      11155111: 'Sepolia Testnet',
      137: 'Polygon Mainnet',
      80001: 'Polygon Mumbai',
      56: 'BSC Mainnet',
      97: 'BSC Testnet',
      42161: 'Arbitrum One',
      421614: 'Arbitrum Sepolia',
      10: 'Optimism',
      420: 'Optimism Sepolia',
    };
    return networks[chainId] || `Chain ${chainId}`;
  };

  const value = {
    // Account info
    account: address,
    isConnected,
    
    // Connection methods
    connectWallet,
    disconnectWallet,
    
    // Wallet info
    balance: balance?.formatted || '0',
    balanceSymbol: balance?.symbol || 'ETH',
    balanceDecimals: balance?.decimals || 18,
    
    // Network info
    chainId: chainId,
    networkName: getNetworkName(chainId),
    
    // Connection state
    isConnecting: isPending,
    error: connectError,
    
    // Available connectors
    connectors: connectors.map(connector => ({
      id: connector.id,
      name: connector.name,
      icon: connector.icon,
    })),
  };

  return (
    <WalletContextV2.Provider value={value}>
      {children}
    </WalletContextV2.Provider>
  );
};
