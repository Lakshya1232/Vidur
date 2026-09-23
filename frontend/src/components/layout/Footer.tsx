import { Link } from 'react-router-dom';
import { Landmark, ShieldCheck, FileText, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900">Vidur</span>
                <span className="ml-1 text-lg font-bold text-brand-600">AI</span>
              </div>
            </Link>
            <p className="text-sm text-gray-500">
              {t('Your AI guide to public services', 'सार्वजनिक सेवाओं के लिए आपका AI मार्गदर्शक')}
            </p>
            <p className="text-xs text-gray-400">
              {t('Simple. Accessible. For Every Citizen.', 'सरल। सुलभ। हर नागरिक के लिए।')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-800">
              {t('Quick Links', 'त्वरित लिंक')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="text-gray-500 hover:text-brand-600">{t('Services', 'सेवाएं')}</Link></li>
              <li><Link to="/assistant" className="text-gray-500 hover:text-brand-600">{t('AI Assistant', 'AI सहायक')}</Link></li>
              <li><Link to="/track" className="text-gray-500 hover:text-brand-600">{t('Track Grievance', 'शिकायत ट्रैक करें')}</Link></li>
              <li><Link to="/help" className="text-gray-500 hover:text-brand-600">{t('Help', 'सहायता')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-800">
              {t('Legal', 'कानूनी')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="flex items-center gap-1.5 text-gray-500 hover:text-brand-600"><ShieldCheck className="h-4 w-4" />{t('Accessibility', 'सुलभता')}</Link></li>
              <li><Link to="/help" className="flex items-center gap-1.5 text-gray-500 hover:text-brand-600"><FileText className="h-4 w-4" />{t('Privacy', 'गोपनीयता')}</Link></li>
              <li><Link to="/help" className="flex items-center gap-1.5 text-gray-500 hover:text-brand-600"><FileText className="h-4 w-4" />{t('Terms', 'नियम')}</Link></li>
              <li><Link to="/help" className="flex items-center gap-1.5 text-gray-500 hover:text-brand-600"><HelpCircle className="h-4 w-4" />{t('Support', 'सहायता')}</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-800">
              {t('About', 'परिचय')}
            </h4>
            <p className="text-sm text-gray-500">
              {t(
                'Vidur is an AI-powered platform that helps citizens understand and access public services across India.',
                'Vidur एक AI-संचालित प्लेटफॉर्म है जो नागरिकों को भारत भर में सार्वजनिक सेवाओं को समझने और उन तक पहुंचने में मदद करता है।'
              )}
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6">
          <p className="text-center text-xs text-gray-400">
            {t(
              'Prototype developed for MPOnline Idea & Innovation Hackathon 2026',
              'MPOnline आइडिया एंड इनोवेशन हैकाथॉन 2026 के लिए प्रोटोटाइप'
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
