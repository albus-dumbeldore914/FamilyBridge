'use client';

/**
 * FAMILYBRIDGE Mother / Guardian Dashboard
 * Themed with PostPilot Editorial SaaS aesthetic
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  FileText,
  Sparkles,
  Shield,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ActionPlanView } from '@/components/ActionPlanView';
import { DocumentCard } from '@/components/DocumentCard';
import { DocumentViewModal } from '@/components/DocumentViewModal';
import { VaultChatWidget } from '@/components/VaultChatWidget';
import { TellUsWhatHappenedModal } from '@/components/TellUsWhatHappenedModal';
import { useFamilyStore } from '@/lib/storage';
import { PermissionService } from '@/services/permissions';
import { VaultDocument } from '@/lib/types';

export default function GuardianDashboard() {
  const {
    documents,
    actions,
    activeRole,
    isContinuityMode,
    updateActionStatus,
    switchRole,
    toggleContinuityMode,
    resetDemo,
  } = useFamilyStore();

  const [activeTab, setActiveTab] = useState<'roadmap' | 'vault' | 'assistant'>('roadmap');
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<VaultDocument | null>(null);

  const authorizedDocs = PermissionService.filterDocumentsForUser(
    documents,
    'guardian',
    'member_priya',
    isContinuityMode
  );

  const insuranceDocs = authorizedDocs.filter((d) => d.category === 'insurance');
  const propertyDocs = authorizedDocs.filter((d) => d.category === 'property');
  const childrenDocs = authorizedDocs.filter(
    (d) => d.category === 'education' || d.category === 'identity'
  );

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#FAFAFA] flex flex-col selection:bg-[#FF4405] selection:text-white">
      <Navbar
        activeRole="guardian"
        isContinuityMode={isContinuityMode}
        onSwitchRole={switchRole}
        onToggleContinuity={toggleContinuityMode}
        onResetDemo={resetDemo}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-skiff-grid">
        {/* Banner: Normal Mode vs Continuity Mode */}
        {isContinuityMode ? (
          <div className="bg-[#111113] border border-[#FF4405]/50 rounded-2xl p-6 sm:p-8 shadow-skiff-lg space-y-4 relative">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider bg-[#FF4405] text-white px-3 py-1 rounded-md shadow-skiff flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  EMERGENCY CONTINUITY ACTIVATED
                </span>
                <span className="text-xs text-[#FF4405] font-mono font-medium">
                  [Authorized Guardian Access: Priya Kumar]
                </span>
              </div>
              <span className="text-xs text-[#71717A] font-mono">
                Primary member simulated unavailable • Elevated permissions granted
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#FAFAFA] tracking-tight">
                &ldquo;I&apos;ve organized the encrypted records available to you.&rdquo;
              </h1>
              <p className="text-sm text-[#A1A1AA] max-w-3xl leading-relaxed font-normal">
                Gemini has analyzed your family&apos;s critical obligations into an actionable roadmap so you don&apos;t have to decipher hundreds of pages of legal text alone.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setIsStoryModalOpen(true)}
                  className="px-5 py-2.5 rounded-lg bg-[#FF4405] hover:bg-[#EA3800] text-white font-semibold text-sm shadow-skiff flex items-center gap-2 transition transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>TELL US WHAT HAPPENED (AI Analysis) →</span>
                </button>
              </div>
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="bg-[#18181B] border border-[#27272A] p-3.5 rounded-xl">
                <span className="text-[#71717A] text-xs block font-mono">Insurance Records</span>
                <span className="text-lg font-bold text-[#FF4405]">{insuranceDocs.length} Verified</span>
              </div>
              <div className="bg-[#18181B] border border-[#27272A] p-3.5 rounded-xl">
                <span className="text-[#71717A] text-xs block font-mono">Property Record</span>
                <span className="text-lg font-bold text-[#3B82F6]">{propertyDocs.length} Joint Title</span>
              </div>
              <div className="bg-[#18181B] border border-[#27272A] p-3.5 rounded-xl">
                <span className="text-[#71717A] text-xs block font-mono">Children Records</span>
                <span className="text-lg font-bold text-[#8B5CF6]">{childrenDocs.length} Protected</span>
              </div>
              <div className="bg-[#18181B] border border-[#27272A] p-3.5 rounded-xl">
                <span className="text-[#71717A] text-xs block font-mono">Total Documents</span>
                <span className="text-lg font-bold text-[#FAFAFA]">{authorizedDocs.length} Accessible</span>
              </div>
              <div className="bg-[#18181B] border border-[#FF4405]/30 p-3.5 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-[#FF4405] text-xs block font-mono">Priority Actions</span>
                <span className="text-lg font-bold text-[#FF4405]">{actions.length} Recommended</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-6 shadow-skiff flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider bg-[#18181B] text-[#FF4405] border border-[#FF4405]/30 px-2.5 py-0.5 rounded">
                  Guardian Dashboard
                </span>
                <span className="text-xs text-[#71717A] font-mono">Priya Kumar (Mother)</span>
              </div>
              <h1 className="text-2xl font-bold text-[#FAFAFA] tracking-tight">Family Vault Overview</h1>
              <p className="text-xs text-[#A1A1AA] mt-1 font-normal">
                You have authorized access to joint family documents, child health floater, and emergency contacts.
              </p>
            </div>

            <button
              onClick={() => toggleContinuityMode(true)}
              className="px-4 py-2 rounded-lg bg-[#FF4405] hover:bg-[#EA3800] text-white font-semibold text-xs shadow-skiff flex items-center gap-2 transition"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Simulate Continuity Event</span>
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-[#27272A] gap-2">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`pb-3 px-3 text-xs font-medium transition border-b-2 flex items-center gap-2 font-mono ${
              activeTab === 'roadmap'
                ? 'border-[#FF4405] text-[#FAFAFA]'
                : 'border-transparent text-[#71717A] hover:text-[#FAFAFA]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FF4405]" />
            <span>Action Roadmap (&ldquo;What Do I Do Now?&rdquo;)</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`pb-3 px-3 text-xs font-medium transition border-b-2 flex items-center gap-2 font-mono ${
              activeTab === 'vault'
                ? 'border-[#FF4405] text-[#FAFAFA]'
                : 'border-transparent text-[#71717A] hover:text-[#FAFAFA]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Authorized Documents ({authorizedDocs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className={`pb-3 px-3 text-xs font-medium transition border-b-2 flex items-center gap-2 font-mono ${
              activeTab === 'assistant'
                ? 'border-[#FF4405] text-[#FAFAFA]'
                : 'border-transparent text-[#71717A] hover:text-[#FAFAFA]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Ask Family Vault (AI)</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'roadmap' && (
          <ActionPlanView
            actions={actions}
            documents={authorizedDocs}
            userRole="guardian"
            isContinuityMode={isContinuityMode}
            onUpdateStatus={updateActionStatus}
          />
        )}

        {activeTab === 'vault' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {authorizedDocs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  userRole="guardian"
                  onView={() => setViewingDoc(doc)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assistant' && (
          <VaultChatWidget
            documents={authorizedDocs}
            userRole="guardian"
            isContinuityMode={isContinuityMode}
            memberId="member_priya"
          />
        )}
      </main>

      <TellUsWhatHappenedModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
      />

      {viewingDoc && (
        <DocumentViewModal
          isOpen={Boolean(viewingDoc)}
          document={viewingDoc}
          userRole="guardian"
          onClose={() => setViewingDoc(null)}
        />
      )}
    </div>
  );
}
