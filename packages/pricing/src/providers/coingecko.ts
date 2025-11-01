export async function getCoingeckoPrice(symbolOrId: string, vsCurrency = 'usd'): Promise<number | null> {
  const id = symbolOrId.toLowerCase();
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=${encodeURIComponent(vsCurrency)}`;
  const res = await fetch(url, {
    headers: {
      'accept': 'application/json',
      // If you have a CG key: 'x-cg-pro-api-key': process.env.COINGECKO_API_KEY ?? ''
    }
  });
  if (!res.ok) return null;
  const json = await res.json();
  const price = json?.[id]?.[vsCurrency];
  return typeof price === 'number' ? price : null;
}

