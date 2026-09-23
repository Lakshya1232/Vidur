import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Clock,
  FileText,
  Users,
  ArrowRight,
  Building,
  MapPin,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, Button, Select, CardSkeleton, EmptyState } from '@/components/ui';
import { getServices, getServiceCategories } from '@/lib/api';
import { serviceCategories } from '@/data/mockData';
import type { PublicService, ServiceCategory } from '@/types';

export function ServicesPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<PublicService[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>(serviceCategories);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getServices();
      setServices(data);
      setLoading(false);
    };
    load();
  }, []);

  const departments = useMemo(() => {
    const set = new Set(services.map((s) => s.department));
    return Array.from(set);
  }, [services]);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
      if (departmentFilter !== 'all' && s.department !== departmentFilter) return false;
      if (stateFilter !== 'all' && s.state !== stateFilter) return false;
      if (typeFilter !== 'all' && s.serviceType !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const name = lang === 'en' ? s.name : s.nameHi;
        const desc = lang === 'en' ? s.description : s.descriptionHi;
        if (!name.toLowerCase().includes(q) && !desc.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [services, categoryFilter, departmentFilter, stateFilter, typeFilter, search, lang]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {t('Public Services', 'सार्वजनिक सेवाएं')}
        </h1>
        <p className="mt-2 text-gray-500">
          {t('Search and browse all available government services', 'सभी उपलब्ध सरकारी सेवाएं खोजें और ब्राउज़ करें')}
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('Search public services...', 'सार्वजनिक सेवाएं खोजें...')}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-base text-gray-800 placeholder-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
            aria-label="Search services"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">{t('All Categories', 'सभी श्रेणियां')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{t(cat.name, cat.nameHi)}</option>
          ))}
        </Select>
        <Select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          aria-label="Filter by department"
        >
          <option value="all">{t('All Departments', 'सभी विभाग')}</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </Select>
        <Select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          aria-label="Filter by state"
        >
          <option value="all">{t('All States', 'सभी राज्य')}</option>
          <option value="All States">{t('All States', 'सभी राज्य')}</option>
        </Select>
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Filter by service type"
        >
          <option value="all">{t('All Types', 'सभी प्रकार')}</option>
          <option value="Application">{t('Application', 'आवेदन')}</option>
          <option value="Grievance">{t('Grievance', 'शिकायत')}</option>
          <option value="Information">{t('Information', 'जानकारी')}</option>
          <option value="Registration">{t('Registration', 'पंजीकरण')}</option>
        </Select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t('No services found', 'कोई सेवा नहीं मिली')}
          message={t('Try adjusting your search or filters.', 'अपनी खोज या फ़िल्टर समायोजित करने का प्रयास करें।')}
          action={<Button variant="secondary" size="sm" onClick={() => { setSearch(''); setCategoryFilter('all'); setDepartmentFilter('all'); setTypeFilter('all'); }}>{t('Clear Filters', 'फ़िल्टर साफ़ करें')}</Button>}
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">
            {filtered.length} {t('services found', 'सेवाएं मिलीं')}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((service) => (
              <Card key={service.id} hover className="flex flex-col p-5" onClick={() => navigate(`/services/${service.id}`)}>
                <div className="mb-3 flex items-start justify-between">
                  <span className="badge bg-brand-50 text-brand-700">{service.serviceType}</span>
                  <span className="text-xs text-gray-400">{service.estimatedTime}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  {t(service.name, service.nameHi)}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                  <Building className="h-3.5 w-3.5" />
                  {t(service.department, service.departmentHi)}
                </p>
                <p className="mt-3 flex-1 text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {t(service.description, service.descriptionHi)}
                </p>
                <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Users className="h-3.5 w-3.5" />
                    {t('Who can use it', 'कौन उपयोग कर सकता है')}: {t(service.eligibility[0], service.eligibilityHi[0])}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <FileText className="h-3.5 w-3.5" />
                    {service.requiredDocuments.filter((d) => d.required).length} {t('documents required', 'दस्तावेज आवश्यक')}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="h-3.5 w-3.5" />
                    {t('Processing', 'प्रसंस्करण')}: {t(service.estimatedTime, service.estimatedTimeHi)}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end">
                  <span className="flex items-center gap-1 text-sm font-semibold text-brand-600">
                    {t('View Details', 'विवरण देखें')}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
