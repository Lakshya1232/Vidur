import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { indianStates, stateDistricts } from '@/data/indianLocation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mic,
  Upload,
  FileText,
  ClipboardList,
  MapPin,
  Search,
  X,
  Bot,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, Button, Select, Textarea, Badge, AIProcessingCard } from '@/components/ui';
import { submitGrievance, classifyGrievance, type GrievanceSubmission } from '@/lib/api';
import { getPriorityColor } from '@/lib/utils';
import { publicServices } from '@/data/mockData';
import type { GrievanceAnalysis } from '@/types';

const steps = [
  { label: 'Select Service', labelHi: 'सेवा चुनें', icon: ClipboardList },
  { label: 'Describe Problem', labelHi: 'समस्या बताएं', icon: FileText },
  { label: 'Location', labelHi: 'स्थान', icon: MapPin },
  { label: 'Upload Document', labelHi: 'दस्तावेज अपलोड', icon: Upload },
  { label: 'Review', labelHi: 'समीक्षा', icon: CheckCircle2 },
];



export function RegisterGrievancePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [grievanceId, setGrievanceId] = useState('');
  const [analysis, setAnalysis] = useState<GrievanceAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    serviceId: '',
    serviceName: '',
    issue: '',
    description: '',
    department: '',
    category: '',
    state: '',
    district: '',
    cityVillage: '',
    landmark: '',
    priority: 'Medium' as string,
    attachments: [] as { name: string; type: string }[],
  });

  const districts = formData.state
  ? stateDistricts[formData.state] || []
  : [];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleServiceSelect = (serviceId: string) => {
    const service = publicServices.find((s) => s.id === serviceId);
    if (service) {
      setFormData((prev) => ({
        ...prev,
        serviceId: service.id,
        serviceName: service.name,
        department: service.department,
        category: service.category,
      }));
      setErrors((prev) => ({ ...prev, serviceId: '' }));
    }
  };

  const handleDescriptionChange = async (value: string) => {
    updateField('description', value);
    updateField('issue', value);
    if (value.length > 20 && !analysis) {
      setAnalyzing(true);
      try {
        const result = await classifyGrievance(value);
        setAnalysis(result);
        updateField('priority', result.priority);
      } catch {
        // silent fail
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((f) => ({
        name: f.name,
        type: f.name.split('.').pop() || 'file',
      }));
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments],
      }));
    }
  };

  const removeAttachment = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== idx),
    }));
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 0 && !formData.serviceId) {
      newErrors.serviceId = t('Please select a service', 'कृपया एक सेवा चुनें');
    }
    if (currentStep === 1 && formData.description.length < 10) {
      newErrors.description = t('Please describe your issue (at least 10 characters)', 'कृपया अपनी समस्या बताएं (कम से कम 10 अक्षर)');
    }
    if (currentStep === 2 && !formData.state) {
      newErrors.state = t('Please select your state', 'कृपया अपना राज्य चुनें');
    }
    if (currentStep === 2 && !formData.district) {
      newErrors.district = t('Please select your district', 'कृपया अपना जिला चुनें');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const submission: GrievanceSubmission = {
        serviceId: formData.serviceId,
        serviceName: formData.serviceName,
        issue: formData.issue,
        description: formData.description,
        department: formData.department,
        category: formData.category,
        state: formData.state,
        district: formData.district,
        cityVillage: formData.cityVillage,
        landmark: formData.landmark,
        priority: formData.priority,
        attachments: formData.attachments,
      };
      const result = await submitGrievance(submission);
      setGrievanceId(result.id);
      setSubmitted(true);
    } catch {
      // show error
    } finally {
      setSubmitting(false);
    }
  };

  // Success Screen
  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Card className="p-8 text-center animate-fade-in">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent-100">
            <CheckCircle2 className="h-10 w-10 text-accent-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('Grievance Submitted Successfully', 'शिकायत सफलतापूर्वक दर्ज की गई')}
          </h1>
          <p className="mt-2 text-gray-500">
            {t('Your grievance has been registered. Save your grievance ID for tracking.', 'आपकी शिकायत दर्ज की गई है। ट्रैकिंग के लिए अपनी शिकायत आईडी सहेजें।')}
          </p>

          <div className="mx-auto mt-6 max-w-xs rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs text-gray-400">{t('Grievance ID', 'शिकायत आईडी')}</p>
            <p className="mt-1 text-xl font-bold text-brand-600">{grievanceId}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => navigate(`/track?id=${grievanceId}`)}>
              <Search className="h-4 w-4" />
              {t('Track Status', 'स्थिति ट्रैक करें')}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              {t('Go to Dashboard', 'डैशबोर्ड पर जाएं')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('Back', 'वापस')}
      </button>

      <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
        {t('Register a Grievance', 'शिकायत दर्ज करें')}
      </h1>
      <p className="mb-8 text-gray-500">
        {t('Complete all steps to submit your grievance', 'अपनी शिकायत जमा करने के लिए सभी चरण पूरे करें')}
      </p>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  idx <= currentStep
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-gray-200 bg-white text-gray-400'
                }`}
              >
                {idx < currentStep ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className={`mt-2 hidden text-xs font-medium sm:block ${idx <= currentStep ? 'text-brand-600' : 'text-gray-400'}`}>
                {t(step.label, step.labelHi)}
              </span>
              {idx < steps.length - 1 && (
                <div className={`absolute h-0.5 ${idx < currentStep ? 'bg-brand-600' : 'bg-gray-200'}`} style={{ width: 'calc(100% / 5 - 40px)', left: `calc(${(idx + 0.5) * 20}% + 20px)`, top: '20px' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        {/* Step 1: Select Service */}
        {currentStep === 0 && (
          <div className="animate-fade-in">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t('Select a Service', 'सेवा चुनें')}
            </h2>
            <div className="space-y-2">
              {publicServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                    formData.serviceId === service.id
                      ? 'border-brand-400 bg-brand-50 ring-2 ring-brand-200'
                      : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${formData.serviceId === service.id ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{t(service.name, service.nameHi)}</p>
                    <p className="text-xs text-gray-500">{t(service.department, service.departmentHi)}</p>
                  </div>
                  {formData.serviceId === service.id && (
                    <CheckCircle2 className="h-5 w-5 text-brand-600" />
                  )}
                </button>
              ))}
            </div>
            {errors.serviceId && <p className="mt-2 text-xs text-red-500">{errors.serviceId}</p>}
          </div>
        )}

        {/* Step 2: Describe Problem */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t('Describe Your Problem', 'अपनी समस्या बताएं')}
            </h2>
            <Textarea
              value={formData.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder={t('Describe your issue in your own words...', 'अपनी समस्या अपने शब्दों में बताएं...')}
              rows={5}
              error={errors.description}
              hint={t('AI will analyze your description to classify the grievance', 'AI आपके विवरण का विश्लेषण करके शिकायत वर्गीकृत करेगा')}
            />
            {analyzing && (
  <div className="mt-3 text-sm text-gray-500">
    🤖 Analyzing your grievance...
  </div>
)}

{analysis && (
  <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
    <h4 className="font-semibold text-blue-900">
      🤖 AI Analysis
    </h4>

    <div className="mt-2 space-y-1 text-sm">
      <p>
        <strong>Detected Category:</strong> {analysis.detectedService}
      </p>

      <p>
        <strong>Priority:</strong> {analysis.priority}
      </p>

      <p>
        <strong>Suggested Action:</strong> {analysis.suggestedAction}
      </p>
    </div>
  </div>
)}














            <div className="mt-3 flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100">
                <Mic className="h-4 w-4" />
                {t('Voice Input', 'वॉइस इनपुट')}
              </button>
            </div>

            {analyzing && (
              <div className="mt-4">
                <AIProcessingCard message={t('Analyzing your description...', 'आपका विवरण विश्लेषण किया जा रहा है...')} />
              </div>
            )}

            {analysis && !analyzing && (
              <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/30 p-4 animate-slide-up">
                <div className="mb-3 flex items-center gap-2">
                  <Bot className="h-4 w-4 text-brand-600" />
                  <span className="text-sm font-semibold text-brand-800">{t('AI Analysis', 'AI विश्लेषण')}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-white/80 p-2.5">
                    <p className="text-xs text-gray-400">{t('Detected Service', 'पहचानी गई सेवा')}</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-800">{analysis.detectedService}</p>
                  </div>
                  <div className="rounded-lg bg-white/80 p-2.5">
                    <p className="text-xs text-gray-400">{t('Issue', 'समस्या')}</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-800">{analysis.issue}</p>
                  </div>
                  <div className="rounded-lg bg-white/80 p-2.5">
                    <p className="text-xs text-gray-400">{t('Department', 'विभाग')}</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-800">{analysis.department}</p>
                  </div>
                  <div className="rounded-lg bg-white/80 p-2.5">
                    <p className="text-xs text-gray-400">{t('Priority', 'प्राथमिकता')}</p>
                    <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${getPriorityColor(analysis.priority).bg} ${getPriorityColor(analysis.priority).text}`}>
                      {analysis.priority}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white/80 p-2.5">
                    <p className="text-xs text-gray-400">{t('Confidence', 'विश्वास')}</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-800">{analysis.confidence}</p>
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-white p-3">
                  <p className="text-xs text-gray-400">{t('Suggested Action', 'सुझाई गई कार्रवाई')}</p>
                  <p className="mt-1 text-sm text-gray-800">{analysis.suggestedAction}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Location */}
        {currentStep === 2 && (
          <div className="animate-fade-in space-y-4">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t('Your Location', 'आपका स्थान')}
            </h2>
            <Select
              label={t('State', 'राज्य')}
              value={formData.state}
              onChange={(e) => {
                updateField('state', e.target.value);
                updateField('district', '');
              }}
              error={errors.state}
            >
              <option value="">{t('Select state', 'राज्य चुनें')}</option>
              {indianStates.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
            <Select
              label={t('District', 'जिला')}
              value={formData.district}
              onChange={(e) => updateField('district', e.target.value)}
              error={errors.district}
            >
              <option value="">{t('Select district', 'जिला चुनें')}</option>
                  {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
                ))}
            </Select>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {t('City / Village', 'शहर / गांव')}
              </label>
              <input
                type="text"
                value={formData.cityVillage}
                onChange={(e) => updateField('cityVillage', e.target.value)}
                placeholder={t('Enter city or village name', 'शहर या गांव का नाम दर्ज करें')}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {t('Landmark (Optional)', 'लैंडमार्क (वैकल्पिक)')}
              </label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => updateField('landmark', e.target.value)}
                placeholder={t('Near bus stand, temple, etc.', 'बस स्टैंड, मंदिर, आदि के पास')}
                className="input-field"
              />
            </div>
          </div>
        )}

        {/* Step 4: Upload Document */}
        {currentStep === 3 && (
          <div className="animate-fade-in">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t('Upload Supporting Document', 'सहायक दस्तावेज अपलोड करें')}
            </h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-all hover:border-brand-400 hover:bg-brand-50"
            >
              <Upload className="h-10 w-10 text-gray-400" />
              <p className="mt-3 text-sm font-medium text-gray-700">
                {t('Drag and drop or click to upload', 'खींचें और छोड़ें या अपलोड करने के लिए क्लिक करें')}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {t('Upload PDF, JPG or PNG', 'PDF, JPG या PNG अपलोड करें')}
              </p>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.png"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Uploaded files */}
            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50">
                      <FileText className="h-4 w-4 text-brand-600" />
                    </div>
                    <span className="flex-1 text-sm text-gray-700">{file.name}</span>
                    <button onClick={() => removeAttachment(idx)} className="text-gray-400 hover:text-red-500">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-brand-50/50 p-3">
              <Bot className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              <p className="text-xs text-brand-700">
                {t('AI/OCR will extract relevant information from your document.', 'AI/OCR आपके दस्तावेज से संबंधित जानकारी निकालेगा।')}
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 4 && (
          <div className="animate-fade-in">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t('Review Your Grievance', 'अपनी शिकायत की समीक्षा करें')}
            </h2>
            <div className="space-y-3">
              <ReviewItem label={t('Service', 'सेवा')} value={formData.serviceName} />
              <ReviewItem label={t('Issue', 'समस्या')} value={formData.description} />
              <ReviewItem label={t('Department', 'विभाग')} value={formData.department} />
              <ReviewItem label={t('Category', 'श्रेणी')} value={formData.category} />
              <ReviewItem label={t('Location', 'स्थान')} value={`${formData.cityVillage}, ${formData.district}, ${formData.state}`} />
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-500">{t('Priority', 'प्राथमिकता')}</span>
                <Badge variant={formData.priority === 'High' || formData.priority === 'Urgent' ? 'warning' : 'info'}>
                  {formData.priority}
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-500">{t('Attachments', 'संलग्नक')}</span>
                <span className="text-sm font-medium text-gray-800">
                  {formData.attachments.length} {t('file(s)', 'फ़ाइलें')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0}>
            <ArrowLeft className="h-4 w-4" />
            {t('Back', 'वापस')}
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              {t('Next', 'अगला')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="accent" onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('Submitting...', 'जमा हो रहा है...')}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {t('Submit Grievance', 'शिकायत जमा करें')}
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-gray-800">{value || '—'}</p>
    </div>
  );
}
