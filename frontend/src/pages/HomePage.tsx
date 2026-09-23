import { useState, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Mic,
  Upload,
  ArrowRight,
  GraduationCap,
  Award,
  Briefcase,
  HeartPulse,
  Wheat,
  Car,
  Camera,
  MessageSquareWarning,
  Building2,
  Trees,
  Bot,
  Languages,
  FileScan,
  CheckCircle2,
  Search,
  FileText,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import { serviceCategories } from '@/data/mockData';

const iconMap: Record<string, ReactNode> = {
  GraduationCap: <GraduationCap className="h-7 w-7" />,
  Award: <Award className="h-7 w-7" />,
  Briefcase: <Briefcase className="h-7 w-7" />,
  HeartPulse: <HeartPulse className="h-7 w-7" />,
  Wheat: <Wheat className="h-7 w-7" />,
  Car: <Car className="h-7 w-7" />,
  Camera: <Camera className="h-7 w-7" />,
  MessageSquareWarning: <MessageSquareWarning className="h-7 w-7" />,
  Building2: <Building2 className="h-7 w-7" />,
  Trees: <Trees className="h-7 w-7" />,
};

const colorMap: Record<string, { bg: string; text: string; hover: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'group-hover:bg-blue-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', hover: 'group-hover:bg-amber-100' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'group-hover:bg-purple-100' },
  red: { bg: 'bg-red-50', text: 'text-red-600', hover: 'group-hover:bg-red-100' },
  green: { bg: 'bg-accent-50', text: 'text-accent-600', hover: 'group-hover:bg-accent-100' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', hover: 'group-hover:bg-cyan-100' },
  orange: { bg: 'bg-saffron-50', text: 'text-saffron-600', hover: 'group-hover:bg-saffron-100' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', hover: 'group-hover:bg-rose-100' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', hover: 'group-hover:bg-indigo-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', hover: 'group-hover:bg-emerald-100' },
};

const examplePrompts = [
  'How can I apply for a scholarship?',
  'Meri scholarship ka payment pending hai',
  'How do I report a damaged road?',
  'What documents are required?',
];

const steps = [
  { icon: Search, title: 'Tell us your problem', titleHi: 'अपनी समस्या बताएं', desc: 'Describe your issue in your own words.', descHi: 'अपनी समस्या अपने शब्दों में बताएं।' },
  { icon: Bot, title: 'AI understands your request', titleHi: 'AI आपके अनुरोध को समझता है', desc: 'Vidur AI analyzes and classifies your query.', descHi: 'Vidur AI आपकी क्वेरी का विश्लेषण करता है।' },
  { icon: FileText, title: 'Get the right service/action', titleHi: 'सही सेवा/कार्रवाई पाएं', desc: 'Find the exact service or register a grievance.', descHi: 'सटीक सेवा खोजें या शिकायत दर्ज करें।' },
  { icon: CheckCircle2, title: 'Track your request', titleHi: 'अपने अनुरोध को ट्रैक करें', desc: 'Monitor progress until resolution.', descHi: 'समाधान तक प्रगति पर नजर रखें।' },
];

const trustCards = [
  { icon: Bot, title: 'AI Assistance', titleHi: 'AI सहायता', desc: 'Understand services in simple language.', descHi: 'सेवाओं को सरल भाषा में समझें।' },
  { icon: Languages, title: 'Multilingual', titleHi: 'बहुभाषी', desc: 'Interact in English, Hindi and Hinglish.', descHi: 'अंग्रेजी, हिंदी और हिंग्लिश में बात करें।' },
  { icon: FileScan, title: 'Document Assistance', titleHi: 'दस्तावेज सहायता', desc: 'Upload documents and extract info using OCR.', descHi: 'दस्तावेज अपलोड करें और OCR से जानकारी निकालें।' },
];

const stats = [
  { value: '10+', label: 'Public Service Categories', labelHi: 'सार्वजनिक सेवा श्रेणियां' },
  { value: '24/7', label: 'AI Assistance', labelHi: 'AI सहायता' },
  { value: '3', label: 'Languages Supported', labelHi: 'समर्थित भाषाएं' },
  { value: '1', label: 'Unified Platform', labelHi: 'एकीकृत प्लेटफॉर्म' },
];

export function HomePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAsk = () => {
    if (query.trim()) {
      navigate(`/assistant?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/assistant');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      navigate('/document-ai');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/40 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <span className="text-sm font-medium text-brand-700">
                {t('AI-Powered Public Service Platform', 'AI-संचालित सार्वजनिक सेवा प्लेटफॉर्म')}
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {t('Public Services, ', 'सार्वजनिक सेवाएं, ')}
              <span className="text-brand-600">{t('Made Simple.', 'सरल बनाई गईं।')}</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
              {t(
                'Ask a question, find the right service, submit a grievance, or track your application — all with the help of AI.',
                'प्रश्न पूछें, सही सेवा खोजें, शिकायत दर्ज करें, या अपना आवेदन ट्रैक करें — सब AI की मदद से।'
              )}
            </p>

            {/* AI Input Box */}
            <div className="mx-auto mt-10 max-w-2xl">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-card-hover">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t(
                    'Describe your problem in your own words...',
                    'अपनी समस्या अपने शब्दों में बताएं...'
                  )}
                  className="w-full resize-none border-0 text-base text-gray-800 placeholder-gray-400 focus:outline-none"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAsk();
                  }}
                  aria-label="Ask Vidur AI"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleUploadClick}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Upload document"
                    >
                      <Upload className="h-4 w-4" />
                      <span className="hidden sm:inline">{t('Upload', 'अपलोड')}</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.png"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <button
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Voice input"
                    >
                      <Mic className="h-4 w-4" />
                      <span className="hidden sm:inline">{t('Speak', 'बोलें')}</span>
                    </button>
                  </div>
                  <button
                    onClick={handleAsk}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.98]"
                  >
                    <Sparkles className="h-4 w-4" />
                    {t('Ask Vidur AI', 'Vidur AI से पूछें')}
                  </button>
                </div>
              </div>

              {/* Example prompts */}
              <div className="mt-6 text-left">
                <p className="mb-3 text-sm font-medium text-gray-500">{t('Try asking:', 'पूछने का प्रयास करें:')}</p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        setQuery(prompt);
                        navigate(`/assistant?q=${encodeURIComponent(prompt)}`);
                      }}
                      className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Document upload card */}
              <button
                onClick={handleUploadClick}
                className="mt-4 flex w-full items-center gap-3 rounded-xl border border-dashed border-brand-300 bg-brand-50/50 p-4 text-left transition-all hover:border-brand-400 hover:bg-brand-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                  <FileScan className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t('Upload a document', 'दस्तावेज अपलोड करें')}</p>
                  <p className="text-xs text-gray-500">{t('Let AI help you understand it', 'AI आपको समझने में मदद करेगा')}</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-brand-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {t('Public Service Categories', 'सार्वजनिक सेवा श्रेणियां')}
          </h2>
          <p className="mt-2 text-gray-500">
            {t('Browse services by category', 'श्रेणी के अनुसार सेवाएं ब्राउज़ करें')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {serviceCategories.map((cat) => {
            const colors = colorMap[cat.color] || colorMap.blue;
            return (
              <Card
                key={cat.id}
                hover
                className="group p-5"
                onClick={() => navigate(`/services?category=${cat.id}`)}
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg} ${colors.text} ${colors.hover} transition-colors`}>
                  {iconMap[cat.icon]}
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  {t(cat.name, cat.nameHi)}
                </h3>
                <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                  {t(cat.description, cat.descriptionHi)}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">
                    {cat.serviceCount} {t('services', 'सेवाएं')}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-brand-500" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How Vidur AI Works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {t('How Vidur AI Works', 'Vidur AI कैसे काम करता है')}
            </h2>
            <p className="mt-2 text-gray-500">
              {t('Four simple steps to get help', 'सहायता पाने के चार सरल चरण')}
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-to-r from-brand-200 via-brand-300 to-brand-200 lg:block" />

            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-brand-200 bg-white shadow-card">
                  <step.icon className="h-7 w-7 text-brand-600" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {t(step.title, step.titleHi)}
                </h3>
                <p className="mt-1.5 text-sm text-gray-500">
                  {t(step.desc, step.descHi)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Accessibility Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {t('Built for Every Citizen', 'हर नागरिक के लिए बनाया गया')}
            </h2>
            <p className="mt-2 text-gray-500">
              {t('Designed for citizens with different levels of digital literacy.', 'विभिन्न डिजिटल साक्षरता स्तर वाले नागरिकों के लिए डिज़ाइन किया गया।')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {trustCards.map((card, idx) => (
              <Card key={idx} className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
                  <card.icon className="h-7 w-7 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t(card.title, card.titleHi)}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {t(card.desc, card.descHi)}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-brand-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl font-bold text-white sm:text-5xl">{stat.value}</p>
                <p className="mt-2 text-sm text-brand-100">
                  {t(stat.label, stat.labelHi)}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-brand-200">
            {t('* Prototype / demo data', '* प्रोटोटाइप / डेमो डेटा')}
          </p>
        </div>
      </section>
    </div>
  );
}
