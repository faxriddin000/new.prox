import { useState } from 'react';
import { ArrowRight, Briefcase, Users2, Layers } from 'lucide-react';
import type { Language } from '../types.ts';
import { getT } from '../data/translations.ts';

interface PortfolioAndAboutSectionProps {
  lang: Language;
  onRequestCaseDeck: () => void;
}

const PORTFOLIO_IMG = '/src/assets/images/portfolio_case_preview_1794585171155.jpg';
const ABOUT_IMG = '/src/assets/images/about_team_workspace_1794585170102.jpg';

export function PortfolioAndAboutSection({
  lang,
  onRequestCaseDeck,
}: PortfolioAndAboutSectionProps) {
  const t = getT(lang);
  const [portImgErr, setPortImgErr] = useState(false);
  const [aboutImgErr, setAboutImgErr] = useState(false);

  return (
    <>
      {/* Portfolio / Keyslar Section */}
      <section className="border-b border-white/[0.08] bg-[#0A0A0A] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-wide text-[#22D3EE]">
                {t.portfolio.kicker}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
                {t.portfolio.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                {t.portfolio.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={onRequestCaseDeck}
              className="inline-flex min-h-[44px] w-fit items-center gap-2 rounded-lg border border-white/[0.14] bg-[#121212] px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-[#2563EB] hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{t.portfolio.requestDeck}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
            {/* Visual Showcase */}
            <div className="lg:col-span-7 overflow-hidden rounded-xl border border-white/[0.09] bg-[#121212] relative min-h-[260px]">
              {!portImgErr ? (
                <img
                  src={PORTFOLIO_IMG}
                  alt="Prox Marketing digital product and analytics showcase"
                  referrerPolicy="no-referrer"
                  onError={() => setPortImgErr(true)}
                  className="h-full w-full object-cover lg:h-full"
                />
              ) : (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#121212] to-[#0F172A] p-8">
                  <Briefcase className="h-9 w-9 text-[#2563EB]" />
                  <span className="font-display text-sm font-semibold text-zinc-300">
                    PROX CASE ARCHIVE
                  </span>
                </div>
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/30 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <span className="font-mono-tabular text-xs font-medium text-[#22D3EE]">
                  {t.portfolio.comingSoonTitle}
                </span>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-300">
                  {t.portfolio.comingSoonDesc}
                </p>
              </div>
            </div>

            {/* Upcoming Case Slots */}
            <div className="flex flex-col justify-between gap-4 lg:col-span-5">
              {t.portfolio.slots.map((slot, idx) => (
                <div
                  key={idx}
                  className="flex flex-1 flex-col justify-between rounded-xl border border-white/[0.08] bg-[#121212]/80 p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-[#22D3EE]">
                      {slot.category}
                    </span>
                    <span className="font-mono-tabular text-xs text-zinc-500">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-white">
                    {slot.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-400">{slot.state}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Biz haqimizda (About Us) */}
      <section
        id="about"
        className="border-b border-white/[0.08] bg-[#0C0C0E] py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Editorial Workspace Image */}
            <div className="lg:col-span-5 overflow-hidden rounded-xl border border-white/[0.09] bg-[#121212] min-h-[280px]">
              {!aboutImgErr ? (
                <img
                  src={ABOUT_IMG}
                  alt="Prox Marketing strategists and engineers collaborating"
                  referrerPolicy="no-referrer"
                  onError={() => setAboutImgErr(true)}
                  className="h-full w-full object-cover lg:h-full"
                />
              ) : (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#121212] to-[#111827] p-8">
                  <Layers className="h-9 w-9 text-[#22D3EE]" />
                  <span className="font-display text-sm font-semibold text-zinc-300">
                    PROX TEAM WORKSPACE
                  </span>
                </div>
              )}
            </div>

            {/* Agency Story, Mission, Core Values & Team Placeholder */}
            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                <p className="text-xs font-medium tracking-wide text-[#22D3EE]">
                  {t.about.kicker}
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
                  {t.about.title}
                </h2>

                <div className="mt-6 border-t border-white/[0.08] pt-6">
                  <h3 className="font-display text-base font-semibold text-white">
                    {t.about.missionTitle}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-zinc-400">
                    {t.about.missionDesc}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {t.about.values.map((val, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/[0.08] bg-[#121212] p-4"
                    >
                      <div className="font-display text-sm font-bold text-white">
                        {val.title}
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                        {val.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team placeholder ready for future activation */}
              <div className="mt-6 flex items-start gap-4 rounded-xl border border-dashed border-white/[0.14] bg-[#121212]/50 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] bg-[#18191E] text-[#22D3EE]">
                  <Users2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold text-white">
                    {t.about.teamPlaceholderTitle}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {t.about.teamPlaceholderDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
