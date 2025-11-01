import React from 'react';

const ProBanner = ({ onUpgrade }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-orange-400/20 via-purple-500/10 to-transparent p-6">
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm text-secondary">Upgrade</div>
          <div className="text-xl font-semibold text-primary">Unlock Pro for live sync, alerts, and export</div>
        </div>
        <button onClick={onUpgrade} className="btn-gradient">Upgrade to Pro</button>
      </div>
    </div>
  );
};

export default ProBanner;

