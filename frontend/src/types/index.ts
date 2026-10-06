export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  universityId?: string;
  universityName?: string;
  programmeId?: string;
  programmeName?: string;
  yearOfStudy?: string;
  regNumber?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  location: string;
  description: string;
  collegesCount: number;
  reportTypes: string[];
  status: 'active' | 'archived';
  isVerified: boolean;
}

export interface College {
  id: string;
  universityId: string;
  name: string;
  code: string;
  departmentsCount: number;
}

export interface Department {
  id: string;
  collegeId: string;
  name: string;
  code: string;
}

export interface Programme {
  id: string;
  departmentId: string;
  name: string;
  code: string;
  degreeType: 'BSc' | 'BA' | 'MSc' | 'MBA' | 'PhD' | 'Diploma';
}

export type ReportTypeSlug = 
  | 'field-training'
  | 'internship'
  | 'industrial-training'
  | 'research-report'
  | 'final-year-project'
  | 'dissertation'
  | 'thesis'
  | 'practical-report'
  | 'seminar-report'
  | 'project-documentation';

export interface ReportTypeConfig {
  id: string;
  slug: ReportTypeSlug;
  name: string;
  description: string;
  typicalUse: string;
  requiredInformation: string[];
  supportedUniversities: string[];
  iconName: string;
  status: 'active' | 'draft';
}

export interface ReportTemplate {
  id: string;
  universityId: string;
  universityName: string;
  reportTypeSlug: ReportTypeSlug;
  reportTypeName: string;
  version: string;
  status: 'Verified' | 'Draft' | 'Needs Review' | 'Deprecated';
  effectiveDate: string;
  sectionsCount: number;
  formattingRules: {
    fontFamily: string;
    fontSizeBody: string;
    lineSpacing: string;
    margins: string;
    citationStyle: 'IEEE' | 'APA7' | 'Harvard' | 'MLA';
  };
}

export interface ReportSection {
  id: string;
  title: string;
  order: number;
  content: string;
  wordCount: number;
  status: 'draft' | 'completed' | 'ai-generated' | 'reviewed';
}

export interface EvidenceFile {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  previewUrl?: string;
  caption?: string;
  uploadedAt: string;
}

export interface WritingPreferences {
  academicTone: 'formal' | 'rigorous' | 'balanced' | 'concise';
  languageVariant: 'en-US' | 'en-GB' | 'en-TZ';
  reportLength: 'standard' | 'extended' | 'brief';
  citationStyle: 'IEEE' | 'APA7' | 'Harvard' | 'MLA';
  perspective: 'third-person' | 'first-person';
  writingSampleText?: string;
}

export type ReportStatus = 
  | 'Draft'
  | 'Generating'
  | 'Review'
  | 'Ready'
  | 'Paid'
  | 'Downloaded'
  | 'Failed';

export interface AcademicReport {
  id: string;
  title: string;
  studentId: string;
  studentName: string;
  regNumber: string;
  universityId: string;
  universityName: string;
  collegeName?: string;
  departmentName?: string;
  programmeName: string;
  yearOfStudy: string;
  semester: string;
  academicYear: string;
  academicSupervisor?: string;
  fieldSupervisor?: string;
  reportTypeSlug: ReportTypeSlug;
  reportTypeName: string;
  status: ReportStatus;
  completionPercentage: number;
  missingFields: string[];
  sections: ReportSection[];
  evidenceFiles: EvidenceFile[];
  writingPreferences: WritingPreferences;
  qualityScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReferenceItem {
  id: string;
  reportId: string;
  citationKey: string;
  title: string;
  authors: string;
  publisherOrJournal: string;
  year: number;
  doiOrUrl?: string;
  status: 'Verified' | 'Needs Review' | 'Could Not Verify';
  verificationNotes?: string;
}

export type PaymentMethod = 
  | 'M-PESA'
  | 'TIGO-PESA'
  | 'AIRTEL-MONEY'
  | 'HALOPESA'
  | 'CRDB-BANK'
  | 'NMB-BANK';

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  reportId: string;
  reportTitle: string;
  studentId: string;
  studentName: string;
  amountTzs: number;
  amountUsd: number;
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
  status: 'Pending' | 'Processing' | 'Successful' | 'Failed';
  createdAt: string;
  completedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'Report' | 'Payment' | 'System' | 'Security';
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

export interface AdminAnalytics {
  totalStudents: number;
  activeStudents: number;
  reportsGenerated: number;
  reportsCompleted: number;
  totalRevenueTzs: number;
  successfulPaymentsCount: number;
  aiTokenUsage: number;
  popularUniversities: { name: string; count: number }[];
  popularReportTypes: { name: string; count: number }[];
}
