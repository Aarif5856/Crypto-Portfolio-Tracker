import { test, expect } from '@playwright/test';
import { setupMockCoinGecko } from './utils/mockApi.js';
import { setupMockWallet } from './utils/mockWallet.js';

test.beforeEach(async ({ page }) => {
  await setupMockCoinGecko(page);
});

test('CryptoPro landing and dashboard smoke test', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('crypto-pro-tutorial-completed', 'true');
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(
    page.getByRole('heading', { name: /Track & Grow Your Crypto Portfolio/i })
  ).toBeVisible();
  await page.locator('#pricing').scrollIntoViewIfNeeded();
  await expect(page.locator('section#pricing')).toHaveScreenshot('pricing-section.png', { animations: 'disabled' });

  await page.getByRole('button', { name: /Live Demo/i }).click();
  await expect(
    page.getByRole('heading', { name: /Welcome to Your Portfolio/i })
  ).toBeVisible();
  await expect(page.locator('main')).toHaveScreenshot('dashboard-logged-out.png', { animations: 'disabled' });

  const promoButton = page.getByRole('button', { name: /^Connect Wallet$/i }).last();
  await promoButton.click();
  await expect(page.getByRole('heading', { name: /^Connect Wallet$/i })).toBeVisible();
  await page.getByRole('button', { name: /Close wallet modal/i }).click({ force: true });

  await expect(page.getByText(/Risk Score/i)).toBeVisible();
});

test('Onboarding tutorial guides new users through key steps', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: /Live Demo/i }).click();

  const onboardingModal = page.getByTestId('onboarding-modal');
  await expect(onboardingModal.getByRole('heading', { name: 'Welcome to CryptoPro!' })).toBeVisible();
  await onboardingModal.getByRole('button', { name: 'Next' }).click();
  await expect(onboardingModal.getByRole('heading', { name: 'Connect Your Wallet' })).toBeVisible();
  await onboardingModal.getByRole('button', { name: 'Next' }).click();
  await expect(onboardingModal.getByRole('heading', { name: 'View Your Portfolio' })).toBeVisible();
  await onboardingModal.getByRole('button', { name: 'Next' }).click();
  await expect(onboardingModal.getByRole('heading', { name: 'Upgrade to Pro' })).toBeVisible();
  await onboardingModal.getByRole('button', { name: 'Next' }).click();
  await expect(onboardingModal.getByRole('heading', { name: "You're All Set!" })).toBeVisible();
  await onboardingModal.getByRole('button', { name: 'Get Started' }).click();
  await expect(onboardingModal).toBeHidden();
});

test('Wallet connection flow displays connected network details', async ({ page }) => {
  await setupMockWallet(page);
  await page.addInitScript(() => {
    window.localStorage.setItem('crypto-pro-tutorial-completed', 'true');
  });
  page.on('console', (msg) => console.log('WALLET TEST LOG:', msg.text()));

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: /Live Demo/i }).click();

  const connectButton = page.getByRole('button', { name: /^Connect Wallet$/i }).last();
  await connectButton.click();
  await page.getByRole('button', { name: 'MetaMask' }).click();

  await expect(page.getByLabel('Disconnect wallet')).toBeVisible();
  await expect(page.getByText(/0xA0b8/i).first()).toBeVisible();
});

