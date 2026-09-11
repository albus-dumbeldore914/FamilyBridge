"use client";

/**
 * FAMILYBRIDGE "TELL US WHAT HAPPENED" Core Intake Component
 * Universal Bridge between Human Intent and Complex Systems
 * Allows ANY user to enter their custom situation or problem.
 * Gemini generates the Action Plan and Unfinished Things to be done,
 * and saves them permanently in the family vault!
 */

import React, { useState } from "react";
import {
  HeartHandshake,
  Sparkles,
  Mic,
  MicOff,
  ArrowRight,
  Shield,
  Landmark,
  Home,
  Award,
  GraduationCap,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  ListTodo,
} from "lucide-react";
import { StoryAnalysisResult, ContinuityActionItem, UserProblemReport } from "@/lib/types";
import { useFamilyStore } from "@/lib/storage";

interface TellUsWhatHappenedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated?: (actions: ContinuityActionItem[]) => void;
}

export const TellUsWhatHappenedModal: React.FC<TellUsWhatHappenedModalProps> = ({
  isOpen,
  onClose,
  onPlanGenerated,
}) => {
  const [storyText, setStoryText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<StoryAnalysisResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const {
    documents,
    activeRole,
    activeMemberId,
    members,
    isContinuityMode,
    addProblemReport,
  } = useFamilyStore();

  if (!isOpen) return null;

  const currentMember = members.find((m) => m.id === activeMemberId) || members[0];

  const toggleVoiceDictation = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setStoryText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser. Please type your situation.");
    }
  };

  const handleAnalyzeStory = async () => {
    if (!storyText.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/gemini/understand-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: storyText,
          userRole: activeRole,
          memberId: activeMemberId,
          isContinuityMode,
          customDocuments: documents,
        }),
      });

      const json = await res.json();
      setIsAnalyzing(false);

      if (json.success && json.data) {
        setAnalysisResult(json.data);
      } else {
        throw new Error(json.error || "Analysis failed");
      }
    } catch (err) {
      console.error("Story analysis error:", err);
      setIsAnalyzing(false);
    }
  };

  const handleSaveToVault = () => {
    if (!analysisResult) return;

    const newReport: UserProblemReport = {
      id: `prob_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      userRole: activeRole,
      userName: currentMember?.name || (activeRole === "primary" ? "Father" : activeRole === "guardian" ? "Mother" : "Child"),
      story: storyText,
      situation: analysisResult.situation,
      status: "active",
      immediateAdvice: analysisResult.immediateAdvice,
      identifiedSystems: analysisResult.identifiedSystems || [],
      missingInformation: analysisResult.missingInformation || [],
      unfinishedTasks: analysisResult.unfinishedTasks || [
        "Procure official certified copies of required certificates",
        "File priority insurance claims before deadlines",
        "Submit bank nominee claim forms to unfreeze accounts",
        "Verify government pension eligibility",
      ],
      actionPlan: analysisResult.actionPlan || [],
    };

    // Store permanently in family vault & auto-merge into active action roadmap
    addProblemReport(newReport);
    setSavedSuccess(true);

    if (onPlanGenerated && analysisResult.actionPlan) {
      onPlanGenerated(analysisResult.actionPlan);
    }

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const getSystemIcon = (icon: string) => {
    switch (icon) {
      case "shield":
        return <Shield className="w-5 h-5 text-[#4262FF]" />;
      case "landmark":
        return <Landmark className="w-5 h-5 text-amber-600" />;
      case "home":
        return <Home className="w-5 h-5 text-blue-600" />;
      case "award":
        return <Award className="w-5 h-5 text-emerald-600" />;
      case "graduation":
        return <GraduationCap className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#111113] border border-[#27272A] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#18181B] border-b border-[#27272A] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF4405]/10 text-[#FF4405] border border-[#FF4405]/20">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-[#FAFAFA]">TELL US WHAT HAPPENED</h2>
                <span className="text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF4405]/15 text-[#FF4405] border border-[#FF4405]/30">
                  Universal Bridge
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] font-normal">
                Enter any situation in your own words. Gemini maps your human story to the complex systems, plans your roadmap, and identifies unfinished tasks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#71717A] hover:text-[#FAFAFA] rounded-lg hover:bg-[#27272A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-[#0A0A0B]">
          {/* Natural Story Input Form */}
          {!analysisResult && (
            <div className="space-y-4">
              <div className="bg-[#111113] border border-[#27272A] rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold text-[#FAFAFA]">
                  <span>Speak or type your situation in plain language:</span>
                  <button
                    type="button"
                    onClick={toggleVoiceDictation}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                      isRecording
                        ? "bg-rose-950/60 border-rose-500 text-rose-300 animate-pulse"
                        : "bg-[#18181B] border-[#27272A] text-[#D4D4D8] hover:border-[#3F3F46]"
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#FF4405]" />}
                    <span>{isRecording ? "Listening..." : "Voice Dictate"}</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  placeholder="e.g. My husband is no longer with us. I have two children, and I don't know what accounts he had, what insurance policies exist, or what paperwork I need to take care of first..."
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg p-3.5 text-sm text-[#FAFAFA] placeholder-[#71717A] leading-relaxed focus:outline-none focus:border-[#FF4405] font-normal"
                />

                {/* Helpful Scenario Pills */}
                <div className="space-y-2 pt-1">
                  <span className="text-[#71717A] font-medium text-[11px] block">Or select a quick scenario:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setStoryText(
                          "My husband is no longer here. I have two school-going children and I don't know what financial accounts he had, what insurance policies exist, or what I need to take care of first."
                        )
                      }
                      className="bg-[#18181B] hover:bg-[#27272A] hover:border-[#FF4405] text-[#D4D4D8] hover:text-[#FAFAFA] px-3 py-1.5 rounded-lg text-[11px] font-medium border border-[#27272A] transition"
                    >
                      Primary breadwinner unavailable
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setStoryText(
                          "We lost our property deed and the housing society is asking for ownership documents and tax receipts to transfer utilities."
                        )
                      }
                      className="bg-[#18181B] hover:bg-[#27272A] hover:border-[#FF4405] text-[#D4D4D8] hover:text-[#FAFAFA] px-3 py-1.5 rounded-lg text-[11px] font-medium border border-[#27272A] transition"
                    >
                      Lost property deed & utilities
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setStoryText(
                          "My father is hospitalized and we urgently need to know which health insurance policies cover him and how to file a cashless claim."
                        )
                      }
                      className="bg-[#18181B] hover:bg-[#27272A] hover:border-[#FF4405] text-[#D4D4D8] hover:text-[#FAFAFA] px-3 py-1.5 rounded-lg text-[11px] font-medium border border-[#27272A] transition"
                    >
                      Emergency medical & hospital claim
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setStoryText(
                          "I am a child/student and I need to find my verified 10th grade certificates, passport, and emergency family contact numbers."
                        )
                      }
                      className="bg-[#18181B] hover:bg-[#27272A] hover:border-[#FF4405] text-[#D4D4D8] hover:text-[#FAFAFA] px-3 py-1.5 rounded-lg text-[11px] font-medium border border-[#27272A] transition"
                    >
                      Student documents & emergency ID
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={isAnalyzing || !storyText.trim()}
                  onClick={handleAnalyzeStory}
                  className="px-6 py-2.5 rounded-xl bg-[#FF4405] hover:bg-[#EA3800] disabled:opacity-40 text-white font-semibold text-xs shadow-lg shadow-[#FF4405]/20 flex items-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>{isAnalyzing ? "Gemini is Analyzing..." : "Analyze & Generate Plan →"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 bg-[#111113] rounded-xl border border-[#27272A] p-8">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-[#27272A] border-t-[#FF4405] animate-spin" />
                <Sparkles className="w-5 h-5 text-[#FF4405] absolute inset-0 m-auto" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-[#FAFAFA]">
                  Gemini is analyzing your story against vault documents & public systems...
                </h3>
                <p className="text-xs text-[#FF4405] font-mono font-medium animate-pulse">
                  Extracting Intent • Identifying Insurance, Banking, EPFO & Unfinished Things To Do
                </p>
              </div>
            </div>
          )}

          {/* Analysis Results: Compassionate Advice -> Unfinished Tasks -> Systems -> Plan */}
          {!isAnalyzing && analysisResult && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Immediate Compassionate Guidance */}
              <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#FF4405] font-semibold text-xs uppercase tracking-wider font-mono">
                  <Sparkles className="w-4 h-4 text-[#FF4405]" />
                  <span>Gemini Compassionate Guidance:</span>
                </div>
                <p className="text-sm text-[#D4D4D8] leading-relaxed">
                  {analysisResult.immediateAdvice}
                </p>
              </div>

              {/* UNFINISHED THINGS WHICH SHOULD BE DONE (Feature Highlight) */}
              <div className="bg-[#111113] border border-[#FF4405]/40 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-[#FF4405]" />
                    <h3 className="text-sm font-semibold text-[#FAFAFA]">
                      Unfinished Tasks & Pending Requirements
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-mono font-semibold px-2.5 py-1 rounded-full bg-[#FF4405]/15 text-[#FF4405] border border-[#FF4405]/30">
                    Immediate Checklist
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA]">
                  These are critical administrative tasks and missing documents that must be completed to protect your family:
                </p>
                <div className="space-y-2 pt-1">
                  {(analysisResult.unfinishedTasks || analysisResult.missingInformation || []).map((task, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 bg-[#18181B] p-3 rounded-lg border border-[#27272A] text-xs text-[#D4D4D8]"
                    >
                      <span className="w-5 h-5 rounded-md bg-[#FF4405]/15 text-[#FF4405] border border-[#FF4405]/30 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Identified Complex Systems */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#FAFAFA] flex items-center gap-2">
                    <span>Complex Systems Identified ({analysisResult.identifiedSystems.length})</span>
                    <span className="text-[10px] bg-[#27272A] text-[#A1A1AA] border border-[#3F3F46] px-2 py-0.5 rounded-full font-mono">
                      Simplified by Gemini
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysisResult.identifiedSystems.map((sys) => (
                    <div
                      key={sys.id}
                      className="bg-[#111113] border border-[#27272A] rounded-xl p-4 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getSystemIcon(sys.icon)}
                          <h4 className="font-medium text-sm text-[#FAFAFA]">{sys.name}</h4>
                        </div>
                        <span
                          className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded uppercase ${
                            sys.urgency === "high"
                              ? "bg-[#FF4405]/15 text-[#FF4405] border border-[#FF4405]/30"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {sys.urgency} priority
                        </span>
                      </div>

                      <div className="bg-[#18181B] p-2.5 rounded-lg border border-[#27272A] text-xs space-y-1.5">
                        <p className="text-[#A1A1AA] text-[11px] leading-relaxed">
                          <strong className="text-[#FAFAFA]">Complexity:</strong> {sys.complexitySummary}
                        </p>
                        <p className="text-[#FF4405] text-[11px] font-medium leading-relaxed pt-1 border-t border-[#27272A]">
                          <strong>Family Action:</strong> {sys.simpleAction}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setAnalysisResult(null)}
                  className="text-xs font-mono text-[#71717A] hover:text-[#FAFAFA] transition"
                >
                  ← Edit My Story
                </button>

                <div className="flex items-center gap-3">
                  {savedSuccess ? (
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-4 py-2 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Saved to Family Vault!
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveToVault}
                      className="px-5 py-2.5 rounded-xl bg-[#FF4405] hover:bg-[#EA3800] text-white font-semibold text-xs shadow-lg shadow-[#FF4405]/20 flex items-center gap-2 transition"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Save Problem & Apply Action Plan to Vault</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};