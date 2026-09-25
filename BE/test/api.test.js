import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { pool } from '../src/config/database.js';

let server;
let base;
before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
  await pool.end();
});

test('database readiness checks the configured live database', async () => {
  const response = await fetch(`${base}/api/health/db`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).database, 'connected');
});

for (const path of ['/categories','/food-categories','/post-categories','/vocabulary-categories',
  '/products?category=gau-bong&q=test&limit=5&page=1','/foods?category=main&must_try=1',
  '/posts?category=chat','/vocabulary?category=greeting&level=beginner&q=안녕하세요']) {
  test(`GET ${path} executes against MySQL`, async () => {
    const response = await fetch(`${base}/api${path}`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.ok(Array.isArray(body.data));
    assert.ok(!JSON.stringify(body).includes('password_hash'));
    if (body.pagination) assert.ok(body.data.length <= body.pagination.limit);
  });
}

for (const path of ['/products/0','/products/not-an-id','/products?limit=101','/products?page=-1',
  '/products?page=1&page=2','/vocabulary?level=invalid','/foods?must_try=x']) {
  test(`invalid input returns 400: ${path}`, async () => {
    const response = await fetch(`${base}/api${path}`);
    assert.equal(response.status, 400);
  });
}

for (const table of ['products','vocabulary','posts']) {
  test(`GET /${table}/:id returns 404 for an absent record`, async () => {
    const [rows] = await pool.query('SELECT COALESCE(MAX(id),0)+1 AS missing_id FROM ??', [table]);
    const response = await fetch(`${base}/api/${table}/${rows[0].missing_id}`);
    assert.equal(response.status, 404);
  });
}

test('search input is treated as data, not SQL', async () => {
  const query = new URLSearchParams({ q: "' OR 1=1 --" });
  const response = await fetch(`${base}/api/products?${query}`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).pagination.total, 0);
});

test('random food returns a record or an explicit empty result', async () => {
  const response = await fetch(`${base}/api/foods/random`);
  assert.ok([200,404].includes(response.status));
  if (response.status === 200) assert.ok((await response.json()).data.id);
});

test('frontend still loads and private database configuration is not served', async () => {
  assert.equal((await fetch(`${base}/html/Home.html`)).status, 200);
  assert.equal((await fetch(`${base}/.env`)).status, 404);
  assert.equal((await fetch(`${base}/api/users`)).status, 404);
});

test('home category menu and filtered pagination use database categories', async () => {
  const response=await fetch(`${base}/api/home/categories`);
  assert.equal(response.status,200);
  const {data}=await response.json();
  assert.ok(Array.isArray(data));
  for(const category of data) {
    const query=new URLSearchParams({category:category.slug,limit:'1',page:'1'});
    const r=await fetch(`${base}/api/home?${query}`);assert.equal(r.status,200);
    const result=await r.json();
    assert.ok(result.data.products.length<=1);
    assert.ok(result.data.products.every(p=>p.category_slug===category.slug));
    assert.equal(result.pagination.page,1);
    if(result.pagination.totalPages>1){
      query.set('page','2');const next=await (await fetch(`${base}/api/home?${query}`)).json();
      assert.ok(next.data.products.every(p=>p.category_slug===category.slug));
      assert.notEqual(next.data.products[0].id,result.data.products[0].id);
    }
  }
  const missing=await (await fetch(`${base}/api/home?category=missing-category-test-999`)).json();
  assert.equal(missing.data.products.length,0);
  assert.equal(missing.pagination.total,0);
  assert.equal((await fetch(`${base}/api/home?page=0`)).status,400);
});
