export const setupMockCoinGecko = async (page) => {
  const pricePayload = {
    ethereum: {
      usd: 3200,
      usd_24h_change: 2.5,
      usd_24h_vol: 100000000,
      usd_market_cap: 400000000,
    },
    'matic-network': {
      usd: 0.85,
      usd_24h_change: 3.2,
      usd_24h_vol: 50000000,
      usd_market_cap: 200000000,
    },
    binancecoin: {
      usd: 410,
      usd_24h_change: 1.1,
      usd_24h_vol: 60000000,
      usd_market_cap: 350000000,
    },
    bitcoin: {
      usd: 64000,
      usd_24h_change: 4.4,
      usd_24h_vol: 250000000,
      usd_market_cap: 1200000000,
    },
    'usd-coin': {
      usd: 1,
      usd_24h_change: 0,
      usd_24h_vol: 8000000,
      usd_market_cap: 500000000,
    },
    tether: {
      usd: 1,
      usd_24h_change: 0,
      usd_24h_vol: 7000000,
      usd_market_cap: 450000000,
    },
    dai: {
      usd: 1,
      usd_24h_change: 0,
      usd_24h_vol: 3000000,
      usd_market_cap: 200000000,
    },
    solana: {
      usd: 98,
      usd_24h_change: 5.8,
      usd_24h_vol: 40000000,
      usd_market_cap: 320000000,
    },
    cardano: {
      usd: 0.45,
      usd_24h_change: -0.8,
      usd_24h_vol: 15000000,
      usd_market_cap: 180000000,
    },
    polkadot: {
      usd: 6.2,
      usd_24h_change: 1.4,
      usd_24h_vol: 12000000,
      usd_market_cap: 90000000,
    },
    'avalanche-2': {
      usd: 32,
      usd_24h_change: -2.1,
      usd_24h_vol: 22000000,
      usd_market_cap: 100000000,
    },
    chainlink: {
      usd: 14.5,
      usd_24h_change: 0.9,
      usd_24h_vol: 9000000,
      usd_market_cap: 70000000,
    },
  };

  const marketData = {
    bitcoin: {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      current_price: 64000,
      price_change_percentage_24h: 4.4,
    },
    ethereum: {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      current_price: 3200,
      price_change_percentage_24h: 2.5,
    },
    solana: {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      current_price: 98,
      price_change_percentage_24h: 5.8,
    },
    cardano: {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      current_price: 0.45,
      price_change_percentage_24h: -0.8,
    },
    'matic-network': {
      id: 'matic-network',
      symbol: 'matic',
      name: 'Polygon',
      current_price: 0.85,
      price_change_percentage_24h: 3.2,
    },
    polkadot: {
      id: 'polkadot',
      symbol: 'dot',
      name: 'Polkadot',
      current_price: 6.2,
      price_change_percentage_24h: 1.4,
    },
    'avalanche-2': {
      id: 'avalanche-2',
      symbol: 'avax',
      name: 'Avalanche',
      current_price: 32,
      price_change_percentage_24h: -2.1,
    },
    binancecoin: {
      id: 'binancecoin',
      symbol: 'bnb',
      name: 'BNB',
      current_price: 410,
      price_change_percentage_24h: 1.1,
    },
  };

  const syntheticForId = (id) => {
    const seed = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const basePrice = (seed % 5000) / 100 + 1;
    const change = ((seed % 200) - 100) / 10;
    return {
      id,
      symbol: id.slice(0, 3).toLowerCase(),
      name: id.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Synthetic Asset',
      current_price: Number(basePrice.toFixed(2)),
      price_change_percentage_24h: Number(change.toFixed(2)),
      usd: Number(basePrice.toFixed(2)),
      usd_24h_change: Number(change.toFixed(2)),
      usd_24h_vol: 1000000,
      usd_market_cap: 5000000 + seed * 1000,
    };
  };

  const ensurePrice = (id) => {
    if (!pricePayload[id]) {
      const synthetic = syntheticForId(id);
      pricePayload[id] = {
        usd: synthetic.usd,
        usd_24h_change: synthetic.usd_24h_change,
        usd_24h_vol: synthetic.usd_24h_vol,
        usd_market_cap: synthetic.usd_market_cap,
      };
    }
    return pricePayload[id];
  };

  const ensureMarketEntry = (id) => {
    if (!marketData[id]) {
      const synthetic = syntheticForId(id);
      marketData[id] = {
        id: synthetic.id,
        symbol: synthetic.symbol,
        name: synthetic.name,
        current_price: synthetic.current_price,
        price_change_percentage_24h: synthetic.price_change_percentage_24h,
      };
    }
    return marketData[id];
  };

  await page.route('https://api.coingecko.com/api/v3/*', async (route, request) => {
    const url = new URL(request.url());
    const { pathname, searchParams } = url;

    if (pathname === '/api/v3/simple/price') {
      const idsParam = searchParams.get('ids') || '';
      const ids = idsParam.split(',').filter(Boolean);
      const body = ids.reduce((acc, id) => {
        acc[id] = ensurePrice(id);
        return acc;
      }, {});
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
      return;
    }

    if (pathname === '/api/v3/coins/markets') {
      const idsParam = searchParams.get('ids') || '';
      const ids = idsParam.split(',').filter(Boolean);
      const response = ids.map((id) => ({
        ...ensureMarketEntry(id),
      }));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
      return;
    }

    if (pathname === '/api/v3/global') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            total_market_cap: { usd: 1200000000 },
            total_volume: { usd: 450000000 },
            active_cryptocurrencies: 9500,
            market_cap_change_percentage_24h_usd: 2.2,
          },
        }),
      });
      return;
    }

    if (pathname === '/api/v3/search') {
      const query = (searchParams.get('query') || '').toLowerCase();
      const matches = Object.keys(marketData)
        .map((id) => ensureMarketEntry(id))
        .filter((coin) => coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query))
        .map((coin) => ({
          item: {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
            market_cap_rank: 1,
          },
        }));

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ coins: matches }),
      });
      return;
    }

    if (pathname === '/api/v3/search/trending') {
      const coins = Object.keys(marketData)
        .map((id, index) => ({ coin: ensureMarketEntry(id), index }))
        .slice(0, 5)
        .map(({ coin, index }) => ({
          item: {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
            market_cap_rank: index + 1,
          },
        }));

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ coins }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });
};
