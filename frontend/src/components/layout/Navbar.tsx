import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
  User,
  Globe,
  Landmark,
  Home,
  Sparkles,
  LayoutGrid,
  MessageSquareWarning,
  Search,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const navLinks = [
  { to: '/', label: 'Home', labelHi: 'होम', icon: Home },
  { to: '/services', label: 'Services', labelHi: 'सेवाएं', icon: LayoutGrid },
  { to: '/assistant', label: 'AI Assistant', labelHi: 'AI सहायक', icon: Sparkles },
  { to: '/grievances', label: 'My Grievances', labelHi: 'मेरी शिकायतें', icon: MessageSquareWarning },
  { to: '/applications', label: 'My Applications', labelHi: 'मेरे आवेदन', icon: FileText },
  { to: '/track', label: 'Track Status', labelHi: 'स्थिति ट्रैक', icon: Search },
  { to: '/help', label: 'Help', labelHi: 'सहायता', icon: HelpCircle },
];

export function Navbar() {
  const { lang, toggleLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" aria-label="Vidur AI Home">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Landmark className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-gray-900">Vidur</span>
            <span className="ml-1 text-lg font-bold text-brand-600">AI</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {t(link.label, link.labelHi)}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4" />
            <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Notifications */}
          <button
            className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-saffron-500" />
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700 transition-colors hover:bg-brand-200"
            aria-label="Profile"
          >
            <User className="h-5 w-5" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <link.icon className="h-5 w-5" />
                {t(link.label, link.labelHi)}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
