# White-Label Crypto Portfolio Tracker

A production-ready Web3 dashboard for tracking cryptocurrency portfolios with easy white-label customization for multiple clients.

## 🚀 Features

- **Wallet Connection**: MetaMask and WalletConnect support
- **Real-time Prices**: Live token prices from CoinGecko API
- **Portfolio Tracking**: View ETH and ERC-20 token balances
- **Dark/Light Theme**: Automatic theme switching
- **White-label Ready**: Easy rebranding via configuration
- **Responsive Design**: Mobile-first TailwindCSS design
- **Monetization Ready**: Pro upgrade and ad banner slots

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS with custom theming
- **Blockchain**: Ethers.js v6
- **API**: CoinGecko for price data
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd crypto-portfolio-tracker
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🎨 White-Label Customization

### Quick Rebranding

To rebrand for a new client, simply edit `/src/config/appConfig.js`:

```javascript
export const appConfig = {
  // Basic App Information
  appName: "YourClientName",
  appDescription: "Your Client's Description",
  logoUrl: "/your-logo.png",
  
  // Branding Colors
  primaryColor: "#YOUR_COLOR",
  secondaryColor: "#YOUR_SECONDARY_COLOR",
  
  // Domain and URLs
  domain: "yourclient.com",
  supportEmail: "support@yourclient.com",
  
  // Features Configuration
  features: {
    darkMode: true,
    walletConnect: true,
    portfolioAnalytics: true,
    // ... other features
  },
  
  // Monetization
  monetization: {
    showUpgradeButton: true,
    showAdBanner: true,
    proPrice: "$9.99/month",
  }
};
```

### Customization Options

#### 1. **Branding**
- `appName`: Your client's app name
- `logoUrl`: Path to logo image (place in `/public/`)
- `primaryColor`: Main brand color (hex)
- `secondaryColor`: Secondary brand color (hex)
- `accentColor`: Accent color for highlights

#### 2. **Features**
- `darkMode`: Enable/disable dark mode
- `walletConnect`: Enable/disable wallet connection
- `portfolioAnalytics`: Show/hide analytics
- `priceAlerts`: Pro feature toggle
- `advancedCharts`: Pro feature toggle
- `exportData`: Pro feature toggle

#### 3. **Monetization**
- `showUpgradeButton`: Show/hide Pro upgrade
- `showAdBanner`: Show/hide ad banner
- `proPrice`: Pricing display
- `stripePublishableKey`: Stripe integration

#### 4. **API Configuration**
- `coingeckoApiKey`: For higher rate limits
- `infuraProjectId`: For better reliability
- `alchemyApiKey`: Alternative to Infura

### Adding Custom Logo

1. Place your logo in `/public/logo.png`
2. Update `logoUrl` in `appConfig.js`
3. For different formats, update the path accordingly

### Custom Colors

The app automatically generates a full color palette from your primary color. Colors are applied as CSS custom properties and work with TailwindCSS.

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Environment Variables** (optional):
   - `VITE_COINGECKO_API_KEY`: For higher rate limits
   - `VITE_INFURA_PROJECT_ID`: For better reliability
   - `VITE_ALCHEMY_API_KEY`: Alternative to Infura

3. **Custom Domain:**
   - Update `domain` in `appConfig.js`
   - Configure in Vercel dashboard

### Multiple Client Deployments

For multiple clients, you can:

1. **Option A: Separate Repos**
   - Clone the repo for each client
   - Update `appConfig.js` for each
   - Deploy separately

2. **Option B: Branch-based**
   - Create a branch for each client
   - Merge updates from main branch
   - Deploy each branch

3. **Option C: Environment-based**
   - Use environment variables for configuration
   - Single codebase, multiple deployments

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx
│   ├── PortfolioOverview.jsx
│   ├── UpgradeToPro.jsx
│   └── AdBanner.jsx
├── pages/              # Page components
│   └── Dashboard.jsx
├── context/            # React contexts
│   ├── WalletContext.jsx
│   └── ThemeContext.jsx
├── utils/              # Utility functions
│   ├── coingecko.js
│   └── portfolio.js
├── config/             # Configuration files
│   ├── appConfig.js
│   └── theme.css
├── hooks/              # Custom React hooks
└── App.jsx
```

## 🔧 Development

### Adding New Features

1. **New Components**: Add to `/src/components/`
2. **New Pages**: Add to `/src/pages/`
3. **New Utilities**: Add to `/src/utils/`
4. **Configuration**: Update `appConfig.js`

### Styling Guidelines

- Use TailwindCSS classes
- Follow the design system in `index.css`
- Use CSS custom properties for theming
- Maintain responsive design principles

### Wallet Integration

The app uses Ethers.js v6 for wallet connections:
- MetaMask (primary)
- WalletConnect (future)
- Supports Ethereum mainnet
- ERC-20 token detection

## 🔒 Security

- **No Private Keys**: Never store or transmit private keys
- **Public APIs Only**: Uses public blockchain APIs
- **Client-side Only**: All operations happen in the browser
- **HTTPS Required**: Always deploy with SSL

## 📊 Supported Tokens

The app automatically detects these popular tokens:
- ETH (Ethereum)
- USDC (USD Coin)
- USDT (Tether)
- DAI (Dai Stablecoin)
- WBTC (Wrapped Bitcoin)
- UNI (Uniswap)
- MATIC (Polygon)
- LINK (Chainlink)

To add more tokens, update `POPULAR_TOKENS` in `/src/utils/portfolio.js`.

## 🎯 Monetization

### Pro Features (Placeholder)
- Advanced analytics
- Price alerts
- Data export
- Real-time updates

### Ad Integration
- Banner ad slots
- Sponsored content areas
- Easy to customize

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Not Connecting**
   - Ensure MetaMask is installed
   - Check if wallet is locked
   - Try refreshing the page

2. **Prices Not Loading**
   - Check internet connection
   - Verify CoinGecko API status
   - Check browser console for errors

3. **Build Errors**
   - Run `npm install` to ensure dependencies
   - Check Node.js version (18+ recommended)
   - Clear node_modules and reinstall

### Support

For issues and questions:
- Check the browser console for errors
- Review the configuration in `appConfig.js`
- Ensure all required dependencies are installed

## 📈 Performance

- **Lazy Loading**: Components load as needed
- **API Caching**: Price data is cached appropriately
- **Optimized Builds**: Vite for fast development and builds
- **Responsive Images**: Optimized for different screen sizes

## 🔄 Updates

To update the app:
1. Pull latest changes
2. Run `npm install` for new dependencies
3. Update `appConfig.js` if needed
4. Test locally with `npm run dev`
5. Deploy with `npm run build` and `vercel --prod`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ for the Web3 community**



