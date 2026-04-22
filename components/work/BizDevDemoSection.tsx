'use client';

import { useState } from 'react';
import LiveDemoFrame from '@/components/ui/LiveDemoFrame';
import BizDevCommandCenterDemo, { STORAGE_KEY } from '@/demos/bizdev-command-center';

export default function BizDevDemoSection() {
  const [resetKey, setResetKey] = useState(0);

  function handleReset() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setResetKey((k) => k + 1);
  }

  return (
    <LiveDemoFrame
      title="BizDev Command Center"
      resetButton={
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center gap-2 rounded-none border border-border bg-transparent px-4 py-2 font-mono text-xs tracking-wide text-text-primary transition-all duration-200 hover:border-accent hover:text-accent"
        >
          Reset Demo
        </button>
      }
    >
      <BizDevCommandCenterDemo key={resetKey} />
    </LiveDemoFrame>
  );
}
