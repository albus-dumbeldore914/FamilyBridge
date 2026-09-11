'use client';

/**
 * FAMILYBRIDGE Complex Systems Mapping ("SYSTEMS INVOLVED")
 * Section 12: The Universal Bridge between Human Intent and Bureaucratic Systems
 */

import React, { useState } from 'react';
import {
  Shield,
  Landmark,
  Home,
  Award,
  GraduationCap,
  FileCheck,
  ArrowDown,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { TellUsWhatHappenedModal } from './TellUsWhatHappenedModal';
import { useFamilyStore } from '@/lib/storage';

export const SystemsInvolvedView: React.FC = () => {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const { isContinuityMode } = useFamilyStore();

  const systems = [
    {
      id: 'sys_insurance',
      title: 'Life & Health Insurance',
      icon: Shield,
      color: '#4262FF',
      bgLight: '#EEF2FF',
      border: '#C7D4FF',
      complexProcess: 'Nominee claim filing, original bond submission, death cert verification within 90 days.',
      simpleAction: 'Claim ₹1.5 Cr HDFC Life Insurance (Priya 100% nominee).',
      targetDoc: 'HDFC Click 2 Protect (HD-9842)',
    },
    {
      id: 'sys_banking',
      title: 'Banking & Financial Accounts',
      icon: Landmark,
      color: '#d97706',
      bgLight: '#fef3c7',
      border: '#fde68a',
      complexProcess: 'Account freezing rules, Form DA-1 nominee verification, FD maturity settlement.',
      simpleAction: 'Submit Form 28 to release ₹34.5L savings & Fixed Deposits directly.',
      targetDoc: 'SBI Multi-Option Deposit',
    },
    {
      id: 'sys_property',
      title: 'Property & Real Estate',
      icon: Home,
      color: '#2563eb',
      bgLight: '#eff6ff',
      border: '#bfdbfe',
      complexProcess: 'Municipal title mutation, survivorship legal affidavit, encumbrance NOC clearance.',
      simpleAction: 'Transfer title solely to Priya Kumar via registered survivorship clause.',
      targetDoc: 'Maple Heights Flat 402 Deed',
    },
    {
      id: 'sys_social',
      title: 'Government Social Security',
      icon: Award,
      color: '#059669',
      bgLight: '#ecfdf5',
      border: '#a7f3d0',
      complexProcess: 'EPFO Form 10D, actuarial widow pension calculation, EDLI assurance claim.',
      simpleAction: 'Receive ₹7L lump-sum EDLI life cover + monthly family widow pension.',
      targetDoc: 'EPFO UAN 1009-8821-4402',
    },
    {
      id: 'sys_education',
      title: 'Children’s Education & ID',
      icon: GraduationCap,
      color: '#7c3aed',
      bgLight: '#f5f3ff',
      border: '#ddd6fe',
      complexProcess: 'School fee guardian re-assignment, Board registration verification, passport biometrics.',
      simpleAction: 'Seamlessly transition school guardian records for Arjun & Ananya.',
      targetDoc: 'CBSE Certificate & Passports',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#FF4405] bg-[#FF4405]/15 px-3 py-1 rounded-full border border-[#FF4405]/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4405]" />
                The Universal Bridge
              </span>
              {isContinuityMode && (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white bg-[#FF4405] px-3 py-1 rounded-full animate-pulse">
                  Continuity Mode Active
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#FAFAFA] tracking-tight">
              SYSTEMS INVOLVED
            </h1>
            <p className="text-sm text-[#A1A1AA] max-w-2xl leading-relaxed font-normal">
              Human problems are stories of grief and uncertainty. FamilyBridge sits between human intent and bureaucratic complexity, translating confusing systems into simple actions.
            </p>
          </div>

          <button
            onClick={() => setIsStoryModalOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-[#FF4405] hover:bg-[#EA3800] text-white font-semibold text-sm shadow-lg shadow-[#FF4405]/20 flex items-center gap-2 transition shrink-0"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Tell Us What Happened →</span>
          </button>
        </div>
      </div>

      {/* Universal Bridge Architectural Flow Diagram */}
      <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-mono font-semibold text-[#71717A] tracking-wider">
            Architecture of the Universal Bridge
          </span>
          <h2 className="text-2xl font-bold text-[#FAFAFA]">
            From Vulnerable Human Need to Clear Resolution
          </h2>
        </div>

        {/* Visual Bridge Diagram */}
        <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
          {/* Level 1: Human */}
          <div className="w-full bg-[#18181B] border border-[#27272A] rounded-xl p-4 text-center">
            <span className="text-xs font-mono font-semibold text-[#71717A] uppercase tracking-widest block mb-1">
              HUMAN STORY
            </span>
            <p className="text-base font-medium text-[#D4D4D8] italic">
              "My husband passed away. I don't know what we have or what to take care of."
            </p>
          </div>

          <div className="text-[#FF4405] flex flex-col items-center">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Level 2: Gemini */}
          <div className="w-full bg-[#18181B] border border-[#FF4405]/40 rounded-xl p-4 text-center shadow-lg">
            <div className="flex items-center justify-center gap-2 text-[#FF4405] font-mono font-bold text-xs uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-[#FF4405]" />
              <span>GEMINI AI REASONING & VAULT SYNTHESIS</span>
            </div>
            <p className="text-xs text-[#FAFAFA] font-medium">
              Understands Intent • Identifies Nominees • Correlates Documents • Eliminates Jargon
            </p>
          </div>

          <div className="text-[#FF4405] flex flex-col items-center">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Level 3: Complex Systems */}
          <div className="w-full bg-[#18181B] border border-[#27272A] rounded-xl p-5 text-center space-y-3">
            <span className="text-xs font-mono font-semibold text-[#71717A] uppercase tracking-widest block">
              COMPLEX SYSTEMS IDENTIFIED & GATED
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono font-medium">
              <span className="bg-[#111113] p-2 rounded-lg border border-[#27272A] text-[#D4D4D8]">
                🛡️ Insurance
              </span>
              <span className="bg-[#111113] p-2 rounded-lg border border-[#27272A] text-[#D4D4D8]">
                🏦 Banking
              </span>
              <span className="bg-[#111113] p-2 rounded-lg border border-[#27272A] text-[#D4D4D8]">
                🏠 Property
              </span>
              <span className="bg-[#111113] p-2 rounded-lg border border-[#27272A] text-[#D4D4D8]">
                🏛️ Benefits
              </span>
              <span className="bg-[#111113] p-2 rounded-lg border border-[#27272A] text-[#D4D4D8] col-span-2 sm:col-span-1">
                🎓 Education
              </span>
            </div>
          </div>

          <div className="text-[#FF4405] flex flex-col items-center">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Level 4: Simple Action */}
          <div className="w-full bg-[#FF4405] text-white rounded-xl p-5 text-center shadow-lg shadow-[#FF4405]/20">
            <span className="text-xs font-mono font-bold uppercase tracking-widest block mb-1 text-white/80">
              SIMPLE HUMAN ACTIONS
            </span>
            <p className="text-base sm:text-lg font-bold">
              "Review your ₹1.5 Cr life insurance policy where you are sole nominee."
            </p>
          </div>
        </div>
      </div>

      {/* Systems Breakdown Cards */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-[#FAFAFA]">
          Detailed System Translation Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {systems.map((sys) => {
            const Icon = sys.icon;
            return (
              <div
                key={sys.id}
                className="bg-[#111113] border border-[#27272A] rounded-2xl p-6 hover:border-[#FF4405]/40 transition duration-200 shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-[#18181B] border border-[#27272A] text-[#FF4405]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-base text-[#FAFAFA]">{sys.title}</h4>
                  </div>
                  <span className="text-[11px] bg-[#18181B] text-[#71717A] px-2.5 py-0.5 rounded-full font-mono border border-[#27272A]">
                    {sys.targetDoc}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-[#18181B] p-3.5 rounded-xl border border-[#27272A] space-y-1">
                    <span className="text-[#71717A] font-mono font-semibold block text-[10px] uppercase">
                      Bureaucratic Complexity:
                    </span>
                    <p className="text-[#A1A1AA] leading-relaxed">{sys.complexProcess}</p>
                  </div>

                  <div className="bg-[#18181B] p-3.5 rounded-xl border border-[#FF4405]/30 space-y-1">
                    <span className="text-[#FF4405] font-mono font-bold block text-[10px] uppercase">
                      FamilyBridge Simple Human Action:
                    </span>
                    <p className="text-[#FAFAFA] font-medium leading-relaxed">{sys.simpleAction}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TellUsWhatHappenedModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
      />
    </div>
  );
};
