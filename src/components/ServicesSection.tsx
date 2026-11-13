import { useState } from 'react';
import {
  Megaphone,
  TrendingUp,
  Code2,
  ArrowUpRight,
  Check,
  X,
  Clock,
} from 'lucide-react';
import type { Language, ServiceCategory, ServiceItem } from '../types.ts';
import { getT } from '../data/translations.ts';

interface ServicesSectionProps {
  lang: Language;
  services: ServiceItem[];
  onSelectService: (category: ServiceCategory, label?: string) => void;
}

const SERVICE_ICONS: Record<ServiceCategory, typeof Megaphone> = {
  smm: Megaphone,
  marketing: TrendingUp,
  it: Code2,
};

export function ServicesSection({
  lang,
  services,
  onSelectService,
}: ServicesSectionProps) {
  const t = getT(lang);
  const [activeTab, setActiveTab] = useState<'all' | ServiceCategory>('all');
  const [detailService, setDetailService] = useState<ServiceItem | null>(null);

  const visibleServices =
    activeTab === 'all'
      ? services
      : services.filter((s) => s.category === activeTab);

  return (
    <section
      id="services"
      className="border-b border-white/[0.08] bg-[#0A0A0A] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-[#22D3EE]">
              {t.services.kicker}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              {t.services.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              {t.services.subtitle}
            </p>
          </div>

          {/* Interactive Service Filter Tabs */}
          <div
            role="tablist"
            aria-label="Service categories"
            className="inline-flex w-fit items-center gap-1 rounded-lg border border-white/[0.08] bg-[#121212] p-1"
          >
            {(['all', 'smm', 'marketing', 'it'] as const).map((tab) => {
              const label =
                tab === 'all'
                  ? t.portfolio.filterAll
                  : tab === 'smm'
                    ? 'SMM'
                    : tab === 'marketing'
                      ? 'Marketing'
                      : 'IT';
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#2563EB] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetric Bento / Pillar Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {visibleServices.map((service, index) => {
            const Icon = SERVICE_ICONS[service.category] || Megaphone;
            const spanClass =
              visibleServices.length === 3 && index === 2
                ? 'lg:col-span-12'
                : visibleServices.length === 1
                  ? 'lg:col-span-12'
                  : 'lg:col-span-6';

            return (
              <article
                key={service.id}
                className={`${spanClass} group relative flex flex-col justify-between rounded-xl border border-white/[0.09] bg-[#121212]/80 backdrop-blur-md p-6 sm:p-8 transition-all duration-200 hover:border-[#2563EB]/60 hover:shadow-[0_0_32px_rgba(37,99,235,0.12)]`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.1] bg-[#18191E] text-[#22D3EE]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-mono-tabular text-xs text-zinc-500">
                          {service.indexLabel} · {service.timeline[lang]}
                        </span>
                        <h3 className="font-display text-2xl font-bold tracking-tight text-white">
                          {service.title[lang]}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDetailService(service)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-[#18191E] px-3.5 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-[#22D3EE]/50 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>{t.services.detailTrigger}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                    {service.summary[lang]}
                  </p>

                  {/* Deliverables */}
                  <ul
                    className={`mt-6 grid gap-3 border-t border-white/[0.07] pt-6 ${
                      spanClass === 'lg:col-span-12'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-1 sm:grid-cols-2'
                    }`}
                  >
                    {service.deliverables.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-zinc-300"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#22D3EE]" />
                        <span>{item[lang]}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-white/[0.07] pt-5">
                  <span className="text-xs text-zinc-500">
                    {service.deliverables.length} {lang === 'uz' ? 'ta asosiy modul' : 'ключевых модулей'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onSelectService(service.category, service.title[lang])
                    }
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B82F6] transition-colors hover:text-[#22D3EE] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{t.services.orderTrigger}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      {detailService && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-detail-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={() => setDetailService(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-white/[0.12] bg-[#121212] p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-5">
              <div>
                <p className="text-xs font-medium text-[#22D3EE]">
                  {detailService.indexLabel} · {t.services.kicker}
                </p>
                <h3
                  id="service-detail-title"
                  className="mt-1 font-display text-2xl font-bold text-white"
                >
                  {detailService.title[lang]} {t.services.modalTitleSuffix}
                </h3>
              </div>
              <button
                type="button"
                aria-label={t.services.closeLabel}
                onClick={() => setDetailService(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-zinc-300 sm:text-base">
              {detailService.summary[lang]}
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs text-zinc-400">
              <Clock className="h-4 w-4 text-[#22D3EE]" />
              <span>{detailService.timeline[lang]}</span>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {t.services.includedLabel}
              </h4>
              <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {detailService.deliverables.map((d, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg border border-white/[0.06] bg-[#18191E]/60 p-3 text-sm text-zinc-200"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#22D3EE]" />
                    <span>{d[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-end gap-3 border-t border-white/[0.08] pt-5">
              <button
                type="button"
                onClick={() => setDetailService(null)}
                className="rounded-lg border border-white/[0.1] px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white cursor-pointer"
              >
                {t.services.closeLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  const chosen = detailService;
                  setDetailService(null);
                  onSelectService(chosen.category, chosen.title[lang]);
                }}
                className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer"
              >
                {t.services.orderTrigger}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
