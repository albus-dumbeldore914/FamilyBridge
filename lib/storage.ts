"use client";

/**
 * FAMILYBRIDGE Reactive Client Storage & State Manager
 * Now syncs with PostgreSQL database via API routes
 */

import { useState, useEffect, useCallback } from "react";
import {
  VaultDocument,
  FamilyMember,
  ContinuityActionItem,
  UserRole,
  ActionStatus,
  UserProblemReport,
} from "./types";

const STORAGE_KEYS = {
  ACTIVE_ROLE: "familybridge_active_role_v1",
  CONTINUITY_MODE: "familybridge_continuity_mode_v1",
  ACTIVE_MEMBER_ID: "familybridge_active_member_id_v1",
};

export function useFamilyStore() {
  const [isClient, setIsClient] = useState(false);
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [actions, setActions] = useState<ContinuityActionItem[]>([]);
  const [problemReports, setProblemReports] = useState<UserProblemReport[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole>("primary");
  const [activeMemberId, setActiveMemberId] = useState<string>("");
  const [isContinuityMode, setIsContinuityMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch documents from database
  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (data.success && data.documents) {
        setDocuments(data.documents);
      }
    } catch (e) {
      console.warn("Failed to fetch documents from DB:", e);
    }
  }, []);

  // Fetch members from database
  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      if (data.success && data.members) {
        setMembers(data.members);
      }
    } catch (e) {
      console.warn("Failed to fetch members from DB:", e);
    }
  }, []);

  // Initialize: fetch from DB + restore role from localStorage
  useEffect(() => {
    setIsClient(true);

    const init = async () => {
      try {
        const storedRole = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) as UserRole | null;
        const storedMemberId = localStorage.getItem(STORAGE_KEYS.ACTIVE_MEMBER_ID);
        const storedContinuity = localStorage.getItem(STORAGE_KEYS.CONTINUITY_MODE);

        if (storedRole) setActiveRole(storedRole);
        if (storedMemberId) setActiveMemberId(storedMemberId);
        if (storedContinuity) setIsContinuityMode(storedContinuity === "true");
      } catch (e) {
        console.warn("LocalStorage error:", e);
      }

      // Fetch data from database
      await Promise.all([fetchDocuments(), fetchMembers()]);
      setIsLoading(false);
    };

    init();
  }, [fetchDocuments, fetchMembers]);

  // Add document — save to DB then update local state
  const addDocument = async (doc: VaultDocument) => {
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      });
      const data = await res.json();

      if (data.success && data.document) {
        // Use the DB-returned document (has server-generated ID)
        setDocuments((prev) => [data.document, ...prev]);
        return data.document;
      } else {
        console.error("Failed to save document:", data.error);
        // Still add locally as fallback
        setDocuments((prev) => [doc, ...prev]);
        return doc;
      }
    } catch (e) {
      console.warn("DB save failed, adding locally:", e);
      setDocuments((prev) => [doc, ...prev]);
      return doc;
    }
  };

  // Update document locally (DB update can be added later)
  const updateDocument = (docId: string, updates: Partial<VaultDocument>) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, ...updates } : d))
    );
  };

  // Delete document
  const deleteDocument = async (docId: string) => {
    try {
      await fetch(`/api/documents?id=${docId}`, { method: "DELETE" });
    } catch (e) {
      console.warn("DB delete failed:", e);
    }
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  // Save actions locally
  const saveActions = (newActions: ContinuityActionItem[]) => {
    setActions(newActions);
  };

  // Add custom user problem report & automatically merge its action plan
  const addProblemReport = (report: UserProblemReport) => {
    setProblemReports((prev) => [report, ...prev]);
    if (report.actionPlan && report.actionPlan.length > 0) {
      const existingIds = new Set(actions.map((a) => a.id));
      const newItems = report.actionPlan.filter((a) => !existingIds.has(a.id));
      setActions((prev) => [...newItems, ...prev]);
    }
  };

  // Update status of problem report
  const updateProblemStatus = (id: string, status: "active" | "in_progress" | "resolved") => {
    setProblemReports((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  // Delete problem report
  const deleteProblemReport = (id: string) => {
    setProblemReports((prev) => prev.filter((p) => p.id !== id));
  };

  // Toggle action item status
  const updateActionStatus = (actionId: string, newStatus: ActionStatus) => {
    setActions((prev) =>
      prev.map((a) =>
        a.id === actionId
          ? {
              ...a,
              status: newStatus,
              completedAt: newStatus === "completed" ? new Date().toISOString() : undefined,
            }
          : a
      )
    );
  };

  // Switch persona role
  const switchRole = (role: UserRole, memberId?: string) => {
    setActiveRole(role);
    let targetMemberId = memberId || "";
    if (!targetMemberId) {
      // Try to find matching member from DB
      const matchingMember = members.find((m) => {
        if (role === "primary") return m.relationship === "father";
        if (role === "guardian") return m.relationship === "mother";
        return m.relationship === "son" || m.relationship === "daughter";
      });
      targetMemberId = matchingMember?.id || "";
    }
    setActiveMemberId(targetMemberId);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_MEMBER_ID, targetMemberId);
    }
  };

  // Toggle Continuity Mode
  const toggleContinuityMode = (enabled: boolean) => {
    setIsContinuityMode(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.CONTINUITY_MODE, enabled ? "true" : "false");
    }
  };

  // Reset — clear localStorage and refetch from DB
  const resetDemo = async () => {
    setActions([]);
    setProblemReports([]);
    setActiveRole("primary");
    setActiveMemberId("");
    setIsContinuityMode(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ROLE);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_MEMBER_ID);
      localStorage.removeItem(STORAGE_KEYS.CONTINUITY_MODE);
    }
    // Refetch from DB
    await Promise.all([fetchDocuments(), fetchMembers()]);
  };

  return {
    isClient,
    isLoading,
    documents,
    members,
    actions,
    problemReports,
    activeRole,
    activeMemberId,
    isContinuityMode,
    addDocument,
    updateDocument,
    deleteDocument,
    updateActionStatus,
    saveActions,
    addProblemReport,
    updateProblemStatus,
    deleteProblemReport,
    switchRole,
    toggleContinuityMode,
    resetDemo,
    refetchDocuments: fetchDocuments,
    refetchMembers: fetchMembers,
  };
}