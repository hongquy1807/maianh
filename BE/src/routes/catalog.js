import { Router } from 'express';
import { pool } from '../config/database.js';
import { badRequest, textQuery, pagination, resourceId, searchPattern } from '../lib/validation.js';

const router = Router();
async function paged(res, query, select, from, where, values, order) {
  const { page, limit, offset } = pagination(query);
  const [counts] = await pool.execute(`SELECT COUNT(*) AS total ${from} WHERE ${where}`, values);
  // limit/offset are bounded integers, never raw client input.
  const [data] = await pool.execute(`${select} ${from} WHERE ${where} ORDER BY ${order} LIMIT ${limit} OFFSET ${offset}`, values);
  const total = Number(counts[0].total);
  res.json({ data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}
async function list(res, statement) {
  const [data] = await pool.execute(statement);
  res.json({ data });
}
function found(res, data) {
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json({ data });
}

router.get('/categories', (req, res) => list(res, 'SELECT id, slug, name, icon, sort_order FROM categories ORDER BY sort_order, id'));
router.get('/food-categories', (req, res) => list(res, 'SELECT id,slug,name,icon FROM food_categories ORDER BY id'));
function foodFilter(query) {
  const category = textQuery(query, 'category', 60);
  const q = textQuery(query, 'q', 180);
  const mustTry = textQuery(query, 'must_try', 1);
  if (mustTry && !['0','1'].includes(mustTry)) throw badRequest('Invalid must_try');
  const conditions = ['f.is_active=1']; const values = [];
  if (category) {
    conditions.push('EXISTS (SELECT 1 FROM food_category_items fi JOIN food_categories fc ON fc.id=fi.category_id WHERE fi.food_id=f.id AND fc.slug=?)');
    values.push(category);
  }
  if (q) { conditions.push("f.name LIKE ? ESCAPE '!'"); values.push(searchPattern(q)); }
  if (mustTry) { conditions.push('f.is_must_try=?'); values.push(Number(mustTry)); }
  return { where: conditions.join(' AND '), values };
}
const foodColumns = 'SELECT f.id,f.slug,f.name,f.description,f.image_url,f.location_hint,f.is_must_try';
router.get('/foods', async (req, res) => {
  const { where, values } = foodFilter(req.query);
  await paged(res, req.query, foodColumns, 'FROM foods f', where, values, 'f.id');
});
router.get('/foods/random', async (req, res) => {
  const { where, values } = foodFilter(req.query);
  const [rows] = await pool.execute(`${foodColumns} FROM foods f WHERE ${where} ORDER BY RAND() LIMIT 1`, values);
  found(res, rows[0]);
});

router.get('/vocabulary-categories', (req, res) => list(res, 'SELECT id,code,name FROM vocabulary_categories ORDER BY id'));
const vocabularyColumns = `SELECT v.id,v.external_id,v.korean,v.romanization,v.vietnamese,v.word_type,
  v.example_ko,v.example_vi,v.level,v.audio_url,c.code AS category_code,c.name AS category_name`;
router.get('/vocabulary', async (req, res) => {
  const category = textQuery(req.query, 'category', 60);
  const q = textQuery(req.query, 'q', 200);
  const level = textQuery(req.query, 'level', 20);
  if (level && !['beginner','intermediate','advanced'].includes(level)) throw badRequest('Invalid level');
  const conditions = ['v.is_active=1']; const values = [];
  if (category) { conditions.push('c.code=?'); values.push(category); }
  if (level) { conditions.push('v.level=?'); values.push(level); }
  if (q) { conditions.push("(v.korean LIKE ? ESCAPE '!' OR v.vietnamese LIKE ? ESCAPE '!')"); values.push(searchPattern(q),searchPattern(q)); }
  await paged(res, req.query, vocabularyColumns, 'FROM vocabulary v JOIN vocabulary_categories c ON c.id=v.category_id', conditions.join(' AND '), values, 'v.id');
});
router.get('/vocabulary/:id', async (req, res) => {
  const [rows] = await pool.execute(`${vocabularyColumns} FROM vocabulary v JOIN vocabulary_categories c ON c.id=v.category_id WHERE v.id=? AND v.is_active=1`, [resourceId(req.params.id)]);
  found(res, rows[0]);
});

router.get('/post-categories', (req, res) => list(res, 'SELECT id,slug,name FROM post_categories ORDER BY id'));
router.get('/posts', async (req, res) => {
  const category = textQuery(req.query, 'category', 60);
  const conditions = ["p.status='published'"]; const values = [];
  if (category) { conditions.push('c.slug=?'); values.push(category); }
  await paged(res, req.query,
    `SELECT p.id,p.title,LEFT(p.content,300) AS excerpt,p.is_pinned,p.created_at,
    c.slug AS category_slug,c.name AS category_name,u.full_name AS author_name,u.avatar_url AS author_avatar,
    (SELECT COUNT(*) FROM post_likes l WHERE l.post_id=p.id) AS likes_count`,
    'FROM posts p JOIN post_categories c ON c.id=p.category_id JOIN users u ON u.id=p.author_id', conditions.join(' AND '), values, 'p.is_pinned DESC,p.created_at DESC,p.id DESC');
});
router.get('/posts/:id', async (req, res) => {
  const id = resourceId(req.params.id);
  const [rows] = await pool.execute(`SELECT p.id,p.title,p.content,p.created_at,p.updated_at,
    c.slug AS category_slug,c.name AS category_name,u.full_name AS author_name,u.avatar_url AS author_avatar
    FROM posts p JOIN post_categories c ON c.id=p.category_id JOIN users u ON u.id=p.author_id
    WHERE p.id=? AND p.status='published'`, [id]);
  if (!rows.length) return found(res, null);
  const [images] = await pool.execute('SELECT id,image_url,sort_order FROM post_images WHERE post_id=? ORDER BY sort_order,id', [id]);
  found(res, { ...rows[0], images });
});

export default router;
