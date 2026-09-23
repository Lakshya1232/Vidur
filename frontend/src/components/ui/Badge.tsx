interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
}

const variantClasses: Record<string, string> = {
  default: 'bg-brand-50 text-brand-700',
  success: 'bg-accent-50 text-accent-700',
  warning: 'bg-amber-50 text-amber-700',
  error: 'bg-red-50 text-red-700',
  info: 'bg-cyan-50 text-cyan-700',
  neutral: 'bg-gray-100 text-gray-600',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`badge ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
