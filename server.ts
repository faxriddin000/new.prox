import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { DEFAULT_LEADS, DEFAULT_SITE_DATA } from './src/data/defaultData.ts';
import type { LeadItem, LeadStatus, PartnerItem, PricingConfig, ServiceItem, SiteData } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');
const PORT = Number(process.env.PORT || 3000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'prox2026';

interface StoreShape {
  siteData: SiteData;
  leads: LeadItem[];
}

const activeTokens = new Set<string>();

async function ensureStore(): Promise<StoreShape> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as StoreShape;
    if (!parsed.siteData || !Array.isArray(parsed.leads)) {
      throw new Error('Invalid store shape');
    }
    return parsed;
  } catch {
    const initial: StoreShape = {
      siteData: structuredClone(DEFAULT_SITE_DATA),
      leads: structuredClone(DEFAULT_LEADS),
    };
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

async function writeStore(store: StoreShape): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!activeTokens.has(token)) {
    res.status(401).json({ error: 'Invalid or expired session' });
    return;
  }
  next();
}

async function startServer() {
  let store = await ensureStore();

  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Public: get site configuration (services, pricing, partners)
  app.get('/api/site-data', (_req, res) => {
    res.json(store.siteData);
  });

  // Public: submit consultation lead
  app.post('/api/leads', async (req, res) => {
    const { name, phone, serviceType, packageInfo, message } = req.body ?? {};
    if (typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    if (typeof phone !== 'string' || phone.replace(/\D/g, '').length < 9) {
      res.status(400).json({ error: 'Valid phone number is required' });
      return;
    }
    const validService = serviceType === 'smm' || serviceType === 'marketing' || serviceType === 'it'
      ? serviceType
      : 'smm';

    const newLead: LeadItem = {
      id: `lead-${Date.now().toString(36)}`,
      name: name.trim(),
      phone: phone.trim(),
      serviceType: validService,
      packageInfo: typeof packageInfo === 'string' && packageInfo.trim() ? packageInfo.trim() : undefined,
      message: typeof message === 'string' && message.trim() ? message.trim() : undefined,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    store.leads = [newLead, ...store.leads];
    await writeStore(store);
    res.status(201).json(newLead);
  });

  // Admin: authenticate
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body ?? {};
    if (typeof password !== 'string' || password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = crypto.randomBytes(24).toString('hex');
    activeTokens.add(token);
    res.json({ token });
  });

  app.post('/api/admin/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      activeTokens.delete(authHeader.slice('Bearer '.length).trim());
    }
    res.json({ ok: true });
  });

  // Admin: leads CRUD
  app.get('/api/admin/leads', requireAdmin, (_req, res) => {
    res.json(store.leads);
  });

  app.patch('/api/admin/leads/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body ?? {};
    const allowed: LeadStatus[] = ['new', 'contacted', 'in_progress', 'closed'];
    if (!allowed.includes(status)) {
      res.status(400).json({ error: 'Invalid lead status' });
      return;
    }
    const idx = store.leads.findIndex((l) => l.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    store.leads[idx] = { ...store.leads[idx], status };
    await writeStore(store);
    res.json(store.leads[idx]);
  });

  app.delete('/api/admin/leads/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const before = store.leads.length;
    store.leads = store.leads.filter((l) => l.id !== id);
    if (store.leads.length === before) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    await writeStore(store);
    res.json({ ok: true });
  });

  // Admin: pricing update
  app.put('/api/admin/pricing', requireAdmin, async (req, res) => {
    const nextPricing = req.body as PricingConfig;
    if (!nextPricing || !Array.isArray(nextPricing.smmPackages) || typeof nextPricing.marketingStartPrice !== 'number') {
      res.status(400).json({ error: 'Invalid pricing payload' });
      return;
    }
    store.siteData = { ...store.siteData, pricing: nextPricing };
    await writeStore(store);
    res.json(store.siteData.pricing);
  });

  // Admin: services update
  app.put('/api/admin/services', requireAdmin, async (req, res) => {
    const nextServices = req.body as ServiceItem[];
    if (!Array.isArray(nextServices) || nextServices.length === 0) {
      res.status(400).json({ error: 'Invalid services payload' });
      return;
    }
    store.siteData = { ...store.siteData, services: nextServices };
    await writeStore(store);
    res.json(store.siteData.services);
  });

  // Admin: partners create/update/delete
  app.post('/api/admin/partners', requireAdmin, async (req, res) => {
    const { name, sector, monogram, logoUrl } = req.body ?? {};
    if (typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Partner name is required' });
      return;
    }
    const cleanName = name.trim();
    const newPartner: PartnerItem = {
      id: `pt-${Date.now().toString(36)}`,
      name: cleanName,
      sector: {
        uz: typeof sector?.uz === 'string' && sector.uz.trim() ? sector.uz.trim() : 'Biznes hamkor',
        ru: typeof sector?.ru === 'string' && sector.ru.trim() ? sector.ru.trim() : 'Бизнес-партнёр',
      },
      monogram:
        typeof monogram === 'string' && monogram.trim()
          ? monogram.trim().slice(0, 2).toUpperCase()
          : cleanName.slice(0, 2).toUpperCase(),
      logoUrl: typeof logoUrl === 'string' && logoUrl.trim() ? logoUrl.trim() : undefined,
    };
    store.siteData = {
      ...store.siteData,
      partners: [...store.siteData.partners, newPartner],
    };
    await writeStore(store);
    res.status(201).json(newPartner);
  });

  app.delete('/api/admin/partners/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const before = store.siteData.partners.length;
    store.siteData = {
      ...store.siteData,
      partners: store.siteData.partners.filter((p) => p.id !== id),
    };
    if (store.siteData.partners.length === before) {
      res.status(404).json({ error: 'Partner not found' });
      return;
    }
    await writeStore(store);
    res.json({ ok: true });
  });

  // Vite middleware in development or static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Prox Marketing server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
