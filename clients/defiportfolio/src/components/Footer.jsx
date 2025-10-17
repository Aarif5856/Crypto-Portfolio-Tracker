import React from 'react';
import { Heart, Github, Twitter, Mail } from 'lucide-react';
import { appConfig } from '../config/appConfig';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {appConfig.appName.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {appConfig.appName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {appConfig.appDescription}
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 max-w-md">
              Professional crypto portfolio tracking for traders, investors, and DeFi enthusiasts. 
              Track your investments in real-time with advanced analytics and insights.
            </p>
            <div className="flex space-x-4">
              {appConfig.social.twitter && (
                <a
                  href={appConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {appConfig.social.github && (
                <a
                  href={appConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {appConfig.supportEmail && (
                <a
                  href={`mailto:${appConfig.supportEmail}`}
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm transition-colors duration-200">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm transition-colors duration-200">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#api" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm transition-colors duration-200">
                  API
                </a>
              </li>
              <li>
                <a href="#integrations" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm transition-colors duration-200">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#help" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm transition-colors duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#status" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm transition-colors duration-200">
                  Status
                </a>
              </li>
              <li>
                <a href="#community" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm transition-colors duration-200">
                  Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {currentYear} {appConfig.appName}. All rights reserved.
              </p>
              <div className="flex space-x-4">
                {appConfig.legal.privacyPolicyUrl && (
                  <a
                    href={appConfig.legal.privacyPolicyUrl}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                )}
                {appConfig.legal.termsOfServiceUrl && (
                  <a
                    href={appConfig.legal.termsOfServiceUrl}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
                  >
                    Terms of Service
                  </a>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>by</span>
              <span className="font-medium text-primary-500">Your Brand Name</span>
            </div>
          </div>
          
          {/* Disclaimer */}
          {appConfig.legal.disclaimer && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
                {appConfig.legal.disclaimer}
              </p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
