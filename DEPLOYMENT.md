# Deployment Guide

This guide will help you deploy the White-Label Crypto Portfolio Tracker for multiple clients.

## 🚀 Quick Start

### Option 1: Automated Setup
```bash
# Run the interactive setup script
node scripts/quick-start.js
```

### Option 2: Manual Setup
```bash
# 1. Update configuration
# Edit src/config/appConfig.js with your client details

# 2. Build the project
npm run build

# 3. Deploy to Vercel
vercel --prod
```

## 📋 Pre-Deployment Checklist

- [ ] Update `appName` in `src/config/appConfig.js`
- [ ] Set `primaryColor` and `secondaryColor`
- [ ] Update `domain` and `supportEmail`
- [ ] Place client logo in `/public/logo.svg`
- [ ] Test locally with `npm run dev`
- [ ] Build successfully with `npm run build`

## 🎨 Client Configuration

### Required Changes
```javascript
// src/config/appConfig.js
export const appConfig = {
  appName: "YourClientName",
  primaryColor: "#YOUR_COLOR",
  domain: "yourclient.com",
  supportEmail: "support@yourclient.com",
  // ... other settings
};
```

### Optional Customizations
- Logo: Replace `/public/logo.svg`
- Favicon: Replace `/public/favicon.ico`
- Colors: Update primary/secondary colors
- Features: Enable/disable specific features
- Monetization: Configure Pro features and ads

## 🌐 Vercel Deployment

### First Time Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Environment Variables (Optional)
Set these in Vercel dashboard or via CLI:
```bash
vercel env add VITE_COINGECKO_API_KEY
vercel env add VITE_INFURA_PROJECT_ID
vercel env add VITE_ALCHEMY_API_KEY
```

### Custom Domain
1. Add domain in Vercel dashboard
2. Update `domain` in `appConfig.js`
3. Configure DNS records

## 🔄 Multiple Client Deployments

### Method 1: Separate Repositories
```bash
# For each client
git clone <original-repo> client-<name>
cd client-<name>
# Update configuration
# Deploy separately
```

### Method 2: Branch-based
```bash
# Create branch for each client
git checkout -b client-<name>
# Update configuration
git commit -am "Configure for <client>"
# Deploy from branch
vercel --prod
```

### Method 3: Environment-based
```bash
# Use environment variables for configuration
# Single codebase, multiple deployments
vercel --prod --env VITE_CLIENT_NAME="ClientName"
```

## 📊 Deployment Scripts

### Automated Deployment
```bash
# Deploy specific client
node deploy.js "ClientName" --build --deploy

# Build only
node deploy.js "ClientName" --build

# Deploy only
node deploy.js "ClientName" --deploy
```

### Quick Start Script
```bash
# Interactive setup
node scripts/quick-start.js
```

## 🔧 Build Configuration

### Production Build
```bash
npm run build
```

### Development Server
```bash
npm run dev
```

### Preview Build
```bash
npm run preview
```

## 📱 Mobile Optimization

The app is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Mobile wallet connection
- Responsive design
- Fast loading

## 🔒 Security Considerations

- All wallet operations are client-side only
- No private keys are stored or transmitted
- Uses public blockchain APIs only
- HTTPS required for production

## 📈 Performance Optimization

- Vite for fast builds
- Code splitting
- Lazy loading
- Optimized images
- CDN delivery via Vercel

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Check for syntax errors

2. **Wallet Not Connecting**
   - Ensure MetaMask is installed
   - Check if wallet is unlocked
   - Try different browser

3. **Prices Not Loading**
   - Check internet connection
   - Verify CoinGecko API status
   - Check browser console for errors

4. **Deployment Issues**
   - Check Vercel logs
   - Verify environment variables
   - Ensure build succeeds locally

### Debug Mode
```bash
# Enable debug logging
DEBUG=true npm run dev
```

## 📞 Support

For deployment issues:
1. Check the browser console for errors
2. Review Vercel deployment logs
3. Test locally first
4. Check configuration in `appConfig.js`

## 🔄 Updates

To update an existing deployment:
```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install

# Rebuild and redeploy
npm run build
vercel --prod
```

## 📋 Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor API rate limits
- Check for security updates
- Review client configurations

### Monitoring
- Set up Vercel analytics
- Monitor error rates
- Track user engagement
- Check API usage

---

**Happy Deploying! 🚀**





