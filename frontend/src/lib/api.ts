import type {
  PublicService,
  Grievance,
  GrievanceAnalysis,
  ChatMessage,
  DocumentAnalysis,
  DashboardStats,
  AdminStats,
  AdminInsight,
  ServiceCategory,
  AdminChartData,
} from '@/types';
import {
  publicServices,
  mockGrievances,
  adminInsights,
  adminChartData,
  mockDocumentAnalysis,
  serviceCategories,
} from '@/data/mockData';

// Base API URL — will be set when backend is connected
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000';

// Simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================
// Services API
// ============================================================

export async function getServices(): Promise<PublicService[]> {
    const response = await fetch(
        `${API_BASE_URL}/services`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch services");
    }

    return response.json();
}

export async function getService(id: string): Promise<PublicService | undefined> {
  const response = await fetch(
    `${API_BASE_URL}/services/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch service");
  }

  return response.json();
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const response = await fetch(
    `${API_BASE_URL}/categories`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch service categories");
  }

  return response.json();
}

// ============================================================
// AI Chat API
// ============================================================

export async function sendChatMessage(message: string): Promise<ChatMessage> {
  await delay(800);
  // Backend: POST /api/chat { message }
  const analysis = classifyGrievanceSync(message);
  const aiMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    role: 'ai',
    content: `I understand that ${analysis.issue.toLowerCase()}. I've analyzed your request and here's what I found.`,
    timestamp: new Date().toISOString(),
    analysis,
    suggestions: [
      'Register Grievance',
      'Check Required Documents',
      'Track Existing Application',
    ],
  };
  return aiMessage;
}

// ============================================================
// Grievance Classification API
// ============================================================

export async function classifyGrievance(
  message: string
): Promise<GrievanceAnalysis> {
  const response = await fetch(`${API_BASE_URL}/classify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to classify grievance');
  }

  return response.json();
}

function classifyGrievanceSync(message: string): GrievanceAnalysis {
  const lower = message.toLowerCase();

  // Scholarship / payment
  if (
    lower.includes('scholarship') ||
    lower.includes('छात्रवृत्ति') ||
    lower.includes('payment') ||
    lower.includes('भुगतान') ||
    lower.includes('pending') ||
    lower.includes('लंबित')
  ) {
    return {
      detectedService: 'Scholarship',
      issue: 'Payment Pending',
      department: 'Education',
      priority: 'Medium',
      confidence: 'High',
      suggestedAction: 'Register a scholarship payment grievance.',
    };
  }

  // Road / infrastructure
  if (
    lower.includes('road') ||
    lower.includes('सड़क') ||
    lower.includes('pothole') ||
    lower.includes('damaged') ||
    lower.includes('infrastructure')
  ) {
    return {
      detectedService: 'Urban Governance',
      issue: 'Damaged Infrastructure',
      department: 'Public Works',
      priority: 'High',
      confidence: 'High',
      suggestedAction: 'Register a road maintenance grievance.',
    };
  }

  // Healthcare
  if (
    lower.includes('health') ||
    lower.includes('स्वास्थ्य') ||
    lower.includes('hospital') ||
    lower.includes('ayushman') ||
    lower.includes('medical')
  ) {
    return {
      detectedService: 'Healthcare',
      issue: 'Service Access Issue',
      department: 'Health',
      priority: 'High',
      confidence: 'High',
      suggestedAction: 'Register a healthcare service grievance.',
    };
  }

  // Agriculture
  if (
    lower.includes('kisan') ||
    lower.includes('किसान') ||
    lower.includes('agriculture') ||
    lower.includes('crop') ||
    lower.includes('फसल')
  ) {
    return {
      detectedService: 'Agriculture',
      issue: 'Scheme Payment Delay',
      department: 'Agriculture',
      priority: 'Medium',
      confidence: 'High',
      suggestedAction: 'Register an agriculture scheme grievance.',
    };
  }

  // Water / electricity
  if (
    lower.includes('water') ||
    lower.includes('पानी') ||
    lower.includes('electricity') ||
    lower.includes('बिजली') ||
    lower.includes('street light')
  ) {
    return {
      detectedService: 'Urban Governance',
      issue: 'Utility Service Issue',
      department: 'Urban Development',
      priority: 'Medium',
      confidence: 'Medium',
      suggestedAction: 'Register a municipal services grievance.',
    };
  }

  // Default
  return {
    detectedService: 'General',
    issue: 'Service Related Issue',
    department: 'Relevant Department',
    priority: 'Medium',
    confidence: 'Medium',
    suggestedAction: 'Register a citizen grievance with details.',
  };
}

// ============================================================
// Grievance API
// ============================================================

export interface GrievanceSubmission {
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
  priority: string;
  attachments: { name: string; type: string }[];
}

export async function submitGrievance(
  data: GrievanceSubmission
): Promise<{ id: string; success: boolean }> {

  const token = localStorage.getItem('access_token');

  const response = await fetch(`${API_BASE_URL}/grievances`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit grievance');
  }

  const result = await response.json();

  return {
    id: result.id,
    success: true,
  };
}

export async function getGrievance(id: string): Promise<Grievance | null> {
  const token = localStorage.getItem('access_token');

  const response = await fetch(
    `${API_BASE_URL}/grievances/${encodeURIComponent(id)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch grievance');
  }

  return response.json();
}

export async function getMyGrievances(): Promise<Grievance[]> {
  const token = localStorage.getItem('access_token');

  const response = await fetch(`${API_BASE_URL}/grievances`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch grievances');
  }

  return response.json();
}

// ============================================================
// Document / OCR API
// ============================================================

export async function uploadDocument(
  file: File
): Promise<{ success: boolean; fileName: string }> {
  await delay(1500);
  // Backend: POST /api/upload (multipart/form-data)
  return { success: true, fileName: file.name };
}

export async function analyzeDocument(
  _file: File
): Promise<DocumentAnalysis> {
  await delay(2000);
  // Backend: POST /api/analyze-document (multipart/form-data)
  return mockDocumentAnalysis as DocumentAnalysis;
}

// ============================================================
// Dashboard API
// ============================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(300);
  // Backend: GET /api/dashboard/stats
  return {
    activeGrievances: 2,
    resolved: 5,
    pendingActions: 1,
  };
}

export async function getRecentActivity(): Promise<Grievance[]> {
  await delay(300);
  return mockGrievances.slice(0, 4);
}

// ============================================================
// Admin API
// ============================================================

export async function getAdminStats(): Promise<AdminStats> {
  await delay(300);
  // Backend: GET /api/admin/stats
  return {
    totalGrievances: 1284,
    pending: 346,
    inProgress: 412,
    resolved: 526,
  };
}

export async function getAdminInsights(): Promise<AdminInsight[]> {
  await delay(400);
  // Backend: GET /api/admin/insights
  return adminInsights;
}

export async function getAdminChartData(): Promise<AdminChartData> {
  await delay(400);
  // Backend: GET /api/admin/analytics
  return adminChartData;
}

export async function getAdminGrievances(): Promise<Grievance[]> {
  const token = localStorage.getItem('access_token');

  const response = await fetch(
    `${API_BASE_URL}/admin/grievances`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || 'Failed to fetch admin grievances'
    );
  }

  return response.json();
}

// ============================================================
// Export API_BASE_URL for potential use
// ============================================================
export { API_BASE_URL };


export async function submitApplication(data: {
  serviceId: string;
  serviceName: string;
  department: string;
  category: string;
  applicantName: string;
  state: string;
  district: string;
  applicationData: Record<string, any>;
}) {
  const token = localStorage.getItem('access_token');

  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit application');
  }

  return response.json();
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}

export async function signupUser(
  name: string,
  email: string,
  password: string
) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Signup failed');
  }

  return response.json();
}

export async function getMyApplications() {
  const token = localStorage.getItem('access_token');

  const response = await fetch(`${API_BASE_URL}/applications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch applications');
  }

  return response.json();
}

export async function getApplication(id: string) {
  const token = localStorage.getItem('access_token');

  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(id)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch application');
  }

  return response.json();
}

export async function getAllApplications() {
  const token = localStorage.getItem('access_token');

  const response = await fetch(
    `${API_BASE_URL}/admin/applications`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch admin applications');
  }

  return response.json();
}


export async function getApplicationHistory(id: string) {
  const token = localStorage.getItem('access_token');

  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(id)}/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error('Failed to fetch application history');
  }

  return response.json();
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string
) {
  const token = localStorage.getItem('access_token');

  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationId)}/status`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update application status');
  }

  return response.json();
}


export async function resolveGrievance(
  grievanceId: string,
  beforeImage: string,
  afterImage: string,
  resolutionDescription: string
) {
  const token = localStorage.getItem('access_token');

  const response = await fetch(
    `${API_BASE_URL}/admin/grievances/${encodeURIComponent(grievanceId)}/resolve`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        beforeImage,
        afterImage,
        resolutionDescription,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to resolve grievance');
  }

  return response.json();
}

export async function verifyOTP(
  email: string,
  otp: string
) {
  const response = await fetch(
    `${API_BASE_URL}/auth/verify-otp`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to verify OTP');
  }

  return response.json();
}


export async function resendOTP(email: string) {
  const response = await fetch(
    `${API_BASE_URL}/auth/resend-otp`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to resend OTP');
  }

  return response.json();
}