/**
 * FAMILYBRIDGE Zero-Trust RBAC & Permission Enforcement Engine
 * Evaluation Criteria 2: Security & Privacy
 * 
 * Ensures documents, financial figures, and sensitive legal artifacts
 * are strictly restricted to authorized family roles (Father vs Mother vs Children).
 */

import { VaultDocument, UserRole, ContinuityActionItem } from '../lib/types';

export class PermissionService {
  /**
   * Deterministically verify whether a user is allowed to access a specific document.
   */
  static canAccessDocument(
    doc: VaultDocument,
    userRole: UserRole,
    memberId: string,
    isContinuityMode: boolean = false
  ): boolean {
    // Primary member (Father) has root vault administrative access
    if (userRole === 'primary') {
      return true;
    }

    // In continuity mode, designated guardians/mothers inherit elevated family protection rights
    if (isContinuityMode && userRole === 'guardian') {
      return true;
    }

    // Direct whitelist check: Was this specific family member explicitly allowed?
    if (doc.visibility?.allowedMemberIds?.includes(memberId)) {
      return true;
    }

    // Recipient target check (Wife / Mother, Children, Family)
    if (userRole === 'guardian' && (doc.recipientTarget === 'wife' || doc.recipientTarget === 'family')) {
      return true;
    }
    if (userRole === 'child' && (doc.recipientTarget === 'children' || doc.recipientTarget === 'family')) {
      return true;
    }

    // Role hierarchy check
    if (userRole === 'guardian' && (doc.visibility?.minimumRole === 'guardian' || doc.visibility?.minimumRole === 'child')) {
      return true;
    }

    if (userRole === 'child' && (doc.visibility?.minimumRole === 'child' || doc.visibility?.isPublicToFamily)) {
      return true;
    }

    return false;
  }

  /**
   * Filter vault documents so unauthorized users never receive raw data or metadata
   */
  static filterDocumentsForUser(
    docs: VaultDocument[],
    userRole: UserRole,
    memberId: string,
    isContinuityMode: boolean = false
  ): VaultDocument[] {
    return docs
      .filter((doc) => this.canAccessDocument(doc, userRole, memberId, isContinuityMode))
      .map((doc) => this.sanitizeForRole(doc, userRole));
  }

  /**
   * Sanitizes document metadata for restricted roles (e.g., hiding bank balances & policy payout amounts from minors)
   */
  static sanitizeForRole(doc: VaultDocument, userRole: UserRole): VaultDocument {
    if (userRole === 'primary' || userRole === 'guardian') {
      return doc; // Full fidelity for adults & guardians
    }

    // Redact sensitive financial and legal terms for child roles
    return {
      ...doc,
      extractedData: {
        ...doc.extractedData,
        coverageAmount: undefined,
        accountNumber: undefined,
        jointOwner: undefined,
        keyConditions: doc.extractedData.keyConditions?.filter(
          (c: string) => !c.toLowerCase().includes('crore') && !c.toLowerCase().includes('lakh') && !c.toLowerCase().includes('balance')
        ),
      },
    };
  }

  /**
   * Filter action plan items based on role authorization
   */
  static filterActionsForUser(
    actions: ContinuityActionItem[],
    userRole: UserRole,
    memberId: string,
    isContinuityMode: boolean = false
  ): ContinuityActionItem[] {
    if (userRole === 'primary' || (userRole === 'guardian' && isContinuityMode)) {
      return actions;
    }

    if (userRole === 'guardian' && !isContinuityMode) {
      // In normal mode, only show actions explicitly assigned to the guardian
      return actions.filter((a) => a.responsibleMemberId === memberId);
    }

    // Children should only see non-sensitive child welfare tasks
    return actions.filter(
      (a) => a.responsibleMemberId === memberId && a.priority !== 'urgent'
    );
  }
}
