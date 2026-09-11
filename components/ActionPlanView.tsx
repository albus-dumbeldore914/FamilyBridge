"use client";

/**
 * FAMILYBRIDGE "WHAT DO I DO NOW?" Continuity Action Plan
 * Miro.com visual theme:
 * - Miro Deep Navy #050038
 * - Miro Electric Blue #4262FF
 * - Miro Accent Yellow #FFD02F
 * - Records custom user problems & displays unfinished tasks checklists
 */

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  FileText,
  User,
  Sparkles,
  PlusCircle,
  ListTodo,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import {
  ContinuityActionItem,
  PriorityLevel,
  ActionStatus,
  VaultDocument,
  UserRole,
} from "@/lib/types";
import { useFamilyStore } from "@/lib/storage";
import { TellUsWhatHappenedModal } from "@/components/TellUsWhatHappenedModal";

interface ActionPlanViewProps {
  actions: ContinuityActionItem[];
  documents: VaultDocument[];
  userRole: UserRole;
  isContinuityMode: boolean;
  onUpdateStatus: (actionId: string, status: ActionStatus) => void;
  onRegeneratePlan?: () => void;
  onExplainDoc?: (doc: VaultDocument) => void;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({
  actions,
  documents,
  isContinuityMode,
  onUpdateStatus,
}) => {
  const [filterPriority, setFilterPriority] = useState<PriorityLevel | "all">("all");
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);
  const [completedUnfinishedTasks, setCompletedUnfinishedTasks] = useState<Record<string, boolean>>({});

  const { problemReports } = useFamilyStore();

  const urgentActions = actions.filter((a) => a.priority === "urgent");
  const importantActions = actions.filter((a) => a.priority === "important");
  const laterActions = actions.filter((a) => a.priority === "later");

  const filteredActions =
    filterPriority === "all"
      ? actions
      : actions.filter((a) => a.priority === filterPriority);

  const completedCount = actions.filter((a) => a.status === "completed").length;
  const progressPercent =
    actions.length > 0 ? Math.round((completedCount / actions.length) * 100) : 0;

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case "urgent":
        return (
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-[#FF4405]/10 text-[#FF4405] border border-[#FF4405]/30 flex items-center gap-1.5 shadow-skiff">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4405] animate-pulse" />
            URGENT
          </span>
        );
      case "important":
        return (
          <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 flex items-center gap-1.5 shadow-skiff">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            IMPORTANT
          </span>
        );
      case "later":
        return (
          <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded bg-[#18181B] text-[#71717A] border border-[#27272A] flex items-center gap-1.5 shadow-skiff">
            <span className="w-1.5 h-1.5 rounded-full bg-[#71717A]" />
            LATER
          </span>
        );
    }
  };

  const handleActionCheck = (action: ContinuityActionItem) => {
    let nextStatus: ActionStatus = "not_started";
    if (action.status === "not_started") nextStatus = "in_progress";
    else if (action.status === "in_progress") nextStatus = "completed";
    else nextStatus = "not_started";

    onUpdateStatus(action.id, nextStatus);
  };

  const toggleUnfinishedTask = (taskId: string) => {
    setCompletedUnfinishedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Skiff Dark Obsidian Banner */}
      <div className="bg-[#111113] border border-[#27272A] text-white rounded-2xl p-6 sm:p-8 shadow-skiff-lg relative overflow-hidden bg-skiff-grid">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4405]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#FF4405] bg-[#18181B] border border-[#FF4405]/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-skiff">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4405]" />
                Gemini Continuity Architect
              </span>
              {isContinuityMode && (
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#FF4405] px-3 py-1 rounded-md shadow-skiff animate-pulse">
                  Continuity Mode Active
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#FAFAFA]">
              WHAT DO I DO NOW?
            </h1>
            <p className="text-sm text-[#A1A1AA] max-w-2xl leading-relaxed font-normal">
              Gemini has translated {documents.length} complex family documents and your reported situations into a prioritized, step-by-step roadmap so your family never feels lost or overwhelmed.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsProblemModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF4405] hover:bg-[#EA3800] text-white text-xs font-semibold shadow-skiff transition transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>Tell Us What Happened / Enter New Problem</span>
              </button>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-xl shrink-0 min-w-[240px] shadow-skiff">
            <div className="flex items-center justify-between text-xs mb-2 font-mono">
              <span className="text-[#A1A1AA]">Roadmap Progress</span>
              <span className="font-semibold text-[#FF4405]">{progressPercent}% Done</span>
            </div>
            <div className="w-full h-2 bg-[#111113] border border-[#27272A] rounded-full overflow-hidden mb-2.5">
              <div
                className="h-full bg-gradient-to-r from-[#FF4405] to-[#FFA07A] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] font-mono text-[#71717A] flex justify-between">
              <span>{completedCount} of {actions.length} tasks done</span>
              <span className="text-[#FF4405]">
                {urgentActions.filter((a) => a.status !== "completed").length} urgent left
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RECORDED FAMILY PROBLEMS & UNFINISHED TASKS CHECKLIST ── */}
      {problemReports.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-[#FF4405]" />
              <h2 className="text-lg font-bold text-[#FAFAFA]">
                Stored Family Problems & Unfinished Checklists ({problemReports.length})
              </h2>
            </div>
            <button
              onClick={() => setIsProblemModalOpen(true)}
              className="text-xs font-mono font-medium text-[#FF4405] hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Another Problem</span>
            </button>
          </div>

          <div className="space-y-3">
            {problemReports.map((prob) => {
              const isExpanded = expandedProblemId === prob.id || problemReports.length === 1;

              return (
                <div
                  key={prob.id}
                  className="bg-[#111113] border border-[#27272A] rounded-2xl p-5 shadow-skiff space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27272A]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-[#18181B] text-[#FF4405] border border-[#FF4405]/30">
                          Reported by {prob.userName}
                        </span>
                        <span className="text-[11px] text-[#71717A] font-mono">
                          {new Date(prob.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-[#FAFAFA]">{prob.situation}</h3>
                    </div>

                    <button
                      onClick={() => setExpandedProblemId(isExpanded ? null : prob.id)}
                      className="text-xs text-[#A1A1AA] hover:text-[#FAFAFA] font-medium flex items-center gap-1 self-start sm:self-auto bg-[#18181B] px-3 py-1.5 rounded-lg border border-[#27272A]"
                    >
                      <span>{isExpanded ? "Collapse Details" : "View Unfinished Tasks"}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Story preview */}
                  <p className="text-xs text-[#A1A1AA] italic leading-relaxed bg-[#18181B] p-3 rounded-lg border border-[#27272A]">
                    &ldquo;{prob.story}&rdquo;
                  </p>

                  {isExpanded && (
                    <div className="space-y-4 pt-2 animate-in fade-in duration-150">
                      {/* Compassionate Advice */}
                      {prob.immediateAdvice && (
                        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 text-xs text-[#FAFAFA]">
                          <strong className="text-[#FF4405] block mb-1">Gemini Guidance:</strong>
                          {prob.immediateAdvice}
                        </div>
                      )}

                      {/* Unfinished Things to be Done */}
                      <div className="bg-[#18181B] border border-[#FF4405]/30 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-semibold text-[#FF4405] uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Unfinished Things Which Should Be Done:
                          </span>
                          <span className="text-[10px] text-[#71717A] font-mono">
                            Click to check off
                          </span>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          {(prob.unfinishedTasks || prob.missingInformation || []).map((task, tIdx) => {
                            const taskKey = `${prob.id}_task_${tIdx}`;
                            const isTaskDone = completedUnfinishedTasks[taskKey];

                            return (
                              <div
                                key={tIdx}
                                onClick={() => toggleUnfinishedTask(taskKey)}
                                className={`flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium cursor-pointer transition select-none ${
                                  isTaskDone
                                    ? "bg-[#111113] text-[#71717A] line-through border border-transparent"
                                    : "bg-[#111113] text-[#FAFAFA] border border-[#27272A] hover:border-[#3F3F46]"
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                    isTaskDone
                                      ? "bg-[#FF4405] border-[#FF4405] text-white"
                                      : "border-[#3F3F46] bg-[#18181B]"
                                  }`}
                                >
                                  {isTaskDone && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span>{task}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Priority Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27272A] pb-4">
        <div className="flex items-center gap-1.5 bg-[#111113] p-1 rounded-lg border border-[#27272A] text-xs shadow-skiff">
          <button
            onClick={() => setFilterPriority("all")}
            className={`px-3 py-1 rounded-md font-mono text-xs transition ${
              filterPriority === "all"
                ? "bg-[#18181B] text-[#FAFAFA] border border-[#3F3F46] shadow-xs"
                : "text-[#71717A] hover:text-[#FAFAFA]"
            }`}
          >
            All Tasks ({actions.length})
          </button>
          <button
            onClick={() => setFilterPriority("urgent")}
            className={`px-3 py-1 rounded-md font-mono text-xs transition ${
              filterPriority === "urgent"
                ? "bg-[#FF4405]/20 text-[#FF4405] border border-[#FF4405]/30 shadow-xs"
                : "text-[#71717A] hover:text-[#FF4405]"
            }`}
          >
            Urgent ({urgentActions.length})
          </button>
          <button
            onClick={() => setFilterPriority("important")}
            className={`px-3 py-1 rounded-md font-mono text-xs transition ${
              filterPriority === "important"
                ? "bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30 shadow-xs"
                : "text-[#71717A] hover:text-[#3B82F6]"
            }`}
          >
            Important ({importantActions.length})
          </button>
          <button
            onClick={() => setFilterPriority("later")}
            className={`px-3 py-1 rounded-md font-mono text-xs transition ${
              filterPriority === "later"
                ? "bg-[#27272A] text-[#FAFAFA] shadow-xs"
                : "text-[#71717A] hover:text-[#FAFAFA]"
            }`}
          >
            Later ({laterActions.length})
          </button>
        </div>

        <div className="text-xs text-[#71717A] font-mono flex items-center gap-2">
          <span>Toggle status:</span>
          <span className="bg-[#111113] border border-[#27272A] px-2.5 py-1 rounded-md text-[11px] font-mono shadow-xs">
            [ ] Not started → [~] In progress → [✓] Done
          </span>
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-4">
        {filteredActions.map((action, idx) => {
          const isDone = action.status === "completed";
          const isInProgress = action.status === "in_progress";
          const linkedDocs = documents.filter((d) =>
            action.relatedDocumentIds.includes(d.id)
          );

          return (
            <div
              key={action.id}
              className={`border rounded-xl p-6 transition-all duration-200 shadow-skiff ${
                isDone
                  ? "bg-[#0E0E10] border-[#27272A] opacity-60"
                  : action.priority === "urgent"
                  ? "bg-[#111113] border-[#FF4405]/40 hover:border-[#FF4405]"
                  : "bg-[#111113] border-[#27272A] hover:border-[#3F3F46]"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox button */}
                <button
                  onClick={() => handleActionCheck(action)}
                  className={`mt-1 w-6 h-6 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                    isDone
                      ? "bg-[#FF4405] border-[#FF4405] text-white shadow-xs"
                      : isInProgress
                      ? "bg-amber-950/40 border-amber-600 text-amber-500"
                      : "border-[#3F3F46] hover:border-[#FF4405] text-transparent bg-[#18181B]"
                  }`}
                  title={`Status: ${action.status.replace("_", " ")} (Click to toggle)`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isInProgress ? (
                    <Clock className="w-3 h-3 text-amber-500 animate-spin" />
                  ) : null}
                </button>

                {/* Content */}
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#71717A] font-semibold">#{idx + 1}</span>
                      <h3
                        className={`text-lg font-bold ${
                          isDone ? "line-through text-[#71717A]" : "text-[#FAFAFA]"
                        }`}
                      >
                        {action.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(action.priority)}
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded capitalize ${
                          isDone
                            ? "bg-[#18181B] text-[#FF4405] border border-[#FF4405]/30"
                            : isInProgress
                            ? "bg-amber-950/30 text-amber-400 border border-amber-800"
                            : "bg-[#18181B] text-[#71717A] border border-[#27272A]"
                        }`}
                      >
                        {action.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    {action.description}
                  </p>

                  {/* Why It Matters Callout */}
                  <div className="bg-[#18181B] border-l-2 border-[#FF4405] rounded-r-lg p-3 text-xs text-[#FAFAFA]">
                    <span className="font-semibold text-[#FF4405] block mb-0.5 font-mono">
                      Why this matters:
                    </span>
                    <p className="text-[#A1A1AA] font-normal">{action.whyItMatters}</p>
                  </div>

                  {/* Required Documents Checklist */}
                  {action.requiredDocuments && action.requiredDocuments.length > 0 && (
                    <div className="pt-1 text-xs">
                      <span className="text-[#71717A] font-mono block mb-1">
                        Documents Needed:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {action.requiredDocuments.map((req, rIdx) => (
                          <span
                            key={rIdx}
                            className="bg-[#18181B] text-[#FAFAFA] px-2.5 py-1 rounded-md text-[11px] border border-[#27272A] flex items-center gap-1 font-mono"
                          >
                            <FileText className="w-3 h-3 text-[#FF4405]" />
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Linked Vault Documents & Responsible Person */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs border-t border-[#27272A]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#71717A]">Responsible:</span>
                      <span className="text-[#FAFAFA] font-medium flex items-center gap-1 font-mono">
                        <User className="w-3.5 h-3.5 text-[#FF4405]" />
                        {action.responsibleMemberName}
                      </span>
                      {action.deadlineNotice && (
                        <span className="text-[#FF4405] text-[11px] font-mono bg-[#FF4405]/10 border border-[#FF4405]/30 px-2 py-0.5 rounded">
                          ⏱ {action.deadlineNotice}
                        </span>
                      )}
                    </div>

                    {linkedDocs.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#71717A]">Vault Match:</span>
                        {linkedDocs.map((ld) => (
                          <span
                            key={ld.id}
                            className="bg-[#18181B] text-[#FF4405] border border-[#FF4405]/30 px-2 py-0.5 rounded text-[11px] font-mono"
                          >
                            {ld.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Problem Intake Modal */}
      <TellUsWhatHappenedModal
        isOpen={isProblemModalOpen}
        onClose={() => setIsProblemModalOpen(false)}
      />
    </div>
  );
};