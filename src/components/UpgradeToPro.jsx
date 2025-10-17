import React, { useState } from 'react';
import { Crown, Check, Zap, BarChart3, Download, Bell } from 'lucide-react';
import { appConfig } from '../config/appConfig';
import StripeModal from './StripeModal';

const UpgradeToPro = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  console.log('UpgradeToPro rendering, showUpgradeButton:', appConfig.monetization.showUpgradeButton);
  console.log('Primary color:', appConfig.primaryColor);
  console.log('Current theme:', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  
  const proFeatures = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Detailed portfolio performance charts and insights',
    },
    {
      icon: Bell,
      title: 'Price Alerts',
      description: 'Get notified when your tokens hit target prices',
    },
    {
      icon: Download,
      title: 'Export Data',
      description: 'Download your portfolio data in CSV/PDF format',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Faster price updates and portfolio synchronization',
    },
  ];

  if (!appConfig.monetization.showUpgradeButton) {
    return null;
  }

  // Fallback for debugging - always show something
  return (
    <div className="card text-white shadow-lg" style={{ backgroundColor: '#10B981', border: '2px solid #059669' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Crown className="w-6 h-6 text-yellow-300" />
          <h3 className="text-xl font-bold text-white">Upgrade to Pro</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{appConfig.monetization.proPrice}</div>
          <div className="text-sm text-white/90">per month</div>
        </div>
      </div>

      <p className="text-white/90 mb-6">
        Unlock advanced features and take your portfolio tracking to the next level.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {proFeatures.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <feature.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-white">{feature.title}</h4>
              <p className="text-sm text-white/80">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex-1 font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
          style={{ 
            backgroundColor: '#FFFFFF', 
            color: '#10B981',
            border: '2px solid #10B981',
            fontWeight: 'bold',
            fontSize: '16px',
            textShadow: 'none'
          }}
        >
          Start Free Trial
        </button>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 border border-white/30"
        >
          Learn More
        </button>
      </div>

      <div className="mt-4 text-xs text-white/70 text-center">
        Cancel anytime • No setup fees • 30-day money-back guarantee
      </div>
      
      <StripeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );

};

export default UpgradeToPro;

