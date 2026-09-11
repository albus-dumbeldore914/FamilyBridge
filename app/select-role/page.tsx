'use client';

/**
 * /select-role — Role Selection after Google Login or Direct Entry
 * Skiff.com aesthetic: Obsidian Dark, Electric Ember (#FF4405), JetBrains Mono
 */

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useFamilyStore } from '@/lib/storage';

const ROLES = [
  {
    id: 'primary' as const,
    emoji: '👨',
    title: 'Father / Primary Admin',
    subtitle: 'Vault Root Admin',
    description:
      'You manage and upload family documents. You control permissions, see all records, and set up the family vault for continuity.',
    features: ['Full vault access', 'Upload & manage documents', 'Set family permissions', 'Simulate emergencies'],
    bg: 'bg-[#18181B]',
    border: 'border-[#FF4405]',
    badge: 'bg-[#FF4405]/10 text-[#FF4405] border border-[#FF4405]/30',
  },
  {
    id: 'guardian' as const,
    emoji: '👩',
    title: 'Mother / Guardian',
    subtitle: 'Continuity Manager',
    description:
      'You access shared family records and — if an emergency is triggered — receive Gemini’s full action roadmap with step-by-step guidance.',
    features: ['Access joint documents', 'Emergency action plan', 'Benefits matching', 'Gemini guidance'],
    bg: 'bg-[#18181B]',
    border: 'border-[#FF4405]',
    badge: 'bg-[#FF4405]/10 text-[#FF4405] border border-[#FF4405]/30',
  },
  {
    id: 'child' as const,
    emoji: '🧒',
    title: 'Child',
    subtitle: 'Restricted Safe Access',
    description:
      'You see only your own certificates, passport, and emergency contacts. All sensitive financial and insurance data is automatically hidden.',
    features: ['Own certificates only', 'Emergency contacts', 'Safe AI assistant', 'No financial data'],
    bg: 'bg-[#18181B]',
    border: 'border-[#8B5CF6]',
    badge: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30',
  },
];

export default function SelectRolePage() {
  const { data: session, status, update } = useSession();
  const { switchRole } = useFamilyStore();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!selected) return;
    setSaving(true);
    setError(null);

    // Always update client-side family store immediately
    switchRole(selected as any);

    try {
      if (session) {
        const res = await fetch('/api/user/set-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: selected }),
        });

        if (res.ok) {
          await update({ role: selected });
        }
      }

      const dashMap: Record<string, string> = {
        primary: '/dashboard/primary',
        guardian: '/dashboard/guardian',
        child: '/dashboard/child',
      };
      router.replace(dashMap[selected] ?? '/dashboard/primary');
    } catch (err: any) {
      console.warn('Notice: set-role API issue, proceeding with client role:', err);
      const dashMap: Record<string, string> = {
        primary: '/dashboard/primary',
        guardian: '/dashboard/guardian',
        child: '/dashboard/child',
      };
      router.replace(dashMap[selected] ?? '/dashboard/primary');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF4405] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#FAFAFA] flex flex-col justify-between selection:bg-[#FF4405] selection:text-white">
      {/* Header */}
      <header className="border-b border-[#27272A] bg-[#0A0A0B]/80 backdrop-blur-md py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#18181B] border border-[#27272A] text-[#FF4405] flex items-center justify-center shadow-skiff">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-[#FAFAFA] tracking-tight">FAMILYBRIDGE</span>
        </div>
        {session?.user && (
          <span className="text-xs text-[#A1A1AA] font-mono">
            Signed in as <strong className="text-[#FAFAFA]">{session.user.name ?? session.user.email}</strong>
          </span>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 flex flex-col justify-center space-y-8 bg-skiff-grid">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#FF4405] bg-[#FF4405]/10 border border-[#FF4405]/30 px-3 py-1 rounded-full">
            Zero-Trust Vault Profile
          </span>
          <h1 className="text-3xl font-bold text-[#FAFAFA]">Select Your Role in the Family</h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto">
            Your role controls what tasks are assigned to you and what encrypted records you can access.
          </p>
        </div>

        {error && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROLES.map((role) => {
            const isSelected = selected === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelected(role.id)}
                className={`text-left p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-skiff ${
                  isSelected
                    ? 'border-[#FF4405] bg-[#18181B] ring-2 ring-[#FF4405]/30'
                    : 'border-[#27272A] bg-[#111113] hover:border-[#3F3F46]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{role.emoji}</span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#FF4405] flex items-center justify-center text-white text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#FAFAFA] text-base">{role.title}</h3>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full inline-block mt-0.5 bg-[#18181B] text-[#A1A1AA] border border-[#27272A]">
                      {role.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">{role.description}</p>
                </div>

                <ul className="text-[11px] text-[#A1A1AA] space-y-1.5 pt-2 border-t border-[#27272A]">
                  {role.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#FF4405]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            disabled={!selected || saving}
            onClick={handleConfirm}
            className="px-8 py-3 rounded-lg bg-[#FF4405] hover:bg-[#EA3800] disabled:opacity-40 text-white font-semibold text-sm shadow-skiff-md flex items-center gap-2 transition"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Opening Portal...</span>
              </>
            ) : (
              <>
                <span>Enter Dedicated Role Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#27272A] bg-[#0A0A0B] py-6 text-center text-xs text-[#71717A] font-mono">
        FAMILYBRIDGE • Zero-Knowledge Role-Based Access Control
      </footer>
    </div>
  );
}