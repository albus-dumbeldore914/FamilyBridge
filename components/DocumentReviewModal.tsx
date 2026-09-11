'use client';

/**
 * FAMILYBRIDGE Document Review & Permission Management Modal
 * Themed with PostPilot warm paper and teal accents
 */

import React, { useState } from 'react';
import { X, Shield, Check, Lock, Users } from 'lucide-react';
import { VaultDocument, FamilyMember, UserRole } from '@/lib/types';

interface DocumentReviewModalProps {
  document: VaultDocument | null;
  isOpen: boolean;
  members: FamilyMember[];
  onClose: () => void;
  onSave: (docId: string, updates: Partial<VaultDocument>) => void;
}

export const DocumentReviewModal: React.FC<DocumentReviewModalProps> = ({
  document,
  isOpen,
  members,
  onClose,
  onSave,
}) => {
  if (!isOpen || !document) return null;

  const [title, setTitle] = useState(document.title);
  const [nominee, setNominee] = useState(document.extractedData.nominee || '');
  const [coverageAmount, setCoverageAmount] = useState(document.extractedData.coverageAmount || '');
  const [policyNumber, setPolicyNumber] = useState(document.extractedData.policyNumber || '');
  const [minimumRole, setMinimumRole] = useState<UserRole>(document.visibility.minimumRole);
  const [allowedMemberIds, setAllowedMemberIds] = useState<string[]>(
    document.visibility.allowedMemberIds || []
  );

  const toggleMemberPermission = (memberId: string) => {
    if (allowedMemberIds.includes(memberId)) {
      setAllowedMemberIds(allowedMemberIds.filter((id) => id !== memberId));
    } else {
      setAllowedMemberIds([...allowedMemberIds, memberId]);
    }
  };

  const handleSave = () => {
    onSave(document.id, {
      title,
      visibility: {
        ...document.visibility,
        minimumRole,
        allowedMemberIds,
        isPublicToFamily: minimumRole === 'child',
      },
      extractedData: {
        ...document.extractedData,
        nominee,
        coverageAmount,
        policyNumber,
      },
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#111113] border border-[#27272A] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#27272A] bg-[#18181B]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FF4405]/10 text-[#FF4405] border border-[#FF4405]/20">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#FAFAFA]">Review & Permissions</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#71717A] hover:text-[#FAFAFA] rounded-lg hover:bg-[#27272A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs bg-[#0A0A0B]">
          <div>
            <label className="text-[#71717A] font-medium block mb-1">Document Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#18181B] border border-[#27272A] rounded-lg p-2.5 text-[#FAFAFA] font-normal text-xs focus:border-[#FF4405]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#FF4405] font-semibold block mb-1">Nominee / Beneficiary</label>
              <input
                type="text"
                value={nominee}
                onChange={(e) => setNominee(e.target.value)}
                className="w-full bg-[#18181B] border border-[#FF4405]/30 rounded-lg p-2.5 text-[#FF4405] font-semibold text-xs focus:border-[#FF4405]"
              />
            </div>
            <div>
              <label className="text-[#71717A] font-medium block mb-1">Policy / Document ID</label>
              <input
                type="text"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                className="w-full bg-[#18181B] border border-[#27272A] rounded-lg p-2.5 text-[#FAFAFA] font-mono text-xs focus:border-[#FF4405]"
              />
            </div>
          </div>

          <div>
            <label className="text-[#71717A] font-medium block mb-1">Coverage / Financial Value</label>
            <input
              type="text"
              value={coverageAmount}
              onChange={(e) => setCoverageAmount(e.target.value)}
              className="w-full bg-[#18181B] border border-[#27272A] rounded-lg p-2.5 text-[#FAFAFA] font-bold text-xs focus:border-[#FF4405]"
            />
          </div>

          {/* Granular RBAC Permissions */}
          <div className="pt-3 border-t border-[#27272A]">
            <label className="text-[#FAFAFA] font-semibold block mb-2 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#FF4405]" />
              <span>Document Access Permissions (RBAC)</span>
            </label>

            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <button
                type="button"
                onClick={() => setMinimumRole('guardian')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  minimumRole === 'guardian'
                    ? 'border-[#FF4405] bg-[#FF4405]/10 text-[#FF4405]'
                    : 'border-[#27272A] bg-[#18181B] text-[#71717A]'
                }`}
              >
                <Lock className="w-4 h-4 text-[#FF4405] shrink-0" />
                <div>
                  <div className="font-semibold text-[#FAFAFA]">Guardian Only</div>
                  <div className="text-[11px] text-[#71717A]">Parents & Trustees</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMinimumRole('child')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  minimumRole === 'child'
                    ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#A78BFA]'
                    : 'border-[#27272A] bg-[#18181B] text-[#71717A]'
                }`}
              >
                <Users className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                <div>
                  <div className="font-semibold text-[#FAFAFA]">Family Visible</div>
                  <div className="text-[11px] text-[#71717A]">Children can view</div>
                </div>
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[#71717A] font-medium text-[11px] block">
                Authorized Family Members:
              </span>
              <div className="space-y-1 bg-[#18181B] p-3 rounded-xl border border-[#27272A]">
                {members.map((member) => {
                  const isChecked = allowedMemberIds.includes(member.id);
                  return (
                    <label
                      key={member.id}
                      className="flex items-center justify-between p-1.5 hover:bg-[#27272A] rounded-lg cursor-pointer transition"
                    >
                      <span className="text-[#D4D4D8] font-normal capitalize">
                        {member.name} ({member.relationship})
                      </span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleMemberPermission(member.id)}
                        className="rounded border-[#27272A] bg-[#0A0A0B] text-[#FF4405] focus:ring-[#FF4405]"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#27272A] bg-[#18181B]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-[#71717A] hover:text-[#FAFAFA] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-[#FF4405] hover:bg-[#EA3800] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-lg shadow-[#FF4405]/20"
          >
            <Check className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
