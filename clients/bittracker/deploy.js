#!/usr/bin/env node

/**
 * Deployment script for white-label crypto portfolio tracker
 * Usage: node deploy.js <client-name> [options]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get command line arguments
const args = process.argv.slice(2);
const clientName = args[0];
const options = {
  build: args.includes('--build'),
  deploy: args.includes('--deploy'),
  help: args.includes('--help'),
};

if (options.help || !clientName) {
  console.log(`
White-Label Crypto Portfolio Tracker - Deployment Script

Usage: node deploy.js <client-name> [options]

Options:
  --build    Build the project for production
  --deploy   Deploy to Vercel
  --help     Show this help message

Examples:
  node deploy.js "CoinVision" --build --deploy
  node deploy.js "CryptoPro" --build
  node deploy.js "BitTracker" --deploy

This script will:
1. Create a client-specific config
2. Build the project (if --build is specified)
3. Deploy to Vercel (if --deploy is specified)
`);
  process.exit(0);
}

console.log(`🚀 Deploying for client: ${clientName}`);

// Client configuration templates
const clientConfigs = {
  'CoinVision': {
    appName: 'CoinVision',
    primaryColor: '#00C2FF',
    secondaryColor: '#6366f1',
    domain: 'coinvision.app',
    supportEmail: 'support@coinvision.app',
  },
  'CryptoPro': {
    appName: 'CryptoPro',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    domain: 'cryptopro.app',
    supportEmail: 'support@cryptopro.app',
  },
  'BitTracker': {
    appName: 'BitTracker',
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706',
    domain: 'bittracker.app',
    supportEmail: 'support@bittracker.app',
  },
};

// Get or create client config
const clientConfig = clientConfigs[clientName] || {
  appName: clientName,
  primaryColor: '#3B82F6',
  secondaryColor: '#1D4ED8',
  domain: `${clientName.toLowerCase()}.app`,
  supportEmail: `support@${clientName.toLowerCase()}.app`,
};

console.log(`📝 Updating configuration for ${clientName}...`);

// Update appConfig.js
const configPath = path.join(__dirname, 'src', 'config', 'appConfig.js');
let configContent = fs.readFileSync(configPath, 'utf8');

// Replace configuration values
configContent = configContent.replace(
  /appName: ".*?"/,
  `appName: "${clientConfig.appName}"`
);
configContent = configContent.replace(
  /primaryColor: ".*?"/,
  `primaryColor: "${clientConfig.primaryColor}"`
);
configContent = configContent.replace(
  /secondaryColor: ".*?"/,
  `secondaryColor: "${clientConfig.secondaryColor}"`
);
configContent = configContent.replace(
  /domain: ".*?"/,
  `domain: "${clientConfig.domain}"`
);
configContent = configContent.replace(
  /supportEmail: ".*?"/,
  `supportEmail: "${clientConfig.supportEmail}"`
);

fs.writeFileSync(configPath, configContent);

// Update theme.css
const themePath = path.join(__dirname, 'src', 'config', 'theme.css');
const themeContent = `/* Dynamic theme CSS generated from appConfig */
:root {
  --primary-50: 0 194 255;
  --primary-100: 0 174 235;
  --primary-200: 0 154 215;
  --primary-300: 0 134 195;
  --primary-400: 0 114 175;
  --primary-500: 0 194 255;
  --primary-600: 20 214 255;
  --primary-700: 40 234 255;
  --primary-800: 60 254 255;
  --primary-900: 80 255 255;
}`;

fs.writeFileSync(themePath, themeContent);

// Update package.json name
const packagePath = path.join(__dirname, 'package.json');
const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
packageContent.name = `crypto-portfolio-tracker-${clientName.toLowerCase()}`;
fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));

console.log(`✅ Configuration updated for ${clientName}`);

// Build project
if (options.build) {
  console.log('🔨 Building project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Deploy to Vercel
if (options.deploy) {
  console.log('🚀 Deploying to Vercel...');
  try {
    // Set project name for Vercel
    process.env.VERCEL_PROJECT_NAME = `crypto-portfolio-${clientName.toLowerCase()}`;
    
    execSync('vercel --prod --yes', { stdio: 'inherit' });
    console.log('✅ Deployment completed successfully');
    console.log(`🌐 Your app should be available at: https://${clientConfig.domain}`);
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

console.log(`🎉 Setup completed for ${clientName}!`);
console.log(`
Next steps:
1. Place your logo in /public/logo.png
2. Update any additional branding in src/config/appConfig.js
3. Test locally with: npm run dev
4. Deploy with: vercel --prod
`);

