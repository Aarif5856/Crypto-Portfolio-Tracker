import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { appConfig } from '../config/appConfig';

const AdBanner = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!appConfig.monetization.showAdBanner || !isVisible) {
    return null;
  }

  return (
    <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <ExternalLink className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              Sponsored Content
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Discover the best DeFi protocols and maximize your yields
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
            Learn More
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Close ad"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;

