import type { LeadItem, SiteData } from '../types.ts';

export const DEFAULT_SITE_DATA: SiteData = {
  services: [
    {
      id: 'svc-smm',
      category: 'smm',
      indexLabel: '01',
      title: {
        uz: 'SMM',
        ru: 'SMM',
      },
      summary: {
        uz: 'Ijtimoiy tarmoqlarda tizimli kontent, brend pozitsiyasi va konversiyali reklama kampaniyalari orqali barqaror auditoriya va murojaatlar oqimini yaratish.',
        ru: 'Системный контент, позиционирование бренда и конверсионные рекламные кампании в соцсетях для стабильного притока заявок.',
      },
      timeline: {
        uz: '14 kunda to‘liq ishga tushirish',
        ru: 'Полный запуск за 14 дней',
      },
      deliverables: [
        {
          uz: 'Strategiya ishlab chiqish',
          ru: 'Разработка стратегии',
        },
        {
          uz: 'Kontent yaratish (Reels, foto, kopirayting)',
          ru: 'Создание контента (Reels, фото, копирайтинг)',
        },
        {
          uz: 'Post va storilarni tizimli boshqarish',
          ru: 'Системное ведение постов и сторис',
        },
        {
          uz: 'Reklama kampaniyalari (Instagram / Facebook)',
          ru: 'Рекламные кампании (Instagram / Facebook)',
        },
        {
          uz: 'Brend imijini mustahkamlash',
          ru: 'Укрепление имиджа бренда',
        },
        {
          uz: 'Analitika va oylik hisobot',
          ru: 'Аналитика и ежемесячная отчётность',
        },
      ],
    },
    {
      id: 'svc-marketing',
      category: 'marketing',
      indexLabel: '02',
      title: {
        uz: 'Marketing',
        ru: 'Маркетинг',
      },
      summary: {
        uz: 'Sotuv bo‘limi bilan integratsiyalashgan performance-marketing, ko‘p kanalli target va brending ekotizimi.',
        ru: 'Performance-маркетинг, мультиканальный таргетинг и брендинг-экосистема, интегрированная с отделом продаж.',
      },
      timeline: {
        uz: '30 kunda to‘liq voronka',
        ru: 'Полная воронка за 30 дней',
      },
      deliverables: [
        {
          uz: 'SMM xizmatlaridagi barcha takliflar',
          ru: 'Все опции SMM-сопровождения',
        },
        {
          uz: 'Target (Google Ads, Telegram Ads)',
          ru: 'Таргет и контекст (Google Ads, Telegram Ads)',
        },
        {
          uz: 'Branding (logo, brandbook)',
          ru: 'Брендинг (логотип, брендбук)',
        },
        {
          uz: 'Marketing strategiya & konsalting',
          ru: 'Маркетинговая стратегия и консалтинг',
        },
        {
          uz: 'Influencer marketing',
          ru: 'Influencer-маркетинг',
        },
        {
          uz: 'Sotuv bo‘limi nazorati va CRM audit',
          ru: 'Контроль отдела продаж и аудит CRM',
        },
      ],
    },
    {
      id: 'svc-it',
      category: 'it',
      indexLabel: '03',
      title: {
        uz: 'IT xizmatlari',
        ru: 'IT-услуги',
      },
      summary: {
        uz: 'Yuqori tezlikdagi veb-platformalar, mobil ilovalar, to‘lov tizimlari va sun’iy intellektga asoslangan sotuv botlarini muhandislik darajasida yaratish.',
        ru: 'Инженерная разработка быстрых веб-платформ, мобильных приложений, платёжных систем и AI-ботов для автоматизации продаж.',
      },
      timeline: {
        uz: 'Individual sprint jadvali asosida',
        ru: 'По индивидуальному спринт-плану',
      },
      deliverables: [
        {
          uz: 'Veb-sayt ishlab chiqish (landing, korporativ, internet-do‘kon)',
          ru: 'Разработка веб-сайтов (лендинг, корпоративный, e-commerce)',
        },
        {
          uz: 'Mobil ilovalar (iOS / Android)',
          ru: 'Мобильные приложения (iOS / Android)',
        },
        {
          uz: 'Onlayn buyurtma va to‘lov tizimlari',
          ru: 'Системы онлайн-заказа и оплаты',
        },
        {
          uz: 'UI/UX dizayn',
          ru: 'UI/UX дизайн',
        },
        {
          uz: 'Texnik qo‘llab-quvvatlash',
          ru: 'Техническая поддержка 24/7',
        },
        {
          uz: 'Sun’iy intellekt va botlar (Telegram / Instagram AI chat-botlar)',
          ru: 'Искусственный интеллект и боты (AI чат-боты Telegram / Instagram)',
        },
      ],
    },
  ],
  pricing: {
    smmPackages: [
      {
        id: 'smm-1m',
        months: 1,
        label: {
          uz: '1 oylik paket',
          ru: 'Пакет на 1 месяц',
        },
        audience: {
          uz: 'Tezkor test va start uchun',
          ru: 'Для быстрого старта и теста гипотез',
        },
        monthlyPrice: 1500,
        featured: false,
        features: [
          {
            uz: 'Strategiya + kontent-plan',
            ru: 'Стратегия + контент-план',
          },
          {
            uz: '12–16 ta Reels va post ishlab chiqish',
            ru: '12–16 Reels и постов в месяц',
          },
          {
            uz: 'Instagram / Facebook target boshqaruvi',
            ru: 'Настройка таргета Instagram / Facebook',
          },
        ],
      },
      {
        id: 'smm-3m',
        months: 3,
        label: {
          uz: '3 oylik paket',
          ru: 'Пакет на 3 месяца',
        },
        audience: {
          uz: 'Barqaror o‘sish bosqichi uchun',
          ru: 'Для этапа устойчивого роста',
        },
        monthlyPrice: 1350,
        featured: false,
        features: [
          {
            uz: 'Kengaytirilgan Reels & foto prodakshn',
            ru: 'Расширенный Reels и фото-продакшн',
          },
          {
            uz: 'Kundalik storis voronkalari',
            ru: 'Ежедневные воронки в сторис',
          },
          {
            uz: 'A/B reklama optimizatsiyasi',
            ru: 'A/B оптимизация рекламных связок',
          },
        ],
      },
      {
        id: 'smm-6m',
        months: 6,
        label: {
          uz: '6 oylik paket',
          ru: 'Пакет на 6 месяцев',
        },
        audience: {
          uz: 'Tizimli bozor ulushini oshirish',
          ru: 'Системное масштабирование доли рынка',
        },
        monthlyPrice: 1200,
        featured: true,
        features: [
          {
            uz: 'To‘liq brend pozitsiyasi va vizual tizim',
            ru: 'Полное позиционирование и визуальная система',
          },
          {
            uz: 'Lid-generatsiya va CRM hisoboti',
            ru: 'Лидогенерация и сквозная отчётность CRM',
          },
          {
            uz: 'Shaxsiy kreativ direktor nazorati',
            ru: 'Кураторство креативного директора',
          },
        ],
      },
      {
        id: 'smm-12m',
        months: 12,
        label: {
          uz: '12 oylik (1 yillik) paket',
          ru: 'Пакет на 12 месяцев (1 год)',
        },
        audience: {
          uz: 'Maksimal ROI va uzoq muddatli hamkorlik',
          ru: 'Максимальный ROI и долгосрочное партнёрство',
        },
        monthlyPrice: 1000,
        featured: false,
        features: [
          {
            uz: 'Yillik strategik yo‘l xaritasi',
            ru: 'Годовая стратегическая дорожная карта',
          },
          {
            uz: 'Ustuvor prodakshn va media byudjet auditi',
            ru: 'Приоритетный продакшн и аудит медиа-бюджета',
          },
          {
            uz: 'Oyiga $500 gacha tejamkorlik',
            ru: 'Экономия до $500 ежемесячно',
          },
        ],
      },
    ],
    marketingStartPrice: 2000,
    marketingSubtitle: {
      uz: 'Kompleks Marketing & Sotuv Tizimi',
      ru: 'Комплексный маркетинг и система продаж',
    },
    marketingNote: {
      uz: 'Loyiha hajmi, reklama kanallari (Google Ads, Telegram Ads, Meta) va sotuv bo‘limi integratsiyasiga qarab individual hisoblanadi.',
      ru: 'Рассчитывается индивидуально в зависимости от масштаба проекта, каналов (Google Ads, Telegram Ads, Meta) и интеграции с отделом продаж.',
    },
    itTitle: {
      uz: 'IT Yechimlar va Raqamli Mahsulotlar',
      ru: 'IT-решения и цифровые продукты',
    },
    itNote: {
      uz: 'Veb-sayt, mobil ilova, to‘lov tizimi yoki AI chat-bot loyihangiz uchun texnik topshiriq va aniq smeta tayyorlab beramiz.',
      ru: 'Подготовим техническое задание и точную смету для вашего сайта, мобильного приложения, платёжной интеграции или AI чат-бота.',
    },
  },
  partners: [
    {
      id: 'pt-1',
      name: 'Apex Logistics',
      sector: { uz: 'Logistika & B2B', ru: 'Логистика и B2B' },
      monogram: 'AX',
    },
    {
      id: 'pt-2',
      name: 'Vektor Med',
      sector: { uz: 'Tibbiyot klinikasi', ru: 'Медицинская клиника' },
      monogram: 'VM',
    },
    {
      id: 'pt-3',
      name: 'Orient Estate',
      sector: { uz: 'Ko‘chmas mulk', ru: 'Недвижимость' },
      monogram: 'OE',
    },
    {
      id: 'pt-4',
      name: 'Saffron Retail',
      sector: { uz: 'E-commerce', ru: 'E-commerce' },
      monogram: 'SR',
    },
    {
      id: 'pt-5',
      name: 'Nova FinTech',
      sector: { uz: 'Moliyaviy xizmatlar', ru: 'Финтех' },
      monogram: 'NF',
    },
    {
      id: 'pt-6',
      name: 'Qadam Auto',
      sector: { uz: 'Avtomobil savdosi', ru: 'Авторитейл' },
      monogram: 'QA',
    },
  ],
};

export const DEFAULT_LEADS: LeadItem[] = [
  {
    id: 'lead-1001',
    name: 'Sardorbek Alimov',
    phone: '+998 90 412 88 10',
    serviceType: 'marketing',
    packageInfo: 'Kompleks Marketing ($2,000+)',
    message: 'Toshkentdagi 3 ta filial uchun Google Ads va sotuv bo‘limi auditi kerak.',
    status: 'new',
    createdAt: '2026-11-12T14:20:00.000Z',
  },
  {
    id: 'lead-1002',
    name: 'Malika Karimova',
    phone: '+998 99 845 19 04',
    serviceType: 'smm',
    packageInfo: '6 oylik paket ($1,200/oy)',
    message: 'Klinika Instagram sahifasini noldan tizimli yuritish bo‘yicha uchrashuv.',
    status: 'contacted',
    createdAt: '2026-11-11T09:45:00.000Z',
  },
  {
    id: 'lead-1003',
    name: 'Jamshid Rahimov',
    phone: '+998 93 301 77 55',
    serviceType: 'it',
    packageInfo: 'Individual IT smeta',
    message: 'Telegram Mini App + Payme/Click integratsiyali do‘kon va AI konsultant bot.',
    status: 'in_progress',
    createdAt: '2026-11-09T16:10:00.000Z',
  },
];
