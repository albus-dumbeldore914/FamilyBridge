// FAMILYBRIDGE Data Models & Type System

export type UserRole = 'primary' | 'guardian' | 'child';

export type FamilyRole = 'father' | 'mother' | 'son' | 'daughter' | 'other';

export type DocumentCategory =
  | 'insurance'
  | 'property'
  | 'financial'
  | 'education'
  | 'identity'
  | 'vehicle'
  | 'other';

export type PriorityLevel = 'urgent' | 'important' | 'later';

export type ActionStatus = 'not_started' | 'in_progress' | 'completed';

export type DocumentType =
  | 'term_life_insurance'
  | 'life_insurance'
  | 'health_insurance'
  | 'property_deed'
  | 'bank_account'
  | 'bank_statement'
  | 'demat_account'
  | 'will_testament'
  | 'identity_aadhaar'
  | 'identity_pan'
  | 'birth_certificate'
  | 'school_certificate'
  | 'pension_certificate'
  | 'education_degree'
  | 'vehicle_rc'
  | 'vehicle_registration'
  | 'other'
  | string;

export interface FamilyMember {
  id: string;
  familyId: string;
  name: string;
  relationship: FamilyRole;
  age: number;
  assignedRole?: UserRole;
  email?: string;
  phone?: string;
  canAccessContinuity: boolean;
  avatarUrl?: string;
  isTrustedContact?: boolean;
}

export interface DocumentVisibility {
  minimumRole: UserRole;
  specificMemberIds?: string[];
  allowedMemberIds?: string[];
  isPublicToFamily?: boolean;
  requiresContinuityMode?: boolean;
}

export interface ExtractedDocumentData {
  title?: string;
  category?: DocumentCategory | string;
  documentType?: string;
  policyNumber?: string;
  accountNumber?: string;
  policyHolder?: string;
  nominee?: string;
  jointOwner?: string;
  studentName?: string;
  institution?: string;
  coverageAmount?: string;
  expiryDate?: string;
  issueDate?: string;
  importantActions?: string[];
  keyConditions?: string[];
  propertyAddress?: string;
  qualification?: string;
  plainSummary?: string;
  confidenceScore: number;
  aiSuggestedNominees?: string[];
  isVerified?: boolean;
  [key: string]: any;
}

export interface VaultDocument {
  id: string;
  familyId: string;
  title: string;
  category: DocumentCategory;
  documentType: string;
  storageUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  fileSizeBytes?: number;
  fileData?: string;
  uploadedAt: string;
  uploadedBy?: string;
  uploadedByMemberId?: string;
  status?: string;
  verifiedByPrimary?: boolean;
  visibility: DocumentVisibility;
  extractedData: ExtractedDocumentData;
  rawTextPreview?: string;
  recipientTarget?: string;
  purpose?: string;
  relationships?: {
    linkedMemberIds: string[];
    linkedDocumentIds: string[];
  };
}

export interface ContinuityActionItem {
  id: string;
  familyId: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  status: ActionStatus;
  responsibleMemberId: string;
  responsibleMemberName: string;
  relatedDocumentIds: string[];
  requiredDocuments: string[];
  whyItMatters: string;
  deadlineNotice?: string;
  completedAt?: string;
}

export interface GovernmentBenefit {
  id: string;
  title: string;
  department: string;
  category: string;
  description: string;
  potentialSupport: string;
  matchScore: 'High Match' | 'Potential Match' | 'Informational';
  criteriaSummary: string[];
  requiredDocuments: string[];
  officialPortalUrl?: string;
  disclaimer: string;
}

export interface VaultMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
  citedDocumentIds?: string[];
  suggestedPrompts?: string[];
}

export interface FamilyMapNode {
  id: string;
  label: string;
  type: 'member' | 'document' | 'action';
  category?: DocumentCategory;
  priority?: PriorityLevel;
  role?: FamilyRole;
}

export interface StorySystemMapping {
  id: string;
  name: string;
  category: DocumentCategory;
  icon: string;
  complexitySummary: string;
  simpleAction: string;
  relatedDocIds: string[];
  urgency: 'high' | 'medium' | 'low';
}

export interface StoryAnalysisResult {
  situation: string;
  affectedPeople: string[];
  intent: string;
  identifiedSystems: StorySystemMapping[];
  missingInformation: string[];
  unfinishedTasks: string[];
  immediateAdvice: string;
  actionPlan: ContinuityActionItem[];
}

export interface UserProblemReport {
  id: string;
  submittedAt: string;
  userRole: UserRole;
  userName: string;
  story: string;
  situation: string;
  status: 'active' | 'in_progress' | 'resolved';
  immediateAdvice: string;
  identifiedSystems: StorySystemMapping[];
  missingInformation: string[];
  unfinishedTasks: string[];
  actionPlan: ContinuityActionItem[];
}