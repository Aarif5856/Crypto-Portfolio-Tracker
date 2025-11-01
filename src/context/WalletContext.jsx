import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { appConfig } from '../config/appConfig';
import { addWalletAddress, getWallets as loadWallets, removeWalletAddress as removeWalletAddr } from '../lib/wallet';

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
  const [activeAccount, setActiveAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [networkName, setNetworkName] = useState('Unknown');
  const [wallets, setWallets] = useState([]);

  const createReadProvider = useCallback(async (targetChainId = 1) => {
    try {
      const chain = Number(targetChainId) || 1;
      const rpcByChain = {
        1: appConfig.api?.alchemyApiKey
          ? `https://eth-mainnet.g.alchemy.com/v2/${appConfig.api.alchemyApiKey}`
          : appConfig.api?.infuraProjectId
          ? `https://mainnet.infura.io/v3/${appConfig.api.infuraProjectId}`
          : 'https://cloudflare-eth.com',
        137: 'https://polygon-rpc.com',
        56: 'https://bsc-dataseed.binance.org',
      };
      const url = rpcByChain[chain] || rpcByChain[1];
      const read = new ethers.JsonRpcProvider(url, chain);
      const network = await read.getNetwork();
      setProvider(read);
      setChainId(Number(network.chainId));
      setNetworkName(`${getNetworkName(Number(network.chainId))} (Read-only)`);
      return read;
    } catch (e) {
      console.error('Failed to create read-only provider', e);
      return null;
    }
  }, []);
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
      setActiveAccount(account);
      setProvider(provider);
      setSigner(signer);
      setBalance(balanceInEth);
      setChainId(chainId);
      setNetworkName(networkName);
      setIsConnected(true);
      setError(null);

      // Add to managed wallets store
      try {
        const updated = addWalletAddress(account, 'Connected');
        setWallets(updated);
      } catch {}
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
          } else {
            await createReadProvider(1);
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err);
        }
      } else {
        await createReadProvider(1);
      }
      // Load managed wallets from localStorage
      try {
        setWallets(loadWallets());
      } catch {}
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
    setActiveAccount(null);
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
      // For read-only, rebuild provider for target chain
      await createReadProvider(targetChainId);
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

  const connectWalletConnect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      // Lazy import without bundler resolution to keep dependency optional
      // Use runtime dynamic import to avoid bundler resolution during build
      const load = (s) => (new Function('s', 'return import(s)'))(s);
      const mod = await load('@walletconnect/ethereum-provider').catch(() => null);
      const EthereumProvider = mod?.default || mod?.EthereumProvider;
      if (!EthereumProvider) {
        throw new Error('WalletConnect not available in this build');
      }
      const wc = await EthereumProvider.init({
        projectId: appConfig.api?.walletConnectProjectId || 'crypto-pro-portfolio-tracker',
        showQrModal: true,
        chains: [1],
      });
      await wc.connect();
      const provider = new ethers.BrowserProvider(wc);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainIdNum = Number(network.chainId);
      const networkName = getNetworkName(chainIdNum);

      const bal = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(bal);

      setAccount(address);
      setActiveAccount(address);
      setProvider(provider);
      setSigner(signer);
      setBalance(balanceInEth);
      setChainId(chainIdNum);
      setNetworkName(networkName);
      setIsConnected(true);
      setError(null);
      try {
        const updated = addWalletAddress(address, 'WalletConnect');
        setWallets(updated);
      } catch {}
    } catch (err) {
      console.error('WalletConnect connection error:', err);
      setError(err?.message || 'Failed to connect via WalletConnect');
    } finally {
      setIsConnecting(false);
    }
  }, []);

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
    activeAccount,
    provider,
    signer,
    balance,
    isConnected,
    isConnecting,
    error,
    chainId,
    networkName,
    connectWallet,
    connectWalletConnect,
    disconnectWallet,
    refreshBalance,
    switchNetwork,
    wallets,
    addManagedWallet: (address, label) => {
      const updated = addWalletAddress(address, label);
      setWallets(updated);
      return updated;
    },
    removeManagedWallet: (address) => {
      const updated = removeWalletAddr(address);
      setWallets(updated);
      if (activeAccount && activeAccount.toLowerCase() === address.toLowerCase()) {
        setActiveAccount(account || null);
      }
      return updated;
    },
    setActiveAccount,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
