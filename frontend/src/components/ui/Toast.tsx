import { type ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const config = {
  success: { icon: CheckCircle2, bg: 'bg-accent-50', border: 'border-accent-200', text: 'text-accent-800', iconColor: 'text-accent-600' },
  error: { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', iconColor: 'text-red-600' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', iconColor: 'text-amber-600' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', iconColor: 'text-blue-600' },
};

export function Toast({ type, message, onClose }: ToastProps) {
  const { icon: Icon, bg, border, text, iconColor } = config[type];
  return (
    <div className={`flex items-center gap-3 rounded-xl border ${border} ${bg} px-4 py-3 shadow-card animate-slide-up`}>
      <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} />
      <p className={`flex-1 text-sm font-medium ${text}`}>{message}</p>
      {onClose && (
        <button onClick={onClose} className={`text-sm ${text} hover:opacity-70`}>
          ✕
        </button>
      )}
    </div>
  );
}

export function SuccessBanner({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-accent-200 bg-accent-50 p-8 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-100">
        <CheckCircle2 className="h-8 w-8 text-accent-600" />
      </div>
      <h3 className="mt-4 text-xl font-bold text-accent-800">{title}</h3>
      {children}
    </div>
  );
}
