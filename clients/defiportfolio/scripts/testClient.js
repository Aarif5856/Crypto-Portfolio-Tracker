#!/usr/bin/env node

/**
 * Test script to create a client without Vercel deployment
 * This is for testing the automation script locally
 */

const { createClient } = require('./createClient.cjs');

const testClient = {
  clientName: 'coinvision-test',
  appName: 'CoinVision Test',
  logoUrl: '/logo.svg',
  primaryColor: '#00C2FF',
  secondaryColor: '#6366f1',
  accentColor: '#f59e0b',
  domain: 'coinvision-test.app',
  supportEmail: 'support@coinvision-test.app',
  appDescription: 'Test Crypto Portfolio Tracker',
  createdAt: new Date().toISOString(),
  status: 'created'
};

console.log('🧪 Testing client creation (without deployment)...');

createClient(testClient)
  .then(() => {
    console.log('✅ Test client created successfully!');
    console.log('📁 Check the clients/coinvision-test directory');
  })
  .catch((error) => {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  });
