"use client";

/**
 * FAMILYBRIDGE Document Card Component
 * Miro / Skiff Obsidian theme
 * Displays records, policies, personal letters, property deeds, and children's certificates
 */

import React, { useState } from "react";
import {
  Shield,
  Home,
  DollarSign,
  GraduationCap,
  FileBadge,
  FileText,
  Car,
  CheckCircle,
  Lock,
  Users,
  Edit2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Heart,
  Mail,
  Eye,
} from "lucide-react";
import { VaultDocument, DocumentCategory, UserRole } from "@/lib/types";

interface DocumentCardProps {
  document: VaultDocument;
  userRole: UserRole;
  onEdit?: (doc: VaultDocument) => void;
  onExplain?: (doc: VaultDocument) => void;
  onView?: (doc: VaultDocument) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  userRole,
  onEdit,
  onExplain,
  onView,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState<string | null>(
    document.extractedData.plainSummary || null
  );

  const isPersonalLetter =
    document.documentType === "personal_letter" ||
    document.category === "other" ||
    document.title.toLowerCase().includes("letter");

  const getCategoryIcon = (category: DocumentCategory) => {
    if (isPersonalLetter) {
      return <Heart className="w-4 h-4 text-[#EC4899]" />;
    }
    switch (category) {
      case "insurance":
        return <Shield className="w-4 h-4 text-[#FF4405]" />;
      case "property":
        return <Home className="w-4 h-4 text-[#3B82F6]" />;
      case "financial":
        return <DollarSign className="w-4 h-4 text-[#10B981]" />;
      case "education":
        return <GraduationCap className="w-4 h-4 text-[#8B5CF6]" />;
      case "identity":
        return <FileBadge className="w-4 h-4 text-[#06B6D4]" />;
      case "vehicle":
        return <Car className="w-4 h-4 text-[#F59E0B]" />;
      default:
        return <FileText className="w-4 h-4 text-[#A1A1AA]" />;
    }
  };

  const getCategoryBadgeClass = (category: DocumentCategory) => {
    if (isPersonalLetter) {
      return "bg-[#EC4899]/10 text-[#EC4899] border-[#EC4899]/30";
    }
    switch (category) {
      case "insurance":
        return "bg-[#FF4405]/10 text-[#FF4405] border-[#FF4405]/30";
      case "property":
        return "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30";
      case "financial":
        return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30";
      case "education":
        return "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30";
      case "identity":
        return "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30";
      case "vehicle":
        return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30";
      default:
        return "bg-[#18181B] text-[#A1A1AA] border-[#27272A]";
    }
  };

  const handleExplain = async () => {
    if (onExplain) {
      onExplain(document);
      return;
    }
    if (simplifiedText) {
      setIsExpanded(true);
      return;
    }
    setIsExplaining(true);
    try {
      const res = await fetch("/api/gemini/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document }),
      });
      const data = await res.json();
      if (data.explanation) {
        setSimplifiedText(data.explanation);
        setIsExpanded(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExplaining(false);
    }
  };

  const data = document.extractedData;
  const isForWife =
    data.nominee?.toLowerCase().includes("wife") ||
    data.nominee?.toLowerCase().includes("priya") ||
    document.title.toLowerCase().includes("priya");
  const isForChildren =
    data.nominee?.toLowerCase().includes("arjun") ||
    data.nominee?.toLowerCase().includes("ananya") ||
    data.nominee?.toLowerCase().includes("child") ||
    document.category === "education";

  return (
    <div className="bg-[#111113] border border-[#27272A] rounded-xl p-5 hover:border-[#3F3F46] transition-all duration-200 shadow-skiff hover:shadow-skiff-md flex flex-col justify-between group">
      <div>
        {/* Top bar: Category badge, AI confidence & Permissions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-xs font-mono font-medium px-2.5 py-0.5 rounded border flex items-center gap-1.5 ${getCategoryBadgeClass(
              document.category
            )}`}
          >
            {getCategoryIcon(document.category)}
            <span className="capitalize">
              {isPersonalLetter ? "Personal Letter" : document.category}
            </span>
          </span>

          <div className="flex items-center gap-2">
            {/* Recipient / Target Pill */}
            {isForWife ? (
              <span className="text-[11px] font-mono text-[#FF4405] bg-[#FF4405]/10 border border-[#FF4405]/30 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                👩 For Wife
              </span>
            ) : isForChildren ? (
              <span className="text-[11px] font-mono text-[#8B5CF6] bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                🧒 For Children
              </span>
            ) : document.visibility.minimumRole === "child" ? (
              <span className="text-[11px] font-mono text-[#A1A1AA] bg-[#18181B] px-2 py-0.5 rounded flex items-center gap-1 font-medium border border-[#27272A]">
                <Users className="w-3 h-3 text-[#3B82F6]" /> Family
              </span>
            ) : (
              <span className="text-[11px] font-mono text-[#71717A] bg-[#18181B] border border-[#27272A] px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                <Lock className="w-3 h-3 text-[#71717A]" /> Private
              </span>
            )}

            {/* Confidence indicator */}
            <span
              className="text-[11px] font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-2 py-0.5 rounded flex items-center gap-1 font-medium"
              title={`Gemini Confidence: ${(data.confidenceScore * 100).toFixed(0)}%`}
            >
              <CheckCircle className="w-3 h-3 text-[#10B981]" />
              {(data.confidenceScore * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Title & Institution */}
        <h3 className="font-bold text-[#FAFAFA] text-base tracking-tight mb-1 group-hover:text-[#FF4405] transition-colors">
          {document.title}
        </h3>
        {data.institution && (
          <p className="text-xs text-[#A1A1AA] mb-3 font-medium">
            {data.institution}
          </p>
        )}

        {/* Personal Letter Excerpt Highlight */}
        {isPersonalLetter && data.plainSummary && (
          <div className="bg-[#18181B] border border-[#EC4899]/25 p-3 rounded-lg text-xs text-[#E4E4E7] leading-relaxed mb-3 italic">
            &ldquo;{data.plainSummary.length > 170 ? data.plainSummary.slice(0, 170) + '...' : data.plainSummary}&rdquo;
          </div>
        )}

        {/* Key Extracted Entities Grid */}
        <div className="bg-[#18181B] rounded-lg p-3 border border-[#27272A] space-y-2 mb-3 text-xs">
          {data.policyNumber && (
            <div className="flex justify-between items-center text-[#A1A1AA]">
              <span className="font-medium">Ref / ID #</span>
              <span className="font-mono text-[#FAFAFA] font-semibold">{data.policyNumber}</span>
            </div>
          )}

          {data.policyHolder && (
            <div className="flex justify-between items-center text-[#A1A1AA]">
              <span className="font-medium">Primary Author / Holder</span>
              <span className="font-semibold text-[#FAFAFA]">{data.policyHolder}</span>
            </div>
          )}

          {data.nominee && (
            <div className="flex justify-between items-center text-[#A1A1AA]">
              <span className="font-medium">Designated For</span>
              <span className="font-medium text-[#FF4405] bg-[#FF4405]/10 px-2 py-0.5 rounded border border-[#FF4405]/30">
                {data.nominee}
              </span>
            </div>
          )}

          {data.jointOwner && (
            <div className="flex justify-between items-center text-[#A1A1AA]">
              <span className="font-medium">Joint Owner</span>
              <span className="font-medium text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded border border-[#3B82F6]/30">
                {data.jointOwner}
              </span>
            </div>
          )}

          {data.studentName && (
            <div className="flex justify-between items-center text-[#A1A1AA]">
              <span className="font-medium">Student</span>
              <span className="font-semibold text-[#8B5CF6]">{data.studentName}</span>
            </div>
          )}

          {data.coverageAmount && (
            <div className="flex justify-between items-center text-[#FAFAFA] pt-1.5 border-t border-[#27272A]">
              <span className="text-[#A1A1AA] font-medium">Value / Coverage</span>
              <span className="font-bold text-[#FAFAFA] text-sm">{data.coverageAmount}</span>
            </div>
          )}

          {data.expiryDate && (
            <div className="flex justify-between items-center text-[#A1A1AA]">
              <span className="font-medium">Valid Till / Renewal</span>
              <span className="text-[#FAFAFA] font-mono">{data.expiryDate}</span>
            </div>
          )}
        </div>

        {/* Simplified / Expandable Summary */}
        {isExpanded && simplifiedText && (
          <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-3 text-xs text-[#FAFAFA] mb-3 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 text-[#FF4405] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isPersonalLetter ? 'Full Letter & Message:' : 'Gemini Plain Language Explanation:'}</span>
            </div>
            <p className="leading-relaxed text-[#A1A1AA] font-normal whitespace-pre-line">{simplifiedText}</p>

            {data.importantActions && data.importantActions.length > 0 && (
              <div className="pt-2 border-t border-[#27272A]">
                <span className="font-semibold text-[#FF4405] block mb-1">Key Directives & Next Steps:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[#A1A1AA] font-normal">
                  {data.importantActions.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#27272A] gap-2">
        <div className="flex items-center gap-2">
          {onView && (
            <button
              onClick={() => onView(document)}
              className="text-xs px-2.5 py-1 rounded bg-[#FF4405]/10 hover:bg-[#FF4405]/20 text-[#FF4405] border border-[#FF4405]/30 font-semibold flex items-center gap-1.5 transition"
              title="Open and view full record"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View</span>
            </button>
          )}

          <button
            onClick={handleExplain}
            disabled={isExplaining}
            className="text-xs text-[#A1A1AA] hover:text-[#FAFAFA] flex items-center gap-1 font-medium transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF4405]" />
            <span>
              {isExplaining
                ? "Reading..."
                : isExpanded
                ? "Hide Details"
                : isPersonalLetter
                ? "Quick Preview"
                : "Plain Summary"}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {userRole === "primary" && onEdit && (
            <button
              onClick={() => onEdit(document)}
              className="p-1.5 text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#18181B] rounded-md transition"
              title="Review and edit permissions"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#18181B] rounded-md transition"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};