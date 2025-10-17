// White-label configuration for Crypto Portfolio Tracker
// Change these values to rebrand for different clients

export const appConfig = {
  // Basic App Information
  appName: "DeFiPortfolio",
  appDescription: "DeFi Portfolio & Yield Tracker",
  logoUrl: "/logo.svg",
  faviconUrl: "/favicon.ico",
  
  // Branding Colors (CSS Custom Properties)
  primaryColor: "#8B5CF6",
  secondaryColor: "#7C3AED",
  accentColor: "#EC4899",
  
  // Domain and URLs
  domain: "defiportfolio.app",
  supportEmail: "support@defiportfolio.app",
  
  // Features Configuration
  features: {
    darkMode: true,
    walletConnect: true,
    portfolioAnalytics: true,
    priceAlerts: false, // Pro feature
    advancedCharts: false, // Pro feature
    exportData: false, // Pro feature
  },
  
  // Monetization
  monetization: {
    showUpgradeButton: true,
    showAdBanner: true,
    proPrice: "$9.99/month",
    stripePublishableKey: "", // Add your Stripe key
  },
  
  // API Configuration
  api: {
    coingeckoApiKey: "", // Optional: Add for higher rate limits
    infuraProjectId: "", // Optional: Add for better reliability
    alchemyApiKey: "", // Optional: Add for better reliability
  },
  
  // Social Links
  social: {
    twitter: "https://twitter.com/coinvision",
    discord: "https://discord.gg/coinvision",
    github: "https://github.com/coinvision",
  },
  
  // Legal
  legal: {
    privacyPolicyUrl: "/privacy",
    termsOfServiceUrl: "/terms",
    disclaimer: "Cryptocurrency investments are subject to market risks. Please invest responsibly.",
  }
};

// Generate CSS custom properties for dynamic theming
export const generateThemeCSS = () => {
  const { primaryColor, secondaryColor, accentColor } = appConfig;
  
  // Convert hex to RGB for CSS custom properties
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  const primaryRgb = hexToRgb(primaryColor);
  const secondaryRgb = hexToRgb(secondaryColor);
  const accentRgb = hexToRgb(accentColor);
  
  return `
    :root {
      --primary-50: ${primaryRgb ? `${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b}` : '0 194 255'};
      --primary-100: ${primaryRgb ? `${Math.max(0, primaryRgb.r - 20)} ${Math.max(0, primaryRgb.g - 20)} ${Math.max(0, primaryRgb.b - 20)}` : '0 174 235'};
      --primary-200: ${primaryRgb ? `${Math.max(0, primaryRgb.r - 40)} ${Math.max(0, primaryRgb.g - 40)} ${Math.max(0, primaryRgb.b - 40)}` : '0 154 215'};
      --primary-300: ${primaryRgb ? `${Math.max(0, primaryRgb.r - 60)} ${Math.max(0, primaryRgb.g - 60)} ${Math.max(0, primaryRgb.b - 60)}` : '0 134 195'};
      --primary-400: ${primaryRgb ? `${Math.max(0, primaryRgb.r - 80)} ${Math.max(0, primaryRgb.g - 80)} ${Math.max(0, primaryRgb.b - 80)}` : '0 114 175'};
      --primary-500: ${primaryRgb ? `${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b}` : '0 194 255'};
      --primary-600: ${primaryRgb ? `${Math.min(255, primaryRgb.r + 20)} ${Math.min(255, primaryRgb.g + 20)} ${Math.min(255, primaryRgb.b + 20)}` : '20 214 255'};
      --primary-700: ${primaryRgb ? `${Math.min(255, primaryRgb.r + 40)} ${Math.min(255, primaryRgb.g + 40)} ${Math.min(255, primaryRgb.b + 40)}` : '40 234 255'};
      --primary-800: ${primaryRgb ? `${Math.min(255, primaryRgb.r + 60)} ${Math.min(255, primaryRgb.g + 60)} ${Math.min(255, primaryRgb.b + 60)}` : '60 254 255'};
      --primary-900: ${primaryRgb ? `${Math.min(255, primaryRgb.r + 80)} ${Math.min(255, primaryRgb.g + 80)} ${Math.min(255, primaryRgb.b + 80)}` : '80 255 255'};
    }
  `;
};
