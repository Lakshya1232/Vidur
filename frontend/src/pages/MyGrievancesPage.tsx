import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ClipboardList, ArrowRight, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, Button, LoadingSpinner, EmptyState } from '@/components/ui';
import { getMyGrievances } from '@/lib/api';
import { getStatusColor, getPriorityColor, formatDate } from '@/lib/utils';
import type { Grievance } from '@/types';

type FilterTab = 'all' | 'active' | 'resolved';

export function MyGrievancesPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getMyGrievances();
      setGrievances(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = grievances.filter((g) => {
    if (filter === 'active' && (g.status === 'Resolved' || g.status === 'Rejected')) return false;
    if (filter === 'resolved' && g.status !== 'Resolved') return false;
    if (search) {
      const q = search.toLowerCase();
      if (!g.id.toLowerCase().includes(q) && !g.serviceName.toLowerCase().includes(q) && !g.issue.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const tabs: { key: FilterTab; label: string; labelHi: string }[] = [
    { key: 'all', label: 'All', labelHi: 'सभी' },
    { key: 'active', label: 'Active', labelHi: 'सक्रिय' },
    { key: 'resolved', label: 'Resolved', labelHi: 'हल हुई' },
  ];

  if (loading) return <LoadingSpinner message={t('Loading your grievances...', 'आपकी शिकायतें लोड हो रही हैं...')} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {t('My Grievances', 'मेरी शिकायतें')}
          </h1>
          <p className="mt-2 text-gray-500">
            {t('Track and manage all your submitted grievances', 'अपनी सभी जमा की गई शिकायतों को ट्रैक और प्रबंधित करें')}
          </p>
        </div>
        <Button className="mt-4 sm:mt-0" onClick={() => navigate('/register-grievance')}>
          <ClipboardList className="h-4 w-4" />
          {t('New Grievance', 'नई शिकायत')}
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('Search by ID, issue, or service...', 'आईडी, समस्या, या सेवा से खोजें...')}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-base text-gray-800 placeholder-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
            aria-label="Search grievances"
          />
        </div>
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                filter === tab.key
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t(tab.label, tab.labelHi)}
            </button>
          ))}
        </div>
      </div>

      {/* Grievance Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          title={t('No grievances found', 'कोई शिकायत नहीं मिली')}
          message={t('You have not submitted any grievances matching the current filter.', 'वर्तमान फ़िल्टर से मेल खाती कोई शिकायत आपने जमा नहीं की है।')}
          icon={<ClipboardList className="h-7 w-7 text-gray-400" />}
          action={<Button onClick={() => navigate('/register-grievance')}>{t('Register a Grievance', 'शिकायत दर्ज करें')}</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((g) => {
            const statusColors = getStatusColor(g.status);
            const priorityColors = getPriorityColor(g.priority);
            return (
              <Card key={g.id} hover className="p-5" onClick={() => navigate(`/track?id=${g.id}`)}>
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-400">{g.id}</p>
                    <h3 className="mt-1 text-base font-semibold text-gray-900">{g.serviceName}</h3>
                  </div>
                  <span className={`badge ${statusColors.bg} ${statusColors.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusColors.dot}`} />
                    {g.status}
                  </span>
                </div>

                <p className="mb-3 text-sm text-gray-500 leading-relaxed line-clamp-2">{g.issue}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(g.createdAt)}
                    </span>

                    <span>•</span>

                    <span>{g.department}</span>

                    <span>•</span>

                    <span className={`badge ${priorityColors.bg} ${priorityColors.text}`}>
                      {g.priority}
                    </span>

                    <span>•</span>

                    <span className="font-medium text-orange-600">
                      Deadline: {formatDate(g.deadlineAt)}
                    </span>
                  </div>

                <div className="mt-4 flex items-center justify-end border-t border-gray-100 pt-3">
                  <span className="flex items-center gap-1 text-sm font-semibold text-brand-600">
                    {t('Track Status', 'स्थिति ट्रैक करें')}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
