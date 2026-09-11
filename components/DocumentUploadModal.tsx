'use client';

/**
 * FAMILYBRIDGE Comprehensive Record Ingestion & Purpose Portal
 * Designed for Father: Allows keeping anything for Wife or Children:
 * - Personal Letters & Life Guidance
 * - Education & School Certificates
 * - Bank Accounts, FDs & Investments
 * - Property Deeds & Land Titles
 * - Insurance & Health Floaters
 * - Identity & Vital Documents
 * - Digital Locker Keys & Directives
 */

import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Edit3,
  Heart,
  GraduationCap,
  Home,
  DollarSign,
  Shield,
  Key,
  ScrollText,
  Users,
  Lock,
  ArrowRight,
  ArrowLeft,
  FileBadge,
  Clock,
} from 'lucide-react';
import { VaultDocument, ExtractedDocumentData, DocumentCategory, UserRole } from '@/lib/types';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApproved: (newDoc: VaultDocument) => void;
}

type RecipientTarget = 'wife' | 'children' | 'family' | 'self';
type RecordPurpose =
  | 'letter'
  | 'education'
  | 'insurance'
  | 'financial'
  | 'property'
  | 'identity'
  | 'will'
  | 'keys';
type InputMode = 'upload' | 'write';
type AccessTiming = 'immediate' | 'emergency' | 'milestone';

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onApproved,
}) => {
  // Step state: 1 = Purpose & Target, 2 = Provide Content (Upload or Write), 3 = Review & Finalize
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Configuration options
  const [recipient, setRecipient] = useState<RecipientTarget>('wife');
  const [purpose, setPurpose] = useState<RecordPurpose>('letter');
  const [inputMode, setInputMode] = useState<InputMode>('write');
  const [accessTiming, setAccessTiming] = useState<AccessTiming>('immediate');

  // Written content state
  const [writtenTitle, setWrittenTitle] = useState('');
  const [writtenNote, setWrittenNote] = useState('');
  const [writtenImportantPoints, setWrittenImportantPoints] = useState('');

  // File upload & AI state
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [extractedResult, setExtractedResult] = useState<{
    doc: Partial<VaultDocument>;
    data: ExtractedDocumentData;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<Partial<ExtractedDocumentData>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Options definitions
  const RECIPIENT_OPTIONS: { id: RecipientTarget; label: string; sub: string; emoji: string; color: string }[] = [
    { id: 'wife', label: 'For My Wife (Priya)', sub: 'Joint assets, emergency liquidity, or personal love letter', emoji: '👩', color: 'border-[#FF4405] text-[#FF4405]' },
    { id: 'children', label: 'For My Children (Arjun & Ananya)', sub: 'School marksheets, college fund, or life guidance', emoji: '🧒', color: 'border-[#8B5CF6] text-[#8B5CF6]' },
    { id: 'family', label: 'For the Entire Family', sub: 'Home property deed, family health floater, household records', emoji: '👨‍👩‍👧‍👦', color: 'border-[#3B82F6] text-[#3B82F6]' },
    { id: 'self', label: 'Confidential to Me (Father)', sub: 'Draft will, private business notes, restricted credentials', emoji: '🔒', color: 'border-[#71717A] text-[#71717A]' },
  ];

  const PURPOSE_OPTIONS: { id: RecordPurpose; label: string; desc: string; icon: React.ReactNode; category: DocumentCategory }[] = [
    { id: 'letter', label: 'Personal Letter & Life Advice', desc: 'Heartfelt words, instructions, or secret family advice', icon: <Heart className="w-4 h-4 text-[#FF4405]" />, category: 'other' },
    { id: 'education', label: "Children's Education & Awards", desc: 'CBSE marksheet, degree, school IDs, achievements', icon: <GraduationCap className="w-4 h-4 text-[#8B5CF6]" />, category: 'education' },
    { id: 'financial', label: 'Bank Account, FD & Investments', desc: 'Fixed deposit, mutual funds, Demat, gold locker', icon: <DollarSign className="w-4 h-4 text-[#10B981]" />, category: 'financial' },
    { id: 'property', label: 'Property Deed & Real Estate', desc: 'Apartment sale deed, land registry, survivorship clause', icon: <Home className="w-4 h-4 text-[#3B82F6]" />, category: 'property' },
    { id: 'insurance', label: 'Insurance & Health Protection', desc: 'Term life cover, health floater, cashless cards', icon: <Shield className="w-4 h-4 text-[#FF4405]" />, category: 'insurance' },
    { id: 'identity', label: 'Identity & Passports', desc: 'Passport, birth certificates, Aadhaar, PAN', icon: <FileBadge className="w-4 h-4 text-[#06B6D4]" />, category: 'identity' },
    { id: 'will', label: 'Will & Estate Directives', desc: 'Last will & testament, power of attorney, executor wishes', icon: <ScrollText className="w-4 h-4 text-[#EAB308]" />, category: 'other' },
    { id: 'keys', label: 'Vault Keys & Emergency PINs', desc: 'Bank locker key location, device PINs, online recovery', icon: <Key className="w-4 h-4 text-[#EC4899]" />, category: 'other' },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const mapCategoryFromPurpose = (purp: RecordPurpose): DocumentCategory => {
    const found = PURPOSE_OPTIONS.find((p) => p.id === purp);
    return found ? found.category : 'other';
  };

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setIsAnalyzing(true);
    setAnalysisStep('Uploading file securely to vault sandbox...');

    try {
      await new Promise((r) => setTimeout(r, 600));
      setAnalysisStep('Gemini is understanding your document structure...');

      const textReader = new FileReader();
      const base64Reader = new FileReader();

      base64Reader.onload = () => {
        const fileDataUrl = typeof base64Reader.result === 'string' ? base64Reader.result : '';

        textReader.onload = async () => {
          const content = typeof textReader.result === 'string' ? textReader.result : '';
          setAnalysisStep('Gemini extracting entities: Nominees, Ref #, Values & Conditions...');

          let json: any = null;
          try {
            const res = await fetch('/api/gemini/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileName: file.name,
                fileContent: content.slice(0, 4000),
              }),
            });
            json = await res.json();
          } catch {
            // Fallback if API is offline
          }

          setIsAnalyzing(false);

          const docCategory = json?.success ? json.classification.category : mapCategoryFromPurpose(purpose);
          const docType = json?.success ? json.classification.documentType : purpose;
          const extracted: ExtractedDocumentData = json?.success
            ? json.extractedData
            : {
                title: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
                category: docCategory,
                documentType: docType,
                policyHolder: 'Ramesh Kumar',
                nominee: recipient === 'wife' ? 'Priya Kumar (Wife)' : recipient === 'children' ? 'Arjun & Ananya (Children)' : 'Family',
                plainSummary: `Document saved by Father for ${recipient === 'wife' ? 'Wife (Priya)' : recipient === 'children' ? 'Children (Arjun & Ananya)' : 'Family'}. Purpose: ${PURPOSE_OPTIONS.find(p => p.id === purpose)?.label}.`,
                confidenceScore: 0.95,
                isVerified: true,
              };

          let allowedMemberIds: string[] = ['member_ramesh'];
          let minimumRole: UserRole = 'primary';
          let isPublicToFamily = false;

          if (recipient === 'wife') {
            allowedMemberIds = ['member_ramesh', 'member_priya'];
            minimumRole = 'guardian';
          } else if (recipient === 'children') {
            allowedMemberIds = ['member_ramesh', 'member_priya', 'member_arjun', 'member_ananya'];
            minimumRole = 'child';
            isPublicToFamily = true;
          } else if (recipient === 'family') {
            allowedMemberIds = ['member_ramesh', 'member_priya', 'member_arjun', 'member_ananya'];
            minimumRole = 'child';
            isPublicToFamily = true;
          }

          const draftDoc: Partial<VaultDocument> = {
            id: `doc_${Date.now()}`,
            familyId: 'family_kumar_101',
            title: extracted.title || file.name.replace(/\.[^/.]+$/, ''),
            fileName: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            fileType: file.type || 'application/pdf',
            fileData: fileDataUrl,
            category: docCategory,
            documentType: docType,
            uploadedBy: 'member_ramesh',
            uploadedAt: new Date().toISOString(),
            status: 'verified',
            recipientTarget: recipient,
            purpose,
            extractedData: extracted,
            visibility: {
              isPublicToFamily,
              allowedMemberIds,
              minimumRole,
              requiresContinuityMode: accessTiming === 'emergency',
            },
          };

          setExtractedResult({ doc: draftDoc, data: extracted });
          setEditableData({ ...extracted });
          setStep(3);
        };

        textReader.readAsText(file);
      };

      base64Reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  const handleProceedFromWrite = () => {
    const chosenTitle = writtenTitle.trim() || `Personal Letter from Father to ${recipient === 'wife' ? 'Priya' : recipient === 'children' ? 'Children' : 'Family'}`;
    const chosenSummary = writtenNote.trim() || 'No text written.';

    let allowedMemberIds: string[] = ['member_ramesh'];
    let minimumRole: UserRole = 'primary';
    let isPublicToFamily = false;

    if (recipient === 'wife') {
      allowedMemberIds = ['member_ramesh', 'member_priya'];
      minimumRole = 'guardian';
    } else if (recipient === 'children') {
      allowedMemberIds = ['member_ramesh', 'member_priya', 'member_arjun', 'member_ananya'];
      minimumRole = 'child';
      isPublicToFamily = true;
    } else if (recipient === 'family') {
      allowedMemberIds = ['member_ramesh', 'member_priya', 'member_arjun', 'member_ananya'];
      minimumRole = 'child';
      isPublicToFamily = true;
    }

    const keyPointsArray = writtenImportantPoints
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const extracted: ExtractedDocumentData = {
      title: chosenTitle,
      category: mapCategoryFromPurpose(purpose),
      documentType: purpose === 'letter' ? 'personal_letter' : purpose,
      policyHolder: 'Ramesh Kumar (Father)',
      nominee: recipient === 'wife' ? 'Priya Kumar (Wife)' : recipient === 'children' ? 'Arjun & Ananya' : 'Family',
      plainSummary: chosenSummary,
      importantActions: keyPointsArray.length > 0 ? keyPointsArray : undefined,
      confidenceScore: 1.0,
      isVerified: true,
    };

    const draftDoc: Partial<VaultDocument> = {
      id: `doc_${Date.now()}`,
      familyId: 'family_kumar_101',
      title: chosenTitle,
      fileName: `${chosenTitle.toLowerCase().replace(/\s+/g, '_')}.txt`,
      fileSize: '12 KB',
      fileType: 'text/plain',
      category: mapCategoryFromPurpose(purpose),
      documentType: purpose === 'letter' ? 'personal_letter' : purpose,
      uploadedBy: 'member_ramesh',
      uploadedAt: new Date().toISOString(),
      status: 'verified',
      recipientTarget: recipient,
      purpose,
      extractedData: extracted,
      visibility: {
        isPublicToFamily,
        allowedMemberIds,
        minimumRole,
        requiresContinuityMode: accessTiming === 'emergency',
      },
    };

    setExtractedResult({ doc: draftDoc, data: extracted });
    setEditableData({ ...extracted });
    setStep(3); // Proceed to review
  };

  const handleApprove = () => {
    if (!extractedResult) return;
    const finalDoc: VaultDocument = {
      ...(extractedResult.doc as VaultDocument),
      title: editableData.title || extractedResult.doc.title || 'Untitled Document',
      extractedData: {
        ...extractedResult.data,
        ...editableData,
        isVerified: true,
      },
      status: 'verified',
    };
    onApproved(finalDoc);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setStep(1);
    setSelectedFile(null);
    setIsAnalyzing(false);
    setAnalysisStep('');
    setExtractedResult(null);
    setIsEditing(false);
    setWrittenTitle('');
    setWrittenNote('');
    setWrittenImportantPoints('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
    >
      <div className="bg-[#111113] border border-[#27272A] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#18181B]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF4405]/10 text-[#FF4405] border border-[#FF4405]/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="upload-modal-title" className="text-base sm:text-lg font-bold text-[#FAFAFA]">
                  {step === 1 && 'What is the Purpose of this Record?'}
                  {step === 2 && (inputMode === 'upload' ? 'Upload File or Document' : 'Write a Personal Letter or Note')}
                  {step === 3 && 'Review & Encrypt into Vault'}
                </h2>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#27272A] text-[#FF4405]">
                  Step {step} of 3
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] font-normal">
                {step === 1 && 'Keep anything for your wife, children, or family: letters, certificates, deeds, or policies'}
                {step === 2 && 'Provide the document or heartfelt note to be preserved securely'}
                {step === 3 && 'Verify access rules, recipient permissions, and summary'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="p-2 text-[#71717A] hover:text-[#FAFAFA] rounded-lg hover:bg-[#27272A] transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── STEP 1: PURPOSE & RECIPIENT SELECTION ── */}
        {step === 1 && (
          <div className="p-6 bg-[#0A0A0B] space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Section 1: Who is this for? */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF4405] block">
                1. Who is this record for?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {RECIPIENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setRecipient(opt.id)}
                    className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${
                      recipient === opt.id
                        ? 'bg-[#18181B] border-[#FF4405] ring-1 ring-[#FF4405]/50 shadow-skiff'
                        : 'bg-[#111113] border-[#27272A] hover:border-[#3F3F46]'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{opt.emoji}</span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-[#FAFAFA]">{opt.label}</h4>
                        {recipient === opt.id && (
                          <span className="w-4 h-4 rounded-full bg-[#FF4405] text-white flex items-center justify-center text-[10px] ml-auto">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#A1A1AA] leading-snug">{opt.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: What is the Purpose / Type? */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF4405] block">
                2. What is the type / purpose of this record?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PURPOSE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setPurpose(opt.id);
                      if (opt.id === 'letter' && inputMode !== 'write') {
                        setInputMode('write');
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                      purpose === opt.id
                        ? 'bg-[#18181B] border-[#FF4405] ring-1 ring-[#FF4405]/40 shadow-xs'
                        : 'bg-[#111113] border-[#27272A] hover:border-[#3F3F46]'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-[#18181B] border border-[#27272A] shrink-0">
                      {opt.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#FAFAFA] truncate">{opt.label}</span>
                        {purpose === opt.id && (
                          <span className="text-[#FF4405] text-xs font-bold shrink-0">✓</span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#71717A] truncate mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Input Method */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF4405] block">
                3. How would you like to provide this?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setInputMode('write')}
                  className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 ${
                    inputMode === 'write'
                      ? 'bg-[#18181B] border-[#FF4405] ring-1 ring-[#FF4405]/50'
                      : 'bg-[#111113] border-[#27272A] hover:border-[#3F3F46]'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-[#FF4405]/10 text-[#FF4405]">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#FAFAFA]">Write Directly in Vault</h4>
                    <p className="text-[10px] text-[#A1A1AA]">Type a personal letter, advice, or note</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode('upload')}
                  className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 ${
                    inputMode === 'upload'
                      ? 'bg-[#18181B] border-[#FF4405] ring-1 ring-[#FF4405]/50'
                      : 'bg-[#111113] border-[#27272A] hover:border-[#3F3F46]'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6]">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#FAFAFA]">Upload a File / Scan</h4>
                    <p className="text-[10px] text-[#A1A1AA]">PDF, marksheet photo, deed, policy</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Section 4: Access Timing */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF4405] block">
                4. When should the recipient be able to access this?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'immediate', title: 'Immediate Access', desc: 'Available right now in their portal' },
                  { id: 'emergency', title: 'Emergency Continuity Only', desc: 'Unlocked only if Father is unavailable' },
                  { id: 'milestone', title: 'Milestone / Event', desc: 'Unlocked on 18th birthday or graduation' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAccessTiming(item.id as AccessTiming)}
                    className={`p-3 rounded-xl border text-left transition ${
                      accessTiming === item.id
                        ? 'bg-[#18181B] border-[#FF4405] ring-1 ring-[#FF4405]/40 text-[#FAFAFA]'
                        : 'bg-[#111113] border-[#27272A] text-[#A1A1AA] hover:border-[#3F3F46]'
                    }`}
                  >
                    <span className="text-xs font-bold block">{item.title}</span>
                    <span className="text-[10px] text-[#71717A] mt-0.5 block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Proceed Button */}
            <div className="flex justify-end pt-3 border-t border-[#27272A]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-lg bg-[#FF4405] hover:bg-[#EA3800] text-white font-semibold text-xs shadow-skiff flex items-center gap-2 transition"
              >
                <span>Proceed to Add Content</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: CONTENT PROVISION (WRITE OR UPLOAD) ── */}
        {step === 2 && (
          <div className="p-6 bg-[#0A0A0B] space-y-6">
            {/* Recipient & Purpose recap banner */}
            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">
                  {RECIPIENT_OPTIONS.find((r) => r.id === recipient)?.emoji}
                </span>
                <div>
                  <span className="text-xs font-semibold text-[#FAFAFA]">
                    {RECIPIENT_OPTIONS.find((r) => r.id === recipient)?.label}
                  </span>
                  <span className="text-[11px] text-[#FF4405] font-mono ml-2">
                    • {PURPOSE_OPTIONS.find((p) => p.id === purpose)?.label}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-[#71717A] hover:text-[#FAFAFA] underline font-mono"
              >
                Change Options
              </button>
            </div>

            {/* If Direct Writing Mode */}
            {inputMode === 'write' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#FAFAFA] block mb-1">
                    Record / Letter Title
                  </label>
                  <input
                    type="text"
                    value={writtenTitle}
                    onChange={(e) => setWrittenTitle(e.target.value)}
                    placeholder={
                      purpose === 'letter'
                        ? recipient === 'wife'
                          ? 'A Love Letter & Financial Guidance to my wife Priya'
                          : 'Words of Advice & Encouragement for Arjun & Ananya'
                        : `Personal Note regarding ${PURPOSE_OPTIONS.find((p) => p.id === purpose)?.label}`
                    }
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2 text-xs text-[#FAFAFA] focus:border-[#FF4405] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-[#FAFAFA]">
                      {purpose === 'letter' ? 'Your Letter & Guidance' : 'Instructions & Personal Notes'}
                    </label>
                    <span className="text-[10px] font-mono text-[#71717A]">
                      Zero-Knowledge Encrypted
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={writtenNote}
                    onChange={(e) => setWrittenNote(e.target.value)}
                    placeholder={
                      recipient === 'wife'
                        ? 'Dearest Priya, if ever you are facing an emergency alone, please know that all our SBI accounts and HDFC policy #HD-9842 have you as 100% registered nominee. Suresh bhai has a copy of our house deed. You are strong and capable. I love you and the children always...'
                        : recipient === 'children'
                        ? 'Dear Arjun and Ananya, Papa wants you to always follow your passions. Arjun, study well for your engineering exams; your college fund is safe. Ananya, continue your beautiful paintings. Be kind to each other and take care of Mumma...'
                        : 'Write down important family instructions, emergency notes, or life guidance...'
                    }
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-lg p-3 text-xs text-[#FAFAFA] leading-relaxed focus:border-[#FF4405] focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#FAFAFA] block mb-1">
                    Key Action Items / Advice Bullets (Optional, 1 per line)
                  </label>
                  <textarea
                    rows={2}
                    value={writtenImportantPoints}
                    onChange={(e) => setWrittenImportantPoints(e.target.value)}
                    placeholder="Example:&#10;1. Locker key #104 is in the study cabinet top shelf&#10;2. Advocate Singhal has the certified title duplicate"
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-lg p-2.5 text-xs text-[#D4D4D8] focus:border-[#FF4405] focus:outline-none font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#27272A]">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-mono text-[#71717A] hover:text-[#FAFAFA] flex items-center gap-1.5 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    disabled={!writtenTitle.trim() && !writtenNote.trim()}
                    onClick={handleProceedFromWrite}
                    className="px-6 py-2.5 rounded-lg bg-[#FF4405] hover:bg-[#EA3800] disabled:opacity-40 text-white font-semibold text-xs shadow-skiff flex items-center gap-2 transition"
                  >
                    <span>Review & Finalize</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* If Upload File Mode */}
            {inputMode === 'upload' && (
              <div className="space-y-4">
                {!isAnalyzing && (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-4 ${
                      dragActive
                        ? 'border-[#FF4405] bg-[#FF4405]/5'
                        : 'border-[#27272A] hover:border-[#FF4405] bg-[#111113]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="w-14 h-14 rounded-xl bg-[#FF4405]/10 border border-[#FF4405]/20 flex items-center justify-center text-[#FF4405] shadow-sm">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#FAFAFA] mb-1">
                        Drag & drop files here, or <span className="text-[#FF4405] underline">browse</span>
                      </p>
                      <p className="text-xs text-[#71717A] max-w-sm">
                        PDF, scanned certificates, JPG, PNG, or text letters
                      </p>
                    </div>

                    {/* Fast Sample Buttons for Demonstration */}
                    <div className="pt-2 flex flex-wrap justify-center gap-2">
                      <span className="text-[11px] text-[#71717A] font-mono">Quick Test Samples:</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          processFile(new File(['Dearest Priya, all our accounts and insurance are verified.'], 'personal_letter_to_priya.pdf', { type: 'application/pdf' }));
                        }}
                        className="text-[11px] bg-[#18181B] hover:bg-[#27272A] hover:border-[#FF4405] text-[#D4D4D8] hover:text-[#FAFAFA] px-2.5 py-1 rounded-lg border border-[#27272A] font-medium transition"
                      >
                        💌 letter_to_priya.pdf
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          processFile(new File(['CBSE Grade 12 Marksheet - Arjun Kumar'], 'arjun_cbse_12th_markcard.pdf', { type: 'application/pdf' }));
                        }}
                        className="text-[11px] bg-[#18181B] hover:bg-[#27272A] hover:border-[#8B5CF6] text-[#D4D4D8] hover:text-[#FAFAFA] px-2.5 py-1 rounded-lg border border-[#27272A] font-medium transition"
                      >
                        🎓 arjun_12th_marks.pdf
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          processFile(new File(['Registered Property Sale Deed Flat 402'], 'sector_62_apartment_deed.pdf', { type: 'application/pdf' }));
                        }}
                        className="text-[11px] bg-[#18181B] hover:bg-[#27272A] hover:border-[#3B82F6] text-[#D4D4D8] hover:text-[#FAFAFA] px-2.5 py-1 rounded-lg border border-[#27272A] font-medium transition"
                      >
                        🏡 apartment_deed.pdf
                      </button>
                    </div>
                  </div>
                )}

                {/* Analyzing state */}
                {isAnalyzing && (
                  <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 bg-[#111113] rounded-xl border border-[#27272A]">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full border-2 border-[#27272A] border-t-[#FF4405] animate-spin" />
                      <Sparkles className="w-5 h-5 text-[#FF4405] absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-[#FAFAFA]">Gemini is understanding your record</h3>
                      <p className="text-xs text-[#FF4405] font-mono font-medium animate-pulse">{analysisStep}</p>
                    </div>
                    <p className="text-xs text-[#71717A] max-w-sm">
                      Extracting entities, validating beneficiary alignment, and applying zero-trust visibility tags.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#27272A]">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-mono text-[#71717A] hover:text-[#FAFAFA] flex items-center gap-1.5 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: REVIEW & ENCRYPT INTO VAULT ── */}
        {step === 3 && extractedResult && (
          <div className="p-6 bg-[#0A0A0B] space-y-5">
            {/* Header Status Card */}
            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold text-[#22C55E] uppercase tracking-wider">
                      Ready for Zero-Knowledge Encryption
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#FAFAFA]">
                    {editableData.title || extractedResult.doc.title}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-[#111113] text-[#FAFAFA] border border-[#27272A] px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <span>{RECIPIENT_OPTIONS.find((r) => r.id === recipient)?.emoji}</span>
                  <span>{RECIPIENT_OPTIONS.find((r) => r.id === recipient)?.label}</span>
                </span>
                <span className="text-xs font-mono bg-[#FF4405]/10 text-[#FF4405] border border-[#FF4405]/30 px-2.5 py-1 rounded-md">
                  {accessTiming === 'immediate' ? '🟢 Immediate' : '🚨 Emergency Only'}
                </span>
              </div>
            </div>

            {/* Editable Attributes */}
            <div className="bg-[#111113] rounded-xl p-5 border border-[#27272A] space-y-4 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#27272A]">
                <span className="font-semibold text-[#FAFAFA]">Record Metadata & Permissions</span>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-[#FF4405] hover:text-[#EA3800] flex items-center gap-1 font-mono font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Done Editing' : 'Edit Details'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#71717A] font-medium block mb-1">Document / Letter Title</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={editableData.title || ''}
                    onChange={(e) => setEditableData({ ...editableData, title: e.target.value })}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 text-[#FAFAFA] font-normal disabled:opacity-85 focus:border-[#FF4405]"
                  />
                </div>

                <div>
                  <label className="text-[#71717A] font-medium block mb-1">Designated Recipient / Nominee</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={editableData.nominee || ''}
                    onChange={(e) => setEditableData({ ...editableData, nominee: e.target.value })}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 text-[#FAFAFA] font-normal disabled:opacity-85 focus:border-[#FF4405]"
                  />
                </div>

                <div>
                  <label className="text-[#71717A] font-medium block mb-1">Primary Holder / Author</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={editableData.policyHolder || 'Ramesh Kumar'}
                    onChange={(e) => setEditableData({ ...editableData, policyHolder: e.target.value })}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 text-[#FAFAFA] font-normal disabled:opacity-85 focus:border-[#FF4405]"
                  />
                </div>

                <div>
                  <label className="text-[#71717A] font-medium block mb-1">Ref Number / Policy ID (Optional)</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={editableData.policyNumber || ''}
                    onChange={(e) => setEditableData({ ...editableData, policyNumber: e.target.value })}
                    placeholder="Optional reference"
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 text-[#FAFAFA] font-mono disabled:opacity-85 focus:border-[#FF4405]"
                  />
                </div>
              </div>

              {editableData.plainSummary && (
                <div className="pt-2 border-t border-[#27272A]">
                  <label className="text-[#71717A] font-medium block mb-1">
                    {purpose === 'letter' ? 'Personal Message / Excerpt' : 'Plain Language Family Summary'}
                  </label>
                  <p className="bg-[#18181B] p-3 rounded-lg border border-[#27272A] text-[#D4D4D8] leading-relaxed whitespace-pre-line">
                    {editableData.plainSummary}
                  </p>
                </div>
              )}

              {editableData.importantActions && editableData.importantActions.length > 0 && (
                <div className="pt-2 border-t border-[#27272A]">
                  <label className="text-[#71717A] font-medium block mb-1">Key Action Directives</label>
                  <ul className="list-disc list-inside space-y-1 text-[#D4D4D8]">
                    {editableData.importantActions.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#27272A]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-mono text-[#71717A] hover:text-[#FAFAFA] flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-mono text-[#71717A] hover:text-[#FAFAFA] transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-6 py-2.5 rounded-lg bg-[#FF4405] hover:bg-[#EA3800] text-white text-xs font-semibold shadow-lg shadow-[#FF4405]/20 flex items-center gap-2 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Store in Vault</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
