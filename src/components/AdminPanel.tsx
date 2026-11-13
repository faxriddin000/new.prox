import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  DollarSign,
  Inbox,
  Layers,
  Lock,
  LogOut,
  Plus,
  Search,
  Trash2,
  Users,
  Check,
  Loader2,
} from 'lucide-react';
import type {
  Language,
  LeadItem,
  LeadStatus,
  PricingConfig,
  ServiceItem,
  SiteData,
} from '../types.ts';
import { getT } from '../data/translations.ts';

interface AdminPanelProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  siteData: SiteData;
  onSiteDataChange: (next: SiteData) => void;
  onBackToSite: () => void;
}

type AdminTab = 'leads' | 'pricing' | 'services' | 'partners';

const TOKEN_STORAGE_KEY = 'prox_admin_token';

const STATUS_STYLE: Record<LeadStatus, string> = {
  new: 'border-[#2563EB]/40 bg-[#2563EB]/15 text-[#60A5FA]',
  contacted: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
  in_progress: 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300',
  closed: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
};

export function AdminPanel({
  lang,
  onChangeLang,
  siteData,
  onSiteDataChange,
  onBackToSite,
}: AdminPanelProps) {
  const t = getT(lang);
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem(TOKEN_STORAGE_KEY)
  );
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('leads');

  // Leads state
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');

  // Pricing editor state
  const [pricingDraft, setPricingDraft] = useState<PricingConfig>(
    siteData.pricing
  );
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingSaved, setPricingSaved] = useState(false);

  // Services editor state
  const [servicesDraft, setServicesDraft] = useState<ServiceItem[]>(
    siteData.services
  );
  const [selectedServiceIdx, setSelectedServiceIdx] = useState(0);
  const [servicesSaving, setServicesSaving] = useState(false);
  const [servicesSaved, setServicesSaved] = useState(false);

  // Partner creation state
  const [partnerName, setPartnerName] = useState('');
  const [partnerSectorUz, setPartnerSectorUz] = useState('');
  const [partnerSectorRu, setPartnerSectorRu] = useState('');
  const [partnerMonogram, setPartnerMonogram] = useState('');
  const [partnerLogoUrl, setPartnerLogoUrl] = useState('');
  const [partnerAdding, setPartnerAdding] = useState(false);

  useEffect(() => {
    setPricingDraft(siteData.pricing);
  }, [siteData.pricing]);

  useEffect(() => {
    setServicesDraft(siteData.services);
  }, [siteData.services]);

  const handleUnauthorized = useCallback(() => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  }, []);

  const fetchLeads = useCallback(async (authToken: string) => {
    setLeadsLoading(true);
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (res.ok) {
        const data = (await res.json()) as LeadItem[];
        setLeads(data);
      }
    } finally {
      setLeadsLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    if (token) {
      fetchLeads(token);
    }
  }, [token, fetchLeads]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setLoginError(t.admin.loginError);
        return;
      }
      const data = (await res.json()) as { token: string };
      sessionStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setToken(data.token);
      setPassword('');
    } catch {
      setLoginError(t.admin.loginError);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    handleUnauthorized();
  };

  const handleLeadStatusChange = async (id: string, status: LeadStatus) => {
    if (!token) return;
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.status === 401) {
      handleUnauthorized();
      return;
    }
    if (res.ok) {
      const updated = (await res.json()) as LeadItem;
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!token) return;
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      handleUnauthorized();
      return;
    }
    if (res.ok) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const handleSavePricing = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setPricingSaving(true);
    setPricingSaved(false);
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pricingDraft),
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (res.ok) {
        const saved = (await res.json()) as PricingConfig;
        onSiteDataChange({ ...siteData, pricing: saved });
        setPricingSaved(true);
        setTimeout(() => setPricingSaved(false), 3000);
      }
    } finally {
      setPricingSaving(false);
    }
  };

  const handleSaveServices = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setServicesSaving(true);
    setServicesSaved(false);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(servicesDraft),
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (res.ok) {
        const saved = (await res.json()) as ServiceItem[];
        onSiteDataChange({ ...siteData, services: saved });
        setServicesSaved(true);
        setTimeout(() => setServicesSaved(false), 3000);
      }
    } finally {
      setServicesSaving(false);
    }
  };

  const handleAddPartner = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !partnerName.trim()) return;
    setPartnerAdding(true);
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: partnerName.trim(),
          sector: {
            uz: partnerSectorUz.trim() || 'Biznes hamkor',
            ru: partnerSectorRu.trim() || 'Бизнес-партнёр',
          },
          monogram: partnerMonogram.trim(),
          logoUrl: partnerLogoUrl.trim() || undefined,
        }),
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (res.ok) {
        const created = await res.json();
        onSiteDataChange({
          ...siteData,
          partners: [...siteData.partners, created],
        });
        setPartnerName('');
        setPartnerSectorUz('');
        setPartnerSectorRu('');
        setPartnerMonogram('');
        setPartnerLogoUrl('');
      }
    } finally {
      setPartnerAdding(false);
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!token) return;
    const res = await fetch(`/api/admin/partners/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      handleUnauthorized();
      return;
    }
    if (res.ok) {
      onSiteDataChange({
        ...siteData,
        partners: siteData.partners.filter((p) => p.id !== id),
      });
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === 'all' || lead.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.message ?? '').toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [leads, statusFilter, searchQuery]);

  const leadCounts = useMemo(() => {
    return {
      total: leads.length,
      newCount: leads.filter((l) => l.status === 'new').length,
      inProgress: leads.filter(
        (l) => l.status === 'in_progress' || l.status === 'contacted'
      ).length,
      closed: leads.filter((l) => l.status === 'closed').length,
    };
  }, [leads]);

  // Login Gate
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-between p-4 sm:p-6">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={onBackToSite}
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-[#121212] px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t.admin.backToSite}</span>
          </button>

          <div className="flex items-center rounded-lg border border-white/[0.1] bg-[#121212] p-0.5">
            <button
              type="button"
              onClick={() => onChangeLang('uz')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                lang === 'uz' ? 'bg-[#2563EB] text-white' : 'text-zinc-400'
              }`}
            >
              UZ
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('ru')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                lang === 'ru' ? 'bg-[#2563EB] text-white' : 'text-zinc-400'
              }`}
            >
              RU
            </button>
          </div>
        </div>

        <div className="mx-auto my-auto w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#121212] p-7 sm:p-8 shadow-2xl">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.1] bg-[#18191E] text-[#22D3EE]">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-white">
            {t.admin.loginTitle}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">{t.admin.loginSubtitle}</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                {t.admin.passwordLabel}
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.admin.passwordPlaceholder}
                required
                className="w-full rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <p className="font-mono-tabular text-xs text-zinc-500">
              {t.admin.loginHint}
            </p>

            {loginError && (
              <div
                role="alert"
                className="rounded-lg border border-red-500/40 bg-red-950/30 px-3.5 py-2.5 text-xs font-medium text-red-300"
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-60 cursor-pointer"
            >
              {loggingIn && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{t.admin.loginBtn}</span>
            </button>
          </form>
        </div>

        <div />
      </div>
    );
  }

  const navItems: { id: AdminTab; label: string; icon: typeof Inbox }[] = [
    { id: 'leads', label: t.admin.tabs.leads, icon: Inbox },
    { id: 'pricing', label: t.admin.tabs.pricing, icon: DollarSign },
    { id: 'services', label: t.admin.tabs.services, icon: Layers },
    { id: 'partners', label: t.admin.tabs.partners, icon: Users },
  ];

  const activeService = servicesDraft[selectedServiceIdx] ?? servicesDraft[0];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 lg:flex">
      {/* Sidebar (260px on desktop) */}
      <aside className="border-b border-white/[0.08] bg-[#101012] lg:w-[260px] lg:shrink-0 lg:border-b-0 lg:border-r lg:flex lg:flex-col lg:justify-between">
        <div className="p-5">
          <div className="border-b border-white/[0.08] pb-4">
            <div className="font-display text-base font-extrabold tracking-tight text-white">
              PROX MARKETING
            </div>
            <div className="mt-1 text-xs text-zinc-400">{t.admin.brandSub}</div>
          </div>

          <nav className="mt-5 flex flex-row gap-1.5 overflow-x-auto lg:flex-col">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#2563EB] text-white'
                      : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:block border-t border-white/[0.08] p-5 space-y-2">
          <button
            type="button"
            onClick={onBackToSite}
            className="flex w-full items-center gap-2 rounded-lg border border-white/[0.1] bg-[#16171B] px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t.admin.backToSite}</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium text-zinc-400 hover:bg-white/[0.04] hover:text-red-300 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{t.admin.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Top Breadcrumb Bar */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] bg-[#0D0D10] px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="font-semibold text-white">PROX Admin</span>
            <span>/</span>
            <span>{navItems.find((n) => n.id === activeTab)?.label}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-white/[0.1] bg-[#121212] p-0.5">
              <button
                type="button"
                onClick={() => onChangeLang('uz')}
                className={`px-2 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                  lang === 'uz' ? 'bg-[#2563EB] text-white' : 'text-zinc-400'
                }`}
              >
                UZ
              </button>
              <button
                type="button"
                onClick={() => onChangeLang('ru')}
                className={`px-2 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                  lang === 'ru' ? 'bg-[#2563EB] text-white' : 'text-zinc-400'
                }`}
              >
                RU
              </button>
            </div>

            <button
              type="button"
              onClick={onBackToSite}
              className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs font-medium text-zinc-300 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t.admin.backToSite}</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs font-medium text-zinc-400 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        <main className="p-5 sm:p-8 max-w-6xl">
          {/* TAB 1: LEADS */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              {/* Summary Metrics */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-xl border border-white/[0.08] bg-[#121212] p-4">
                  <div className="text-xs text-zinc-400">{t.admin.leads.total}</div>
                  <div className="mt-1 font-display text-2xl font-bold text-white tabular-nums">
                    {leadCounts.total}
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-[#121212] p-4">
                  <div className="text-xs text-zinc-400">{t.admin.leads.newCount}</div>
                  <div className="mt-1 font-display text-2xl font-bold text-[#60A5FA] tabular-nums">
                    {leadCounts.newCount}
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-[#121212] p-4">
                  <div className="text-xs text-zinc-400">{t.admin.leads.inProgressCount}</div>
                  <div className="mt-1 font-display text-2xl font-bold text-cyan-300 tabular-nums">
                    {leadCounts.inProgress}
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-[#121212] p-4">
                  <div className="text-xs text-zinc-400">{t.admin.leads.closedCount}</div>
                  <div className="mt-1 font-display text-2xl font-bold text-emerald-400 tabular-nums">
                    {leadCounts.closed}
                  </div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.admin.leads.searchPlaceholder}
                    className="w-full rounded-lg border border-white/[0.1] bg-[#121212] pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:border-[#2563EB] focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/[0.08] bg-[#121212] p-1">
                  {(['all', 'new', 'contacted', 'in_progress', 'closed'] as const).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          statusFilter === st
                            ? 'bg-[#2563EB] text-white'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {st === 'all'
                          ? t.admin.leads.filterAll
                          : t.admin.leads.statuses[st]}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Leads Data Table */}
              <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#121212]">
                {leadsLoading ? (
                  <div className="p-6 space-y-3">
                    {[1, 2, 3].map((row) => (
                      <div
                        key={row}
                        className="h-10 w-full animate-pulse rounded-lg bg-white/[0.04]"
                      />
                    ))}
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="p-10 text-center text-sm text-zinc-400">
                    {t.admin.leads.empty}
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-white/[0.08] bg-[#16171B] text-zinc-400">
                      <tr>
                        <th className="px-4 py-3 font-semibold">{t.admin.leads.columns.client}</th>
                        <th className="px-4 py-3 font-semibold">{t.admin.leads.columns.phone}</th>
                        <th className="px-4 py-3 font-semibold">{t.admin.leads.columns.service}</th>
                        <th className="px-4 py-3 font-semibold">{t.admin.leads.columns.note}</th>
                        <th className="px-4 py-3 font-semibold">{t.admin.leads.columns.date}</th>
                        <th className="px-4 py-3 font-semibold">{t.admin.leads.columns.status}</th>
                        <th className="px-4 py-3 font-semibold text-right">{t.admin.leads.columns.action}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {filteredLeads.map((lead) => (
                        <tr
                          key={lead.id}
                          className="transition-colors hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-3.5 font-semibold text-white whitespace-nowrap">
                            {lead.name}
                          </td>
                          <td className="px-4 py-3.5 font-mono-tabular text-zinc-300 whitespace-nowrap">
                            <a
                              href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                              className="hover:text-[#22D3EE]"
                            >
                              {lead.phone}
                            </a>
                          </td>
                          <td className="px-4 py-3.5 text-zinc-300">
                            <div className="font-medium text-white uppercase">
                              {lead.serviceType}
                            </div>
                            {lead.packageInfo && (
                              <div className="text-[11px] text-zinc-400">
                                {lead.packageInfo}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-zinc-400 max-w-xs">
                            <span className="line-clamp-2">
                              {lead.message || '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-mono-tabular text-zinc-400 whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleDateString(
                              lang === 'uz' ? 'uz-UZ' : 'ru-RU'
                            )}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <select
                              aria-label={`Status for ${lead.name}`}
                              value={lead.status}
                              onChange={(e) =>
                                handleLeadStatusChange(
                                  lead.id,
                                  e.target.value as LeadStatus
                                )
                              }
                              className={`rounded-md border px-2.5 py-1 text-xs font-medium focus:outline-none cursor-pointer ${
                                STATUS_STYLE[lead.status]
                              }`}
                            >
                              <option value="new" className="bg-[#121212] text-white">
                                {t.admin.leads.statuses.new}
                              </option>
                              <option value="contacted" className="bg-[#121212] text-white">
                                {t.admin.leads.statuses.contacted}
                              </option>
                              <option value="in_progress" className="bg-[#121212] text-white">
                                {t.admin.leads.statuses.in_progress}
                              </option>
                              <option value="closed" className="bg-[#121212] text-white">
                                {t.admin.leads.statuses.closed}
                              </option>
                            </select>
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <button
                              type="button"
                              aria-label={`${t.admin.leads.deleteConfirm} ${lead.name}`}
                              onClick={() => handleDeleteLead(lead.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] text-zinc-400 hover:border-red-500/40 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRICING EDITOR */}
          {activeTab === 'pricing' && (
            <form onSubmit={handleSavePricing} className="space-y-8">
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  {t.admin.pricingAdmin.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {t.admin.pricingAdmin.subtitle}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {t.admin.pricingAdmin.smmSection}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {pricingDraft.smmPackages.map((pkg, idx) => (
                    <div
                      key={pkg.id}
                      className="rounded-xl border border-white/[0.08] bg-[#121212] p-4 space-y-3"
                    >
                      <div className="font-display text-sm font-bold text-white">
                        {pkg.label[lang]}
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">
                          USD / {lang === 'uz' ? 'oy' : 'мес'}
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={50}
                          value={pkg.monthlyPrice}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setPricingDraft((prev) => ({
                              ...prev,
                              smmPackages: prev.smmPackages.map((p, i) =>
                                i === idx ? { ...p, monthlyPrice: val } : p
                              ),
                            }));
                          }}
                          className="w-full font-mono-tabular rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#2563EB] focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-white/[0.08] bg-[#121212] p-5 space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t.admin.pricingAdmin.marketingSection}
                  </h3>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      USD
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={pricingDraft.marketingStartPrice}
                      onChange={(e) =>
                        setPricingDraft((prev) => ({
                          ...prev,
                          marketingStartPrice: Number(e.target.value) || 0,
                        }))
                      }
                      className="w-full font-mono-tabular rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-white focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Izoh ({lang.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      value={pricingDraft.marketingNote[lang]}
                      onChange={(e) =>
                        setPricingDraft((prev) => ({
                          ...prev,
                          marketingNote: {
                            ...prev.marketingNote,
                            [lang]: e.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-white focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-[#121212] p-5 space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t.admin.pricingAdmin.itSection}
                  </h3>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      {lang === 'uz' ? 'Sarlavha' : 'Заголовок'} ({lang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={pricingDraft.itTitle[lang]}
                      onChange={(e) =>
                        setPricingDraft((prev) => ({
                          ...prev,
                          itTitle: { ...prev.itTitle, [lang]: e.target.value },
                        }))
                      }
                      className="w-full rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-white focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Izoh ({lang.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      value={pricingDraft.itNote[lang]}
                      onChange={(e) =>
                        setPricingDraft((prev) => ({
                          ...prev,
                          itNote: { ...prev.itNote, [lang]: e.target.value },
                        }))
                      }
                      className="w-full rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-white focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={pricingSaving}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-60 cursor-pointer"
                >
                  {pricingSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>
                    {pricingSaving
                      ? t.admin.pricingAdmin.savingBtn
                      : t.admin.pricingAdmin.saveBtn}
                  </span>
                </button>
                {pricingSaved && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <Check className="h-4 w-4" />
                    {t.admin.pricingAdmin.savedMsg}
                  </span>
                )}
              </div>
            </form>
          )}

          {/* TAB 3: SERVICES EDITOR */}
          {activeTab === 'services' && activeService && (
            <form onSubmit={handleSaveServices} className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  {t.admin.servicesAdmin.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {t.admin.servicesAdmin.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {servicesDraft.map((svc, idx) => (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => setSelectedServiceIdx(idx)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      selectedServiceIdx === idx
                        ? 'bg-[#2563EB] text-white'
                        : 'border border-white/[0.1] bg-[#121212] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {svc.indexLabel}. {svc.title[lang]}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#121212] p-6 space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Title (UZ)
                    </label>
                    <input
                      type="text"
                      value={activeService.title.uz}
                      onChange={(e) => {
                        const val = e.target.value;
                        setServicesDraft((prev) =>
                          prev.map((s, i) =>
                            i === selectedServiceIdx
                              ? { ...s, title: { ...s.title, uz: val } }
                              : s
                          )
                        );
                      }}
                      className="w-full rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3.5 py-2 text-sm text-white focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Title (RU)
                    </label>
                    <input
                      type="text"
                      value={activeService.title.ru}
                      onChange={(e) => {
                        const val = e.target.value;
                        setServicesDraft((prev) =>
                          prev.map((s, i) =>
                            i === selectedServiceIdx
                              ? { ...s, title: { ...s.title, ru: val } }
                              : s
                          )
                        );
                      }}
                      className="w-full rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3.5 py-2 text-sm text-white focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">
                    Summary ({lang.toUpperCase()})
                  </label>
                  <textarea
                    rows={2}
                    value={activeService.summary[lang]}
                    onChange={(e) => {
                      const val = e.target.value;
                      setServicesDraft((prev) =>
                        prev.map((s, i) =>
                          i === selectedServiceIdx
                            ? {
                                ...s,
                                summary: { ...s.summary, [lang]: val },
                              }
                            : s
                        )
                      );
                    }}
                    className="w-full rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3.5 py-2 text-sm text-white focus:border-[#2563EB] focus:outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Deliverables ({lang.toUpperCase()})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setServicesDraft((prev) =>
                          prev.map((s, i) =>
                            i === selectedServiceIdx
                              ? {
                                  ...s,
                                  deliverables: [
                                    ...s.deliverables,
                                    { uz: 'Yangi xizmat bandi', ru: 'Новый пункт услуги' },
                                  ],
                                }
                              : s
                          )
                        );
                      }}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.12] bg-[#18191E] px-3 py-1.5 text-xs font-medium text-zinc-200 hover:text-white cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{t.admin.servicesAdmin.addDeliverable}</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {activeService.deliverables.map((del, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={del[lang]}
                          onChange={(e) => {
                            const val = e.target.value;
                            setServicesDraft((prev) =>
                              prev.map((s, i) =>
                                i === selectedServiceIdx
                                  ? {
                                      ...s,
                                      deliverables: s.deliverables.map((item, j) =>
                                        j === dIdx
                                          ? { ...item, [lang]: val }
                                          : item
                                      ),
                                    }
                                  : s
                              )
                            );
                          }}
                          className="flex-1 rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#2563EB] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setServicesDraft((prev) =>
                              prev.map((s, i) =>
                                i === selectedServiceIdx
                                  ? {
                                      ...s,
                                      deliverables: s.deliverables.filter(
                                        (_, j) => j !== dIdx
                                      ),
                                    }
                                  : s
                              )
                            );
                          }}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] text-zinc-400 hover:border-red-500/40 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={servicesSaving}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-60 cursor-pointer"
                >
                  {servicesSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{t.admin.servicesAdmin.saveBtn}</span>
                </button>
                {servicesSaved && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <Check className="h-4 w-4" />
                    {t.admin.servicesAdmin.savedMsg}
                  </span>
                )}
              </div>
            </form>
          )}

          {/* TAB 4: PARTNERS & LOGOS */}
          {activeTab === 'partners' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  {t.admin.partnersAdmin.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {t.admin.partnersAdmin.subtitle}
                </p>
              </div>

              <form
                onSubmit={handleAddPartner}
                className="rounded-xl border border-white/[0.08] bg-[#121212] p-6 space-y-4"
              >
                <h3 className="font-display text-sm font-bold text-white">
                  {t.admin.partnersAdmin.addTitle}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      {t.admin.partnersAdmin.nameLabel} *
                    </label>
                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      required
                      placeholder="Uzum Tech"
                      className="w-full rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      {t.admin.partnersAdmin.sectorLabelUz}
                    </label>
                    <input
                      type="text"
                      value={partnerSectorUz}
                      onChange={(e) => setPartnerSectorUz(e.target.value)}
                      placeholder="E-commerce"
                      className="w-full rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      {t.admin.partnersAdmin.sectorLabelRu}
                    </label>
                    <input
                      type="text"
                      value={partnerSectorRu}
                      onChange={(e) => setPartnerSectorRu(e.target.value)}
                      placeholder="Электронная коммерция"
                      className="w-full rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      {t.admin.partnersAdmin.monogramLabel}
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={partnerMonogram}
                      onChange={(e) => setPartnerMonogram(e.target.value)}
                      placeholder="UT"
                      className="w-full rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3 py-2 text-sm text-white uppercase focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      {t.admin.partnersAdmin.logoUrlLabel}
                    </label>
                    <input
                      type="url"
                      value={partnerLogoUrl}
                      onChange={(e) => setPartnerLogoUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={partnerAdding}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-60 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t.admin.partnersAdmin.addBtn}</span>
                </button>
              </form>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {siteData.partners.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#121212] p-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] bg-[#18191E] font-display text-sm font-bold text-[#22D3EE]">
                        {p.monogram}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-display text-sm font-semibold text-white">
                          {p.name}
                        </div>
                        <div className="truncate text-xs text-zinc-400">
                          {p.sector[lang]}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label={`${t.admin.partnersAdmin.deleteBtn} ${p.name}`}
                      onClick={() => handleDeletePartner(p.id)}
                      className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/[0.08] text-zinc-400 hover:border-red-500/40 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
