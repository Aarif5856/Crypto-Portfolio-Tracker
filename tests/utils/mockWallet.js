export const setupMockWallet = async (page) => {
  await page.addInitScript(() => {
    const accounts = ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'];
    let isConnected = false;
    const listeners = {};

    const emit = (event, payload) => {
      (listeners[event] || []).forEach((handler) => handler(payload));
    };

    window.ethereum = {
      isMetaMask: true,
      request: async ({ method, params }) => {
        switch (method) {
          case 'eth_accounts':
            return isConnected ? accounts : [];
          case 'eth_requestAccounts':
            isConnected = true;
            emit('accountsChanged', accounts);
            return accounts;
          case 'eth_chainId':
            return '0x1';
          case 'eth_getBalance':
        return '0xDE0B6B3A7640000'; // 1 ETH
      case 'wallet_switchEthereumChain':
        return null;
      case 'eth_blockNumber':
        return '0x1';
      case 'eth_getCode':
        return '0x';
      case 'eth_call':
        if (params && params[0] && typeof params[0].data === 'string' && params[0].data.startsWith('0x70a08231')) {
          return '0x0000000000000000000000000000000000000000000000000000000000000014';
        }
        return '0x';
      case 'eth_estimateGas':
        return '0x5208';
      default:
        return '0x0';
        }
      },
      on: (event, handler) => {
        listeners[event] = listeners[event] || [];
        listeners[event].push(handler);
      },
      removeListener: (event, handler) => {
        if (!listeners[event]) return;
        listeners[event] = listeners[event].filter((h) => h !== handler);
      },
    };
  });
};
