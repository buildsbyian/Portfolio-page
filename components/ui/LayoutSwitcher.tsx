'use client';

import React from 'react';
import { useLayout, LayoutStyle } from './LayoutProvider';

const layouts: { id: LayoutStyle; label: string; icon: string }[] = [
  { id: 'standard', label: '1 Standard', icon: '☰' },
  { id: 'screenshot', label: '2 Asymmetric', icon: '◫' },
  { id: 'bento', label: '3 Bento Grid', icon: '⊞' },
  { id: 'split', label: '4 Split View', icon: '◧' },
];

export default function LayoutSwitcher() {
  const { layout, setLayout } = useLayout();

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <div className="bg-surface/90 backdrop-blur-md border border-border p-1.5 flex gap-1 rounded-full shadow-lg">
        {layouts.map((l) => (
          <button
            key={l.id}
            onClick={() => setLayout(l.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-wider transition-all duration-300 ${
              layout === l.id
                ? 'bg-accent text-bg shadow-sm opacity-100'
                : 'text-text-secondary hover:text-text-primary hover:bg-border/50 opacity-80 hover:opacity-100'
            }`}
            title={l.label}
          >
            <span className="opacity-70">{l.icon}</span>
            <span className="inline-block">{l.label.split(' ')[1]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
