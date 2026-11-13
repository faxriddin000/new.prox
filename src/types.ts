export type Language = 'uz' | 'ru';

export type ServiceCategory = 'smm' | 'marketing' | 'it';

export type LeadStatus = 'new' | 'contacted' | 'in_progress' | 'closed';

export interface BilingualText {
  uz: string;
  ru: string;
}

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  indexLabel: string;
  title: BilingualText;
  summary: BilingualText;
  deliverables: BilingualText[];
  timeline: BilingualText;
}

export interface SmmPackage {
  id: string;
  months: number;
  label: BilingualText;
  audience: BilingualText;
  monthlyPrice: number;
  featured?: boolean;
  features: BilingualText[];
}

export interface PricingConfig {
  smmPackages: SmmPackage[];
  marketingStartPrice: number;
  marketingSubtitle: BilingualText;
  marketingNote: BilingualText;
  itTitle: BilingualText;
  itNote: BilingualText;
}

export interface PartnerItem {
  id: string;
  name: string;
  sector: BilingualText;
  monogram: string;
  logoUrl?: string;
}

export interface LeadItem {
  id: string;
  name: string;
  phone: string;
  serviceType: ServiceCategory;
  packageInfo?: string;
  message?: string;
  status: LeadStatus;
  createdAt: string;
}

export interface SiteData {
  services: ServiceItem[];
  pricing: PricingConfig;
  partners: PartnerItem[];
}
