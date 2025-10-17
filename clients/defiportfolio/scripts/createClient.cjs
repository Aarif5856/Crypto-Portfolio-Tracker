#!/usr/bin/env node

/**
 * Client Management and Deployment Automation Script
 * 
 * Usage:
 *   node scripts/createClient.js                    # Interactive mode
 *   node scripts/createClient.js --auto clients.json # Batch mode
 *   node scripts/createClient.js --list             # List all clients
 *   node scripts/createClient.js --delete <name>    # Delete client
 * 
 * Features:
 * - Clone and rebrand DApp for new clients
 * - Automatic Vercel deployment
 * - Client management (list, delete)
 * - Batch creation from JSON
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const readline = require('readline');

// Configuration
const CONFIG = {
  sourceDir: process.cwd(),
  clientsDir: path.join(process.cwd(), 'clients'),
  clientsFile: path.join(process.cwd(), 'clients', 'clients.json'),
  templateConfig: path.join(process.cwd(), 'src', 'config', 'appConfig.js'),
  vercelConfig: path.join(process.cwd(), 'vercel.json'),
};

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Utility functions
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logSuccess = (message) => log(`✅ ${message}`, 'green');
const logError = (message) => log(`❌ ${message}`, 'red');
const logWarning = (message) => log(`⚠️  ${message}`, 'yellow');
const logInfo = (message) => log(`ℹ️  ${message}`, 'blue');
const logHeader = (message) => log(`\n🚀 ${message}`, 'cyan');

// Ensure directories exist
const ensureDirectories = () => {
  if (!fs.existsSync(CONFIG.clientsDir)) {
    fs.mkdirSync(CONFIG.clientsDir, { recursive: true });
    logSuccess('Created clients directory');
  }
  
  if (!fs.existsSync(CONFIG.clientsFile)) {
    fs.writeFileSync(CONFIG.clientsFile, JSON.stringify([], null, 2));
    logSuccess('Created clients.json file');
  }
};

// Load existing clients
const loadClients = () => {
  try {
    const data = fs.readFileSync(CONFIG.clientsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logError(`Failed to load clients: ${error.message}`);
    return [];
  }
};

// Save clients
const saveClients = (clients) => {
  try {
    fs.writeFileSync(CONFIG.clientsFile, JSON.stringify(clients, null, 2));
    logSuccess('Client data saved');
  } catch (error) {
    logError(`Failed to save clients: ${error.message}`);
  }
};

// Validate client name
const validateClientName = (name) => {
  if (!name || name.trim().length === 0) {
    throw new Error('Client name is required');
  }
  
  const cleanName = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  if (cleanName !== name.toLowerCase()) {
    logWarning(`Client name will be normalized to: ${cleanName}`);
  }
  
  return cleanName;
};

// Validate color
const validateColor = (color) => {
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexPattern.test(color)) {
    throw new Error('Invalid color format. Use hex format like #FF5733');
  }
  return color;
};

// Validate domain
const validateDomain = (domain) => {
  if (!domain || domain.trim().length === 0) {
    throw new Error('Domain is required');
  }
  
  const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/;
  if (!domainPattern.test(domain)) {
    throw new Error('Invalid domain format. Use format like example.com');
  }
  
  return domain;
};

// Copy directory recursively
const copyDirectory = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules, .git, dist, etc.
      if (['node_modules', '.git', 'dist', 'clients'].includes(entry.name)) {
        continue;
      }
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

// Update appConfig.js with client data
const updateAppConfig = (clientDir, clientData) => {
  const configPath = path.join(clientDir, 'src', 'config', 'appConfig.js');
  
  if (!fs.existsSync(configPath)) {
    throw new Error('appConfig.js not found in client directory');
  }
  
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Replace configuration values
  const replacements = {
    'appName: ".*?"': `appName: "${clientData.appName}"`,
    'appDescription: ".*?"': `appDescription: "${clientData.appDescription || 'Professional Crypto Portfolio Tracker'}"`,
    'logoUrl: ".*?"': `logoUrl: "${clientData.logoUrl}"`,
    'primaryColor: ".*?"': `primaryColor: "${clientData.primaryColor}"`,
    'secondaryColor: ".*?"': `secondaryColor: "${clientData.secondaryColor || '#6366f1'}"`,
    'accentColor: ".*?"': `accentColor: "${clientData.accentColor || '#f59e0b'}"`,
    'domain: ".*?"': `domain: "${clientData.domain}"`,
    'supportEmail: ".*?"': `supportEmail: "${clientData.supportEmail}"`,
  };
  
  Object.entries(replacements).forEach(([pattern, replacement]) => {
    const regex = new RegExp(pattern, 'g');
    configContent = configContent.replace(regex, replacement);
  });
  
  fs.writeFileSync(configPath, configContent);
  logSuccess('Updated appConfig.js');
};

// Update package.json
const updatePackageJson = (clientDir, clientData) => {
  const packagePath = path.join(clientDir, 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    throw new Error('package.json not found in client directory');
  }
  
  const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageData.name = `crypto-portfolio-tracker-${clientData.clientName}`;
  packageData.description = `${clientData.appName} - Professional Crypto Portfolio Tracker`;
  
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
  logSuccess('Updated package.json');
};

// Update Vercel config
const updateVercelConfig = (clientDir, clientData) => {
  const vercelPath = path.join(clientDir, 'vercel.json');
  
  if (!fs.existsSync(vercelPath)) {
    // Copy from template
    fs.copyFileSync(CONFIG.vercelConfig, vercelPath);
  }
  
  const vercelData = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  vercelData.name = `crypto-portfolio-${clientData.clientName}`;
  
  fs.writeFileSync(vercelPath, JSON.stringify(vercelData, null, 2));
  logSuccess('Updated vercel.json');
};

// Install dependencies and build
const buildClient = (clientDir) => {
  logInfo('Installing dependencies...');
  
  try {
    execSync('npm install', { 
      cwd: clientDir, 
      stdio: 'inherit',
      timeout: 300000 // 5 minutes
    });
    logSuccess('Dependencies installed');
  } catch (error) {
    throw new Error(`Failed to install dependencies: ${error.message}`);
  }
  
  logInfo('Building project...');
  
  try {
    execSync('npm run build', { 
      cwd: clientDir, 
      stdio: 'inherit',
      timeout: 300000 // 5 minutes
    });
    logSuccess('Project built successfully');
  } catch (error) {
    throw new Error(`Failed to build project: ${error.message}`);
  }
};

// Deploy to Vercel
const deployToVercel = async (clientDir, clientData) => {
  // Check if we're in test mode
  if (process.env.TEST_MODE === 'true') {
    logWarning('TEST MODE: Skipping Vercel deployment');
    return `https://test-${clientData.clientName}.vercel.app`;
  }
  
  logInfo('Deploying to Vercel...');
  
  try {
    // Set Vercel project name
    process.env.VERCEL_PROJECT_NAME = `crypto-portfolio-${clientData.clientName}`;
    
    const result = execSync('vercel --prod --yes', { 
      cwd: clientDir, 
      stdio: 'pipe',
      timeout: 600000 // 10 minutes
    });
    
    const output = result.toString();
    const urlMatch = output.match(/https:\/\/[^\s]+/);
    const deployedUrl = urlMatch ? urlMatch[0] : 'Unknown URL';
    
    logSuccess(`Deployed successfully!`);
    logInfo(`URL: ${deployedUrl}`);
    
    return deployedUrl;
  } catch (error) {
    throw new Error(`Failed to deploy to Vercel: ${error.message}`);
  }
};

// Interactive client creation
const createClientInteractive = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (query) => new Promise((resolve) => rl.question(query, resolve));
  
  try {
    logHeader('Creating New Client');
    
    const appName = await question('App Name (e.g., "CoinVision"): ');
    const logoUrl = await question('Logo URL (e.g., "/logo.svg"): ');
    const primaryColor = await question('Primary Color (e.g., "#00C2FF"): ');
    const domain = await question('Domain (e.g., "coinvision.app"): ');
    const supportEmail = await question('Support Email (e.g., "support@coinvision.app"): ');
    
    rl.close();
    
    // Validate inputs
    const clientName = validateClientName(appName);
    const validatedColor = validateColor(primaryColor);
    const validatedDomain = validateDomain(domain);
    
    const clientData = {
      clientName,
      appName,
      logoUrl: logoUrl || '/logo.svg',
      primaryColor: validatedColor,
      domain: validatedDomain,
      supportEmail: supportEmail || `support@${validatedDomain}`,
      createdAt: new Date().toISOString(),
      status: 'created'
    };
    
    await createClient(clientData);
    
  } catch (error) {
    rl.close();
    logError(error.message);
    process.exit(1);
  }
};

// Create client (main function)
const createClient = async (clientData) => {
  const clientDir = path.join(CONFIG.clientsDir, clientData.clientName);
  
  try {
    // Check if client already exists
    if (fs.existsSync(clientDir)) {
      throw new Error(`Client '${clientData.clientName}' already exists`);
    }
    
    logInfo(`Creating client: ${clientData.appName}`);
    
    // Copy source code
    logInfo('Copying source code...');
    copyDirectory(CONFIG.sourceDir, clientDir);
    logSuccess('Source code copied');
    
    // Update configuration files
    logInfo('Updating configuration...');
    updateAppConfig(clientDir, clientData);
    updatePackageJson(clientDir, clientData);
    updateVercelConfig(clientDir, clientData);
    
    // Build project
    buildClient(clientDir);
    
    // Deploy to Vercel
    const deployedUrl = await deployToVercel(clientDir, clientData);
    
    // Update client data with deployment info
    clientData.deployedUrl = deployedUrl;
    clientData.status = 'deployed';
    clientData.deployedAt = new Date().toISOString();
    
    // Save client data
    const clients = loadClients();
    clients.push(clientData);
    saveClients(clients);
    
    logSuccess(`Client '${clientData.appName}' created and deployed successfully!`);
    logInfo(`Deployed URL: ${deployedUrl}`);
    logInfo(`Client directory: ${clientDir}`);
    
    return clientData;
    
  } catch (error) {
    logError(`Failed to create client: ${error.message}`);
    
    // Cleanup on failure
    if (fs.existsSync(clientDir)) {
      fs.rmSync(clientDir, { recursive: true, force: true });
      logInfo('Cleaned up failed client directory');
    }
    
    throw error;
  }
};

// List all clients
const listClients = () => {
  const clients = loadClients();
  
  if (clients.length === 0) {
    logInfo('No clients found');
    return;
  }
  
  logHeader('All Clients');
  console.table(clients.map(client => ({
    Name: client.appName,
    'Client ID': client.clientName,
    Domain: client.domain,
    Status: client.status,
    'Created': new Date(client.createdAt).toLocaleDateString(),
    URL: client.deployedUrl || 'Not deployed'
  })));
};

// Delete client
const deleteClient = (clientName) => {
  const clients = loadClients();
  const clientIndex = clients.findIndex(c => c.clientName === clientName);
  
  if (clientIndex === -1) {
    throw new Error(`Client '${clientName}' not found`);
  }
  
  const client = clients[clientIndex];
  const clientDir = path.join(CONFIG.clientsDir, clientName);
  
  // Remove directory
  if (fs.existsSync(clientDir)) {
    fs.rmSync(clientDir, { recursive: true, force: true });
    logSuccess(`Removed client directory: ${clientDir}`);
  }
  
  // Remove from clients list
  clients.splice(clientIndex, 1);
  saveClients(clients);
  
  logSuccess(`Client '${client.appName}' deleted successfully`);
  logWarning('Note: Vercel deployment still exists and needs manual cleanup');
};

// Batch create from JSON
const createBatchClients = async (jsonFile) => {
  if (!fs.existsSync(jsonFile)) {
    throw new Error(`JSON file not found: ${jsonFile}`);
  }
  
  const clientsData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  
  if (!Array.isArray(clientsData)) {
    throw new Error('JSON file must contain an array of client objects');
  }
  
  logHeader(`Creating ${clientsData.length} clients from ${jsonFile}`);
  
  for (let i = 0; i < clientsData.length; i++) {
    const clientData = clientsData[i];
    
    try {
      logInfo(`Creating client ${i + 1}/${clientsData.length}: ${clientData.appName}`);
      
      // Validate required fields
      if (!clientData.appName || !clientData.primaryColor || !clientData.domain) {
        throw new Error('Missing required fields: appName, primaryColor, domain');
      }
      
      clientData.clientName = validateClientName(clientData.appName);
      clientData.primaryColor = validateColor(clientData.primaryColor);
      clientData.domain = validateDomain(clientData.domain);
      
      await createClient(clientData);
      
    } catch (error) {
      logError(`Failed to create client ${clientData.appName}: ${error.message}`);
      continue;
    }
  }
  
  logSuccess('Batch creation completed');
};

// Main function
const main = async () => {
  const args = process.argv.slice(2);
  
  try {
    ensureDirectories();
    
    if (args.includes('--list')) {
      listClients();
    } else if (args.includes('--delete')) {
      const clientName = args[args.indexOf('--delete') + 1];
      if (!clientName) {
        throw new Error('Client name required for delete operation');
      }
      deleteClient(clientName);
    } else if (args.includes('--auto')) {
      const jsonFile = args[args.indexOf('--auto') + 1];
      if (!jsonFile) {
        throw new Error('JSON file required for auto mode');
      }
      await createBatchClients(jsonFile);
    } else {
      await createClientInteractive();
    }
    
  } catch (error) {
    logError(error.message);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  createClient,
  listClients,
  deleteClient,
  createBatchClients
};
