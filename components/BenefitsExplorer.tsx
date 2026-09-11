'use client';

/**
 * FAMILYBRIDGE Government Benefits Explorer
 * Themed with PostPilot Editorial SaaS aesthetic
 */

import React from 'react';
import {
  Award,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { BENEFIT_SCHEMES_DATABASE } from '@/lib/benefitsData';
import { GovernmentBenefit } from '@/lib/types';

export const BenefitsExplorer: React.FC = () => {
  const schemes = BENEFIT_SCHEMES_DATABASE;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#FF4405] bg-[#FF4405]/15 px-3 py-1 rounded-full border border-[#FF4405]/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4405]" />
                Societal Benefit Bridge
              </span>
              <span className="text-[10px] font-mono text-[#D4D4D8] bg-[#18181B] border border-[#27272A] px-2.5 py-0.5 rounded-full">
                Ethical Matching (Non-claimant)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA] tracking-tight">
              Potentially Relevant Government & Social Benefits
            </h1>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-2xl leading-relaxed font-normal">
              Gemini analyzed your family’s employment records, children’s ages, and provident fund status to identify institutional support schemes.
            </p>
          </div>

          <div className="bg-[#18181B] border border-[#27272A] p-4 rounded-xl text-xs text-[#A1A1AA] max-w-xs shadow-sm">
            <div className="flex items-center gap-1.5 text-[#FF4405] font-mono font-semibold mb-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Transparency Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              FamilyBridge identifies <em className="text-[#FAFAFA]">potentially relevant</em> schemes. Deterministic approval is governed exclusively by designated government offices.
            </p>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-[#111113] border border-[#27272A] rounded-2xl p-6 hover:border-[#FF4405]/40 transition duration-200 shadow-lg flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] text-[#71717A] font-mono block">
                    {scheme.department}
                  </span>
                  <h3 className="font-semibold text-[#FAFAFA] text-base mt-0.5">
                    {scheme.title}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-mono font-semibold px-3 py-1 rounded-full border whitespace-nowrap ${
                    scheme.matchScore === 'High Match'
                      ? 'bg-[#FF4405]/15 text-[#FF4405] border-[#FF4405]/30'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}
                >
                  {scheme.matchScore}
                </span>
              </div>

              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                {scheme.description}
              </p>

              {/* Potential Support Banner */}
              <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 text-xs">
                <span className="text-[#71717A] block text-[11px] font-mono mb-0.5">
                  Potential Family Assistance:
                </span>
                <span className="font-bold text-[#FF4405] text-sm">
                  {scheme.potentialSupport}
                </span>
              </div>

              {/* Criteria Checklist */}
              <div className="text-xs space-y-1.5">
                <span className="font-semibold text-[#FAFAFA] block">Matched Criteria:</span>
                {scheme.criteriaSummary.map((crit, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2 text-[#D4D4D8]">
                    <ShieldCheck className="w-4 h-4 text-[#FF4405] shrink-0" />
                    <span>{crit}</span>
                  </div>
                ))}
              </div>

              {/* Required Documents */}
              <div className="text-xs space-y-1.5 pt-1">
                <span className="text-[#71717A] font-medium block">Required Proof:</span>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.requiredDocuments.map((doc, dIdx) => (
                    <span
                      key={dIdx}
                      className="bg-[#18181B] text-[#D4D4D8] px-2.5 py-1 rounded-lg text-[11px] border border-[#27272A]"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Disclaimer & Link */}
            <div className="pt-4 border-t border-[#27272A] space-y-2 text-[11px]">
              <p className="text-[#71717A] italic">{scheme.disclaimer}</p>
              {scheme.officialPortalUrl && (
                <a
                  href={scheme.officialPortalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#FF4405] hover:text-[#EA3800] font-mono font-medium transition"
                >
                  <span>Official Government Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
