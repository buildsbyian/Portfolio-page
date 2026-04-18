'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import AnimateIn from './AnimateIn';

const themes = [
  { id: 'brutalist', label: '01 Brutal', icon: '■' },
  { id: 'glass', label: '02 Glass', icon: '✧' },
  { id: 'neobrutal', label: '03 Neo', icon: '▲' },
  { id: 'tactile', label: '04 Tactile', icon: '○' },
] as const;

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <div className="bg-surface/90 backdrop-blur-md border border-border p-1.5 flex gap-1 rounded-full shadow-lg">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-wider transition-all duration-300 ${
              theme === t.id
                ? 'bg-accent text-bg shadow-sm opacity-100'
                : 'text-text-secondary hover:text-text-primary hover:bg-border/50 opacity-80 hover:opacity-100'
            }`}
            title={t.label}
          >
            <span className="opacity-70">{t.icon}</span>
            <span className="inline-block">{t.label.split(' ')[1]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
