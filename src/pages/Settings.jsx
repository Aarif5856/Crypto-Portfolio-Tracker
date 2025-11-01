import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { appConfig } from '../config/appConfig';

const Settings = () => {
  const [name, setName] = useState(appConfig.appName || 'CryptoPro');
  const [powered, setPowered] = useState(appConfig.branding?.showPoweredBy ?? true);
  const [primary, setPrimary] = useState(appConfig.primaryColor || '#10B981');

  useEffect(() => {
    // Persist basic overrides locally for demo purposes
    const state = { name, powered, primary };
    localStorage.setItem('branding-overrides', JSON.stringify(state));
  }, [name, powered, primary]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <div className="mb-4 text-primary font-semibold">Branding</div>
        <div className="space-y-4 text-sm">
          <div>
            <label className="text-secondary block mb-1">App Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-secondary block mb-1">Primary Color</label>
            <input type="color" className="h-10 w-16 rounded" value={primary} onChange={(e) => setPrimary(e.target.value)} />
          </div>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={powered} onChange={(e) => setPowered(e.target.checked)} />
            <span className="text-secondary">Show “Powered by CryptoPro”</span>
          </label>
        </div>
      </Card>
      <Card>
        <div className="mb-4 text-primary font-semibold">Data & Privacy</div>
        <div className="text-xs text-secondary">Placeholders for data export, account deletion, and license controls.</div>
      </Card>
    </div>
  );
};

export default Settings;

