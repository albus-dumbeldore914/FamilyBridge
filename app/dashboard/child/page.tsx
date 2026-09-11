'use client';

/**
 * FAMILYBRIDGE Child Dashboard (Arjun & Ananya)
 * Themed with PostPilot Editorial SaaS aesthetic
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  Phone,
  HeartHandshake,
  FileText,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { DocumentCard } from '@/components/DocumentCard';
import { DocumentViewModal } from '@/components/DocumentViewModal';
import { useFamilyStore } from '@/lib/storage';
import { PermissionService } from '@/services/permissions';
import { VaultDocument } from '@/lib/types';

const emergencyContacts = [
  {
    name: 'Priya Kumar',
    relation: 'Mother',
    phone: '+91 98765 43211',
    note: 'Primary Guardian & Residence Head',
  },
  {
    name: 'Suresh Kumar',
    relation: 'Paternal Uncle (Chacha)',
    phone: '+91 98110 54321',
    note: 'Designated Emergency Family Trustee',
  },
  {
    name: 'Dr. Vivek Mehra',
    relation: 'Family Pediatrician / Physician',
    phone: '+91 98221 67890',
    note: 'Max Healthcare Noida (Direct Line)',
  },
  {
    name: 'Advocate Rajesh Singhal',
    relation: 'Family Legal Counsel',
    phone: '+91 98334 11223',
    note: 'Holds duplicate copy of registered will',
  },
];

export default function ChildDashboard() {
  const {
    documents,
    members,
    activeRole,
    isContinuityMode,
    switchRole,
    toggleContinuityMode,
    resetDemo,
  } = useFamilyStore();

  const [activeChildId, setActiveChildId] = useState<'member_arjun' | 'member_ananya'>('member_arjun');
  const [viewingDoc, setViewingDoc] = useState<VaultDocument | null>(null);

  const childAuthorizedDocs = PermissionService.filterDocumentsForUser(
    documents,
    'child',
    activeChildId,
    false
  );

  const activeChild =
    members.find((m) => m.id === activeChildId) ||
    members[2] || {
      id: activeChildId,
      name: activeChildId === 'member_arjun' ? 'Arjun Kumar' : 'Ananya Kumar',
      age: activeChildId === 'member_arjun' ? 16 : 10,
      relationship: activeChildId === 'member_arjun' ? 'son' : 'daughter',
      familyId: 'family_default',
      canAccessContinuity: false,
    };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#FAFAFA] flex flex-col selection:bg-[#8B5CF6] selection:text-white">
      <Navbar
        activeRole="child"
        isContinuityMode={isContinuityMode}
        onSwitchRole={switchRole}
        onToggleContinuity={toggleContinuityMode}
        onResetDemo={resetDemo}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-skiff-grid">
        {/* Child Header & Persona Switcher */}
        <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-6 sm:p-8 shadow-skiff flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-medium uppercase tracking-wider bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Student & Dependent Portal
              </span>
              <span className="text-xs text-[#71717A] font-mono">
                Logged in as: <strong className="text-[#FAFAFA]">{activeChild.name}</strong> ({activeChild.age} yrs)
              </span>
            </div>
            <h1 className="text-3xl font-bold text-[#FAFAFA] tracking-tight">My Documents & Records</h1>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 font-normal">
              Access your verified academic certificates, identity records, and family emergency contacts.
            </p>
          </div>

          <div className="flex items-center bg-[#18181B] p-1 rounded-xl border border-[#27272A] text-xs shadow-skiff">
            <span className="text-[#71717A] px-3 text-[11px] font-mono">Profile:</span>
            <button
              onClick={() => setActiveChildId('member_arjun')}
              className={`px-3 py-1 rounded-lg font-mono text-xs transition ${
                activeChildId === 'member_arjun'
                  ? 'bg-[#8B5CF6] text-white shadow-xs'
                  : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
              }`}
            >
              Arjun (16y)
            </button>
            <button
              onClick={() => setActiveChildId('member_ananya')}
              className={`px-3 py-1 rounded-lg font-mono text-xs transition ${
                activeChildId === 'member_ananya'
                  ? 'bg-[#8B5CF6] text-white shadow-xs'
                  : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
              }`}
            >
              Ananya (10y)
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-[#111113] border border-[#27272A] rounded-xl p-4 flex items-center justify-between gap-3 text-xs text-[#A1A1AA] shadow-skiff">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#8B5CF6] shrink-0" />
            <span className="font-normal">
              <strong className="text-[#FAFAFA]">Zero-Trust Cryptographic Guard:</strong> Sensitive family investments, bank accounts, and property deeds are securely locked from dependent profiles.
            </span>
          </div>
          <span className="text-[11px] font-mono bg-[#18181B] text-[#8B5CF6] border border-[#8B5CF6]/30 px-2.5 py-0.5 rounded shrink-0 hidden sm:inline">
            Role: Child (Read-Only)
          </span>
        </div>

        {/* My Documents Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#FAFAFA] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#8B5CF6]" />
              <span>Authorized Personal Documents ({childAuthorizedDocs.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {childAuthorizedDocs.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                userRole="child"
                onView={() => setViewingDoc(doc)}
              />
            ))}
          </div>
        </section>

        {/* Emergency Contacts Section */}
        <section className="space-y-4 pt-4 border-t border-[#27272A]">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#FF4405]" />
            <h2 className="text-xl font-bold text-[#FAFAFA]">Family Emergency Contacts</h2>
          </div>
          <p className="text-xs text-[#71717A] font-normal">
            Important verified contacts to reach in any emergency or family situation
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyContacts.map((contact, idx) => (
              <div
                key={idx}
                className="bg-[#111113] border border-[#27272A] rounded-xl p-5 space-y-2 hover:border-[#3F3F46] transition shadow-skiff"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#8B5CF6] font-semibold uppercase tracking-wider">
                    {contact.relation}
                  </span>
                  <HeartHandshake className="w-4 h-4 text-[#71717A]" />
                </div>
                <h3 className="font-semibold text-[#FAFAFA] text-base">{contact.name}</h3>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-xs font-mono text-[#FF4405] hover:underline block"
                >
                  {contact.phone}
                </a>
                <p className="text-[11px] text-[#71717A] leading-tight">{contact.note}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {viewingDoc && (
        <DocumentViewModal
          isOpen={Boolean(viewingDoc)}
          document={viewingDoc}
          userRole="child"
          onClose={() => setViewingDoc(null)}
        />
      )}
    </div>
  );
}
