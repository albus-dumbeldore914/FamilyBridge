'use client';

/**
 * FAMILYBRIDGE "Ask the Family Vault" Assistant Page
 * Themed with PostPilot Editorial SaaS aesthetic
 */

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { VaultChatWidget } from '@/components/VaultChatWidget';
import { useFamilyStore } from '@/lib/storage';
import { PermissionService } from '@/services/permissions';

export default function AssistantPage() {
  const {
    documents,
    activeRole,
    activeMemberId,
    isContinuityMode,
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
    <div className="min-h-screen bg-[#0A0A0B] text-[#FAFAFA] bg-skiff-grid flex flex-col">
      <Navbar
        activeRole={activeRole}
        isContinuityMode={isContinuityMode}
        onSwitchRole={switchRole}
        onToggleContinuity={toggleContinuityMode}
        onResetDemo={resetDemo}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VaultChatWidget
          documents={authorizedDocs}
          userRole={activeRole}
          isContinuityMode={isContinuityMode}
          memberId={activeMemberId}
        />
      </main>
    </div>
  );
}
