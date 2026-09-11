'use client';

/**
 * FAMILYBRIDGE Action Plan Page ("WHAT DO I DO NOW?")
 * Themed with PostPilot Editorial SaaS aesthetic
 */

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { ActionPlanView } from '@/components/ActionPlanView';
import { useFamilyStore } from '@/lib/storage';
import { PermissionService } from '@/services/permissions';

export default function PlanPage() {
  const {
    documents,
    actions,
    activeRole,
    activeMemberId,
    isContinuityMode,
    updateActionStatus,
    switchRole,
    toggleContinuityMode,
    resetDemo,
  } = useFamilyStore();

  const authorizedDocs = PermissionService.filterDocumentsForUser(
    documents,
    activeRole,
    activeMemberId,
    isContinuityMode
  );

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#FAFAFA] flex flex-col selection:bg-[#FF4405] selection:text-white">
      <Navbar
        activeRole={activeRole}
        isContinuityMode={isContinuityMode}
        onSwitchRole={switchRole}
        onToggleContinuity={toggleContinuityMode}
        onResetDemo={resetDemo}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-skiff-grid">
        <ActionPlanView
          actions={actions}
          documents={authorizedDocs}
          userRole={activeRole}
          isContinuityMode={isContinuityMode}
          onUpdateStatus={updateActionStatus}
        />
      </main>
    </div>
  );
}
