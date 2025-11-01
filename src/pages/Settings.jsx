import React, { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import { appConfig } from '../config/appConfig';
import { useWallet } from '../context/WalletContext';

const Settings = () => {
  const [name, setName] = useState(appConfig.appName || 'CryptoPro');
  const [powered, setPowered] = useState(appConfig.branding?.showPoweredBy ?? true);
  const [primary, setPrimary] = useState(appConfig.primaryColor || '#10B981');

  useEffect(() => {
    // Persist basic overrides locally for demo purposes
    const state = { name, powered, primary };
    localStorage.setItem('branding-overrides', JSON.stringify(state));
  }, [name, powered, primary]);

  const { wallets, addManagedWallet, removeManagedWallet, setActiveAccount, activeAccount, account } = useWallet();
  const [newAddr, setNewAddr] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const allWallets = useMemo(() => {
    const uniq = new Map();
    (wallets || []).forEach((w) => uniq.set(w.address.toLowerCase(), w));
    if (account) uniq.set(account.toLowerCase(), { address: account, label: 'Connected' });
    return Array.from(uniq.values());
  }, [wallets, account]);

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
        <div className="mb-4 text-primary font-semibold">Wallet Manager</div>
        <div className="space-y-4 text-sm">
          <div className="flex gap-2">
            <input className="input" placeholder="0x... address" value={newAddr} onChange={(e)=>setNewAddr(e.target.value)} />
            <input className="input" placeholder="Label (optional)" value={newLabel} onChange={(e)=>setNewLabel(e.target.value)} />
            <button className="btn-gradient" onClick={()=>{ if(newAddr){ addManagedWallet(newAddr, newLabel); setNewAddr(''); setNewLabel(''); } }}>Add</button>
          </div>
          <div className="space-y-2">
            {allWallets.map((w)=> (
              <div key={w.address} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                <div>
                  <div className="text-primary text-sm">{w.label || 'Wallet'}</div>
                  <div className="text-secondary text-xs">{w.address}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="badge" onClick={()=>setActiveAccount(w.address)}>{activeAccount?.toLowerCase()===w.address.toLowerCase() ? 'Active' : 'Set Active'}</button>
                  <button className="btn-secondary px-3 py-1 text-xs" onClick={()=>removeManagedWallet(w.address)}>Remove</button>
                </div>
              </div>
            ))}
            {allWallets.length===0 && <div className="text-xs text-secondary">No wallets yet. Add addresses to aggregate your portfolio.</div>}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
