/**
 * FAMILYBRIDGE Automated Test Suite
 * Hackathon Evaluation Pillar 4: Testing & Robustness
 * Hackathon Evaluation Pillar 2: Security & Zero-Trust Verification
 */

import { describe, it, expect } from 'vitest';
import { PermissionService } from '../services/permissions';
import { GeminiService } from '../services/gemini';
import { INITIAL_DOCUMENTS, INITIAL_MEMBERS, INITIAL_ACTIONS } from '../lib/mockData';
import { VaultDocument } from '../lib/types';

describe('Security Pillar: Zero-Trust RBAC & Permission Gating', () => {
  it('prevents Child roles from accessing sensitive financial or life insurance documents', () => {
    const lifeInsuranceDoc = INITIAL_DOCUMENTS.find((d) => d.documentType === 'life_insurance')!;
    const propertyDoc = INITIAL_DOCUMENTS.find((d) => d.documentType === 'property_deed')!;
    const bankDoc = INITIAL_DOCUMENTS.find((d) => d.documentType === 'bank_statement')!;

    // Test access for child (Arjun Kumar)
    expect(PermissionService.canAccessDocument(lifeInsuranceDoc, 'child', 'member_arjun', false)).toBe(false);
    expect(PermissionService.canAccessDocument(propertyDoc, 'child', 'member_arjun', false)).toBe(false);
    expect(PermissionService.canAccessDocument(bankDoc, 'child', 'member_arjun', false)).toBe(false);
  });

  it('permits Child roles to access their verified educational and identity documents', () => {
    const schoolDoc = INITIAL_DOCUMENTS.find((d) => d.documentType === 'school_certificate')!;
    const birthDoc = INITIAL_DOCUMENTS.find((d) => d.documentType === 'birth_certificate')!;

    expect(PermissionService.canAccessDocument(schoolDoc, 'child', 'member_arjun', false)).toBe(true);
    expect(PermissionService.canAccessDocument(birthDoc, 'child', 'member_ananya', false)).toBe(true);
  });

  it('redacts sensitive financial and monetary values when sanitizing documents for child roles', () => {
    const healthDoc = INITIAL_DOCUMENTS.find((d) => d.documentType === 'health_insurance')!;
    const sanitized = PermissionService.sanitizeForRole(healthDoc, 'child');

    expect(sanitized.extractedData.coverageAmount).toBeUndefined();
    expect(sanitized.extractedData.accountNumber).toBeUndefined();
  });

  it('elevates Guardian access to all family records during simulated Continuity Mode', () => {
    const lifeInsuranceDoc = INITIAL_DOCUMENTS.find((d) => d.documentType === 'life_insurance')!;

    // In normal mode vs continuity mode
    const canAccessContinuity = PermissionService.canAccessDocument(
      lifeInsuranceDoc,
      'guardian',
      'member_priya',
      true // Continuity mode active
    );
    expect(canAccessContinuity).toBe(true);
  });
});

describe('Google Gemini AI Pipeline & Extraction', () => {
  it('correctly classifies a life insurance document filename and content snippet', async () => {
    const result = await GeminiService.classifyDocument(
      'Policy Bond HDFC Click 2 Protect Life Sum Assured Rs 1.5 Crore Nominee Priya Kumar',
      'hdfc_life_term_insurance.pdf'
    );
    expect(result.category).toBe('insurance');
    expect(result.documentType).toBe('life_insurance');
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('correctly classifies a property title deed', async () => {
    const result = await GeminiService.classifyDocument(
      'Sub-Registrar deed of apartment Maple Heights Sector 62 Noida joint ownership',
      'flat_402_sale_deed.pdf'
    );
    expect(result.category).toBe('property');
    expect(result.documentType).toBe('property_deed');
  });

  it('detects nominee and owner relationships between family members and documents', () => {
    const relations = GeminiService.detectDocumentRelationships(INITIAL_DOCUMENTS, INITIAL_MEMBERS);
    expect(relations.length).toBeGreaterThan(0);

    const nomineeLink = relations.find(
      (r) => r.from === 'doc_hdfc_life' && r.to === 'member_priya'
    );
    expect(nomineeLink).toBeDefined();
    expect(nomineeLink?.label).toContain('Nominee');
  });
});

describe('Killer Feature: "What Do I Do Now?" Continuity Roadmap', () => {
  it('flags life insurance claims and pension notifications as URGENT priorities', () => {
    const urgentItems = INITIAL_ACTIONS.filter((a) => a.priority === 'urgent');
    expect(urgentItems.length).toBeGreaterThanOrEqual(2);

    const claimAction = urgentItems.find((a) => a.title.toLowerCase().includes('insurance'));
    expect(claimAction).toBeDefined();
    expect(claimAction?.responsibleMemberName).toBe('Priya Kumar');
  });

  it('ensures every continuity action includes why it matters and required documents', () => {
    INITIAL_ACTIONS.forEach((action) => {
      expect(action.whyItMatters).toBeTruthy();
      expect(action.requiredDocuments.length).toBeGreaterThan(0);
      expect(action.responsibleMemberId).toBeTruthy();
    });
  });
});
