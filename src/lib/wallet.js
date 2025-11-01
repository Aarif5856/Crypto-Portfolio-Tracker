import { loadLocal, saveLocal } from './utils';

const KEY = 'cpt-wallets';

export const getWallets = () => loadLocal(KEY, []);
export const setWallets = (arr) => saveLocal(KEY, arr);

export const addWalletAddress = (address, label = '') => {
  const wallets = getWallets();
  if (!wallets.find((w) => w.address.toLowerCase() === address.toLowerCase())) {
    wallets.push({ address, label, addedAt: Date.now() });
    setWallets(wallets);
  }
  return wallets;
};

export const removeWalletAddress = (address) => {
  const wallets = getWallets().filter((w) => w.address.toLowerCase() !== address.toLowerCase());
  setWallets(wallets);
  return wallets;
};

