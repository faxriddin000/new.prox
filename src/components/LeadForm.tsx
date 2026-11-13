import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import type { Language, ServiceCategory } from '../types.ts';
import { getT } from '../data/translations.ts';

interface LeadFormProps {
  lang: Language;
  initialService?: ServiceCategory;
  initialPackageInfo?: string;
  onSuccessDone?: () => void;
}

export function LeadForm({
  lang,
  initialService = 'smm',
  initialPackageInfo = '',
  onSuccessDone,
}: LeadFormProps) {
  const t = getT(lang);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState<ServiceCategory>(initialService);
  const [packageInfo, setPackageInfo] = useState(initialPackageInfo);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setServiceType(initialService);
  }, [initialService]);

  useEffect(() => {
    setPackageInfo(initialPackageInfo);
  }, [initialPackageInfo]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError(t.contact.errors.nameRequired);
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      setError(t.contact.errors.phoneRequired);
      return;
    }
    if (digits.length < 9) {
      setError(t.contact.errors.phoneInvalid);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          serviceType,
          packageInfo: packageInfo.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });
      if (!res.ok) {
        throw new Error('Request failed');
      }
      setSubmitted(true);
      setName('');
      setPhone('');
      setMessage('');
      if (onSuccessDone) {
        onSuccessDone();
      }
    } catch {
      setError(t.contact.errors.submitFailed);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-start justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-6 sm:p-8">
        <div className="flex items-center gap-3 text-emerald-400">
          <CheckCircle2 className="h-6 w-6 shrink-0" />
          <h4 className="font-display text-lg font-bold text-white">
            {t.contact.successMessage}
          </h4>
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          {lang === 'uz'
            ? 'Menejerimiz ish vaqtida siz bilan telefon yoki Telegram orqali bog‘lanadi.'
            : 'Наш менеджер свяжется с вами по телефону или в Telegram в рабочее время.'}
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-5 rounded-lg border border-white/[0.12] bg-[#18191E] px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white cursor-pointer"
        >
          {t.contact.newRequestBtn}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {packageInfo && (
        <div className="flex items-center justify-between rounded-lg border border-[#2563EB]/40 bg-[#2563EB]/10 px-3.5 py-2.5 text-xs">
          <span className="text-zinc-300">
            {t.contact.packageLabel}:{' '}
            <strong className="font-semibold text-white">{packageInfo}</strong>
          </span>
          <button
            type="button"
            onClick={() => setPackageInfo('')}
            className="text-zinc-400 hover:text-white cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      <div>
        <label
          htmlFor={`lead-name-${initialPackageInfo ? 'modal' : 'page'}`}
          className="block text-xs font-medium text-zinc-300 mb-1.5"
        >
          {t.contact.nameLabel} *
        </label>
        <input
          id={`lead-name-${initialPackageInfo ? 'modal' : 'page'}`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.contact.namePlaceholder}
          required
          className="w-full rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`lead-phone-${initialPackageInfo ? 'modal' : 'page'}`}
            className="block text-xs font-medium text-zinc-300 mb-1.5"
          >
            {t.contact.phoneFieldLabel} *
          </label>
          <input
            id={`lead-phone-${initialPackageInfo ? 'modal' : 'page'}`}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.contact.phonePlaceholder}
            required
            className="w-full font-mono-tabular rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>

        <div>
          <label
            htmlFor={`lead-service-${initialPackageInfo ? 'modal' : 'page'}`}
            className="block text-xs font-medium text-zinc-300 mb-1.5"
          >
            {t.contact.serviceLabel}
          </label>
          <select
            id={`lead-service-${initialPackageInfo ? 'modal' : 'page'}`}
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as ServiceCategory)}
            className="w-full rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-white focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="smm">{t.contact.serviceOptions.smm}</option>
            <option value="marketing">{t.contact.serviceOptions.marketing}</option>
            <option value="it">{t.contact.serviceOptions.it}</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor={`lead-msg-${initialPackageInfo ? 'modal' : 'page'}`}
          className="block text-xs font-medium text-zinc-300 mb-1.5"
        >
          {t.contact.messageLabel}
        </label>
        <textarea
          id={`lead-msg-${initialPackageInfo ? 'modal' : 'page'}`}
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.contact.messagePlaceholder}
          className="w-full resize-none rounded-lg border border-white/[0.12] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-950/30 px-3.5 py-2.5 text-xs font-medium text-red-300"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-60 cursor-pointer"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{t.contact.submittingBtn}</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>{t.contact.submitBtn}</span>
          </>
        )}
      </button>
    </form>
  );
}
