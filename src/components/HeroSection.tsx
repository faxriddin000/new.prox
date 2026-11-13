import { useState } from 'react';
import { ArrowRight, ArrowDownRight, Building2 } from 'lucide-react';
import type { Language } from '../types.ts';
import { getT } from '../data/translations.ts';

interface HeroSectionProps {
  lang: Language;
  onOpenConsultation: () => void;
}

const HERO_IMAGE = '/src/assets/images/hero_agency_studio_1794585170822.jpg';

export function HeroSection({ lang, onOpenConsultation }: HeroSectionProps) {
  const t = getT(lang);
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-white/[0.08] bg-[#0A0A0A] bg-architectural-grid"
    >
      {/* Subtle cobalt radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[780px] -translate-x-1/2 rounded-full bg-[#2563EB]/[0.12] blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-14 sm:px-6 lg:px-8 lg:pt-18 lg:pb-20">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Copy Column */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <p className="text-xs font-medium tracking-wide text-[#22D3EE] mb-4">
              {t.hero.kicker}
            </p>

            <h1 className="font-display text-[clamp(2.15rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-white text-balance">
              {t.hero.headline}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              {t.hero.subheadline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenConsultation}
                className="inline-flex min-h-[46px] items-center gap-2.5 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#1D4ED8] shadow-[0_0_28px_rgba(37,99,235,0.35)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href="#services"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-white/[0.14] bg-[#121212]/90 px-6 py-3 text-sm font-semibold text-zinc-200 transition-colors duration-150 hover:border-white/30 hover:text-white whitespace-nowrap shrink-0"
              >
                <span>{t.hero.secondaryCta}</span>
                <ArrowDownRight className="h-4 w-4 text-zinc-400" />
              </a>
            </div>
          </div>

          {/* Right Media Column */}
          <div className="lg:col-span-6 flex">
            <div className="relative w-full overflow-hidden rounded-xl border border-white/[0.1] bg-[#121212] min-h-[260px] sm:min-h-[340px] lg:min-h-[420px]">
              {!imgError ? (
                <img
                  src={HERO_IMAGE}
                  alt="Prox Marketing Agency modern digital studio"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover lg:h-full"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#121212] via-[#0F172A] to-[#0A0A0A] p-8 text-center">
                  <Building2 className="h-10 w-10 text-[#2563EB]" />
                  <span className="font-display text-sm font-semibold text-zinc-300">
                    PROX MARKETING STUDIO
                  </span>
                </div>
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/15 to-transparent"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4">
                <span className="text-xs font-medium text-zinc-300">
                  SMM · Performance Marketing · IT Engineering
                </span>
                <span className="font-mono-tabular text-xs text-[#22D3EE]">
                  PROX / TASHKENT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-column metric strip below hero split */}
        <div className="mt-10 grid grid-cols-1 divide-y divide-white/[0.08] rounded-xl border border-white/[0.08] bg-[#121212]/70 backdrop-blur-md sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
          {t.hero.metrics.map((metric, idx) => (
            <div key={idx} className="p-5 sm:p-6">
              <div className="font-display text-2xl font-bold tracking-tight text-white tabular-nums">
                {metric.value}
              </div>
              <p className="mt-1.5 text-sm leading-snug text-zinc-400">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
