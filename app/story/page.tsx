'use client';

/**
 * FAMILYBRIDGE "TELL US WHAT HAPPENED" Page
 * Section 4: The Most Important Feature
 */

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { TellUsWhatHappenedModal } from '@/components/TellUsWhatHappenedModal';
import { useFamilyStore } from '@/lib/storage';
import { HeartHandshake, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StoryPage() {
  const {
    activeRole,
    isContinuityMode,
    switchRole,
    toggleContinuityMode,
    resetDemo,
  } = useFamilyStore();

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#FAFAFA] bg-skiff-grid flex flex-col">
      <Navbar
        activeRole={activeRole}
        isContinuityMode={isContinuityMode}
        onSwitchRole={switchRole}
        onToggleContinuity={toggleContinuityMode}
        onResetDemo={resetDemo}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4405]/15 text-[#FF4405] text-[10px] font-mono font-semibold border border-[#FF4405]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#FF4405]" />
          <span>The Universal Bridge Between Human Emotion & Complex Systems</span>
        </div>

        <h1 className="text-4xl font-bold text-[#FAFAFA] tracking-tight">
          Tell Us What Happened
        </h1>
        <p className="text-[#A1A1AA] max-w-xl mx-auto text-sm">
          Whether typed or spoken in your own words, Gemini translates your human story into an immediate, prioritized action roadmap.
        </p>

        <button
          onClick={() => setIsOpen(true)}
          className="px-8 py-4 rounded-xl bg-[#FF4405] hover:bg-[#EA3800] text-white font-semibold text-base shadow-lg shadow-[#FF4405]/20 inline-flex items-center gap-2 transition"
        >
          <HeartHandshake className="w-5 h-5" />
          <span>Open Story Intake Engine →</span>
        </button>

        <TellUsWhatHappenedModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </main>
    </div>
  );
}
