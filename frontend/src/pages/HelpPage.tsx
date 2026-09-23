import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  Sparkles,
  ClipboardList,
  Upload,
  ShieldCheck,
  Languages,
  Accessibility,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, Button } from '@/components/ui';

const faqs = [
  {
    question: 'What is Vidur AI?',
    questionHi: 'Vidur AI क्या है?',
    answer: 'Vidur AI is an AI-powered platform that helps Indian citizens understand and access public services. You can ask questions, find services, register grievances, upload documents, and track your applications — all in one place.',
    answerHi: 'Vidur AI एक AI-संचालित प्लेटफॉर्म है जो भारतीय नागरिकों को सार्वजनिक सेवाओं को समझने और उन तक पहुंचने में मदद करता है। आप एक ही जगह प्रश्न पूछ सकते हैं, सेवाएं खोज सकते हैं, शिकायतें दर्ज कर सकते हैं, दस्तावेज अपलोड कर सकते हैं, और अपने आवेदन ट्रैक कर सकते हैं।',
  },
  {
    question: 'How do I register a grievance?',
    questionHi: 'मैं शिकायत कैसे दर्ज करूं?',
    answer: 'Go to "Register Grievance" from the navigation menu. Select a service, describe your problem, provide your location, optionally upload a document, review your details, and submit. You will receive a grievance ID to track your request.',
    answerHi: 'नेविगेशन मेनू से "शिकायत दर्ज करें" पर जाएं। एक सेवा चुनें, अपनी समस्या बताएं, अपना स्थान दें, वैकल्पिक रूप से दस्तावेज अपलोड करें, अपना विवरण देखें, और जमा करें। आपको अपना अनुरोध ट्रैक करने के लिए एक शिकायत आईडी मिलेगी।',
  },
  {
    question: 'How do I track my grievance status?',
    questionHi: 'मैं अपनी शिकायत स्थिति कैसे ट्रैक करूं?',
    answer: 'Go to "Track Status" and enter your grievance ID (e.g., GRV-2026-00125). You will see the current status, department, priority, and a timeline of all updates.',
    answerHi: '"स्थिति ट्रैक" पर जाएं और अपनी शिकायत आईडी (जैसे GRV-2026-00125) दर्ज करें। आपको वर्तमान स्थिति, विभाग, प्राथमिकता, और सभी अपडेट की टाइमलाइन दिखेगी।',
  },
  {
    question: 'Can I use Vidur AI in Hindi?',
    questionHi: 'क्या मैं Vidur AI का उपयोग हिंदी में कर सकता हूं?',
    answer: 'Yes! Click the language selector in the top right corner to switch between English and हिंदी. The AI assistant also understands Hinglish (a mix of Hindi and English).',
    answerHi: 'हां! ऊपर दाईं ओर भाषा चयनकर्ता पर क्लिक करें अंग्रेजी और हिंदी के बीच स्विच करने के लिए। AI सहायक हिंग्लिश (हिंदी और अंग्रेजी का मिश्रण) भी समझता है।',
  },
  {
    question: 'What is the Document AI feature?',
    questionHi: 'दस्तावेज़ AI सुविधा क्या है?',
    answer: 'Upload any government document (PDF, JPG, or PNG) and Vidur AI will use OCR to extract key information like your name, application ID, and dates. It also provides an AI summary of the document.',
    answerHi: 'कोई भी सरकारी दस्तावेज़ (PDF, JPG, या PNG) अपलोड करें और Vidur AI OCR का उपयोग करके आपका नाम, आवेदन आईडी, और तिथियों जैसी महत्वपूर्ण जानकारी निकालेगा। यह दस्तावेज़ का एक AI सारांश भी प्रदान करता है।',
  },
  {
    question: 'Is my data safe?',
    questionHi: 'क्या मेरा डेटा सुरक्षित है?',
    answer: 'Vidur AI follows government data protection standards. Your personal information is encrypted and only used for processing your requests. We do not share your data with third parties.',
    answerHi: 'Vidur AI सरकारी डेटा संरक्षण मानकों का पालन करता है। आपकी व्यक्तिगत जानकारी एन्क्रिप्टेड है और केवल आपके अनुरोधों को संसाधित करने के लिए उपयोग की जाती है।',
  },
];

const helpTopics = [
  { icon: Sparkles, title: 'AI Assistant', titleHi: 'AI सहायक', desc: 'Ask any question about public services', descHi: 'सार्वजनिक सेवाओं के बारे में कोई भी प्रश्न पूछें', route: '/assistant' },
  { icon: ClipboardList, title: 'Register Grievance', titleHi: 'शिकायत दर्ज करें', desc: 'Submit a new grievance in 5 simple steps', descHi: '5 आसान चरणों में नई शिकायत जमा करें', route: '/register-grievance' },
  { icon: Search, title: 'Track Status', titleHi: 'स्थिति ट्रैक करें', desc: 'Check the status of your submitted grievances', descHi: 'अपनी जमा की गई शिकायतों की स्थिति जांचें', route: '/track' },
  { icon: Upload, title: 'Document AI', titleHi: 'दस्तावेज़ AI', desc: 'Upload and understand your documents with AI', descHi: 'AI के साथ अपने दस्तावेज़ अपलोड करें और समझें', route: '/document-ai' },
];

const accessibilityFeatures = [
  { icon: Languages, title: 'Multilingual Support', titleHi: 'बहुभाषी समर्थन', desc: 'Available in English and Hindi', descHi: 'अंग्रेजी और हिंदी में उपलब्ध' },
  { icon: Accessibility, title: 'Large Touch Targets', titleHi: 'बड़े टच लक्ष्य', desc: 'Buttons and controls are easy to tap', descHi: 'बटन और नियंत्रण टैप करने में आसान हैं' },
  { icon: ShieldCheck, title: 'High Contrast', titleHi: 'उच्च कंट्रास्ट', desc: 'Readable text on all backgrounds', descHi: 'सभी पृष्ठभूमि पर पठनीय टेक्स्ट' },
];

export function HelpPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5">
          <HelpCircle className="h-4 w-4 text-brand-600" />
          <span className="text-sm font-medium text-brand-700">{t('Help & Support', 'सहायता और समर्थन')}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {t('How can we help you?', 'हम आपकी कैसे मदद कर सकते हैं?')}
        </h1>
        <p className="mt-2 text-gray-500">
          {t('Find answers, learn about features, and get support', 'उत्तर खोजें, सुविधाओं के बारे में जानें, और सहायता प्राप्त करें')}
        </p>
      </div>

      {/* Quick Help Topics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {helpTopics.map((topic, idx) => (
          <Card key={idx} hover className="flex items-center gap-4 p-5" onClick={() => navigate(topic.route)}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50">
              <topic.icon className="h-6 w-6 text-brand-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">{t(topic.title, topic.titleHi)}</h3>
              <p className="mt-0.5 text-xs text-gray-500">{t(topic.desc, topic.descHi)}</p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-gray-300" />
          </Card>
        ))}
      </div>

      {/* Accessibility */}
      <Card className="mb-8 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Accessibility className="h-5 w-5 text-brand-600" />
          {t('Accessibility Features', 'सुलभता सुविधाएं')}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {accessibilityFeatures.map((feature, idx) => (
            <div key={idx} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50">
                <feature.icon className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">{t(feature.title, feature.titleHi)}</h3>
              <p className="mt-1 text-xs text-gray-500">{t(feature.desc, feature.descHi)}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* FAQs */}
      <Card className="mb-8 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t('Frequently Asked Questions', 'अक्सर पूछे जाने वाले प्रश्न')}
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-gray-100">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium text-gray-800">
                  {lang === 'en' ? faq.question : faq.questionHi}
                </span>
                {openFaq === idx ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                )}
              </button>
              {openFaq === idx && (
                <div className="border-t border-gray-100 p-4 animate-fade-in">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {lang === 'en' ? faq.answer : faq.answerHi}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Contact */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t('Still need help?', 'अभी भी सहायता चाहिए?')}
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          {t('Our support team is available to assist you with any questions or issues.', 'हमारी सहायता टीम आपके किसी भी प्रश्न या समस्या में सहायता के लिए उपलब्ध है।')}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm">
            <Phone className="h-4 w-4" />
            {t('Call Support', 'सहायता कॉल करें')}
          </Button>
          <Button variant="ghost" size="sm">
            <Mail className="h-4 w-4" />
            {t('Email Us', 'हमें ईमेल करें')}
          </Button>
          <Button size="sm" onClick={() => navigate('/assistant')}>
            <Sparkles className="h-4 w-4" />
            {t('Ask AI Assistant', 'AI सहायक से पूछें')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
