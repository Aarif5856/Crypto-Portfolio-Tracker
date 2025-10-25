import React from 'react';
import { Github, Twitter, MessageCircle } from 'lucide-react';
import { appConfig } from '../config/appConfig';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-1">
            {/* Clean footer copy after removing corrupted glyphs */}
            <span>&copy; {currentYear} CryptoPro</span>
            <span>-</span>
            <span>Powered by Web3</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={appConfig.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 transition-colors duration-200"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={appConfig.social.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 transition-colors duration-200"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href={appConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 transition-colors duration-200"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

