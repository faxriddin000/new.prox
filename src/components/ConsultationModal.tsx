import { X } from 'lucide-react';
import type { Language, ServiceCategory } from '../types.ts';
import { getT } from '../data/translations.ts';
import { LeadForm } from './LeadForm.tsx';

interface ConsultationModalProps {
  open: boolean;
  lang: Language;
  initialService: ServiceCategory;
  initialPackageInfo: string;
  onClose: () => void;
}

export function ConsultationModal({
  open,
  lang,
  initialService,
  initialPackageInfo,
  onClose,
}: ConsultationModalProps) {
  if (!open) return null;
  const t = getT(lang);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consult-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#121212] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4 mb-5">
          <div>
            <p className="text-xs font-medium text-[#22D3EE]">
              PROX MARKETING
            </p>
            <h3
              id="consult-modal-title"
              className="mt-1 font-display text-xl font-bold text-white"
            >
              {t.contact.formTitle}
            </h3>
          </div>
          <button
            type="button"
            aria-label={t.services.closeLabel}
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <LeadForm
          lang={lang}
          initialService={initialService}
          initialPackageInfo={initialPackageInfo}
        />
      </div>
    </div>
  );
}
