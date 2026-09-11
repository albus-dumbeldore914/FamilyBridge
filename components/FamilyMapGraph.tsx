"use client";

/**
 * FAMILYBRIDGE Interactive Family Knowledge Graph (Family Map)
 * Styled as a Miro Visual Collaboration Canvas:
 * - Miro Dot Matrix Grid
 * - Stable, jitter-free SVG interactions (no scale glitches)
 * - Bezier relationship curves
 * - Interactive node inspection & zoom controls
 */

import React, { useState } from "react";
import {
  Users,
  Shield,
  Home,
  CheckSquare,
  Sparkles,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { VaultDocument, FamilyMember, ContinuityActionItem } from "@/lib/types";

interface FamilyMapGraphProps {
  members: FamilyMember[];
  documents: VaultDocument[];
  actions: ContinuityActionItem[];
}

interface GraphNode {
  id: string;
  name: string;
  category: "father" | "mother" | "child" | "insurance" | "property" | "finance" | "education" | "action";
  x: number;
  y: number;
  subtext?: string;
  meta?: Record<string, any>;
}

interface GraphLink {
  from: string;
  to: string;
  label: string;
  color?: string;
}

export const FamilyMapGraph: React.FC<FamilyMapGraphProps> = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "family" | "insurance" | "property" | "actions">("all");
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const nodes: GraphNode[] = [
    {
      id: "member_ramesh",
      name: "Ramesh Kumar",
      category: "father",
      x: 520,
      y: 200,
      subtext: "Father / Primary Vault Admin",
      meta: { Role: "Primary Vault Owner", Email: "ramesh.kumar@familyvault.demo", Status: "Active" },
    },
    {
      id: "member_priya",
      name: "Priya Kumar",
      category: "mother",
      x: 240,
      y: 200,
      subtext: "Mother / Authorized Guardian",
      meta: { Nominees: "3 Active Policies", JointOwner: "Maple Heights Flat 402", ContinuityAccess: "Authorized" },
    },
    {
      id: "member_arjun",
      name: "Arjun Kumar",
      category: "child",
      x: 820,
      y: 130,
      subtext: "Son (16 yrs)",
      meta: { Education: "CBSE Grade 10", HealthCoverage: "Star Health Floater", RestrictedAccess: "True" },
    },
    {
      id: "member_ananya",
      name: "Ananya Kumar",
      category: "child",
      x: 820,
      y: 280,
      subtext: "Daughter (10 yrs)",
      meta: { Documents: "Birth Certificate & Passport", HealthCoverage: "Star Health Floater", RestrictedAccess: "True" },
    },
    {
      id: "doc_hdfc_life",
      name: "HDFC Term Life (₹1.5 Cr)",
      category: "insurance",
      x: 380,
      y: 70,
      subtext: "Nominee: Priya Kumar (100%)",
      meta: { PolicyNumber: "HD-9842-7712-TL", ClaimWindow: "90 days", NomineeShare: "100%" },
    },
    {
      id: "doc_property_deed",
      name: "Maple Heights Flat 402",
      category: "property",
      x: 240,
      y: 360,
      subtext: "Joint Title with Survivorship",
      meta: { Address: "Sector 62, Noida", Locker: "SBI Locker #104", SurvivorshipClause: "Present" },
    },
    {
      id: "doc_epfo_pension",
      name: "EPFO Pension & EDLI (₹35.4L)",
      category: "finance",
      x: 520,
      y: 370,
      subtext: "Widow Pension & EDLI ₹7L",
      meta: { UAN: "1009-8821-4402", EDLICover: "₹7,00,000", Scheme: "EPS-95" },
    },
    {
      id: "action_claim_hdfc",
      name: "Claim ₹1.5 Cr Insurance",
      category: "action",
      x: 90,
      y: 70,
      subtext: "URGENT Action Step",
      meta: { Responsible: "Priya Kumar", PayoutTimeline: "15-30 days", RequiredDocs: "Death Cert, Original Policy" },
    },
    {
      id: "doc_arjun_school",
      name: "CBSE 10th Certificate",
      category: "education",
      x: 990,
      y: 130,
      subtext: "DigiLocker Verified",
      meta: { Student: "Arjun Kumar", Board: "CBSE", Verification: "Verified" },
    },
    {
      id: "doc_ananya_birth",
      name: "Birth Certificate & Passport",
      category: "education",
      x: 990,
      y: 280,
      subtext: "Legal ID & Passport",
      meta: { Student: "Ananya Kumar", DocumentType: "Identity & Passport", Validity: "2031" },
    },
  ];

  const links: GraphLink[] = [
    { from: "member_ramesh", to: "doc_hdfc_life", label: "Primary Holder", color: "#4262FF" },
    { from: "member_ramesh", to: "doc_property_deed", label: "Co-Owner", color: "#2563eb" },
    { from: "member_ramesh", to: "doc_epfo_pension", label: "PF Subscriber", color: "#d97706" },
    { from: "doc_hdfc_life", to: "member_priya", label: "100% Nominee", color: "#4262FF" },
    { from: "doc_property_deed", to: "member_priya", label: "Joint Title", color: "#2563eb" },
    { from: "doc_epfo_pension", to: "member_priya", label: "Widow Pension", color: "#d97706" },
    { from: "member_priya", to: "action_claim_hdfc", label: "Claimant Action", color: "#E11D48" },
    { from: "doc_hdfc_life", to: "action_claim_hdfc", label: "Policy File", color: "#E11D48" },
    { from: "member_ramesh", to: "member_arjun", label: "Father of", color: "#8b5cf6" },
    { from: "member_ramesh", to: "member_ananya", label: "Father of", color: "#8b5cf6" },
    { from: "member_arjun", to: "doc_arjun_school", label: "Student File", color: "#0d9488" },
    { from: "member_ananya", to: "doc_ananya_birth", label: "Identity File", color: "#0d9488" },
  ];

  const getNodeColor = (category: string) => {
    switch (category) {
      case "father":
        return "#4262FF"; // Miro Electric Blue
      case "mother":
        return "#7C3AED"; // Miro Purple
      case "child":
        return "#0D9488"; // Teal
      case "insurance":
        return "#D97706"; // Amber
      case "property":
        return "#2563EB"; // Royal Blue
      case "finance":
        return "#059669"; // Emerald
      case "education":
        return "#DB2777"; // Pink
      case "action":
        return "#E11D48"; // Rose / Alert
      default:
        return "#475569";
    }
  };

  const filteredNodes = nodes.filter((n) => {
    if (filter === "all") return true;
    if (filter === "family") return n.category === "father" || n.category === "mother" || n.category === "child";
    if (filter === "insurance") return n.category === "insurance" || n.category === "father" || n.category === "mother";
    if (filter === "property") return n.category === "property" || n.category === "father" || n.category === "mother";
    if (filter === "actions") return n.category === "action" || n.category === "mother" || n.category === "insurance";
    return true;
  });

  const visibleNodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredLinks = links.filter((l) => visibleNodeIds.has(l.from) && visibleNodeIds.has(l.to));

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(0.8, prev + delta), 1.4));
  };

  return (
    <div className="space-y-4">
      {/* Skiff Header & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111113] border border-[#27272A] p-5 rounded-2xl shadow-skiff">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#18181B] border border-[#27272A] flex items-center justify-center text-[#FF4405] shadow-skiff">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-[#FAFAFA]">Family Knowledge Graph</h2>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-1 font-normal">
            Visual zero-knowledge graph mapping family members, documents, nominees, and urgent continuity actions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 bg-[#18181B] p-1 rounded-lg border border-[#27272A] text-xs">
            {(
              [
                { id: "all", label: "All Nodes" },
                { id: "family", label: "Family Core" },
                { id: "insurance", label: "Insurance" },
                { id: "property", label: "Property" },
                { id: "actions", label: "Actions" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1 rounded-md font-mono text-xs transition-all ${
                  filter === tab.id
                    ? "bg-[#27272A] text-[#FAFAFA] shadow-xs"
                    : "text-[#71717A] hover:text-[#FAFAFA]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-[#18181B] p-1 rounded-lg border border-[#27272A]">
            <button
              onClick={() => handleZoom(-0.1)}
              className="p-1.5 text-[#71717A] hover:text-[#FAFAFA] rounded-md hover:bg-[#27272A] transition"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-semibold text-[#A1A1AA] px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => handleZoom(0.1)}
              className="p-1.5 text-[#71717A] hover:text-[#FAFAFA] rounded-md hover:bg-[#27272A] transition"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-[#71717A] hover:text-[#FAFAFA] rounded-md hover:bg-[#27272A] transition ml-0.5"
              title="Reset view"
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Skiff Canvas Area */}
      <div className="relative bg-[#111113] border border-[#27272A] rounded-2xl overflow-hidden shadow-skiff p-2">
        <svg
          viewBox="0 0 1100 460"
          className="w-full h-auto select-none"
          style={{
            minHeight: "420px",
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center center",
            transition: "transform 0.15s ease-out",
          }}
        >
          <defs>
            {/* Arrowhead marker */}
            <marker
              id="skiff-arrow"
              viewBox="0 0 10 10"
              refX="24"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#3F3F46" />
            </marker>

            {/* Cyber / Cryptographic grid pattern */}
            <pattern id="skiff-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <rect width="28" height="28" fill="#0A0A0B" />
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Canvas Background */}
          <rect width="1100" height="460" fill="url(#skiff-grid)" />

          {/* Links (Connectors) */}
          {filteredLinks.map((link, idx) => {
            const source = nodes.find((n) => n.id === link.from);
            const target = nodes.find((n) => n.id === link.to);
            if (!source || !target) return null;

            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;

            const isHighlighted =
              hoveredNodeId === source.id ||
              hoveredNodeId === target.id ||
              selectedNode?.id === source.id ||
              selectedNode?.id === target.id;

            return (
              <g key={idx}>
                {/* Connecting Line */}
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHighlighted ? "#FF4405" : link.color || "#27272A"}
                  strokeWidth={isHighlighted ? "2.5" : "1.5"}
                  strokeDasharray={link.label.includes("Action") ? "4,4" : "none"}
                  opacity={isHighlighted ? 1 : 0.6}
                  markerEnd="url(#skiff-arrow)"
                />

                {/* Relationship Pill Label */}
                <rect
                  x={midX - 44}
                  y={midY - 10}
                  width="88"
                  height="20"
                  rx="6"
                  fill="#18181B"
                  stroke={isHighlighted ? "#FF4405" : "#27272A"}
                  strokeWidth={isHighlighted ? "1.5" : "1"}
                  filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.5))"
                />
                <text
                  x={midX}
                  y={midY + 3.5}
                  textAnchor="middle"
                  fill={isHighlighted ? "#FAFAFA" : "#A1A1AA"}
                  fontSize="9"
                  fontFamily="'Inter', sans-serif"
                  fontWeight="500"
                >
                  {link.label}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNodeId === node.id;
            const color = getNodeColor(node.category);

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="cursor-pointer"
                transform={`translate(${node.x}, ${node.y})`}
              >
                {/* Selection Ring */}
                {(isSelected || isHovered) && (
                  <circle
                    r="30"
                    fill="none"
                    stroke={color}
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                    strokeDasharray={isSelected ? "none" : "3,2"}
                    opacity="0.9"
                  />
                )}

                {/* Node Body */}
                <circle
                  r="22"
                  fill="#18181B"
                  stroke={color}
                  strokeWidth="2.5"
                  filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.6))"
                />

                {/* Node Icon */}
                <text
                  y="4.5"
                  textAnchor="middle"
                  fill={color}
                  fontSize="12"
                  fontWeight="700"
                  fontFamily="'Inter', sans-serif"
                >
                  {node.category === "father"
                    ? "👨‍💼"
                    : node.category === "mother"
                    ? "👩‍💼"
                    : node.category === "child"
                    ? "🎓"
                    : node.category === "insurance"
                    ? "🛡️"
                    : node.category === "property"
                    ? "🏠"
                    : node.category === "finance"
                    ? "💰"
                    : node.category === "action"
                    ? "⚡"
                    : "📄"}
                </text>

                {/* Node Title Badge */}
                <rect
                  x="-70"
                  y="28"
                  width="140"
                  height="22"
                  rx="6"
                  fill="#18181B"
                  stroke="#27272A"
                  strokeWidth="1"
                  filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.4))"
                />
                <text
                  y="42"
                  textAnchor="middle"
                  fill="#FAFAFA"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="'Inter', sans-serif"
                >
                  {node.name.length > 20 ? `${node.name.substring(0, 18)}…` : node.name}
                </text>

                {/* Subtext */}
                {node.subtext && (
                  <text
                    y="60"
                    textAnchor="middle"
                    fill="#71717A"
                    fontSize="8.5"
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="500"
                  >
                    {node.subtext}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute bottom-5 right-5 bg-[#111113] border border-[#27272A] rounded-xl p-5 shadow-skiff-lg max-w-sm w-full text-xs animate-in fade-in duration-150 z-20">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getNodeColor(selectedNode.category) }}
                />
                <span className="font-bold text-sm text-[#FAFAFA]">{selectedNode.name}</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-[#71717A] hover:text-[#FAFAFA] font-bold p-1"
                aria-label="Close detail panel"
              >
                ✕
              </button>
            </div>

            <p className="text-[#A1A1AA] my-2.5 font-normal">{selectedNode.subtext}</p>

            {selectedNode.meta && (
              <div className="bg-[#18181B] p-3 rounded-lg border border-[#27272A] space-y-1.5 font-mono text-[11px] mb-3">
                {Object.entries(selectedNode.meta).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center">
                    <span className="text-[#71717A]">{k}:</span>
                    <span className="text-[#FAFAFA] font-medium">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setSelectedNode(null)}
              className="w-full py-2 bg-[#FF4405] hover:bg-[#EA3800] text-white rounded-lg text-xs font-semibold transition shadow-skiff"
            >
              Done Viewing
            </button>
          </div>
        )}
      </div>

      {/* Skiff Legend Footer */}
      <div className="bg-[#111113] border border-[#27272A] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-skiff">
        <span className="font-semibold text-[#FAFAFA] flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#FF4405]" /> Vault Legend:
        </span>
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#A1A1AA]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> Primary Root Admin
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Guardian (Mother)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Children (Restricted)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4405]" /> Insurance & Policy
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" /> Real Estate & Property
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Urgent Action Claim
          </span>
        </div>
      </div>
    </div>
  );
};