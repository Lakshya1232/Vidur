import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  CheckCircle2,
  MapPin,
  Send,
} from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';
import { Button, Card, LoadingSpinner, ErrorState } from '@/components/ui';
import { getService, submitApplication } from '@/lib/api';
import { indianStates, stateDistricts } from '../data/indianLocation';
import type { PublicService } from '@/types';

export function ApplyServicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const [service, setService] = useState<PublicService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    applicantName: '',
    state: '',
    district: '',
  });

  useEffect(() => {
    const loadService = async () => {
      setLoading(true);

      try {
        const data = await getService(id || '');

        if (data) {
          setService(data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  const districts = formData.state
    ? stateDistricts[formData.state] || []
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!service) return;

    if (
      !formData.applicantName.trim() ||
      !formData.state ||
      !formData.district
    ) {
      alert(
        t(
          'Please fill all required fields.',
          'कृपया सभी आवश्यक जानकारी भरें।'
        )
      );
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitApplication({
        serviceId: service.id,
        serviceName: service.name,
        department: service.department,
        category: service.category,
        applicantName: formData.applicantName,
        state: formData.state,
        district: formData.district,
        applicationData: {
          applicantName: formData.applicantName,
          state: formData.state,
          district: formData.district,
        },
      });

      setSubmittedId(result.id);
    } catch (error) {
      console.error(error);

      alert(
        t(
          'Failed to submit application. Please try again.',
          'आवेदन जमा नहीं हो सका। कृपया पुनः प्रयास करें।'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner
        message={t(
          'Loading application...',
          'आवेदन फॉर्म लोड हो रहा है...'
        )}
      />
    );
  }

  if (error || !service) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState
          title={t('Service Not Found', 'सेवा नहीं मिली')}
          message={t(
            'The selected service could not be found.',
            'चयनित सेवा नहीं मिली।'
          )}
          onRetry={() => navigate('/services')}
        />
      </div>
    );
  }

  if (submittedId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Card className="p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            {t(
              'Application Submitted Successfully',
              'आवेदन सफलतापूर्वक जमा हुआ'
            )}
          </h1>

          <p className="mt-3 text-gray-600">
            {t(
              'Your application has been saved successfully.',
              'आपका आवेदन सफलतापूर्वक सुरक्षित कर दिया गया है।'
            )}
          </p>

          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              {t('Application ID', 'आवेदन आईडी')}
            </p>

            <p className="mt-1 text-xl font-bold text-brand-700">
              {submittedId}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate('/services')}>
              {t('Back to Services', 'सेवाओं पर वापस जाएं')}
            </Button>

            <Button
              variant="accent"
              onClick={() => navigate('/dashboard')}
            >
              {t('Go to Dashboard', 'डैशबोर्ड पर जाएं')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const isRegistration = service.serviceType === 'Registration';

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(`/services/${service.id}`)}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('Back to Service', 'सेवा पर वापस जाएं')}
      </button>

      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            {service.serviceType}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {isRegistration
            ? t('Registration Form', 'पंजीकरण फॉर्म')
            : t('Application Form', 'आवेदन फॉर्म')}
        </h1>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <Building className="h-4 w-4" />
          {t(service.department, service.departmentHi)}
        </div>

        <p className="mt-3 text-gray-600">
          {t(service.name, service.nameHi)}
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Applicant Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('Applicant Name', 'आवेदक का नाम')}
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              type="text"
              value={formData.applicantName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  applicantName: e.target.value,
                }))
              }
              placeholder={t(
                'Enter your full name',
                'अपना पूरा नाम दर्ज करें'
              )}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* State */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {t('State', 'राज्य')}
                <span className="text-red-500">*</span>
              </span>
            </label>

            <select
              value={formData.state}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  state: e.target.value,
                  district: '',
                }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              <option value="">
                {t('Select State', 'राज्य चुनें')}
              </option>

              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('District', 'जिला')}
              <span className="ml-1 text-red-500">*</span>
            </label>

            <select
              value={formData.district}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  district: e.target.value,
                }))
              }
              disabled={!formData.state || districts.length === 0}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-gray-100"
            >
              <option value="">
                {!formData.state
                  ? t('Select State First', 'पहले राज्य चुनें')
                  : districts.length === 0
                    ? t(
                        'District data unavailable',
                        'जिले का डेटा उपलब्ध नहीं है'
                      )
                    : t('Select District', 'जिला चुनें')}
              </option>

              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="border-t border-gray-100 pt-6">
            <Button
              type="submit"
              variant="accent"
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              <Send className="h-4 w-4" />

              {submitting
                ? t('Submitting...', 'जमा हो रहा है...')
                : isRegistration
                  ? t('Submit Registration', 'पंजीकरण जमा करें')
                  : t('Submit Application', 'आवेदन जमा करें')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}