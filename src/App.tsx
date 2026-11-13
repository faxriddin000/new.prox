import { useEffect, useState } from 'react';
import { DEFAULT_SITE_DATA } from './data/defaultData.ts';
import type { Language, ServiceCategory, SiteData } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { PricingSection } from './components/PricingSection.tsx';
import { UspAndPartnersSection } from './components/UspAndPartnersSection.tsx';
import { PortfolioAndAboutSection } from './components/PortfolioAndAboutSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { ConsultationModal } from './components/ConsultationModal.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';

export default function App() {
  const [lang, setLang] = useState<Language>('uz');
  const [siteData, setSiteData] = useState<SiteData>(DEFAULT_SITE_DATA);
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() =>
    window.location.pathname.startsWith('/admin')
  );

  // Consultation / pre-selected service state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceCategory>('smm');
  const [selectedPackageInfo, setSelectedPackageInfo] = useState('');

  useEffect(() => {
    fetch('/api/site-data')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SiteData | null) => {
        if (data && data.pricing && data.services && data.partners) {
          setSiteData(data);
        }
      })
      .catch(() => {
        // Fallback to default seed data if offline
      });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setIsAdminRoute(window.location.pathname.startsWith('/admin'));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const openAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToSite = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenConsultation = (
    category: ServiceCategory = 'smm',
    packageInfo = ''
  ) => {
    setSelectedService(category);
    setSelectedPackageInfo(packageInfo);
    setModalOpen(true);
  };

  const handleSelectAndScrollToContact = (
    category: ServiceCategory,
    packageInfo = ''
  ) => {
    setSelectedService(category);
    setSelectedPackageInfo(packageInfo);
    setModalOpen(true);
  };

  if (isAdminRoute) {
    return (
      <AdminPanel
        lang={lang}
        onChangeLang={setLang}
        siteData={siteData}
        onSiteDataChange={setSiteData}
        onBackToSite={backToSite}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F4F5]">
      <Navbar
        lang={lang}
        onChangeLang={setLang}
        onOpenConsultation={() => handleOpenConsultation('smm', '')}
      />

      <main>
        <HeroSection
          lang={lang}
          onOpenConsultation={() => handleOpenConsultation('smm', '')}
        />

        <ServicesSection
          lang={lang}
          services={siteData.services}
          onSelectService={(cat, label) =>
            handleSelectAndScrollToContact(cat, label ?? '')
          }
        />

        <PricingSection
          lang={lang}
          pricing={siteData.pricing}
          onSelectPlan={(cat, pkgLabel) =>
            handleSelectAndScrollToContact(cat, pkgLabel)
          }
        />

        <UspAndPartnersSection lang={lang} partners={siteData.partners} />

        <PortfolioAndAboutSection
          lang={lang}
          onRequestCaseDeck={() =>
            handleOpenConsultation(
              'marketing',
              lang === 'uz'
                ? 'Yopiq keyslar taqdimoti'
                : 'Презентация закрытых кейсов'
            )
          }
        />

        <ContactSection
          lang={lang}
          selectedService={selectedService}
          selectedPackageInfo={selectedPackageInfo}
        />
      </main>

      <Footer lang={lang} onOpenAdmin={openAdmin} />

      <ConsultationModal
        open={modalOpen}
        lang={lang}
        initialService={selectedService}
        initialPackageInfo={selectedPackageInfo}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
