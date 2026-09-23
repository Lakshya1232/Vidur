// Utility helpers for Vidur AI

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getStatusColor(status: string): {
  bg: string;
  text: string;
  dot: string;
} {
  switch (status) {
    case 'Submitted':
      return { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' };
    case 'Acknowledged':
      return { bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-500' };
    case 'Under Review':
      return { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' };
    case 'In Progress':
      return { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' };
    case 'Resolved':
      return { bg: 'bg-accent-50', text: 'text-accent-700', dot: 'bg-accent-500' };
    case 'Rejected':
      return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' };
  }
}

export function getPriorityColor(priority: string): {
  bg: string;
  text: string;
} {
  switch (priority) {
    case 'Urgent':
      return { bg: 'bg-red-50', text: 'text-red-700' };
    case 'High':
      return { bg: 'bg-saffron-50', text: 'text-saffron-700' };
    case 'Medium':
      return { bg: 'bg-blue-50', text: 'text-blue-700' };
    case 'Low':
      return { bg: 'bg-gray-50', text: 'text-gray-600' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-600' };
  }
}

export function getConfidenceColor(confidence: string): string {
  switch (confidence) {
    case 'High':
      return 'text-accent-600';
    case 'Medium':
      return 'text-amber-600';
    case 'Low':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}
