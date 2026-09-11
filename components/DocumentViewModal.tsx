'use client';

/**
 * FAMILYBRIDGE Document Viewer & Reader Modal
 * Accessible to everyone (Father, Mother, Children)
 * Allows reading full personal letters, viewing legal/financial directives,
 * examining verified entity breakdowns, and reviewing key instructions.
 */

import React from 'react';
import {
  X,
  FileText,
  Heart,
  Shield,
  Home,
  DollarSign,
  GraduationCap,
  FileBadge,
  Car,
  Users,
  Lock,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  Image as ImageIcon,
  Eye,
} from 'lucide-react';
import { VaultDocument, DocumentCategory, UserRole } from '@/lib/types';

interface DocumentViewModalProps {
  document: VaultDocument | null;
  isOpen: boolean;
  userRole: UserRole;
  onClose: () => void;
}

export const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  document,
  isOpen,
  userRole,
  onClose,
}) => {
  if (!isOpen || !document) return null;

  const data = document.extractedData || {};

  const isPersonalLetter =
    document.documentType === 'personal_letter' ||
    document.category === 'other' ||
    document.title.toLowerCase().includes('letter');

  const getCategoryIcon = (category: DocumentCategory) => {
    if (isPersonalLetter) return <Heart className="w-5 h-5 text-[#EC4899]" />;
    switch (category) {
      case 'insurance':
        return <Shield className="w-5 h-5 text-[#FF4405]" />;
      case 'property':
        return <Home className="w-5 h-5 text-[#3B82F6]" />;
      case 'financial':
        return <DollarSign className="w-5 h-5 text-[#10B981]" />;
      case 'education':
        return <GraduationCap className="w-5 h-5 text-[#8B5CF6]" />;
      case 'identity':
        return <FileBadge className="w-5 h-5 text-[#06B6D4]" />;
      case 'vehicle':
        return <Car className="w-5 h-5 text-[#F59E0B]" />;
      default:
        return <FileText className="w-5 h-5 text-[#A1A1AA]" />;
    }
  };

  const getTargetBadge = () => {
    if (document.recipientTarget === 'wife') {
      return (
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-[#FF4405]/10 text-[#FF4405] border border-[#FF4405]/30 flex items-center gap-1.5">
          👩 Dedicated for Wife (Mother)
        </span>
      );
    }
    if (document.recipientTarget === 'children') {
      return (
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 flex items-center gap-1.5">
          🧒 Dedicated for Children
        </span>
      );
    }
    if (document.recipientTarget === 'family' || document.visibility?.isPublicToFamily) {
      return (
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" /> Shared with Family
        </span>
      );
    }
    return (
      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-[#18181B] text-[#71717A] border border-[#27272A] flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5" /> Private Record
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-view-title"
    >
      <div className="bg-[#111113] border border-[#27272A] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#18181B]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#111113] border border-[#27272A] shrink-0">
              {getCategoryIcon(document.category)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="doc-view-title" className="text-base sm:text-lg font-bold text-[#FAFAFA]">
                  {document.title}
                </h2>
              </div>
              <p className="text-xs text-[#71717A] font-mono mt-0.5">
                {document.fileName || 'Vault Document'} • Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#71717A] hover:text-[#FAFAFA] rounded-lg hover:bg-[#27272A] transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#27272A]">
            <div className="flex items-center gap-2">
              {getTargetBadge()}
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#18181B] text-[#A1A1AA] border border-[#27272A] uppercase">
                {document.category}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#22C55E] font-mono bg-[#22C55E]/10 border border-[#22C55E]/20 px-2.5 py-1 rounded">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified & Stored in Vault</span>
            </div>
          </div>

          {/* Uploaded File Attachment View / Download */}
          {document.fileData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#FF4405]">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Original Uploaded File ({document.fileName || 'Attached File'})</span>
                </div>

                <a
                  href={document.fileData}
                  download={document.fileName || 'vault-document'}
                  className="px-3 py-1 rounded bg-[#FF4405]/10 hover:bg-[#FF4405]/20 text-[#FF4405] border border-[#FF4405]/30 text-xs font-mono font-semibold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Save</span>
                </a>
              </div>

              {/* Render Image preview if image */}
              {document.fileType?.startsWith('image/') || document.fileData.startsWith('data:image/') ? (
                <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3 flex flex-col items-center justify-center overflow-hidden">
                  <img
                    src={document.fileData}
                    alt={document.title}
                    className="max-h-96 max-w-full rounded-lg object-contain border border-[#27272A]"
                  />
                  <span className="text-[11px] text-[#71717A] font-mono mt-2">{document.fileName} • {document.fileSize || ''}</span>
                </div>
              ) : document.fileType === 'application/pdf' || document.fileData.startsWith('data:application/pdf') ? (
                <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FF4405]/10 border border-[#FF4405]/20 flex items-center justify-center text-[#FF4405]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#FAFAFA]">{document.fileName}</p>
                    <p className="text-xs text-[#71717A] font-mono mt-0.5">
                      PDF Document • {document.fileSize || 'Attached'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={document.fileData}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-[#FF4405] hover:bg-[#EA3800] text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open PDF in New Tab</span>
                    </a>
                    <a
                      href={document.fileData}
                      download={document.fileName || 'vault-document.pdf'}
                      className="px-4 py-2 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-[#FAFAFA] text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#27272A] text-[#FAFAFA]">
                      <FileText className="w-5 h-5 text-[#FF4405]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#FAFAFA]">{document.fileName}</p>
                      <p className="text-[11px] text-[#71717A] font-mono">{document.fileType || 'File'} • {document.fileSize || ''}</p>
                    </div>
                  </div>
                  <a
                    href={document.fileData}
                    download={document.fileName || 'vault-file'}
                    className="px-3 py-1.5 rounded-lg bg-[#FF4405] hover:bg-[#EA3800] text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Primary Letter or Document Content */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#FF4405]">
              {isPersonalLetter ? <Heart className="w-3.5 h-3.5 text-[#EC4899]" /> : <FileText className="w-3.5 h-3.5" />}
              <span>{isPersonalLetter ? 'Full Letter & Words of Guidance' : 'Document Content & Summary'}</span>
            </div>

            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 text-sm text-[#FAFAFA] leading-relaxed whitespace-pre-line shadow-inner">
              {data.plainSummary || 'No detailed written content recorded.'}
            </div>
          </div>

          {/* Key Directives / Bullet Points */}
          {data.importantActions && data.importantActions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#FF4405]">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4405]" />
                <span>Important Actions & Directives</span>
              </div>

              <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 space-y-2">
                <ul className="space-y-2">
                  {data.importantActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#D4D4D8]">
                      <span className="w-5 h-5 rounded bg-[#FF4405]/10 text-[#FF4405] flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Extracted Metadata Grid */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#71717A] block">
              Document Entities & Verified Metadata
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.policyHolder && (
                <div className="bg-[#18181B] border border-[#27272A] p-3 rounded-lg text-xs">
                  <span className="text-[#71717A] block font-medium">Author / Primary Holder</span>
                  <span className="font-semibold text-[#FAFAFA] text-sm mt-0.5 block">{data.policyHolder}</span>
                </div>
              )}

              {data.nominee && (
                <div className="bg-[#18181B] border border-[#27272A] p-3 rounded-lg text-xs">
                  <span className="text-[#71717A] block font-medium">Designated Recipient / Nominee</span>
                  <span className="font-semibold text-[#FF4405] text-sm mt-0.5 block">{data.nominee}</span>
                </div>
              )}

              {data.policyNumber && (
                <div className="bg-[#18181B] border border-[#27272A] p-3 rounded-lg text-xs">
                  <span className="text-[#71717A] block font-medium">Policy / Ref ID</span>
                  <span className="font-mono text-[#FAFAFA] text-sm mt-0.5 block">{data.policyNumber}</span>
                </div>
              )}

              {data.institution && (
                <div className="bg-[#18181B] border border-[#27272A] p-3 rounded-lg text-xs">
                  <span className="text-[#71717A] block font-medium">Institution / Authority</span>
                  <span className="font-semibold text-[#FAFAFA] text-sm mt-0.5 block">{data.institution}</span>
                </div>
              )}

              {/* Show coverage/balance only to adult roles (primary & guardian) */}
              {data.coverageAmount && userRole !== 'child' && (
                <div className="bg-[#18181B] border border-[#27272A] p-3 rounded-lg text-xs">
                  <span className="text-[#71717A] block font-medium">Value / Sum Assured</span>
                  <span className="font-bold text-[#10B981] text-sm mt-0.5 block">{data.coverageAmount}</span>
                </div>
              )}

              {data.jointOwner && userRole !== 'child' && (
                <div className="bg-[#18181B] border border-[#27272A] p-3 rounded-lg text-xs">
                  <span className="text-[#71717A] block font-medium">Joint Co-Owner</span>
                  <span className="font-semibold text-[#3B82F6] text-sm mt-0.5 block">{data.jointOwner}</span>
                </div>
              )}

              {data.expiryDate && (
                <div className="bg-[#18181B] border border-[#27272A] p-3 rounded-lg text-xs">
                  <span className="text-[#71717A] block font-medium">Valid Till / Milestone</span>
                  <span className="font-mono text-[#FAFAFA] text-sm mt-0.5 block">{data.expiryDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#18181B] border-t border-[#27272A] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#71717A]">
            FAMILYBRIDGE Zero-Knowledge Protected Record
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-[#FAFAFA] text-xs font-semibold transition"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
