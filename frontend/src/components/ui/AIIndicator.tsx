import { Bot, Loader2 } from 'lucide-react';

interface AIIndicatorProps {
  message?: string;
  analyzing?: boolean;
  className?: string;
}

export function AIIndicator({
  message = 'Vidur AI',
  analyzing = false,
  className = '',
}: AIIndicatorProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 ${className}`}
    >
      {analyzing ? (
        <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
      ) : (
        <Bot className="h-4 w-4 text-brand-600" />
      )}
      <span className="text-sm font-medium text-brand-700">
        {analyzing ? `Analyzing...` : message}
      </span>
    </div>
  );
}

export function AIProcessingCard({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/50 p-4 animate-fade-in">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100">
        <Bot className="h-5 w-5 text-brand-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-brand-800">Vidur AI</p>
        <p className="text-sm text-brand-600">{message}</p>
      </div>
      <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
    </div>
  );
}
