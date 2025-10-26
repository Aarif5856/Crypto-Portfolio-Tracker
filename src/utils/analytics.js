import { appConfig } from '../config/appConfig';

/**
 * Centralized tracker for pricing CTA clicks.
 * Sends events to Vercel analytics when available and optionally pings a CRM webhook.
 */
export const trackPricingClick = (plan, source) => {
  try {
    window.va?.track?.('pricing_click', {
      plan,
      source,
      timestamp: Date.now(),
    });
  } catch (err) {
    // Silently ignore analytics failures in production
    if (import.meta.env?.DEV) {
      console.warn('Vercel analytics tracking failed', err);
    }
  }

  const webhook = appConfig.analytics?.crmWebhookUrl;
  if (!webhook || typeof navigator === 'undefined') {
    return;
  }

  const payload = JSON.stringify({
    type: 'pricing_click',
    plan,
    source,
    at: new Date().toISOString(),
  });

  try {
    const sent = navigator.sendBeacon?.(webhook, payload);
    if (!sent) {
      fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // no-op: avoid bubbling network errors to the UI
  }
};
