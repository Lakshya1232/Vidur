import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  children?: ReactNode;
}

export function LoadingSpinner({ message }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      {message && (
        <p className="mt-3 text-sm text-gray-500">{message}</p>
      )}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function AITypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      <span className="text-xs font-medium text-gray-400 mr-1">Vidur AI is typing</span>
      <span className="h-2 w-2 rounded-full bg-brand-400 animate-typing" />
      <span className="h-2 w-2 rounded-full bg-brand-400 animate-typing" style={{ animationDelay: '0.2s' }} />
      <span className="h-2 w-2 rounded-full bg-brand-400 animate-typing" style={{ animationDelay: '0.4s' }} />
    </div>
  );
}
