'use client';

/**
 * FAMILYBRIDGE "SYSTEMS INVOLVED" Page
 * Section 12: Complex System Mapping & The Universal Bridge
 */

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { SystemsInvolvedView } from '@/components/SystemsInvolvedView';
import { useFamilyStore } from '@/lib/storage';

export default function SystemsPage() {
  const {
    activeRole,
    isContinuityMode,
    switchRole,
    toggleContinuityMode,
    resetDemo,
  } = useFamilyStore();

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#FAFAFA] bg-skiff-grid flex flex-col">
      <Navbar
        activeRole={activeRole}
        isContinuityMode={isContinuityMode}
        onSwitchRole={switchRole}
        onToggleContinuity={toggleContinuityMode}
        onResetDemo={resetDemo}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SystemsInvolvedView />
      </main>
    </div>
  );
}
