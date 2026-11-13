import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { Language } from '../types.ts';
import { getT } from '../data/translations.ts';

interface NavbarProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  onOpenConsultation: () => void;
}

export function Navbar({ lang, onChangeLang, onOpenConsultation }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = getT(lang);

  const links = [
    { href: '#home', label: t.nav.home },
    { href: '#about', label: t.nav.about },
    { href: '#services', label: t.nav.services },
    { href: '#pricing', label: t.nav.pricing },
    { href: '#partners', label: t.nav.partners },
    { href: '#contact', label: t.nav.contact },
  ];

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0A0A0A]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#home"
          className="font-display text-base font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-sm"
        >
          PROX MARKETING
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-400"
        >
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 transition-colors duration-150 hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-sm after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[#22D3EE] after:transition-all after:duration-200 hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Language Toggle + Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            role="group"
            aria-label="Language selector"
            className="flex items-center rounded-lg border border-white/[0.1] bg-[#121212] p-0.5"
          >
            <button
              type="button"
              onClick={() => onChangeLang('uz')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                lang === 'uz'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              UZ
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('ru')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                lang === 'ru'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              RU
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenConsultation}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white transition-all duration-150 hover:bg-[#1D4ED8] shadow-[0_0_20px_rgba(37,99,235,0.3)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
          >
            {t.nav.cta}
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-lg border border-white/[0.1] bg-[#121212] text-zinc-200 hover:text-white cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#0A0A0A]/95 backdrop-blur-xl px-4 py-4">
          <nav className="flex flex-col gap-1">
            {links.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-zinc-300 hover:bg-white/[0.05] hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenConsultation();
              }}
              className="mt-3 flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer"
            >
              {t.nav.cta}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
