import React, { useState } from 'react';
import { X, CreditCard, Shield, Check } from 'lucide-react';
import { appConfig } from '../config/appConfig';

const StripeModal = ({ isOpen, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  if (!isOpen) return null;

  const plans = {
    monthly: {
      price: 9.99,
      period: 'month',
      features: ['Advanced Analytics', 'Price Alerts', 'Export Data', 'Real-time Updates']
    },
    yearly: {
      price: 99.99,
      period: 'year',
      savings: 'Save 17%',
      features: ['Advanced Analytics', 'Price Alerts', 'Export Data', 'Real-time Updates', 'Priority Support']
    }
  };

  const handleUpgrade = async () => {
    setIsProcessing(true);
    
    // Simulate Stripe checkout process
    setTimeout(() => {
      alert('This is a demo. In production, this would redirect to Stripe checkout.');
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Upgrade to Pro
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {appConfig.appName} Professional
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Plan Selection */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedPlan === 'monthly'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${plans.monthly.price}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  per {plans.monthly.period}
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 relative ${
                selectedPlan === 'yearly'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                {plans.yearly.savings}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${plans.yearly.price}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  per {plans.yearly.period}
                </div>
              </div>
            </button>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              What's included:
            </h3>
            {plans[selectedPlan].features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          {/* Security Notice */}
          <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-6">
            <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="font-medium mb-1">Secure Payment</div>
              <div>Powered by Stripe. Your payment information is encrypted and secure.</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Upgrade Now - ${plans[selectedPlan].price}</span>
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Maybe Later
            </button>
          </div>

          {/* Terms */}
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            By upgrading, you agree to our Terms of Service and Privacy Policy.
            Cancel anytime.
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeModal;
