'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type LayoutStyle = 'standard' | 'screenshot' | 'bento' | 'split';

interface LayoutContextType {
  layout: LayoutStyle;
  setLayout: (layout: LayoutStyle) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [layout, setLayoutState] = useState<LayoutStyle>('standard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLayout = localStorage.getItem('portfolio-layout') as LayoutStyle | null;
    if (savedLayout) {
      setLayoutState(savedLayout);
    }
  }, []);

  const setLayout = (newLayout: LayoutStyle) => {
    setLayoutState(newLayout);
    localStorage.setItem('portfolio-layout', newLayout);
  };

  // We still render on server with 'standard', then hydrate. Standard React pattern.
  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
