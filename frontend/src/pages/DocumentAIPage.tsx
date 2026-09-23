import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  Bot,
  CheckCircle2,
  Sparkles,
  ClipboardList,
  X,
  Loader2,
  FileScan,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, Button, Badge } from '@/components/ui';
import { analyzeDocument } from '@/lib/api';
import type { DocumentAnalysis } from '@/types';

export function DocumentAIPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [error, setError] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError(true);
      return;
    }

    setError(false);
    setUploading(true);

    // Simulate upload progress
    await new Promise((r) => setTimeout(r, 1000));
    setUploading(false);
    setAnalyzing(true);

    try {
      const result = await analyzeDocument(file);
      setAnalysis(result);
    } catch {
      setError(true);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5">
          <FileScan className="h-4 w-4 text-brand-600" />
          <span className="text-sm font-medium text-brand-700">{t('Document AI', 'दस्तावेज़ AI')}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {t('Understand Your Document', 'अपना दस्तावेज़ समझें')}
        </h1>
        <p className="mt-2 text-gray-500">
          {t('Upload a document and let AI extract key information for you.', 'दस्तावेज़ अपलोड करें और AI आपके लिए महत्वपूर्ण जानकारी निकाले।')}
        </p>
      </div>

      {/* Upload Area */}
      {!analysis && !analyzing && (
        <Card className="p-8">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center transition-all hover:border-brand-400 hover:bg-brand-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-brand-500" />
                <p className="mt-4 text-sm font-medium text-gray-700">{t('Uploading...', 'अपलोड हो रहा है...')}</p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400" />
                <p className="mt-4 text-base font-medium text-gray-700">
                  {t('Drag and drop or click to upload', 'खींचें और छोड़ें या क्लिक करें')}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  {t('Upload PDF, JPG or PNG', 'PDF, JPG या PNG अपलोड करें')}
                </p>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.png"
            className="hidden"
            onChange={handleFileSelect}
          />

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4">
              <X className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-700">
                {t('Unsupported document format. Please upload PDF, JPG, or PNG files only.', 'असमर्थित दस्तावेज़ प्रारूप। कृपया केवल PDF, JPG, या PNG फ़ाइलें अपलोड करें।')}
              </p>
            </div>
          )}

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-brand-50/50 p-3">
            <Bot className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            <p className="text-xs text-brand-700">
              {t('AI/OCR will extract relevant information from your document and provide a summary.', 'AI/OCR आपके दस्तावेज़ से संबंधित जानकारी निकालेगा और एक सारांश प्रदान करेगा।')}
            </p>
          </div>
        </Card>
      )}

      {/* Analyzing */}
      {analyzing && (
        <Card className="p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100">
            <Bot className="h-8 w-8 text-brand-600 animate-pulse-soft" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-800">
            {t('Analyzing your document...', 'आपका दस्तावेज़ विश्लेषण किया जा रहा है...')}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t('Extracting text with OCR and running AI analysis', 'OCR के साथ टेक्स्ट निकाला जा रहा है और AI विश्लेषण चल रहा है')}
          </p>
          <div className="mx-auto mt-6 flex max-w-xs items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-brand-500 animate-pulse-soft" style={{ width: '70%' }} />
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      {analysis && !analyzing && (
        <div className="space-y-6 animate-fade-in">
          {/* Document Info */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                  <FileText className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{analysis.fileName}</p>
                  <p className="text-xs text-gray-500">{analysis.documentType}</p>
                </div>
              </div>
              <Badge variant="success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t('OCR Completed', 'OCR पूर्ण')}
              </Badge>
            </div>
          </Card>

          {/* Extracted Information */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {t('Extracted Information', 'निकाली गई जानकारी')}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {analysis.extractedFields.map((field, idx) => (
                <div key={idx} className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                  <p className="text-xs text-gray-400">{field.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-800">{field.value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Summary */}
          <Card className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100">
                <Sparkles className="h-4 w-4 text-brand-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('AI Summary', 'AI सारांश')}
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{analysis.aiSummary}</p>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/assistant')}>
              <Sparkles className="h-4 w-4" />
              {t('Ask AI About This Document', 'इस दस्तावेज़ के बारे में AI से पूछें')}
            </Button>
            <Button variant="accent" onClick={() => navigate('/register-grievance')}>
              <ClipboardList className="h-4 w-4" />
              {t('Register Grievance', 'शिकायत दर्ज करें')}
            </Button>
            <Button variant="ghost" onClick={handleReset}>
              {t('Upload Another', 'दूसरा अपलोड करें')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
