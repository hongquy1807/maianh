import koreaRoutes from './routes/korea.js';
import newsRoutes from './routes/tintuc.js';
import notificationRoutes from './routes/thongbao.js';
import checkoutRoutes from './routes/checkout.js';
import profileRoutes from './routes/profile.js';
import express from 'express';
import { fileURLToPath } from 'node:url';
import catalogRoutes from './routes/catalog.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import homeRoutes from './routes/home.js';
import adminRoutes from './routes/admin/index.js';
import authRoutes from './routes/auth.js';
import { checkDatabase, pool } from './config/database.js';
import { hashToken } from './lib/passwords.js';

const app = express();
const frontendPath = fileURLToPath(new URL('../../FE/', import.meta.url));

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use('/uploads/tintuc', (req,res,next)=>{
  if(/\.(pdf|docx|xlsx|pptx)$/i.test(req.path))res.set('Content-Disposition','attachment');
  next();
});
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
app.use('/api/profile', profileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/korea', koreaRoutes);
app.use('/api/tintuc', newsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api', catalogRoutes);

app.use('/admin', async (req, res, next) => {
  const cookieName = 'maianh_session';
  const token = (req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);

  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    return res.redirect(302, '/html/DangNhap.html');
  }

  try {
    const [rows] = await pool.execute(`SELECT u.role
      FROM auth_sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > UTC_TIMESTAMP() AND u.status = 'active'`, [hashToken(token)]);

    if (!rows.length) {
      res.clearCookie(cookieName, { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production' });
      return res.redirect(302, '/html/DangNhap.html');
    }

    if (rows[0].role !== 'admin') {
      return res.redirect(302, '/html/Home.html');
    }
  } catch (error) {
    console.error('Admin guard failed:', error);
    return res.redirect(302, '/html/DangNhap.html');
  }

  next();
});

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
