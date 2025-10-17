#!/usr/bin/env node

/**
 * Quick start script for white-label crypto portfolio tracker
 * This script helps you quickly set up a new client deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 White-Label Crypto Portfolio Tracker - Quick Start\n');

// Interactive setup
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupClient() {
  try {
    console.log('Let\'s set up your client configuration:\n');
    
    const clientName = await question('Client name (e.g., "CoinVision"): ');
    const primaryColor = await question('Primary color (hex, e.g., "#00C2FF"): ');
    const domain = await question('Domain (e.g., "coinvision.app"): ');
    const supportEmail = await question('Support email (e.g., "support@coinvision.app"): ');
    
    console.log('\n📝 Updating configuration...');
    
    // Update appConfig.js
    const configPath = path.join(__dirname, '..', 'src', 'config', 'appConfig.js');
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    configContent = configContent.replace(
      /appName: ".*?"/,
      `appName: "${clientName}"`
    );
    configContent = configContent.replace(
      /primaryColor: ".*?"/,
      `primaryColor: "${primaryColor}"`
    );
    configContent = configContent.replace(
      /domain: ".*?"/,
      `domain: "${domain}"`
    );
    configContent = configContent.replace(
      /supportEmail: ".*?"/,
      `supportEmail: "${supportEmail}"`
    );
    
    fs.writeFileSync(configPath, configContent);
    
    // Update package.json
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageContent.name = `crypto-portfolio-tracker-${clientName.toLowerCase().replace(/\s+/g, '-')}`;
    fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
    
    console.log('✅ Configuration updated successfully!');
    
    const shouldBuild = await question('\n🔨 Build the project now? (y/n): ');
    if (shouldBuild.toLowerCase() === 'y') {
      console.log('Building project...');
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Build completed!');
    }
    
    const shouldDeploy = await question('\n🚀 Deploy to Vercel now? (y/n): ');
    if (shouldDeploy.toLowerCase() === 'y') {
      console.log('Deploying to Vercel...');
      process.env.VERCEL_PROJECT_NAME = `crypto-portfolio-${clientName.toLowerCase().replace(/\s+/g, '-')}`;
      execSync('vercel --prod --yes', { stdio: 'inherit' });
      console.log('✅ Deployment completed!');
    }
    
    console.log('\n🎉 Setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Place your logo in /public/logo.svg');
    console.log('2. Test locally with: npm run dev');
    console.log('3. Deploy with: vercel --prod');
    
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
  } finally {
    rl.close();
  }
}

setupClient();

