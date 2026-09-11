'use client';

/**
 * FAMILYBRIDGE Primary Member (Father) Dashboard
 * Skiff.com Obsidian Aesthetic
 * Dedicated Father Portal: Tasks to be done, root vault administration, and RBAC permissions
 */

import React, { useState } from 'react';
import {
  Upload,
  ShieldCheck,
  Users,
  FolderOpen,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ListTodo,
  FileText,
  Lock,
  Heart,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { DocumentCard } from '@/components/DocumentCard';
import { DocumentUploadModal } from '@/components/DocumentUploadModal';
import { DocumentReviewModal } from '@/components/DocumentReviewModal';
import { DocumentViewModal } from '@/components/DocumentViewModal';
import { ContinuityVerificationModal } from '@/components/ContinuityVerificationModal';
import { TellUsWhatHappenedModal } from '@/components/TellUsWhatHappenedModal';
import { useFamilyStore } from '@/lib/storage';
import { VaultDocument } from '@/lib/types';

interface FatherTask {
  id: string;
  title: string;
  detail: string;
  urgency: 'high' | 'medium';
  completed: boolean;
  actionLabel: string;
  actionType: 'upload' | 'permissions' | 'simulation' | 'problem';
}

export default function PrimaryDashboard() {
  const {
    documents,
    members,
    activeRole,
    isContinuityMode,
    addDocument,
    updateDocument,
    switchRole,
    toggleContinuityMode,
    resetDemo,
  } = useFamilyStore();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<VaultDocument | null>(null);
  const [viewingDoc, setViewingDoc] = useState<VaultDocument | null>(null);
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const guardianMember =
    members.find((m) => m.relationship === 'mother' || m.canAccessContinuity) ??
    members[1] ??
    members[0] ?? {
      id: 'member_priya',
      name: 'Priya Kumar',
      relationship: 'mother',
      age: 45,
      familyId: 'family_default',
      canAccessContinuity: true,
    };

  // Father specific tasks that need to be done
  const [tasks, setTasks] = useState<FatherTask[]>([
    {
      id: 'ft_1',
      title: 'Register Nominee for SBI Fixed Deposit (₹34.5L)',
      detail: 'Submit Form DA-1 to SBI to register Priya Kumar as 100% nominee so accounts unfreeze without probate.',
      urgency: 'high',
      completed: false,
      actionLabel: 'Assign Nominee',
      actionType: 'permissions',
    },
    {
      id: 'ft_2',
      title: 'Upload Family Health Insurance Floater Policy',
      detail: 'Missing cashless hospitalization card. Upload Max Bupa / Star Health card to safeguard family.',
      urgency: 'high',
      completed: false,
      actionLabel: 'Upload Policy',
      actionType: 'upload',
    },
    {
      id: 'ft_3',
      title: 'Verify Property Deed Survivorship Clause',
      detail: 'Confirm Maple Heights Flat 402 deed has registered survivorship clause with Advocate Singhal.',
      urgency: 'medium',
      completed: true,
      actionLabel: 'Review Deed',
      actionType: 'permissions',
    },
    {
      id: 'ft_4',
      title: 'Designate Emergency Trustee & Share Offline Affirmation',
      detail: 'Inform Paternal Uncle Suresh Kumar about second-factor emergency verification duties.',
      urgency: 'medium',
      completed: false,
      actionLabel: 'Verify Trustee',
      actionType: 'simulation',
    },
    {
      id: 'ft_5',
      title: 'Test Family Continuity Readiness Simulation',
      detail: 'Simulate Father unavailability to verify Mother receives the 3-tier action roadmap instantly.',
      urgency: 'high',
      completed: false,
      actionLabel: 'Run Simulation',
      actionType: 'simulation',
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleTaskAction = (actionType: FatherTask['actionType']) => {
    if (actionType === 'upload') {
      setIsUploadOpen(true);
    } else if (actionType === 'simulation') {
      setIsSimulationModalOpen(true);
    } else if (actionType === 'problem') {
      setIsStoryModalOpen(true);
    } else {
      // open first document for review/permissions
      if (documents.length > 0) {
        setEditingDoc(documents[0]);
      }
    }
  };

  // Completeness score
  const hasLifeInsurance = documents.some((d) => d.category === 'insurance');
  const hasProperty = documents.some((d) => d.category === 'property');
  const hasPension = documents.some((d) => d.category === 'financial');
  const completenessPercent = Math.round(
    ((hasLifeInsurance ? 35 : 0) + (hasProperty ? 35 : 0) + (hasPension ? 30 : 0))
  );

  const completedTasksCount = tasks.filter((t) => t.completed).length;

  const filteredDocs =
    categoryFilter === 'all'
      ? documents
      : categoryFilter === 'other'
      ? documents.filter((d) => d.category === 'other' || d.documentType === 'personal_letter')
      : documents.filter((d) => d.category === categoryFilter);

  const categories: { label: string; value: string; count: number }[] = [
    { label: 'All Records', value: 'all', count: documents.length },
    { label: '💌 Letters & Notes', value: 'other', count: documents.filter((d) => d.category === 'other' || d.documentType === 'personal_letter').length },
    { label: 'Insurance', value: 'insurance', count: documents.filter((d) => d.category === 'insurance').length },
    { label: 'Property', value: 'property', count: documents.filter((d) => d.category === 'property').length },
    { label: 'Financial', value: 'financial', count: documents.filter((d) => d.category === 'financial').length },
    { label: 'Education', value: 'education', count: documents.filter((d) => d.category === 'education').length },
    { label: 'Identity', value: 'identity', count: documents.filter((d) => d.category === 'identity').length },
    { label: 'Vehicle', value: 'vehicle', count: documents.filter((d) => d.category === 'vehicle').length },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#FAFAFA] flex flex-col selection:bg-[#FF4405] selection:text-white">
      <Navbar
        activeRole={activeRole}
        isContinuityMode={isContinuityMode}
        onSwitchRole={switchRole}
        onToggleContinuity={toggleContinuityMode}
        onResetDemo={resetDemo}
        onTriggerContinuitySimulation={() => setIsSimulationModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-skiff-grid">
        {/* Top Header with Completeness Progress */}
        <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-6 sm:p-8 shadow-skiff flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium uppercase tracking-wider bg-[#18181B] text-[#FF4405] border border-[#FF4405]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF4405]" />
                Father / Primary Admin Portal
              </span>
              <span className="text-xs text-[#71717A] font-mono">Ramesh Kumar</span>
            </div>
            <h1 className="text-3xl font-bold text-[#FAFAFA] tracking-tight">
              Father&apos;s Command Center
            </h1>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-2xl font-normal leading-relaxed">
              As the Primary Admin, you manage vault completeness, assign nominees, and safeguard the family. Only you have root access to edit permissions and ingest sensitive legal assets.
            </p>
          </div>

          {/* Completeness Tracker Card */}
          <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-xl min-w-[280px] space-y-2 shrink-0 shadow-skiff">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#A1A1AA]">Vault Completeness</span>
              <span className="font-semibold text-[#FF4405]">{completenessPercent}% Complete</span>
            </div>
            <div className="w-full h-2.5 bg-[#111113] border border-[#27272A] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF4405] to-[#FFA07A] rounded-full transition-all duration-500"
                style={{ width: `${completenessPercent}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1.5 text-[10px] font-mono">
              <span className={`px-2 py-0.5 rounded ${hasLifeInsurance ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30' : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30'}`}>
                {hasLifeInsurance ? '✓ Life Insurance' : '✕ Life Insurance'}
              </span>
              <span className={`px-2 py-0.5 rounded ${hasProperty ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30' : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30'}`}>
                {hasProperty ? '✓ Property Deed' : '✕ Property Deed'}
              </span>
              <span className={`px-2 py-0.5 rounded ${hasPension ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30' : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30'}`}>
                {hasPension ? '✓ Pension' : '✕ Pension'}
              </span>
            </div>
          </div>
        </div>

        {/* ── FATHER'S TASKS TO BE DONE ── */}
        <section className="bg-[#111113] border border-[#FF4405]/30 rounded-2xl p-6 sm:p-7 shadow-skiff space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272A] pb-4>">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider bg-[#FF4405]/10 text-[#FF4405] border border-[#FF4405]/30 px-2.5 py-0.5 rounded flex items-center gap-1.5">
                  <ListTodo className="w-3.5 h-3.5" />
                  Father&apos;s Priority Checklist
                </span>
                <span className="text-xs text-[#A1A1AA] font-mono">
                  {completedTasksCount} of {tasks.length} Completed
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#FAFAFA] mt-1">
                Tasks That Must Be Completed By Father
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-[#FF4405] hover:bg-[#EA3800] text-white text-xs font-semibold shadow-skiff flex items-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Keep File or Letter for Family</span>
              </button>
              <button
                onClick={() => setIsStoryModalOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-[#18181B] hover:bg-[#222226] text-[#FAFAFA] border border-[#27272A] text-xs font-semibold shadow-skiff flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF4405]" />
                <span>Tell Gemini a Problem</span>
              </button>
              <button
                onClick={() => setIsSimulationModalOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-[#18181B] hover:bg-[#222226] text-[#FAFAFA] border border-[#FF4405]/40 text-xs font-semibold shadow-skiff flex items-center gap-1.5 transition"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#FF4405]" />
                <span>Test Simulation</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  task.completed
                    ? 'bg-[#18181B]/50 border-[#27272A] opacity-75'
                    : 'bg-[#18181B] border-[#27272A] hover:border-[#3F3F46]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className="flex items-start gap-2.5 text-left group"
                    >
                      <div
                        className={`w-5 h-5 rounded mt-0.5 border flex items-center justify-center transition shrink-0 ${
                          task.completed
                            ? 'bg-[#22C55E] border-[#22C55E]'
                            : 'border-[#3F3F46] group-hover:border-[#FF4405]'
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <h3
                          className={`text-sm font-semibold transition ${
                            task.completed ? 'line-through text-[#71717A]' : 'text-[#FAFAFA]'
                          }`}
                        >
                          {task.title}
                        </h3>
                      </div>
                    </button>

                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold shrink-0 ${
                        task.urgency === 'high'
                          ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30'
                          : 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/30'
                      }`}
                    >
                      {task.urgency === 'high' ? 'Urgent' : 'Medium'}
                    </span>
                  </div>

                  <p className="text-xs text-[#A1A1AA] pl-7 leading-relaxed">
                    {task.detail}
                  </p>
                </div>

                <div className="pl-7 pt-2 flex items-center justify-between border-t border-[#27272A]/60">
                  <span className="text-[11px] font-mono text-[#71717A]">
                    {task.completed ? '✓ Status: Completed' : '○ Status: Needs Action'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTaskAction(task.actionType)}
                    className="text-xs font-semibold text-[#FF4405] hover:text-[#EA3800] flex items-center gap-1 transition"
                  >
                    <span>{task.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Family Members Row */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FF4405]" />
              <h2 className="text-lg font-bold text-[#FAFAFA]">Family Members & Guardians</h2>
            </div>
            <span className="text-xs font-mono text-[#71717A]">{members.length} Registered Members</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-[#111113] border border-[#27272A] rounded-xl p-4 flex items-center justify-between shadow-skiff hover:border-[#3F3F46] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#18181B] border border-[#27272A] text-[#FF4405] flex items-center justify-center font-bold text-sm shadow-skiff uppercase">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#FAFAFA] text-sm">{member.name}</h3>
                    <p className="text-[11px] text-[#71717A] font-mono capitalize">
                      {member.relationship} • {member.age} yrs
                    </p>
                  </div>
                </div>

                {member.canAccessContinuity && (
                  <span
                    className="text-[10px] font-mono bg-[#18181B] text-[#FF4405] border border-[#FF4405]/30 px-2 py-0.5 rounded"
                    title="Authorized to access continuity mode"
                  >
                    Guardian
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Document Categories Filter & Vault Records */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-[#FF4405]" />
              <h2 className="text-lg font-bold text-[#FAFAFA]">
                Father&apos;s Encrypted Vault Records ({filteredDocs.length})
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-[#111113] p-1 rounded-xl border border-[#27272A] text-xs">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategoryFilter(cat.value)}
                  className={`px-3 py-1 rounded-lg font-mono text-xs transition ${
                    categoryFilter === cat.value
                      ? 'bg-[#FF4405] text-white font-semibold shadow-xs'
                      : 'text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#18181B]'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocs.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                userRole="primary"
                onEdit={() => setEditingDoc(doc)}
                onView={() => setViewingDoc(doc)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Modals */}
      {isUploadOpen && (
        <DocumentUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onApproved={addDocument}
        />
      )}

      {editingDoc && (
        <DocumentReviewModal
          isOpen={Boolean(editingDoc)}
          document={editingDoc}
          members={members}
          onClose={() => setEditingDoc(null)}
          onSave={updateDocument}
        />
      )}

      {viewingDoc && (
        <DocumentViewModal
          isOpen={Boolean(viewingDoc)}
          document={viewingDoc}
          userRole="primary"
          onClose={() => setViewingDoc(null)}
        />
      )}

      {isSimulationModalOpen && guardianMember && (
        <ContinuityVerificationModal
          isOpen={isSimulationModalOpen}
          trustedGuardian={guardianMember}
          onClose={() => setIsSimulationModalOpen(false)}
          onConfirmSimulation={() => {
            toggleContinuityMode(true);
            switchRole('guardian');
          }}
        />
      )}

      {isStoryModalOpen && (
        <TellUsWhatHappenedModal
          isOpen={isStoryModalOpen}
          onClose={() => setIsStoryModalOpen(false)}
        />
      )}
    </div>
  );
}