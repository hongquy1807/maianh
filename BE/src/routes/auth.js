import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { pool } from '../config/database.js';
import { hashPassword, verifyPassword, newToken, hashToken } from '../lib/passwords.js';
import { sendResetEmail, mailConfigured } from '../services/reset-mail.js';

const cookieName = 'maianh_session';
const cookieOptions = () => ({ httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
const publicUser = u => ({ id: String(u.id), email: u.email, full_name: u.full_name, phone: u.phone, avatar_url: u.avatar_url, role: u.role });
const fail = (status, message) => Object.assign(new Error(message), { status, publicMessage: message });
function emailValue(value) {
  if (typeof value !== 'string') throw fail(400, 'Email không hợp lệ.');
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw fail(400, 'Email không hợp lệ.');
  return email;
}
function passwordValue(value) {
  if (typeof value !== 'string' || value.length < 8 || value.length > 128) throw fail(400, 'Mật khẩu phải từ 8 đến 128 ký tự.');
  return value;
}
function sessionToken(req) {
  const token = (req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  return /^[a-f0-9]{64}$/.test(token || '') ? token : null;
}

// Dependency injection allows integration tests to capture mail without sending it.
export function createAuthRouter({ db = pool, sendMail = sendResetEmail, canSendMail = mailConfigured } = {}) {
  const router = Router();
  router.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    if (!['GET','HEAD','OPTIONS'].includes(req.method)) {
      // Cross-origin HTML forms cannot set this header. No CORS is enabled.
      if (req.get('X-Requested-With') !== 'maianh-web' || req.get('Sec-Fetch-Site') === 'cross-site') return next(fail(403, 'Yêu cầu không hợp lệ.'));
      if (!req.is('application/json')) return next(fail(415, 'Vui lòng gửi dữ liệu JSON.'));
    }
    next();
  });
  const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Bạn thử quá nhiều lần. Vui lòng chờ 15 phút.' } });
  const resetLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Bạn thử quá nhiều lần. Vui lòng chờ 15 phút.' } });

  router.post('/register', authLimit, async (req, res) => {
    const { full_name, phone, password, agree_terms } = req.body || {};
    const email = emailValue(req.body?.email);
    passwordValue(password);
    if (typeof full_name !== 'string' || full_name.trim().length < 2 || full_name.trim().length > 120) throw fail(400, 'Họ tên phải từ 2 đến 120 ký tự.');
    if (agree_terms !== true) throw fail(400, 'Bạn cần đồng ý điều khoản dịch vụ.');
    if (typeof phone !== 'string') throw fail(400, 'Số điện thoại không hợp lệ.');
    const normalizedPhone = phone.replace(/[\s.-]/g, '');
    if (!/^(0|\+84)\d{9,10}$/.test(normalizedPhone)) throw fail(400, 'Số điện thoại không hợp lệ.');
    const passwordHash = await hashPassword(password);
    try {
      await db.execute('INSERT INTO users(email,password_hash,full_name,phone,role,status) VALUES(?,?,?,?,\'customer\',\'active\')', [email,passwordHash,full_name.trim(),normalizedPhone]);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw fail(409, 'Email đã được đăng ký. Hãy đăng nhập hoặc khôi phục mật khẩu.');
      throw error;
    }
    res.status(201).json({ message: 'Đăng ký thành công. Bạn có thể đăng nhập.' });
  });

  router.post('/login', authLimit, async (req, res) => {
    const email = emailValue(req.body?.email);
    const password = req.body?.password;
    if (typeof password !== 'string' || !password.length || password.length > 128) throw fail(400, 'Vui lòng nhập mật khẩu hợp lệ.');
    const [rows] = await db.execute('SELECT id,email,password_hash,full_name,phone,avatar_url,role,status FROM users WHERE email=? LIMIT 1', [email]);
    const user = rows[0];
    const verified = await verifyPassword(password, user?.password_hash);
    if (!verified || user.status !== 'active') throw fail(401, 'Email hoặc mật khẩu không đúng.');
    const token = newToken();
    const lifetime = req.body.remember === true ? 30 * 86400000 : 12 * 3600000;
    // Serialize login with password reset to avoid creating a session for an old password.
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [current] = await conn.execute('SELECT password_hash,status FROM users WHERE id=? FOR UPDATE', [user.id]);
      if (current[0]?.password_hash !== user.password_hash || current[0]?.status !== 'active') throw fail(401, 'Email hoặc mật khẩu không đúng.');
      const oldToken = sessionToken(req);
      if (oldToken) await conn.execute('DELETE FROM auth_sessions WHERE token_hash=?', [hashToken(oldToken)]);
      await conn.execute('INSERT INTO auth_sessions(token_hash,user_id,expires_at) VALUES(?,?,?)', [hashToken(token),user.id,new Date(Date.now()+lifetime)]);
      await conn.commit();
    } catch (error) { await conn.rollback(); throw error; } finally { conn.release(); }
    res.cookie(cookieName, token, { ...cookieOptions(), ...(req.body.remember === true ? { maxAge: lifetime } : {}) });
    res.json({ user: publicUser(user) });
  });

  router.get('/me', async (req, res) => {
    const token = sessionToken(req);
    if (!token) throw fail(401, 'Bạn chưa đăng nhập.');
    const [rows] = await db.execute(`SELECT u.id,u.email,u.full_name,u.phone,u.avatar_url,u.role FROM auth_sessions s
      JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>UTC_TIMESTAMP() AND u.status='active'`, [hashToken(token)]);
    if (!rows.length) { res.clearCookie(cookieName, cookieOptions()); throw fail(401, 'Phiên đăng nhập đã hết hạn.'); }
    res.json({ user: publicUser(rows[0]) });
  });

  router.post('/logout', async (req, res) => {
    const token = sessionToken(req);
    if (token) await db.execute('DELETE FROM auth_sessions WHERE token_hash=?', [hashToken(token)]);
    res.clearCookie(cookieName, cookieOptions());
    res.json({ message: 'Đã đăng xuất.' });
  });

  router.post('/forgot-password', resetLimit, async (req, res) => {
    const email = emailValue(req.body?.email);
    if (!canSendMail()) throw fail(503, 'Chức năng gửi email khôi phục chưa sẵn sàng. Vui lòng liên hệ quản trị viên.');
    const message = 'Nếu email đã đăng ký, bạn sẽ nhận được hướng dẫn khôi phục mật khẩu.';
    const [rows] = await db.execute("SELECT id,email FROM users WHERE email=? AND status='active'", [email]);
    if (rows.length) {
      const token = newToken();
      await db.execute('INSERT INTO password_reset_tokens(token_hash,user_id,expires_at) VALUES(?,?,?)', [hashToken(token),rows[0].id,new Date(Date.now()+15*60000)]);
      const origin = new URL(process.env.APP_ORIGIN || 'http://127.0.0.1:3000');
      const resetUrl = new URL('/html/DangNhap.html', origin);
      // Fragment is not sent to servers or in Referer headers.
      resetUrl.hash = `reset=${token}`;
      try { await sendMail(rows[0].email, resetUrl.href); }
      catch {
        await db.execute('DELETE FROM password_reset_tokens WHERE token_hash=?', [hashToken(token)]);
        console.error('Password reset email delivery failed');
      }
    }
    res.json({ message });
  });

  router.post('/reset-password', authLimit, async (req, res) => {
    const { token, password } = req.body || {};
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) throw fail(400, 'Liên kết khôi phục không hợp lệ hoặc đã hết hạn.');
    passwordValue(password);
    const passwordHash = await hashPassword(password);
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [tokens] = await conn.execute('SELECT user_id FROM password_reset_tokens WHERE token_hash=? AND expires_at>UTC_TIMESTAMP()', [hashToken(token)]);
      if (!tokens.length) throw fail(400, 'Liên kết khôi phục không hợp lệ hoặc đã hết hạn.');
      const userId = tokens[0].user_id;
      const [users] = await conn.execute('SELECT status FROM users WHERE id=? FOR UPDATE', [userId]);
      const [current] = await conn.execute('SELECT token_hash FROM password_reset_tokens WHERE token_hash=? AND expires_at>UTC_TIMESTAMP() FOR UPDATE', [hashToken(token)]);
      if (users[0]?.status !== 'active' || !current.length) throw fail(400, 'Liên kết khôi phục không hợp lệ hoặc đã hết hạn.');
      await conn.execute('UPDATE users SET password_hash=? WHERE id=?', [passwordHash,userId]);
      await conn.execute('DELETE FROM password_reset_tokens WHERE user_id=?', [userId]);
      await conn.execute('DELETE FROM auth_sessions WHERE user_id=?', [userId]);
      await conn.commit();
    } catch (error) { await conn.rollback(); throw error; } finally { conn.release(); }
    res.clearCookie(cookieName, cookieOptions());
    res.json({ message: 'Đã đặt lại mật khẩu. Vui lòng đăng nhập lại.' });
  });
  return router;
}

export default createAuthRouter();
