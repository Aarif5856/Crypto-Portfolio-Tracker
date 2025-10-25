import { test, expect } from '@playwright/test';

test('CryptoPro landing and dashboard smoke test', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('crypto-pro-tutorial-completed', 'true');
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(
    page.getByRole('heading', { name: /Track & Grow Your Crypto Portfolio/i })
  ).toBeVisible();

  await page.getByRole('button', { name: /Live Demo/i }).click();
  await expect(
    page.getByRole('heading', { name: /Welcome to Your Portfolio/i })
  ).toBeVisible();

  const connectButton = page.getByRole('button', { name: /^Connect Wallet$/i }).last();
  await connectButton.click();

  const modalHeading = page.getByRole('heading', { name: /^Connect Wallet$/i });
  await expect(modalHeading).toBeVisible();

  await page.getByRole('button', { name: /Close wallet modal/i }).click({ force: true });
  await expect(modalHeading).toBeHidden();

  await expect(page.getByText(/Risk Score/i)).toBeVisible();
});

