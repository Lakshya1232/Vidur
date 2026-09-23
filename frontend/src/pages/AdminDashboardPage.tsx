import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquareWarning,
  Sparkles,
  Building2,
  BarChart3,
  Users,
  Settings,
  AlertTriangle,
  Info,
  ShieldAlert,
  ArrowRight,
  Clock,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, Button, Badge, LoadingSpinner } from '@/components/ui';
import {
  getAdminStats,
  getAdminInsights,
  getAdminChartData,
  getAdminGrievances,
  getAllApplications,
  updateApplicationStatus,
  resolveGrievance,
} from '@/lib/api';
import { getStatusColor, getPriorityColor } from '@/lib/utils';
import type { AdminStats, AdminInsight, Grievance, AdminChartData } from '@/types';

const sidebarItems = [
  { label: 'Dashboard', labelHi: 'डैशबोर्ड', icon: LayoutDashboard, active: true },
  { label: 'Grievances', labelHi: 'शिकायतें', icon: MessageSquareWarning },
  { label: 'AI Insights', labelHi: 'AI अंतर्दृष्टि', icon: Sparkles },
  { label: 'Departments', labelHi: 'विभाग', icon: Building2 },
  { label: 'Analytics', labelHi: 'विश्लेषण', icon: BarChart3 },
  { label: 'Users', labelHi: 'उपयोगकर्ता', icon: Users },
  { label: 'Settings', labelHi: 'सेटिंग्स', icon: Settings },
];

const insightConfig = {
  info: { icon: Info, bg: 'bg-blue-50', text: 'text-blue-700', iconColor: 'text-blue-500' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', text: 'text-amber-700', iconColor: 'text-amber-500' },
  critical: { icon: ShieldAlert, bg: 'bg-red-50', text: 'text-red-700', iconColor: 'text-red-500' },
};

type AdminApplication = {
  id: string;
  serviceName: string;
  department: string;
  applicantName: string;
  state: string;
  district: string;
  status: string;
  submittedAt: string;
};

type AdminGrievance = {
  id: string;
  serviceName: string;
  issue: string;
  department: string;
  priority: string;
  status: string;
  district: string;
  state: string;
  submittedAt: string;
  deadlineAt: string;
  beforeImage?: string | null;
  afterImage?: string | null;
  resolutionDescription?: string | null;
  resolvedAt?: string | null;
  escalatedAt?: string | null;
};

export function AdminDashboardPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [insights, setInsights] = useState<AdminInsight[]>([]);
  const [chartData, setChartData] = useState<AdminChartData | null>(null);
  const [grievances, setGrievances] = useState<AdminGrievance[]>([]);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedGrievance, setSelectedGrievance] =
    useState<AdminGrievance | null>(null);

  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [resolutionDescription, setResolutionDescription] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [s, i, c, g, a] = await Promise.all([
        getAdminStats(),
        getAdminInsights(),
        getAdminChartData(),
        getAdminGrievances(),
        getAllApplications(),
      ]);
      setStats(s);
      setInsights(i);
      setChartData(c);
      setGrievances(g);
      setApplications(a);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !chartData) { <LoadingSpinner message={t('Loading admin dashboard...', 'एडमिन डैशबोर्ड लोड हो रहा है...')} />;}

  const statCards = [
    { label: t('Total Grievances', 'कुल शिकायतें'), value: stats?.totalGrievances || 0, icon: MessageSquareWarning, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: t('Pending', 'लंबित'), value: stats?.pending || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: t('In Progress', 'प्रगति पर'), value: stats?.inProgress || 0, icon: Loader2, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: t('Resolved', 'हल हुई'), value: stats?.resolved || 0, icon: CheckCircle2, color: 'text-accent-600', bg: 'bg-accent-50' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Vidur AI</p>
            <p className="text-xs text-gray-400">{t('Admin Panel', 'एडमिन पैनल')}</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {sidebarItems.map((item, idx) => (
            <button
              key={idx}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {t(item.label, item.labelHi)}
            </button>
          ))}
        </nav>
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">{t('Dept. Official', 'विभाग अधिकारी')}</p>
              <p className="text-xs text-gray-400">admin@vidurai.gov.in</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Mobile sidebar header */}
        <div className="border-b border-gray-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-gray-900">{t('Admin Panel', 'एडमिन पैनल')}</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {t('Department Dashboard', 'विभाग डैशबोर्ड')}
              </h1>
              <p className="mt-1 text-gray-500">
                {t('Monitor and manage grievances across all departments', 'सभी विभागों में शिकायतों की निगरानी और प्रबंधन करें')}
              </p>
            </div>
            <div className="mt-4 flex gap-2 sm:mt-0">
              <Button variant="secondary" size="sm" onClick={() => navigate('/grievances')}>
                <MessageSquareWarning className="h-4 w-4" />
                {t('View Grievances', 'शिकायतें देखें')}
              </Button>
              <Button size="sm" onClick={() => navigate('/assistant')}>
                <Sparkles className="h-4 w-4" />
                {t('AI Insights', 'AI अंतर्दृष्टि')}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {statCards.map((stat, idx) => (
              <Card key={idx} className="p-5">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </Card>
            ))}
          </div>


            {/* Applications */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Applications
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Application ID</th>
                      <th className="text-left py-3">Applicant</th>
                      <th className="text-left py-3">Service</th>
                      <th className="text-left py-3">Department</th>
                      <th className="text-left py-3">Location</th>
                      <th className="text-left py-3">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {applications.map((application) => (
                      <tr key={application.id} className="border-b">
                        <td className="py-3">{application.id}</td>
                        <td className="py-3">{application.applicantName}</td>
                        <td className="py-3">{application.serviceName}</td>
                        <td className="py-3">{application.department}</td>
                        <td className="py-3">
                          {application.district}, {application.state}
                        </td>
                        <td className="py-3">
                          <select
                            value={application.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value;

                              try {
                                await updateApplicationStatus(application.id, newStatus);

                                setApplications((prev) =>
                                  prev.map((item) =>
                                    item.id === application.id
                                      ? { ...item, status: newStatus }
                                      : item
                                  )
                                );
                              } catch (error) {
                                console.error(error);
                                alert('Failed to update application status');
                              }
                            }}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          >
                            <option value="Submitted">Submitted</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Processing">Processing</option>
                            <option value="Approved">Approved</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>


          {/* Grievance Resolution */}
          {selectedGrievance && (
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Resolve Grievance
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedGrievance.id} — {selectedGrievance.issue}
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedGrievance(null);
                    setBeforeImage('');
                    setAfterImage('');
                    setResolutionDescription('');
                  }}
                >
                  Cancel
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Before Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Before-work Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      const reader = new FileReader();

                      reader.onloadend = () => {
                        setBeforeImage(reader.result as string);
                      };

                      reader.readAsDataURL(file);
                    }}
                    className="block w-full text-sm text-gray-600
                              file:mr-4 file:rounded-lg file:border-0
                              file:bg-gray-100 file:px-4 file:py-2
                              file:text-sm file:font-medium"
                  />

                  {beforeImage && (
                    <img
                      src={beforeImage}
                      alt="Before work"
                      className="mt-4 h-48 w-full rounded-lg object-cover border"
                    />
                  )}
                </div>

                {/* After Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    After-work Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      const reader = new FileReader();

                      reader.onloadend = () => {
                        setAfterImage(reader.result as string);
                      };

                      reader.readAsDataURL(file);
                    }}
                    className="block w-full text-sm text-gray-600
                              file:mr-4 file:rounded-lg file:border-0
                              file:bg-gray-100 file:px-4 file:py-2
                              file:text-sm file:font-medium"
                  />

                  {afterImage && (
                    <img
                      src={afterImage}
                      alt="After work"
                      className="mt-4 h-48 w-full rounded-lg object-cover border"
                    />
                  )}
                </div>
              </div>

              {/* Resolution Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Description
                </label>

                <textarea
                  value={resolutionDescription}
                  onChange={(e) => setResolutionDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the work completed..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3
                            text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              {/* Resolve Button */}
              <div className="mt-6 flex justify-end">
                <Button
                  disabled={resolving}
                  onClick={async () => {
                    if (!beforeImage) {
                      alert('Please upload the before-work image');
                      return;
                    }

                    if (!afterImage) {
                      alert('Please upload the after-work image');
                      return;
                    }

                    if (!resolutionDescription.trim()) {
                      alert('Please enter the resolution description');
                      return;
                    }

                    try {
                      setResolving(true);

                      await resolveGrievance(
                        selectedGrievance.id,
                        beforeImage,
                        afterImage,
                        resolutionDescription
                      );

                      setGrievances((prev) =>
                        prev.map((item) =>
                          item.id === selectedGrievance.id
                            ? {
                                ...item,
                                status: 'Resolved',
                                beforeImage,
                                afterImage,
                                resolutionDescription,
                                resolvedAt: new Date().toISOString(),
                              }
                            : item
                        )
                      );

                      setSelectedGrievance(null);
                      setBeforeImage('');
                      setAfterImage('');
                      setResolutionDescription('');

                      alert('Grievance resolved successfully');
                    } catch (error) {
                      console.error(error);
                      alert('Failed to resolve grievance');
                    } finally {
                      setResolving(false);
                    }
                  }}
                >
                  {resolving ? 'Resolving...' : 'Resolve Grievance'}
                </Button>
              </div>
            </Card>
          )}  

          {/* Charts Row 1 */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Grievances by Department */}
            <Card className="p-6">
              <h3 className="mb-4 text-base font-semibold text-gray-900">
                {t('Grievances by Department', 'विभाग अनुसार शिकायतें')}
              </h3>
              <div className="space-y-3">
                {chartData?.grievancesByDepartment.map((dept, idx) => {
                  const maxVal = Math.max(...chartData?.grievancesByDepartment.map((d) => d.value));
                  const width = (dept.value / maxVal) * 100;
                  return (
                    <div key={idx}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-gray-600">{dept.label}</span>
                        <span className="font-semibold text-gray-800">{dept.value}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${width}%`, backgroundColor: dept.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>



            {/* Priority Distribution */}
            <Card className="p-6">
              <h3 className="mb-4 text-base font-semibold text-gray-900">
                {t('Priority Distribution', 'प्राथमिकता वितरण')}
              </h3>
              <div className="flex flex-wrap items-center justify-around gap-4">
                {chartData?.priorityDistribution.map((p, idx) => {
                  const total = chartData?.priorityDistribution.reduce((sum, item) => sum + item.value, 0);
                  const percentage = ((p.value / total) * 100).toFixed(0);
                  const radius = 60 + (p.value / total) * 40;
                  return (
                    <div key={idx} className="text-center">
                      <div
                        className="mx-auto flex items-center justify-center rounded-full text-white font-bold"
                        style={{
                          width: `${radius}px`,
                          height: `${radius}px`,
                          backgroundColor: p.color,
                          fontSize: '14px',
                        }}
                      >
                        {percentage}%
                      </div>
                      <p className="mt-2 text-xs font-medium text-gray-600">{p.label}</p>
                      <p className="text-xs text-gray-400">{p.value}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Grievances by Category */}
            <Card className="p-6">
              <h3 className="mb-4 text-base font-semibold text-gray-900">
                {t('Grievances by Category', 'श्रेणी अनुसार शिकायतें')}
              </h3>
              <div className="space-y-3">
                {chartData?.grievancesByCategory.map((cat, idx) => {
                  const maxVal = Math.max(...chartData?.grievancesByCategory.map((c) => c.value));
                  const width = (cat.value / maxVal) * 100;
                  return (
                    <div key={idx}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-gray-600">{cat.label}</span>
                        <span className="font-semibold text-gray-800">{cat.value}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Resolution Trend */}
            <Card className="p-6">
              <h3 className="mb-4 text-base font-semibold text-gray-900">
                {t('Resolution Trend', 'समाधान प्रवृत्ति')}
              </h3>
              <div className="flex h-48 items-end justify-between gap-2">
                {chartData?.resolutionTrend.map((month, idx) => {
                  const maxVal = Math.max(...chartData?.resolutionTrend.map((m) => Math.max(m.filed, m.resolved)));
                  const filedH = (month.filed / maxVal) * 100;
                  const resolvedH = (month.resolved / maxVal) * 100;
                  return (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                      <div className="flex w-full items-end justify-center gap-1" style={{ height: '160px' }}>
                        <div className="w-3 rounded-t bg-gray-300 transition-all duration-500" style={{ height: `${filedH}%` }} title={`Filed: ${month.filed}`} />
                        <div className="w-3 rounded-t bg-accent-500 transition-all duration-500" style={{ height: `${resolvedH}%` }} title={`Resolved: ${month.resolved}`} />
                      </div>
                      <span className="text-xs text-gray-400">{month.month}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-gray-300" />
                  {t('Filed', 'दर्ज')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-accent-500" />
                  {t('Resolved', 'हल हुई')}
                </span>
              </div>
            </Card>
          </div>

          {/* AI Insights */}
          <Card className="mb-6 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100">
                  <Sparkles className="h-4 w-4 text-brand-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  {t('AI Insights', 'AI अंतर्दृष्टि')}
                </h3>
              </div>
              <Badge variant="info">{insights.length} {t('insights', 'अंतर्दृष्टि')}</Badge>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {insights.map((insight) => {
                const config = insightConfig[insight.severity];
                return (
                  <div key={insight.id} className={`rounded-xl border p-4 ${config.bg} border-transparent`}>
                    <div className="flex items-start gap-2">
                      <config.icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconColor}`} />
                      <div>
                        <p className={`text-sm font-semibold ${config.text}`}>{insight.title}</p>
                        <p className="mt-1 text-xs text-gray-600 leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => navigate('/grievances')}>
                {t('View Grievances', 'शिकायतें देखें')}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={() => navigate('/assistant')}>
                <Sparkles className="h-4 w-4" />
                {t('Review AI Insights', 'AI अंतर्दृष्टि समीक्षा करें')}
              </Button>
            </div>
          </Card>

          {/* Recent Grievances Table */}
          <Card className="overflow-hidden">
            <div className="border-b border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-900">
                {t('Recent Grievances', 'हाल की शिकायतें')}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{t('ID', 'आईडी')}</th>
                    <th className="hidden px-4 py-3 text-left text-xs font-semibold text-gray-500 sm:table-cell">{t('Issue', 'समस्या')}</th>
                    <th className="hidden px-4 py-3 text-left text-xs font-semibold text-gray-500 md:table-cell">{t('Department', 'विभाग')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{t('Priority', 'प्राथमिकता')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{t('Status', 'स्थिति')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{t('Action', 'कार्रवाई')}</th>
                  </tr>
                </thead>
                <tbody>
                  {grievances.slice(0, 6).map((g) => {
                    const statusColors = getStatusColor(g.status);
                    const priorityColors = getPriorityColor(g.priority);
                    return (
                      <tr key={g.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-xs font-medium text-gray-700">{g.id}</td>
                        <td className="hidden px-4 py-3 text-sm text-gray-600 sm:table-cell max-w-xs truncate">{g.serviceName}</td>
                        <td className="hidden px-4 py-3 text-sm text-gray-500 md:table-cell">{g.department}</td>
                        <td className="px-4 py-3">
                          <span className={`badge ${priorityColors.bg} ${priorityColors.text}`}>{g.priority}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${statusColors.bg} ${statusColors.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusColors.dot}`} />
                            {g.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {g.status !== 'Resolved' ? (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedGrievance(g);
                                setBeforeImage('');
                                setAfterImage('');
                                setResolutionDescription('');
                              }}
                            >
                              Resolve
                            </Button>
                          ) : (
                            <span className="text-sm font-medium text-green-600">
                              Resolved
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
