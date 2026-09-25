import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import express from 'express';
import { createAuthRouter, requireAuth, requireAdmin } from '../src/routes/auth.js';
import { pool } from '../src/config/database.js';
import { hashToken } from '../src/lib/passwords.js';

after(() => pool.end());

test('admin routes require authenticated admin account', async () => {
  const otpMail = [];
  const app = express();
  app.use(express.json());
  app.use('/api/auth', createAuthRouter({ canSendMail: () => true, sendMail: async (email,code) => {otpMail.push(code);} }));
  app.get('/api/admin/me', requireAuth, requireAdmin, (req, res) => {
    res.json({ ok: true, user: { id: req.user.id, email: req.user.email, role: req.user.role } });
  });
  app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.publicMessage || 'Internal error' }));
  const server = app.listen(0,'127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const customer = { email: `customer-${randomUUID()}@example.invalid`, password: 'Password-123!', full_name: 'Khách hàng', phone: '0912345678', agree_terms: true };
  const admin = { email: `admin-${randomUUID()}@example.invalid`, password: 'Password-456!', full_name: 'Quản trị', phone: '0912345679', agree_terms: true };

  try {
    const customerReg = await fetch(base + '/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'maianh-web' }, body: JSON.stringify(customer) });
    await fetch(base + '/api/auth/verify-otp', {method:'POST', headers:{'Content-Type':'application/json','X-Requested-With':'maianh-web'}, body:JSON.stringify({challenge_id:(await customerReg.json()).challenge_id,code:otpMail.at(-1)})});
    const customerLogin = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'maianh-web' }, body: JSON.stringify({ email: customer.email, password: customer.password }) });
    const customerCookie = customerLogin.headers.get('set-cookie').split(';')[0];

    const adminReg = await fetch(base + '/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'maianh-web' }, body: JSON.stringify(admin) });
    await fetch(base + '/api/auth/verify-otp', {method:'POST', headers:{'Content-Type':'application/json','X-Requested-With':'maianh-web'}, body:JSON.stringify({challenge_id:(await adminReg.json()).challenge_id,code:otpMail.at(-1)})});
    await pool.execute('UPDATE users SET role=? WHERE email=?', ['admin', admin.email]);
    const adminLogin = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'maianh-web' }, body: JSON.stringify({ email: admin.email, password: admin.password }) });
    const adminCookie = adminLogin.headers.get('set-cookie').split(';')[0];

    assert.equal((await fetch(base + '/api/admin/me')).status, 401);
    assert.equal((await fetch(base + '/api/admin/me', { headers: { Cookie: customerCookie } })).status, 403);
    assert.equal((await fetch(base + '/api/admin/me', { headers: { Cookie: adminCookie } })).status, 200);
  } finally {
    await pool.execute('DELETE FROM users WHERE email IN (?, ?)', [customer.email, admin.email]);
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});

test('registration, real session, logout and one-use password recovery', async () => {
  const mailbox = [];
  const app = express();
  app.use(express.json());
  app.use('/api/auth', createAuthRouter({ canSendMail: () => true, sendMail: async (email,url) => { mailbox.push({email,url}); } }));
  app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.publicMessage || 'Internal error' }));
  const server = app.listen(0,'127.0.0.1');
  await new Promise(resolve => server.once('listening',resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/auth`;
  const email = `auth-test-${randomUUID()}@example.invalid`;
  const password = 'Test-password-2026!';
  const newPassword = 'New-test-password-2026!';
  let userId;
  async function request(path, body, cookie = '', extraHeaders = {}) {
    return fetch(base+path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {'Content-Type':'application/json','X-Requested-With':'maianh-web', ...(cookie ? {Cookie:cookie} : {}), ...extraHeaders},
      ...(body === undefined ? {} : {body:JSON.stringify(body)})
    });
  }
  const cookieOf = response => response.headers.get('set-cookie').split(';')[0];
  try {
    assert.equal((await request('/me')).status,401);
    assert.equal((await request('/login',{email,password},'',{'X-Requested-With':''})).status,403);
    assert.equal((await request('/login',{email,password},'',{'Sec-Fetch-Site':'cross-site'})).status,403);
    assert.equal((await request('/register',{email,password:'short'})).status,400);
    const body = {email,password,full_name:'Người kiểm thử',phone:'0912345678',agree_terms:true,role:'admin'};
    const registration = await request('/register',body); assert.equal(registration.status,202);
    const challenge_id = (await registration.json()).challenge_id;
    assert.equal((await request('/login',{email,password})).status,401);
    assert.equal((await request('/verify-otp',{challenge_id,code:'000000'})).status,400);
    assert.equal((await request('/verify-otp',{challenge_id,code:mailbox.at(-1).url})).status,200);
    assert.equal((await request('/verify-otp',{challenge_id,code:mailbox.at(-1).url})).status,400);
    mailbox.length=0;
    const [users] = await pool.execute('SELECT id,password_hash,role FROM users WHERE email=?',[email]);
    userId=users[0].id;
    assert.equal(users[0].role,'customer');
    assert.match(users[0].password_hash,/^scrypt-v1\$/);
    assert.notEqual(users[0].password_hash,password);
    assert.equal((await request('/register',body)).status,409);
    assert.equal((await request('/login',{email,password:'Wrong-password!'})).status,401);
    const login = await request('/login',{email:email.toUpperCase(),password,remember:true});
    assert.equal(login.status,200);
    assert.match(login.headers.get('set-cookie'),/HttpOnly/);
    assert.match(login.headers.get('set-cookie'),/SameSite=Lax/);
    assert.match(login.headers.get('set-cookie'),/Max-Age=/);
    let cookie=cookieOf(login);
    const me=await request('/me',undefined,cookie);
    assert.equal(me.status,200);
    assert.equal((await me.json()).user.email,email);
    assert.equal((await request('/logout',{},cookie)).status,200);
    assert.equal((await request('/me',undefined,cookie)).status,401);
    cookie=cookieOf(await request('/login',{email,password}));
    const forgot=await request('/forgot-password',{email});
    assert.equal(forgot.status,200);
    const unknown=await request('/forgot-password',{email:'not-registered-'+randomUUID()+'@example.invalid'});
    const recovery = await forgot.json(); assert.equal(recovery.message,(await unknown.json()).message);
    assert.equal(mailbox.length,1);
    const verified = await request('/verify-otp',{challenge_id:recovery.challenge_id,code:mailbox[0].url});
    assert.equal(verified.status,200); const {token}=await verified.json();
    const [stored]=await pool.execute('SELECT token_hash FROM password_reset_tokens WHERE user_id=?',[userId]);
    assert.equal(stored[0].token_hash,hashToken(token));
    assert.notEqual(stored[0].token_hash,token);
    const resets=await Promise.all([request('/reset-password',{token,password:newPassword}),request('/reset-password',{token,password:newPassword})]);
    assert.deepEqual(resets.map(r=>r.status).sort(),[200,400]);
    assert.equal((await request('/me',undefined,cookie)).status,401);
    assert.equal((await request('/login',{email,password})).status,401);
    const newLogin=await request('/login',{email,password:newPassword});
    assert.equal(newLogin.status,200);
    cookie=cookieOf(newLogin);
    await pool.execute('UPDATE auth_sessions SET expires_at=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 MINUTE) WHERE user_id=?',[userId]);
    assert.equal((await request('/me',undefined,cookie)).status,401);
    const again=await (await request('/forgot-password',{email})).json();
    const {token:expiredToken}=await (await request('/verify-otp',{challenge_id:again.challenge_id,code:mailbox.at(-1).url})).json();
    await pool.execute('UPDATE password_reset_tokens SET expires_at=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 MINUTE) WHERE user_id=?',[userId]);
    assert.equal((await request('/reset-password',{token:expiredToken,password})).status,400);
    for(let i=0;i<2;i++)await request('/forgot-password',{email:'missing@example.invalid'});
    assert.equal((await request('/forgot-password',{email})).status,429);
  } finally {
    await pool.execute('DELETE FROM auth_otp WHERE email=?',[email]);
    if(userId) await pool.execute('DELETE FROM users WHERE id=? AND email=?',[userId,email]);
    server.closeAllConnections(); await new Promise(resolve=>server.close(resolve));
  }
});

test('OTP expires, locks after five errors and is removed when mail fails', async () => {
  let code, failMail=false;
  const app=express(); app.use(express.json());
  app.use(createAuthRouter({canSendMail:()=>true,sendMail:async(email,value)=>{if(failMail)throw new Error('mail unavailable');code=value;}}));
  app.use((error,req,res,next)=>res.status(error.status||500).json({error:error.publicMessage||'Internal error'}));
  const server=app.listen(0,'127.0.0.1'); await new Promise(r=>server.once('listening',r));
  const email=`otp-${randomUUID()}@example.invalid`;
  const body={email,password:'Password-123!',full_name:'OTP test',phone:'0912345678',agree_terms:true};
  const request=(path,body)=>fetch(`http://127.0.0.1:${server.address().port}${path}`,{method:'POST',headers:{'Content-Type':'application/json','X-Requested-With':'maianh-web'},body:JSON.stringify(body)});
  try {
    let {challenge_id}=await (await request('/register',body)).json();
    const [[stored]]=await pool.execute('SELECT code_hash,payload FROM auth_otp WHERE id=?',[challenge_id]);
    assert.equal(stored.code_hash,hashToken(challenge_id+code));
    assert.ok(!JSON.stringify(stored).includes(body.password));
    for(let i=0;i<5;i++)assert.equal((await request('/verify-otp',{challenge_id,code:'000000'})).status,400);
    assert.equal((await request('/verify-otp',{challenge_id,code})).status,400);
    ({challenge_id}=await (await request('/register',body)).json());
    await pool.execute('UPDATE auth_otp SET expires_at=UTC_TIMESTAMP()-INTERVAL 1 MINUTE WHERE id=?',[challenge_id]);
    assert.equal((await request('/verify-otp',{challenge_id,code})).status,400);
    failMail=true;
    assert.equal((await request('/register',body)).status,503);
    const [[users]]=await pool.execute('SELECT COUNT(*) AS n FROM users WHERE email=?',[email]); assert.equal(Number(users.n),0);
    const [[pending]]=await pool.execute('SELECT COUNT(*) AS n FROM auth_otp WHERE email=? AND attempts=0',[email]);assert.equal(Number(pending.n),0);
  } finally {
    await pool.execute('DELETE FROM auth_otp WHERE email=?',[email]);
    await pool.execute('DELETE FROM users WHERE email=?',[email]);
    server.closeAllConnections(); await new Promise(r=>server.close(r));
  }
});
