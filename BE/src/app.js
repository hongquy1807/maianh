import express from 'express';
import { fileURLToPath } from 'node:url';
import catalogRoutes from './routes/catalog.js';
import authRoutes from './routes/auth.js';
import { checkDatabase } from './config/database.js';

const app = express();
const frontendPath = fileURLToPath(new URL('../../FE/', import.meta.url));

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(fileURLToPath(new URL('../uploads/', import.meta.url)), {
  dotfiles: 'deny', index: false,
  setHeaders(res) { res.setHeader('X-Content-Type-Options', 'nosniff'); }
}));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'maianh-backend' });
});

app.get('/api/health/db', async (req, res) => {
  try {
    await checkDatabase();
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});
app.use('/api/auth', authRoutes);
app.use('/api', catalogRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API not found' });
});

// Preserve old page URLs after moving pages into FE/html.
app.get('/', (req, res) => {
  res.redirect(`/html/Home.html${req.originalUrl.slice(req.path.length)}`);
});
app.get('/:page.html', (req, res, next) => {
  const pages = ['Home', 'Cart', 'ChiTiet', 'DangNhap', 'Korean', 'profile', 'Random', 'TinTuc'];
  if (!pages.includes(req.params.page)) return next();
  res.redirect(`/html/${req.params.page}.html${req.originalUrl.slice(req.path.length)}`);
});
app.use(express.static(frontendPath, { index: false }));

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  const status = err.status >= 400 && err.status < 600 ? err.status : 500;
  if (status >= 500) console.error('Request failed:', err.code || err.name);
  res.status(status).json({ error: err.publicMessage || (status >= 500 ? 'Internal server error' : 'Invalid request') });
});

export default app;
