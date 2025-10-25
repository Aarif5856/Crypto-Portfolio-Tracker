import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

const getNetworkName = (chainId) => {
  const networks = {
    1: 'Ethereum Mainnet',
    3: 'Ropsten Testnet',
    4: 'Rinkeby Testnet',
    5: 'Goerli Testnet',
    42: 'Kovan Testnet',
    11155111: 'Sepolia Testnet',
    137: 'Polygon Mainnet',
    80001: 'Polygon Mumbai',
    56: 'BSC Mainnet',
    97: 'BSC Testnet',
  };
  return networks[chainId] || `Chain ${chainId}`;
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [networkName, setNetworkName] = useState('Unknown');
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = accounts[0];

      // Get network info
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      const networkName = getNetworkName(chainId);

      // Get balance
      const balance = await provider.getBalance(account);
      const balanceInEth = ethers.formatEther(balance);

      setAccount(account);
      setProvider(provider);
      setSigner(signer);
      setBalance(balanceInEth);
      setChainId(chainId);
      setNetworkName(networkName);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err);
        }
      }
    };

    checkConnection();
  }, [connectWallet]);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);


  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setBalance('0');
    setChainId(null);
    setNetworkName('Unknown');
    setIsConnected(false);
    setError(null);
  };

  const switchNetwork = async (targetChainId) => {
    if (!window.ethereum) {
      setError('Wallet not available');
      return;
    }
    const hexId = '0x' + Number(targetChainId).toString(16);
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexId }],
      });
    } catch (switchError) {
      // If the chain is not added to MetaMask, you could request to add it here.
      console.error('Error switching network:', switchError);
      setError('Failed to switch network');
    }
  };

  const refreshBalance = async () => {
    if (provider && account) {
      try {
        const balance = await provider.getBalance(account);
        const balanceInEth = ethers.formatEther(balance);
        setBalance(balanceInEth);
      } catch (err) {
        console.error('Error refreshing balance:', err);
      }
    }
  };

  const value = {
    account,
    provider,
    signer,
    balance,
    isConnected,
    isConnecting,
    error,
    chainId,
    networkName,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    switchNetwork,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
