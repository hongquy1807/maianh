import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import express from 'express';
import { createAuthRouter } from '../src/routes/auth.js';
import { pool } from '../src/config/database.js';
import { hashToken } from '../src/lib/passwords.js';

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
    assert.equal((await request('/register',body)).status,201);
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
    assert.deepEqual(await forgot.json(),await unknown.json());
    assert.equal(mailbox.length,1);
    const token=new URLSearchParams(new URL(mailbox[0].url).hash.slice(1)).get('reset');
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
    await request('/forgot-password',{email});
    const expiredToken=new URLSearchParams(new URL(mailbox.at(-1).url).hash.slice(1)).get('reset');
    await pool.execute('UPDATE password_reset_tokens SET expires_at=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 MINUTE) WHERE user_id=?',[userId]);
    assert.equal((await request('/reset-password',{token:expiredToken,password})).status,400);
    for(let i=0;i<2;i++)await request('/forgot-password',{email:'missing@example.invalid'});
    assert.equal((await request('/forgot-password',{email})).status,429);
  } finally {
    if(userId) await pool.execute('DELETE FROM users WHERE id=? AND email=?',[userId,email]);
    server.closeAllConnections(); await new Promise(resolve=>server.close(resolve));
    await pool.end();
  }
});
