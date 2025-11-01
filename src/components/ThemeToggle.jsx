import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative flex h-9 w-16 items-center rounded-full bg-white/10 p-1"
    >
      <div
        className={`absolute top-1 left-1 h-7 w-7 rounded-full bg-[#121212] shadow-sm transition-transform ${
          isDark ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        <div className="flex h-full w-full items-center justify-center">
          {isDark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-secondary" />}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;

