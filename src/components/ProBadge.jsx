import React from 'react';
import { Crown, Star } from 'lucide-react';

const ProBadge = ({ isPro = false, showText = true }) => {
  if (!isPro) return null;

  return (
    <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold shadow-sm border border-yellow-200">
      <Crown className="w-3 h-3" />
      {showText && <span>PRO</span>}
    </div>
  );
};

export default ProBadge;

