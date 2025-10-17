import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, optimism, bsc, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'CryptoPro Portfolio Tracker',
  projectId: 'crypto-pro-portfolio-tracker', // Using a placeholder for now
  chains: [mainnet, polygon, arbitrum, optimism, bsc, sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
