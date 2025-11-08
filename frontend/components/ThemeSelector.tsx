'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Theme } from '@/types/themes';

interface ThemeSelectorProps {
  themes: Theme[];
}

const STORAGE_KEY = 'selectedTheme';
const BASE_URL = 'http://localhost:3001';

export default function ThemeSelector({ themes }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  // Initialize theme from localStorage or use the first available theme
  useEffect(() => {
    if (themes.length === 0) return;

    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const isValidTheme = savedTheme && themes.some(theme => theme.url === savedTheme);
    
    if (isValidTheme) {
      setSelectedTheme(savedTheme);
    } else {
      // Fallback to the first theme if saved theme is invalid or doesn't exist
      setSelectedTheme(themes[0].url);
    }
  }, [themes]);

  // Apply the selected theme to the page background
  useEffect(() => {
    if (!selectedTheme) return;

    localStorage.setItem(STORAGE_KEY, selectedTheme);
    
    const backgroundUrl = `url(${BASE_URL}${selectedTheme})`;
    document.body.style.backgroundImage = backgroundUrl;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('themeChanged'));
  }, [selectedTheme]);

  const isThemeSelected = (themeUrl: string) => selectedTheme === themeUrl;

  return (
    <div className="p-4 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 max-w-[280px]">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-white mb-0.5 tracking-tight">Themes</h3>
        <p className="text-xs text-gray-400">Pick your background</p>
      </div>
      
      <div className="grid grid-cols-2 gap-2 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/50">
        {themes.map((theme, index) => {
          const isSelected = isThemeSelected(theme.url);
          
          return (
            <button
              key={theme.url || index}
              onClick={() => setSelectedTheme(theme.url)}
              className={`
                relative w-full aspect-video rounded-md overflow-hidden
                transform transition-all duration-200 ease-out
                ${isSelected 
                  ? 'ring-3 ring-blue-500 ring-offset-1 ring-offset-gray-900 scale-105 shadow-lg shadow-blue-500/40' 
                  : 'ring-1 ring-gray-600/50 hover:ring-gray-500 hover:scale-105 shadow-md'
                }
                focus:outline-none focus:ring-3 focus:ring-blue-400
                group cursor-pointer
              `}
              aria-label={`Select theme ${index + 1}`}
              aria-pressed={isSelected}
            >
              <Image
                src={`${BASE_URL}${theme.url}`}
                alt={`Theme ${index + 1}`}
                width={150}
                height={100}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
              />
              
              {/* Overlay effect */}
              <div className={`
                absolute inset-0 transition-opacity duration-200
                ${isSelected 
                  ? 'bg-blue-500/20 opacity-100' 
                  : 'bg-black/20 opacity-0 group-hover:opacity-100'
                }
              `} />
              
              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1 shadow-lg animate-in zoom-in duration-150">
                  <svg 
                    className="w-3 h-3 text-white" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="3" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}