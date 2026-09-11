'use client';

/**
 * FAMILYBRIDGE Landing Page
 * Skiff.com Design System:
 * - Obsidian Dark Surfaces (#0A0A0B, #111113, #18181B)
 * - Electric Ember Accents (#FF4405)
 * - Inter & JetBrains Mono Typography
 * - Role-Gated Portals for Father, Mother, and Child
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useFamilyStore } from '@/lib/storage';
import {
  Shield,
  Sparkles,
  ArrowRight,
  FileText,
  Lock,
  CheckCircle2,
  Cpu,
  Layers,
  Users,
  LogOut,
  AlertTriangle,
} from 'lucide-react';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const { switchRole } = useFamilyStore();
  const router = useRouter();
  const userRole = (session?.user as any)?.role as string | undefined;

  const handleSelectRole = (role: 'primary' | 'guardian' | 'child') => {
    switchRole(role);
    const path =
      role === 'primary'
        ? '/dashboard/primary'
        : role === 'guardian'
        ? '/dashboard/guardian'
        : '/dashboard/child';
    router.push(path);
  };

  const getDashboardHref = () => {
    if (userRole === 'guardian') return '/dashboard/guardian';
    if (userRole === 'child') return '/dashboard/child';
    return '/dashboard/primary';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#FAFAFA] flex flex-col justify-between selection:bg-[#FF4405] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-[#27272A] bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#18181B] border border-[#27272A] text-[#FF4405] flex items-center justify-center shadow-skiff">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[#FAFAFA]">
                FAMILYBRIDGE
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#18181B] text-[#A1A1AA] border border-[#27272A]">
                E2EE Vault
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {status === 'authenticated' ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#A1A1AA] font-mono hidden sm:inline">
                  {session?.user?.email}
                </span>
                <Link
                  href={getDashboardHref()}
                  className="text-xs font-semibold px-4 py-2 rounded-lg bg-[#FF4405] hover:bg-[#EA3800] text-white shadow-skiff transition flex items-center gap-1.5"
                >
                  <span>Open Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-[#71717A] hover:text-[#FAFAFA] rounded-lg border border-[#27272A] hover:bg-[#18181B] transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/story"
                  className="text-xs font-medium px-3.5 py-2 rounded-lg text-[#D4D4D8] hover:text-[#FAFAFA] hover:bg-[#18181B] transition hidden sm:inline-block"
                >
                  Tell Us What Happened
                </Link>
                <Link
                  href="/login"
                  className="text-xs font-semibold px-4 py-2 rounded-lg bg-[#FF4405] hover:bg-[#EA3800] text-white shadow-skiff transition flex items-center gap-1.5"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 bg-skiff-grid">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18181B] border border-[#27272A] text-[#FAFAFA] text-xs font-mono shadow-skiff">
              <span className="w-2 h-2 rounded-full bg-[#FF4405] animate-pulse" />
              <span>Zero-Knowledge Family Continuity Vault</span>
              <span className="text-[#71717A]">•</span>
              <span className="text-[#FF4405]">Powered by Gemini 2.0</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FAFAFA] leading-[1.1]">
              When Life Changes, Your Family Knows{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4405] via-[#FF6633] to-[#FFAA00]">
                Exactly What To Do.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#A1A1AA] max-w-2xl mx-auto font-normal leading-relaxed">
              Zero-knowledge encrypted family vault with Gemini-powered understanding. Choose your role below to access your customized tasks, records, and action roadmap.
            </p>

            {/* Quick Portal Switcher Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSelectRole('primary')}
                className="px-5 py-3 rounded-lg bg-[#18181B] hover:bg-[#222226] text-[#FAFAFA] border border-[#27272A] hover:border-[#FF4405] font-semibold text-xs shadow-skiff flex items-center gap-2 transition"
              >
                <span>👨 Enter Father Portal</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FF4405]" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('guardian')}
                className="px-5 py-3 rounded-lg bg-[#FF4405] hover:bg-[#EA3800] text-white font-semibold text-xs shadow-skiff-md flex items-center gap-2 transition"
              >
                <span>👩 Enter Mother Portal</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('child')}
                className="px-5 py-3 rounded-lg bg-[#18181B] hover:bg-[#222226] text-[#FAFAFA] border border-[#27272A] hover:border-[#8B5CF6] font-semibold text-xs shadow-skiff flex items-center gap-2 transition"
              >
                <span>🧒 Enter Children Portal</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8B5CF6]" />
              </button>
            </div>
          </div>
        </section>

        {/* Visual Gemini Pipeline Section */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-8 sm:p-10 shadow-skiff-lg">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
              <span className="text-xs uppercase font-mono font-bold text-[#FF4405] tracking-widest block">
                Universal Human-to-System Bridge
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA]">
                How FamilyBridge Transforms Bureaucracy
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              <div className="bg-[#18181B] p-6 rounded-xl border border-[#27272A] space-y-3 relative hover:border-[#3F3F46] transition">
                <div className="w-10 h-10 rounded-lg bg-[#27272A] flex items-center justify-center text-[#FAFAFA] shadow-xs">
                  <FileText className="w-5 h-5 text-[#A1A1AA]" />
                </div>
                <div className="text-xs font-mono font-semibold text-[#71717A] uppercase tracking-wider">Step 01</div>
                <h3 className="text-lg font-bold text-[#FAFAFA]">1. Human Story & Raw Records</h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Upload policies, land deeds, certificates, or speak in your own words: <em>&ldquo;My husband passed away, what do I do?&rdquo;</em>
                </p>
              </div>

              <div className="bg-[#18181B] p-6 rounded-xl border border-[#27272A] space-y-3 relative hover:border-[#FF4405]/50 transition">
                <div className="w-10 h-10 rounded-lg bg-[#FF4405]/10 border border-[#FF4405]/20 flex items-center justify-center text-[#FF4405] shadow-xs">
                  <Cpu className="w-5 h-5 text-[#FF4405]" />
                </div>
                <div className="text-xs font-mono font-semibold text-[#FF4405] uppercase tracking-wider">Step 02</div>
                <h3 className="text-lg font-bold text-[#FAFAFA]">2. Gemini Multimodal Synthesis</h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Gemini extracts legal entities, policy values, designated nominees, and uncovers unfinished administrative obligations.
                </p>
              </div>

              <div className="bg-[#18181B] p-6 rounded-xl border border-[#27272A] space-y-3 relative hover:border-[#3B82F6]/50 transition">
                <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] shadow-xs">
                  <Layers className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div className="text-xs font-mono font-semibold text-[#3B82F6] uppercase tracking-wider">Step 03</div>
                <h3 className="text-lg font-bold text-[#FAFAFA]">3. Role-Gated Action Roadmap</h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Father manages admin setups, Mother receives urgent claim deadlines & benefits, and Children see safe educational records.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Three Dedicated Role Portals Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181B] border border-[#27272A] text-xs font-mono text-[#FF4405]">
              Zero-Trust Role-Gated Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FAFAFA]">
              Click Any Role to Open Their Dedicated Task Portal
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-2xl mx-auto">
              Each family member gets a dedicated view showing exclusively their tasks, authorized documents, and permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Father Card */}
            <div className="bg-[#111113] rounded-2xl border border-[#27272A] hover:border-[#FF4405]/50 p-7 flex flex-col justify-between space-y-5 shadow-skiff hover:shadow-skiff-lg transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#18181B] border border-[#27272A] flex items-center justify-center text-2xl">
                  👨
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#FAFAFA]">Father / Primary Admin</h3>
                  <span className="text-[11px] font-mono font-semibold text-[#FF4405] bg-[#FF4405]/10 border border-[#FF4405]/20 px-2.5 py-0.5 rounded-full inline-block mt-1">
                    Vault Root Admin
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Manages vault completeness, uploads legal records, assigns nominees, and tests emergency continuity readiness.
                </p>
                <div className="bg-[#18181B] p-3 rounded-lg border border-[#27272A] space-y-1.5">
                  <span className="text-[10px] font-mono font-semibold text-[#71717A] uppercase block">
                    Father&apos;s Specific Tasks:
                  </span>
                  <ul className="text-xs text-[#D4D4D8] space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4405] shrink-0" /> Complete missing health & vehicle insurance
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4405] shrink-0" /> Assign SBI Bank & Mutual Fund nominees
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4405] shrink-0" /> Run Emergency Simulation Sandbox
                    </li>
                  </ul>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSelectRole('primary')}
                className="w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-[#18181B] hover:bg-[#222226] text-[#FAFAFA] border border-[#27272A] hover:border-[#FF4405] transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Enter Father Portal (Tasks & Admin)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FF4405]" />
              </button>
            </div>

            {/* Mother Card */}
            <div className="bg-[#111113] rounded-2xl border-2 border-[#FF4405]/50 p-7 flex flex-col justify-between space-y-5 shadow-skiff-md hover:shadow-skiff-lg transition-all relative">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#18181B] border border-[#27272A] flex items-center justify-center text-2xl">
                  👩
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#FAFAFA]">Mother / Guardian</h3>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#FF4405] text-white">
                    Continuity
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Receives Gemini&apos;s &ldquo;WHAT DO I DO NOW?&rdquo; roadmap, with urgent insurance claims, bank unfreezing, and pensions.
                </p>
                <div className="bg-[#18181B] p-3 rounded-lg border border-[#27272A] space-y-1.5">
                  <span className="text-[10px] font-mono font-semibold text-[#FF4405] uppercase block">
                    Mother&apos;s Critical Tasks:
                  </span>
                  <ul className="text-xs text-[#D4D4D8] space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4405] shrink-0" /> Claim ₹1.5 Cr HDFC Life Insurance
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4405] shrink-0" /> Submit Form 28 for SBI ₹34.5L release
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4405] shrink-0" /> Apply for EPFO Family Widow Pension
                    </li>
                  </ul>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSelectRole('guardian')}
                className="w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-[#FF4405] hover:bg-[#EA3800] text-white transition shadow-skiff flex items-center justify-center gap-1.5"
              >
                <span>Enter Mother Portal (Tasks & Claims)</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Child Card */}
            <div className="bg-[#111113] rounded-2xl border border-[#27272A] hover:border-[#8B5CF6]/50 p-7 flex flex-col justify-between space-y-5 shadow-skiff hover:shadow-skiff-lg transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#18181B] border border-[#27272A] flex items-center justify-center text-2xl">
                  🧒
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#FAFAFA]">Child (Arjun / Ananya)</h3>
                  <span className="text-[11px] font-mono font-semibold text-[#8B5CF6] bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 px-2.5 py-0.5 rounded-full inline-block mt-1">
                    Safe Restricted
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Confidential financial documents are fully hidden. Shows school records, birth certificates, and emergency contacts.
                </p>
                <div className="bg-[#18181B] p-3 rounded-lg border border-[#27272A] space-y-1.5">
                  <span className="text-[10px] font-mono font-semibold text-[#8B5CF6] uppercase block">
                    Children&apos;s Tasks & Records:
                  </span>
                  <ul className="text-xs text-[#D4D4D8] space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0" /> Download CBSE 10th marksheet & school IDs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0" /> Save Emergency Family Contacts to phone
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0" /> 🔒 Financial & bank records strictly hidden
                    </li>
                  </ul>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSelectRole('child')}
                className="w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-[#18181B] hover:bg-[#222226] text-[#FAFAFA] border border-[#27272A] hover:border-[#8B5CF6]/50 transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Enter Children Portal (Tasks & IDs)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8B5CF6]" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#27272A] bg-[#0A0A0B] py-8 text-center text-xs text-[#71717A]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-[#FAFAFA]">
            FAMILYBRIDGE • Encrypted Family Vault built with Google Gemini
          </p>
          <p className="font-mono text-[11px]">
            Zero-knowledge privacy & security architecture • Prompt Wars Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
}