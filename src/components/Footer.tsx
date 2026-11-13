import { Shield } from 'lucide-react';
import type { Language } from '../types.ts';
import { getT } from '../data/translations.ts';

interface FooterProps {
  lang: Language;
  onOpenAdmin: () => void;
}

export function Footer({ lang, onOpenAdmin }: FooterProps) {
  const t = getT(lang);

  const navLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#about', label: t.nav.about },
    { href: '#services', label: t.nav.services },
    { href: '#pricing', label: t.nav.pricing },
    { href: '#partners', label: t.nav.partners },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <footer className="bg-[#080809] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-white/[0.08] pb-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <a
              href="#home"
              className="font-display text-lg font-extrabold tracking-tight text-white"
            >
              PROX MARKETING
            </a>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
              {t.footer.tagline}
            </p>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {t.footer.navTitle}
            </h4>
            <ul className="mt-4 grid grid-cols-2 gap-2.5 text-sm text-zinc-300">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {t.footer.contactTitle}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-300">
              <li>
                <a
                  href="tel:+998200260418"
                  className="font-mono-tabular hover:text-white"
                >
                  +998 20 026 04 18
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/prox_uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Instagram: @prox_uz
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/manager_prox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Telegram: @manager_prox
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-xs text-zinc-500">{t.footer.copyright}</p>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-[#121212] px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-white/20 hover:text-white cursor-pointer"
          >
            <Shield className="h-3.5 w-3.5 text-[#3B82F6]" />
            <span>{t.footer.adminLink}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
