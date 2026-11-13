import { Check, ArrowRight, Terminal, TrendingUp } from 'lucide-react';
import type { Language, PricingConfig, ServiceCategory } from '../types.ts';
import { getT } from '../data/translations.ts';

interface PricingSectionProps {
  lang: Language;
  pricing: PricingConfig;
  onSelectPlan: (category: ServiceCategory, packageInfo: string) => void;
}

export function PricingSection({
  lang,
  pricing,
  onSelectPlan,
}: PricingSectionProps) {
  const t = getT(lang);
  const basePrice = pricing.smmPackages[0]?.monthlyPrice || 1500;

  return (
    <section
      id="pricing"
      className="border-b border-white/[0.08] bg-[#0C0C0E] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-[#22D3EE]">
            {t.pricing.kicker}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            {t.pricing.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* SMM Packages Grid */}
        <div className="mt-12">
          <div className="mb-5 flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="font-display text-lg font-semibold text-white">
              {t.pricing.smmTabTitle}
            </h3>
            <span className="font-mono-tabular text-xs text-zinc-400">
              USD · {lang === 'uz' ? 'oylik to‘lov' : 'ежемесячно'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pricing.smmPackages.map((pkg) => {
              const monthlyDiff = Math.max(0, basePrice - pkg.monthlyPrice);
              const totalSaving = monthlyDiff * pkg.months;

              return (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col justify-between rounded-xl border p-6 transition-all duration-200 ${
                    pkg.featured
                      ? 'border-[#2563EB] bg-[#131722] shadow-[0_0_36px_rgba(37,99,235,0.18)]'
                      : 'border-white/[0.08] bg-[#121212] hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-base font-bold text-white">
                        {pkg.label[lang]}
                      </span>
                      {pkg.featured && (
                        <span className="text-xs font-semibold text-[#22D3EE]">
                          {t.pricing.recommended}
                        </span>
                      )}
                    </div>

                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                      {pkg.audience[lang]}
                    </p>

                    <div className="mt-6 flex items-baseline gap-1.5 border-b border-white/[0.07] pb-5">
                      <span className="font-display text-3xl font-bold tracking-tight text-white tabular-nums">
                        ${pkg.monthlyPrice.toLocaleString('en-US')}
                      </span>
                      <span className="text-sm text-zinc-400">
                        {t.pricing.perMonth}
                      </span>
                    </div>

                    {totalSaving > 0 ? (
                      <p className="mt-3 font-mono-tabular text-xs text-[#22D3EE]">
                        {t.pricing.saveLabel} ${totalSaving.toLocaleString('en-US')}
                      </p>
                    ) : (
                      <p className="mt-3 font-mono-tabular text-xs text-zinc-500">
                        {lang === 'uz' ? 'Standart tarif' : 'Базовый тариф'}
                      </p>
                    )}

                    <ul className="mt-4 space-y-2.5">
                      {pkg.features.map((feat, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-zinc-300"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#3B82F6]" />
                          <span>{feat[lang]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onSelectPlan(
                        'smm',
                        `${pkg.label[lang]} ($${pkg.monthlyPrice}/oy)`
                      )
                    }
                    className={`mt-7 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      pkg.featured
                        ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                        : 'border border-white/[0.12] bg-[#18191E] text-zinc-200 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <span>{t.pricing.selectPlan}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Marketing & IT Pricing Split */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Marketing Card */}
          <div className="flex flex-col justify-between rounded-xl border border-white/[0.09] bg-[#121212]/90 p-7 sm:p-8">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-[#22D3EE]">
                  02 · {t.pricing.marketingKicker}
                </span>
                <TrendingUp className="h-5 w-5 text-zinc-400" />
              </div>

              <h3 className="mt-3 font-display text-2xl font-bold text-white">
                {pricing.marketingSubtitle[lang]}
              </h3>

              <div className="mt-5 flex flex-wrap items-baseline gap-2 border-y border-white/[0.07] py-4">
                <span className="text-sm text-zinc-400">
                  {t.pricing.fromLabel}:
                </span>
                <span className="font-display text-3xl font-bold text-white tabular-nums">
                  ${pricing.marketingStartPrice.toLocaleString('en-US')}
                </span>
                <span className="text-sm font-medium text-zinc-400">
                  {t.pricing.fromSuffix}
                </span>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-zinc-400">
                {pricing.marketingNote[lang]}
              </p>
            </div>

            <div className="mt-7">
              <button
                type="button"
                onClick={() =>
                  onSelectPlan(
                    'marketing',
                    `Marketing ($${pricing.marketingStartPrice}+)`
                  )
                }
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{t.pricing.marketingCta}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* IT Individual Smeta Card */}
          <div className="flex flex-col justify-between rounded-xl border border-white/[0.09] bg-[#121212]/90 p-7 sm:p-8">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-[#22D3EE]">
                  03 · {t.pricing.itKicker}
                </span>
                <Terminal className="h-5 w-5 text-zinc-400" />
              </div>

              <h3 className="mt-3 font-display text-2xl font-bold text-white">
                {pricing.itTitle[lang]}
              </h3>

              <div className="mt-5 flex items-baseline gap-2 border-y border-white/[0.07] py-4">
                <span className="font-display text-2xl font-bold text-white">
                  {t.pricing.itPriceLabel}
                </span>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-zinc-400">
                {pricing.itNote[lang]}
              </p>

              <ul className="mt-4 space-y-2">
                {t.pricing.itSteps.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-zinc-300"
                  >
                    <Check className="h-4 w-4 shrink-0 text-[#22D3EE]" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7">
              <button
                type="button"
                onClick={() =>
                  onSelectPlan('it', t.pricing.itPriceLabel)
                }
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#2563EB]/60 bg-[#2563EB]/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2563EB] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{t.pricing.itCta}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
