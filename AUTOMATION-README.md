# 🤖 Client Automation Script

Automated client creation, rebranding, and deployment for the White-Label Crypto Portfolio Tracker.

## 🚀 Quick Start

```bash
# Interactive mode (recommended for single clients)
node scripts/createClient.js

# Batch mode (for multiple clients)
node scripts/createClient.js --auto scripts/sample-clients.json

# List all clients
node scripts/createClient.js --list

# Delete a client
node scripts/createClient.js --delete client-name
```

## 📋 Prerequisites

### Required Software
- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **Vercel CLI** (`npm install -g vercel`)

### Required Setup
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Ensure you're in the project root:**
   ```bash
   cd "C:\Users\USER\Desktop\Crypto Portfolio Tracker"
   ```

3. **Verify source files exist:**
   - `src/config/appConfig.js`
   - `package.json`
   - `vercel.json`

## 🎯 Features

### ✅ **Interactive Client Creation**
- Prompts for client information
- Validates all inputs
- Creates branded copy of your DApp
- Deploys automatically to Vercel
- Saves client data for management

### ✅ **Batch Client Creation**
- Create multiple clients from JSON file
- Perfect for bulk deployments
- Error handling per client
- Continues on individual failures

### ✅ **Client Management**
- List all created clients
- View deployment status
- Delete clients and clean up
- Track client information

### ✅ **Automatic Deployment**
- Builds project automatically
- Deploys to Vercel with custom domain
- Returns deployment URL
- Updates client records

## 📖 Usage Examples

### 1. Create a Single Client (Interactive)

```bash
node scripts/createClient.js
```

**Example Session:**
```
🚀 Creating New Client
App Name (e.g., "CoinVision"): CoinVision
Logo URL (e.g., "/logo.svg"): /logo.svg
Primary Color (e.g., "#00C2FF"): #00C2FF
Domain (e.g., "coinvision.app"): coinvision.app
Support Email (e.g., "support@coinvision.app"): support@coinvision.app

✅ Source code copied
✅ Updated appConfig.js
✅ Updated package.json
✅ Updated vercel.json
✅ Dependencies installed
✅ Project built successfully
✅ Deployed successfully!
ℹ️  URL: https://crypto-portfolio-coinvision.vercel.app
✅ Client 'CoinVision' created and deployed successfully!
```

### 2. Create Multiple Clients (Batch)

```bash
node scripts/createClient.js --auto scripts/sample-clients.json
```

**Sample JSON Structure:**
```json
[
  {
    "appName": "CoinVision",
    "logoUrl": "/logo.svg",
    "primaryColor": "#00C2FF",
    "domain": "coinvision.app",
    "supportEmail": "support@coinvision.app"
  },
  {
    "appName": "CryptoPro",
    "logoUrl": "/logo.svg",
    "primaryColor": "#10B981",
    "domain": "cryptopro.app",
    "supportEmail": "support@cryptopro.app"
  }
]
```

### 3. List All Clients

```bash
node scripts/createClient.js --list
```

**Output:**
```
🚀 All Clients
┌─────────────┬──────────────┬─────────────────┬──────────┬─────────────┬─────────────────────────────────────┐
│ Name        │ Client ID    │ Domain          │ Status   │ Created     │ URL                                  │
├─────────────┼──────────────┼─────────────────┼──────────┼─────────────┼─────────────────────────────────────┤
│ CoinVision  │ coinvision   │ coinvision.app  │ deployed │ 10/16/2025  │ https://crypto-portfolio-coinvision.vercel.app │
│ CryptoPro   │ cryptopro    │ cryptopro.app   │ deployed │ 10/16/2025  │ https://crypto-portfolio-cryptopro.vercel.app   │
└─────────────┴──────────────┴─────────────────┴──────────┴─────────────┴─────────────────────────────────────┘
```

### 4. Delete a Client

```bash
node scripts/createClient.js --delete coinvision
```

**Output:**
```
✅ Removed client directory: C:\Users\USER\Desktop\Crypto Portfolio Tracker\clients\coinvision
✅ Client 'CoinVision' deleted successfully
⚠️  Note: Vercel deployment still exists and needs manual cleanup
```

## 📁 File Structure

After running the script, your project will have:

```
Crypto Portfolio Tracker/
├── scripts/
│   ├── createClient.js          # Main automation script
│   └── sample-clients.json      # Example batch file
├── clients/
│   ├── clients.json             # Client database
│   ├── coinvision/              # Client 1
│   │   ├── src/
│   │   ├── package.json
│   │   ├── vercel.json
│   │   └── dist/
│   ├── cryptopro/               # Client 2
│   │   └── ...
│   └── ...
└── ...
```

## ⚙️ Configuration

### Client Data Structure

Each client is stored with this information:

```javascript
{
  "clientName": "coinvision",           // Normalized name (lowercase, hyphens)
  "appName": "CoinVision",              // Display name
  "logoUrl": "/logo.svg",               // Logo path
  "primaryColor": "#00C2FF",            // Brand color
  "secondaryColor": "#6366f1",          // Secondary color
  "accentColor": "#f59e0b",             // Accent color
  "domain": "coinvision.app",           // Client domain
  "supportEmail": "support@coinvision.app", // Support email
  "appDescription": "Professional...",  // App description
  "deployedUrl": "https://...",         // Vercel URL
  "status": "deployed",                 // Status
  "createdAt": "2025-10-16T...",        // Creation timestamp
  "deployedAt": "2025-10-16T..."        // Deployment timestamp
}
```

### Required Fields

- **appName**: Display name for the app
- **primaryColor**: Hex color code (e.g., #00C2FF)
- **domain**: Valid domain name (e.g., example.com)

### Optional Fields

- **logoUrl**: Logo path (default: /logo.svg)
- **secondaryColor**: Secondary brand color
- **accentColor**: Accent color
- **supportEmail**: Support email address
- **appDescription**: App description

## 🔧 Advanced Usage

### Custom Batch File

Create your own JSON file for batch creation:

```json
[
  {
    "appName": "MyClient1",
    "primaryColor": "#FF5733",
    "domain": "myclient1.com",
    "supportEmail": "support@myclient1.com"
  },
  {
    "appName": "MyClient2",
    "primaryColor": "#33FF57",
    "domain": "myclient2.com"
  }
]
```

Then run:
```bash
node scripts/createClient.js --auto my-clients.json
```

### Environment Variables

The script respects these environment variables:

```bash
# Vercel project name prefix
VERCEL_PROJECT_PREFIX=crypto-portfolio

# Custom build timeout (default: 5 minutes)
BUILD_TIMEOUT=300000

# Custom deploy timeout (default: 10 minutes)
DEPLOY_TIMEOUT=600000
```

## 🐛 Troubleshooting

### Common Issues

#### 1. **"Vercel CLI not found"**
```bash
npm install -g vercel
vercel login
```

#### 2. **"Client already exists"**
```bash
# Delete existing client first
node scripts/createClient.js --delete client-name

# Or use a different name
```

#### 3. **"Build failed"**
- Check if all dependencies are installed
- Verify source code is complete
- Check for syntax errors in source files

#### 4. **"Deploy failed"**
- Ensure Vercel CLI is logged in
- Check internet connection
- Verify Vercel account has deployment permissions

#### 5. **"Invalid color format"**
- Use hex format: #FF5733 or #F53
- Include the # symbol
- Use valid hex characters (0-9, A-F)

### Debug Mode

Run with debug output:
```bash
DEBUG=true node scripts/createClient.js
```

### Manual Cleanup

If script fails mid-process:

```bash
# Remove failed client directory
rm -rf clients/failed-client-name

# Remove from clients.json manually
# Edit clients/clients.json and remove the failed entry
```

## 📊 Performance

### Typical Timings

- **Single Client Creation**: 2-3 minutes
- **Batch Creation (5 clients)**: 10-15 minutes
- **Build Time**: 30-60 seconds per client
- **Deploy Time**: 30-90 seconds per client

### Resource Usage

- **Disk Space**: ~50MB per client
- **Memory**: ~200MB during build
- **Network**: ~10MB upload per deployment

## 🔒 Security

### Best Practices

1. **Never commit client data:**
   ```bash
   echo "clients/" >> .gitignore
   ```

2. **Use environment variables for sensitive data:**
   ```bash
   export VERCEL_TOKEN=your_token_here
   ```

3. **Validate all inputs:**
   - Script validates colors, domains, emails
   - Sanitizes client names
   - Prevents path traversal attacks

4. **Clean up failed deployments:**
   - Script automatically cleans up on failure
   - Manual cleanup available for edge cases

## 🚀 Production Deployment

### For Production Use

1. **Set up proper Vercel account:**
   - Upgrade to Pro for custom domains
   - Configure team settings
   - Set up monitoring

2. **Use environment variables:**
   ```bash
   export VERCEL_ORG_ID=your_org_id
   export VERCEL_PROJECT_ID=your_project_id
   ```

3. **Monitor deployments:**
   - Check Vercel dashboard
   - Set up alerts for failures
   - Monitor resource usage

4. **Backup client data:**
   ```bash
   cp clients/clients.json backup/clients-$(date +%Y%m%d).json
   ```

## 📞 Support

### Getting Help

1. **Check the logs:**
   - Script provides detailed error messages
   - Check Vercel deployment logs
   - Review build output

2. **Common solutions:**
   - Re-run the script (often fixes temporary issues)
   - Check internet connection
   - Verify all prerequisites are installed

3. **Manual fallback:**
   - Copy source code manually
   - Update config files by hand
   - Deploy via Vercel dashboard

### Script Maintenance

- **Update dependencies:** `npm update`
- **Update Vercel CLI:** `npm install -g vercel@latest`
- **Test with sample data:** Use `sample-clients.json`

---

## 🎉 Success!

Your automation script is ready to scale your white-label business! 

**Next Steps:**
1. Test with the sample clients
2. Create your first real client
3. Set up monitoring
4. Scale to unlimited clients

**Happy Deploying!** 🚀



