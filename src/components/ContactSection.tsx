import { Phone, Instagram, Send, ArrowUpRight } from 'lucide-react';
import type { Language, ServiceCategory } from '../types.ts';
import { getT } from '../data/translations.ts';
import { LeadForm } from './LeadForm.tsx';

interface ContactSectionProps {
  lang: Language;
  selectedService: ServiceCategory;
  selectedPackageInfo: string;
}

export function ContactSection({
  lang,
  selectedService,
  selectedPackageInfo,
}: ContactSectionProps) {
  const t = getT(lang);

  const channels = [
    {
      label: t.contact.phoneLabel,
      value: '+998 20 026 04 18',
      href: 'tel:+998200260418',
      icon: Phone,
      external: false,
    },
    {
      label: t.contact.instagramLabel,
      value: '@prox_uz',
      href: 'https://instagram.com/prox_uz',
      icon: Instagram,
      external: true,
    },
    {
      label: t.contact.telegramLabel,
      value: '@manager_prox',
      href: 'https://t.me/manager_prox',
      icon: Send,
      external: true,
    },
  ];

  return (
    <section
      id="contact"
      className="border-b border-white/[0.08] bg-[#0A0A0A] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5">
            <p className="text-xs font-medium tracking-wide text-[#22D3EE]">
              {t.contact.kicker}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              {t.contact.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              {t.contact.subtitle}
            </p>

            <div className="mt-8 space-y-3.5">
              {channels.map((ch) => {
                const Icon = ch.icon;
                return (
                  <a
                    key={ch.value}
                    href={ch.href}
                    target={ch.external ? '_blank' : undefined}
                    rel={ch.external ? 'noopener noreferrer' : undefined}
                    className="group flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#121212] p-4 sm:p-5 transition-colors hover:border-[#2563EB]/60"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.1] bg-[#18191E] text-[#22D3EE]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs text-zinc-400">{ch.label}</div>
                        <div className="mt-0.5 font-mono-tabular text-base font-semibold text-white">
                          {ch.value}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-white" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right: Lead Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-white/[0.1] bg-[#121212]/90 backdrop-blur-md p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-white mb-6">
                {t.contact.formTitle}
              </h3>
              <LeadForm
                lang={lang}
                initialService={selectedService}
                initialPackageInfo={selectedPackageInfo}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
