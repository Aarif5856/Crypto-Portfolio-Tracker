# White-Label Crypto Portfolio Tracker

A production-ready Web3 dashboard that lets agencies launch crypto portfolio tracking experiences under their own brand. The application ships with polished UI components, cohesive theming, and revenue features that can be toggled per client.

## Features
- Wallet connections via MetaMask today, WalletConnect-ready architecture
- Live price lookups powered by the CoinGecko API with graceful fallbacks
- Portfolio aggregation for ETH and popular ERC-20 tokens
- Dark/light themes with automatic system detection
- White-label friendly branding and feature toggles
- Monetization hooks: upgrade-to-pro modal and ad banner slots
- Responsive design tuned for phones, tablets, and desktops

## Tech Stack
- React 18 + Vite
- TailwindCSS with CSS custom properties for dynamic themes
- Ethers.js v6 and wagmi for wallet interactions
- Axios for HTTP requests
- Chart.js and Recharts for data visualization
- Playwright for end-to-end smoke tests

## Getting Started

```bash
git clone <your-repo>
cd crypto-portfolio-tracker
npm install
npm run dev
```

Additional scripts:
- `npm run build` – create a production bundle in `dist/`
- `npm run preview` – preview the production build locally
- `npm run lint` – lint source files with ESLint
- `npm run test:e2e` – execute Playwright scenarios (requires `npx playwright install`)
- `npm run check:encoding` – ensure no non-ASCII glyphs slipped into `src/`

## Environment Variables

Copy `.env.example` to `.env` and populate when you are ready to connect to production services.

Key variables:
- `VITE_COINGECKO_API_KEY` – optional, raises CoinGecko rate limits
- `VITE_INFURA_PROJECT_ID` / `VITE_ALCHEMY_API_KEY` – optional Ethereum RPC providers
- `VITE_STRIPE_PUBLISHABLE_KEY` – required when you wire Upgrade to Pro to Stripe
- `VITE_ALLOWED_ORIGINS`, `VITE_ENABLE_ANALYTICS`, etc. – feature-flag style controls

The tracker works out of the box without secrets, but rate-limited APIs will benefit from real keys.

## White-Label Customization

All branding lives in `src/config/appConfig.js`. Update the config for each client or load values dynamically from your CMS.

```javascript
export const appConfig = {
  appName: "YourClientName",
  appDescription: "Client specific positioning",
  logoUrl: "/logos/your-client.svg",
  primaryColor: "#12b981",
  secondaryColor: "#6366f1",
  domain: "yourclient.com",
  supportEmail: "support@yourclient.com",
  features: {
    darkMode: true,
    walletConnect: true,
    portfolioAnalytics: true,
    priceAlerts: false,
    advancedCharts: false,
    exportData: false,
  },
  monetization: {
    showUpgradeButton: true,
    showAdBanner: true,
    proPrice: "$19.00/mo",
    stripePublishableKey: "",
  },
};
```

Tips:
- Drop client brand assets inside `public/` and reference them via relative paths.
- The theming helper automatically generates Tailwind-compatible color shades from `primaryColor`.
- Use the feature toggles to stage premium functionality for higher tiers.
- Customize `social`, `legal`, and `analytics` blocks in the config to wire external tools.

## Project Structure

```
src/
  components/        Reusable UI (Hero, Header, Watchlist, etc.)
  config/            White-label configuration and theming helpers
  context/           React context providers (wallet, theme, onboarding)
  hooks/             Data hooks (`usePortfolioData`, etc.)
  pages/             Landing and dashboard entry points
  utils/             API clients, analytics helpers, portfolio math
  App.jsx            Root component with routing between landing/dashboard
```

Tailwind styles live in `src/index.css`, while global assets live under `public/`.

## Deployment

The app is optimized for static hosting. Typical workflow:
1. `npm run build`
2. Deploy the contents of `dist/` to Vercel, Netlify, Cloudflare Pages, or S3/CloudFront.
3. Configure environment variables on the hosting platform.
4. Point the custom domain listed in `appConfig.js` to the deployed project.

`vercel.json` is bundled for one-command Vercel deploys, including SPA rewrites.

## Security Notes
- Read-only wallet access only; no private keys are ever stored or transmitted.
- All API requests target reputable, HTTPS endpoints.
- Encourage production deployments to sit behind SSL with HSTS enabled.
- For Stripe or other payment integrations, keep secret keys server-side only.

## Supported Tokens

The default setup recognises ETH plus a curated list of ERC-20 tokens (USDC, USDT, DAI, WBTC, UNI, MATIC, LINK). Update `POPULAR_TOKENS` in `src/utils/portfolio.js` to extend coverage or tailor per client.

## Troubleshooting
- **Wallet fails to connect** – confirm MetaMask is installed/unlocked and you are on a supported network (Ethereum, Polygon, BSC).
- **Prices fail to load** – check CoinGecko status or supply an API key for higher limits; fallback pricing is logged in the console.
- **Build errors** – use Node 18+, reinstall dependencies, and clear `node_modules` if the issue persists.

## Contributing
1. Fork the repo
2. Create a feature branch
3. Run lint/build before pushing
4. Open a pull request once checks pass

## License

MIT © 2025 Crypto Portfolio Tracker contributors
