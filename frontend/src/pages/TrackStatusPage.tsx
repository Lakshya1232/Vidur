import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Building,
  AlertCircle,
  Calendar,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, Button, Badge, LoadingSpinner, ErrorState, EmptyState } from '@/components/ui';
import { getGrievance } from '@/lib/api';
import { getStatusColor, getPriorityColor, formatDate } from '@/lib/utils';
import type { Grievance } from '@/types';

export function TrackStatusPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [searchId, setSearchId] = useState(searchParams.get('id') || '');
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (id?: string) => {
    const queryId = id || searchId;
    if (!queryId.trim()) return;

    setLoading(true);
    setSearched(true);
    setNotFound(false);
    setGrievance(null);

    try {
      const result = await getGrievance(queryId.trim());
      if (result) {
        setGrievance(result);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setSearchId(id);
      handleSearch(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {t('Track Your Grievance', 'अपनी शिकायत ट्रैक करें')}
        </h1>
        <p className="mt-2 text-gray-500">
          {t('Enter your grievance ID to see the current status', 'वर्तमान स्थिति देखने के लिए अपनी शिकायत आईडी दर्ज करें')}
        </p>
      </div>

      {/* Search */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="GRV-2026-00125"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-base text-gray-800 placeholder-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
              aria-label="Grievance ID input"
            />
          </div>
          <Button onClick={() => handleSearch()} disabled={loading || !searchId.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {t('Track Status', 'स्थिति ट्रैक करें')}
          </Button>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          {t('Tip: Try GRV-2026-00125, GRV-2026-00112, GRV-2026-00098', 'सुझाव: GRV-2026-00125, GRV-2026-00112, GRV-2026-00098 आजमाएं')}
        </p>
      </Card>

      {/* Loading */}
      {loading && <LoadingSpinner message={t('Searching for your grievance...', 'आपकी शिकायत खोजी जा रही है...')} />}

      {/* Not Found */}
      {notFound && !loading && (
        <ErrorState
          title={t('Invalid Grievance ID', 'अमान्य शिकायत आईडी')}
          message={t('No grievance found with this ID. Please check and try again.', 'इस आईडी के साथ कोई शिकायत नहीं मिली। कृपया जांचें और पुनः प्रयास करें।')}
          onRetry={() => handleSearch()}
          icon={<AlertCircle className="h-7 w-7 text-red-500" />}
        />
      )}

      {/* Results */}
      {grievance && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Grievance Info Card */}
          <Card className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400">{grievance.id}</p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">{grievance.serviceName}</h2>
              </div>
              <Badge variant={grievance.status === 'Resolved' ? 'success' : grievance.status === 'Rejected' ? 'error' : 'warning'}>
                {grievance.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <div>
                <p className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Building className="h-3.5 w-3.5" />
                  {t('Department', 'विभाग')}
                </p>
                <p className="mt-0.5 text-sm font-medium text-gray-800">{grievance.department}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs text-gray-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {t('Priority', 'प्राथमिकता')}
                </p>
                <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${getPriorityColor(grievance.priority).bg} ${getPriorityColor(grievance.priority).text}`}>
                  {grievance.priority}
                </span>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar className="h-3.5 w-3.5" />
                  {t('Submitted On', 'जमा किया गया')}
                </p>
                <p className="mt-0.5 text-sm font-medium text-gray-800">{formatDate(grievance.submittedAt)}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  {t('Last Updated', 'अंतिम अपडेट')}
                </p>
                <p className="mt-0.5 text-sm font-medium text-gray-800">{formatDate(grievance.updatedAt)}</p>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              {t('Status Timeline', 'स्थिति टाइमलाइन')}
            </h3>
            <div className="relative">
              {(grievance.timeline ?? []).map((event, idx) => {
                const isLast = idx === grievance.timeline.length - 1;
                const isCurrent = event.completed && (idx === grievance.timeline.length - 1 || !grievance.timeline[idx + 1].completed);
                return (
                  <div key={idx} className="relative flex gap-4 pb-8 last:pb-0">
                    {/* Vertical line */}
                    {!isLast && (
                      <div className={`absolute left-4 top-10 h-full w-0.5 ${event.completed ? 'bg-accent-300' : 'bg-gray-200'}`} />
                    )}

                    {/* Icon */}
                    <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      event.completed
                        ? isCurrent
                          ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                          : 'bg-accent-500 text-white'
                        : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                    }`}>
                      {event.completed ? (
                        isCurrent ? (
                          <span className="h-3 w-3 rounded-full bg-white" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <p className={`text-sm font-semibold ${event.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                        {event.status}
                      </p>
                      {event.timestamp && (
                        <p className="mt-0.5 text-xs text-gray-500">{event.timestamp}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">{event.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400">
                {t('Last updated', 'अंतिम अपडेट')} {formatDate(grievance.updatedAt)}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Initial state */}
      {!searched && !loading && (
        <EmptyState
          title={t('Enter a Grievance ID', 'शिकायत आईडी दर्ज करें')}
          message={t('Search for any grievance using its tracking ID to see real-time status updates.', 'किसी भी शिकायत को उसकी ट्रैकिंग आईडी से खोजें और वास्तविक समय स्थिति अपडेट देखें।')}
          icon={<Search className="h-7 w-7 text-gray-400" />}
        />
      )}
    </div>
  );
}
