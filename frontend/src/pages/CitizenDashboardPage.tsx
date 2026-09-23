import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ClipboardList,
  Search,
  Upload,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Sun,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, LoadingSpinner } from '@/components/ui';
import { getDashboardStats, getRecentActivity } from '@/lib/api';
import { getStatusColor, formatDate } from '@/lib/utils';
import type { Grievance, DashboardStats } from '@/types';

export function CitizenDashboardPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [s, r] = await Promise.all([getDashboardStats(), getRecentActivity()]);
      setStats(s);
      setRecent(r);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner message={t('Loading your dashboard...', 'आपका डैशबोर्ड लोड हो रहा है...')} />;

  const statCards = [
    { label: t('Active Grievances', 'सक्रिय शिकायतें'), value: stats?.activeGrievances || 0, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: t('Resolved', 'हल हुई'), value: stats?.resolved || 0, icon: CheckCircle2, color: 'text-accent-600', bg: 'bg-accent-50' },
    { label: t('Pending Actions', 'लंबित कार्रवाई'), value: stats?.pendingActions || 0, icon: Clock, color: 'text-brand-600', bg: 'bg-brand-50' },
  ];

  const quickActions = [
    { label: t('Ask Vidur AI', 'Vidur AI से पूछें'), icon: Sparkles, route: '/assistant', color: 'bg-brand-600' },
    { label: t('Register Grievance', 'शिकायत दर्ज करें'), icon: ClipboardList, route: '/register-grievance', color: 'bg-accent-600' },
    { label: t('Track Status', 'स्थिति ट्रैक करें'), icon: Search, route: '/track', color: 'bg-saffron-500' },
    { label: t('Upload Document', 'दस्तावेज़ अपलोड करें'), icon: Upload, route: '/document-ai', color: 'bg-indigo-500' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron-100">
          <Sun className="h-6 w-6 text-saffron-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {t('Good morning, Citizen', 'सुप्रभात, नागरिक')}
          </h1>
          <p className="mt-1 text-gray-500">
            {t('Here is an overview of your activities', 'यहाँ आपकी गतिविधियों का अवलोकन है')}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t('Quick Actions', 'त्वरित कार्रवाई')}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => navigate(action.route)}
              className="group flex flex-col items-center gap-3 rounded-xl border border-gray-100 p-4 text-center transition-all hover:border-brand-200 hover:bg-brand-50/30"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color} text-white transition-transform group-hover:scale-110`}>
                <action.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('Recent Activity', 'हाल की गतिविधि')}
          </h2>
          <button
            onClick={() => navigate('/grievances')}
            className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            {t('View All', 'सभी देखें')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          {recent.map((g) => {
            const statusColors = getStatusColor(g.status);
            return (
              <Card key={g.id} hover className="flex items-center gap-4 p-4" onClick={() => navigate(`/track?id=${g.id}`)}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${statusColors.bg}`}>
                  <TrendingUp className={`h-5 w-5 ${statusColors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-gray-400">{g.id}</p>
                    <span className={`badge ${statusColors.bg} ${statusColors.text}`}>{g.status}</span>
                  </div>
                  <p className="mt-0.5 truncate text-sm font-semibold text-gray-900">{g.serviceName}</p>
                  <p className="text-xs text-gray-400">{formatDate(g.createdAt)}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-gray-300" />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
