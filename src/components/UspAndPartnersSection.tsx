import { useState } from 'react';
import { Layers, Target, Users, BarChart3 } from 'lucide-react';
import type { Language, PartnerItem } from '../types.ts';
import { getT } from '../data/translations.ts';

interface UspAndPartnersSectionProps {
  lang: Language;
  partners: PartnerItem[];
}

const USP_ICONS = [Layers, Target, Users, BarChart3];

function PartnerCard({
  partner,
  lang,
}: {
  partner: PartnerItem;
  lang: Language;
}) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="flex min-w-[220px] items-center gap-3.5 rounded-xl border border-white/[0.08] bg-[#121212] px-5 py-4 transition-colors hover:border-[#2563EB]/40">
      {partner.logoUrl && !imgErr ? (
        <img
          src={partner.logoUrl}
          alt={partner.name}
          referrerPolicy="no-referrer"
          onError={() => setImgErr(true)}
          className="h-10 w-10 rounded-lg object-contain bg-white/[0.04] p-1"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] bg-[#18191E] font-display text-sm font-bold text-[#22D3EE]">
          {partner.monogram}
        </div>
      )}
      <div className="min-w-0">
        <div className="truncate font-display text-sm font-semibold text-white">
          {partner.name}
        </div>
        <div className="truncate text-xs text-zinc-400">
          {partner.sector[lang]}
        </div>
      </div>
    </div>
  );
}

export function UspAndPartnersSection({
  lang,
  partners,
}: UspAndPartnersSectionProps) {
  const t = getT(lang);
  const marqueeList = partners.length > 0 ? [...partners, ...partners] : [];

  return (
    <>
      {/* Nega aynan biz? (USP) */}
      <section className="border-b border-white/[0.08] bg-[#0A0A0A] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium tracking-wide text-[#22D3EE]">
                {t.usp.kicker}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
                {t.usp.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                {t.usp.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7">
              {t.usp.items.map((item, idx) => {
                const Icon = USP_ICONS[idx % USP_ICONS.length];
                return (
                  <div
                    key={item.index}
                    className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#121212]/80 p-6 transition-colors duration-150 hover:border-white/20"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tabular text-xs font-medium text-zinc-500">
                          {item.index}
                        </span>
                        <Icon className="h-5 w-5 text-[#3B82F6]" />
                      </div>
                      <h3 className="mt-4 font-display text-lg font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Hamkorlarimiz (Partners Logo Slider & Grid) */}
      <section
        id="partners"
        className="overflow-hidden border-b border-white/[0.08] bg-[#0C0C0E] py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#22D3EE]">
                {t.partners.kicker}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {t.partners.title}
              </h2>
            </div>
            <p className="max-w-md text-sm text-zinc-400">
              {t.partners.subtitle}
            </p>
          </div>

          {/* Infinite smooth marquee slider on desktop */}
          {marqueeList.length > 0 && (
            <div className="relative mt-10 overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#0C0C0E] to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#0C0C0E] to-transparent"
              />
              <div className="flex w-max gap-4 animate-partner-marquee">
                {marqueeList.map((partner, idx) => (
                  <PartnerCard
                    key={`${partner.id}-${idx}`}
                    partner={partner}
                    lang={lang}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
