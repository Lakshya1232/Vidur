import { Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, LayoutGrid, MessageSquareWarning, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const items = [
  { to: '/', label: 'Home', labelHi: 'होम', icon: Home },
  { to: '/assistant', label: 'AI', labelHi: 'AI', icon: Sparkles },
  { to: '/services', label: 'Services', labelHi: 'सेवाएं', icon: LayoutGrid },
  { to: '/grievances', label: 'Grievances', labelHi: 'शिकायत', icon: MessageSquareWarning },
  { to: '/track', label: 'Track', labelHi: 'ट्रैक', icon: Search },
];

export function MobileNav() {
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-around px-2 py-1.5">
        {items.map((item) => {
          const isActive =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive ? 'text-brand-600' : 'text-gray-400'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-brand-600' : 'text-gray-400'}`} />
              <span className={isActive ? 'text-brand-600' : 'text-gray-400'}>
                {t(item.label, item.labelHi)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
