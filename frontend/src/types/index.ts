// ============================================================
// Core domain types for Vidur AI
// ============================================================

export type Language = 'en' | 'hi';

export type GrievanceStatus =
  | 'Submitted'
  | 'Under Review'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface ServiceCategory {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  icon: string; // lucide icon name
  color: string; // tailwind color class fragment
  serviceCount: number;
}

export interface ServiceDocument {
  label: string;
  labelHi: string;
  required: boolean;
}

export interface PublicService {
  id: string;
  name: string;
  nameHi: string;
  category: string;
  department: string;
  departmentHi: string;
  state: string;
  serviceType: 'Application' | 'Grievance' | 'Information' | 'Registration';
  description: string;
  descriptionHi: string;
  eligibility: string[];
  eligibilityHi: string[];
  requiredDocuments: ServiceDocument[];
  process: string[];
  processHi: string[];
  estimatedTime: string;
  estimatedTimeHi: string;
  faqs: { question: string; answer: string }[];
  faqsHi: { question: string; answer: string }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  analysis?: GrievanceAnalysis;
  suggestions?: string[];
}

export interface GrievanceAnalysis {
  detectedService: string;
  issue: string;
  department: string;
  priority: Priority;
  confidence: 'Low' | 'Medium' | 'High';
  suggestedAction: string;
}

export interface Grievance {
  id: string;
  serviceId: string;
  serviceName: string;
  issue: string;
  description: string;
  department: string;
  category: string;
  state: string;
  district: string;
  cityVillage: string;
  landmark?: string;
  priority: Priority;
  status: GrievanceStatus;
  createdAt: string;
  submittedAt: string;
  updatedAt: string;
  deadlineAt: string;
  attachments: { name: string; type: string }[];
  timeline: GrievanceTimelineEvent[];
}

export interface GrievanceTimelineEvent {
  status: string;
  timestamp: string;
  completed: boolean;
  description: string;
}

export interface DocumentAnalysis {
  fileName: string;
  ocrCompleted: boolean;
  extractedFields: { label: string; value: string }[];
  aiSummary: string;
  documentType: string;
}

export interface DashboardStats {
  activeGrievances: number;
  resolved: number;
  pendingActions: number;
}

export interface AdminStats {
  totalGrievances: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

export interface AdminInsight {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface ChartBarItem {
  label: string;
  value: number;
  color?: string;
}

export interface TrendBarItem {
  month: string;
  filed: number;
  resolved: number;
}

export interface AdminChartData {
  grievancesByDepartment: ChartBarItem[];
  grievancesByCategory: ChartBarItem[];
  resolutionTrend: TrendBarItem[];
  priorityDistribution: ChartBarItem[];
}
