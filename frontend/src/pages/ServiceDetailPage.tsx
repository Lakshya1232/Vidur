import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ListChecks,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, Button, Badge, LoadingSpinner, ErrorState } from '@/components/ui';
import { getService } from '@/lib/api';
import type { PublicService } from '@/types';

export function ServiceDetailPage() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [service, setService] = useState<PublicService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getService(id || '');
      if (data) {
        setService(data);
      } else {
        setError(true);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <LoadingSpinner message={t('Loading service details...', 'सेवा विवरण लोड हो रहा है...')} />;
  if (error || !service) return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <ErrorState
        title={t('Service Not Found', 'सेवा नहीं मिली')}
        message={t('The service you are looking for does not exist or has been removed.', 'आप जिस सेवा की तलाश में हैं वह मौजूद नहीं है या हटा दी गई है।')}
        onRetry={() => navigate('/services')}
      />
    </div>
  );

  const faqs = lang === 'en' ? service.faqs : service.faqsHi;
  const eligibility = lang === 'en' ? service.eligibility : service.eligibilityHi;
  const process = lang === 'en' ? service.process : service.processHi;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/services')}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('Back to Services', 'सेवाओं पर वापस')}
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="default">{service.serviceType}</Badge>
          <Badge variant="neutral">{t(service.category, service.category)}</Badge>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {t(service.name, service.nameHi)}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Building className="h-4 w-4" />
            {t(service.department, service.departmentHi)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {t('Processing', 'प्रसंस्करण')}: {t(service.estimatedTime, service.estimatedTimeHi)}
          </span>
        </div>
        <p className="mt-4 text-gray-600 leading-relaxed">
          {t(service.description, service.descriptionHi)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Button onClick={() => navigate('/assistant')}>
          <Sparkles className="h-4 w-4" />
          {t('Ask AI', 'AI से पूछें')}
        </Button>

        {service.serviceType === 'Application' && (
          <Button
            variant="accent"
            onClick={() => navigate(`/apply/${service.id}`)}
          >
            <ClipboardList className="h-4 w-4" />
            {t('Apply Now', 'अभी आवेदन करें')}
          </Button>
        )}

        {service.serviceType === 'Registration' && (
          <Button
            variant="accent"
            onClick={() => navigate(`/apply/${service.id}`)}
          >
            <ClipboardList className="h-4 w-4" />
            {t('Register Now', 'अभी पंजीकरण करें')}
          </Button>
        )}

        {service.serviceType === 'Information' && (
          <Button
            variant="accent"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <FileText className="h-4 w-4" />
            {t('View Information', 'जानकारी देखें')}
          </Button>
        )}

        {service.serviceType === 'Grievance' && (
          <Button
            variant="accent"
            onClick={() => navigate('/register-grievance')}
          >
            <ClipboardList className="h-4 w-4" />
            {t('Register Grievance', 'शिकायत दर्ज करें')}
          </Button>
        )}
      </div>

      {/* Eligibility */}
      <Card className="mb-6 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <CheckCircle2 className="h-5 w-5 text-accent-600" />
          {t('Eligibility', 'पात्रता')}
        </h2>
        <ul className="space-y-3">
          {eligibility.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Required Documents */}
      <Card className="mb-6 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <FileText className="h-5 w-5 text-brand-600" />
          {t('Required Documents', 'आवश्यक दस्तावेज')}
        </h2>
        <div className="space-y-2">
          {service.requiredDocuments.map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
              <span className="text-sm text-gray-700">{t(doc.label, doc.labelHi)}</span>
              {doc.required ? (
                <Badge variant="error">{t('Required', 'आवश्यक')}</Badge>
              ) : (
                <Badge variant="neutral">{t('Optional', 'वैकल्पिक')}</Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Process */}
      <Card className="mb-6 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <ListChecks className="h-5 w-5 text-brand-600" />
          {t('Process', 'प्रक्रिया')}
        </h2>
        <ol className="space-y-4">
          {process.map((step, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                {idx + 1}
              </span>
              <p className="pt-0.5 text-sm text-gray-600">{step}</p>
            </li>
          ))}
        </ol>
      </Card>

      {/* Expected Timeline */}
      <Card className="mb-6 p-6">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Clock className="h-5 w-5 text-brand-600" />
          {t('Expected Timeline', 'अपेक्षित समय-सीमा')}
        </h2>
        <p className="text-sm text-gray-600">
          {t(
            `The estimated processing time for this service is ${service.estimatedTime}.`,
            `इस सेवा का अनुमानित प्रसंस्करण समय ${service.estimatedTimeHi} है।`
          )}
        </p>
      </Card>

      {/* FAQs */}
      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <HelpCircle className="h-5 w-5 text-brand-600" />
          {t('Frequently Asked Questions', 'अक्सर पूछे जाने वाले प्रश्न')}
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-gray-100">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium text-gray-800">{faq.question}</span>
                {openFaq === idx ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                )}
              </button>
              {openFaq === idx && (
                <div className="border-t border-gray-100 p-4 animate-fade-in">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
