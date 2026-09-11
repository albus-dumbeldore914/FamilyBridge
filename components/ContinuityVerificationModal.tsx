'use client';

/**
 * FAMILYBRIDGE Simulated Continuity Verification Modal
 * Themed with PostPilot warm paper and coral accent
 */

import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { FamilyMember } from '@/lib/types';

interface ContinuityVerificationModalProps {
  isOpen: boolean;
  trustedGuardian: FamilyMember;
  onClose: () => void;
  onConfirmSimulation: () => void;
}

export const ContinuityVerificationModal: React.FC<ContinuityVerificationModalProps> = ({
  isOpen,
  trustedGuardian,
  onClose,
  onConfirmSimulation,
}) => {
  const [confirmedCheck, setConfirmedCheck] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#111113] border border-[#27272A] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#18181B] border-b border-[#27272A] px-6 py-5 flex items-center justify-between text-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF4405]/10 text-[#FF4405] border border-[#FF4405]/20">
              <AlertTriangle className="w-5 h-5 text-[#FF4405]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#FAFAFA]">Simulate Continuity Event</h2>
              <span className="text-[10px] text-[#FF4405] font-mono font-bold tracking-wider uppercase">
                [HACKATHON EVALUATION DEMO MODE]
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#71717A] hover:text-[#FAFAFA] rounded-lg hover:bg-[#27272A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs bg-[#0A0A0B]">
          <div className="bg-[#18181B] border border-[#FF4405]/30 rounded-xl p-4 space-y-2 text-[#D4D4D8]">
            <h3 className="font-semibold flex items-center gap-1.5 text-[#FF4405] text-sm font-mono">
              <ShieldAlert className="w-4 h-4" />
              What this simulation does:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-[#A1A1AA]">
              <li>Marks primary member (Ramesh Kumar) as unavailable.</li>
              <li>
                Elevates access permissions for designated guardian: <strong className="text-[#FAFAFA]">{trustedGuardian.name}</strong>.
              </li>
              <li>Activates Gemini's <strong className="text-[#FF4405]">"WHAT DO I DO NOW?"</strong> continuity action engine.</li>
              <li>Unlocks life insurance claim procedures and survivorship property rights.</li>
            </ul>
          </div>

          <div className="space-y-2 text-[#71717A]">
            <p className="leading-relaxed">
              In production, this transition requires multi-signature legal verification or dual-factor trusted contact affirmation. For this hackathon demo, you can trigger it instantly.
            </p>

            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#18181B] border border-[#27272A] cursor-pointer hover:border-[#FF4405] transition mt-2">
              <input
                type="checkbox"
                checked={confirmedCheck}
                onChange={(e) => setConfirmedCheck(e.target.checked)}
                className="mt-0.5 rounded border-[#27272A] bg-[#0A0A0B] text-[#FF4405] focus:ring-[#FF4405]"
              />
              <span className="text-[#FAFAFA] font-medium leading-relaxed">
                I understand this is a simulation. Switch active role to Mother (Priya Kumar) and open Continuity Mode.
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#27272A] bg-[#18181B]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-[#71717A] hover:text-[#FAFAFA] transition"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!confirmedCheck}
            onClick={() => {
              onConfirmSimulation();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#FF4405] hover:bg-[#EA3800] disabled:opacity-40 text-white text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-[#FF4405]/20"
          >
            <span>Activate Continuity Mode</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
