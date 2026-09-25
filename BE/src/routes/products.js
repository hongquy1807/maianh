import { Router } from 'express';
import { pool } from '../config/database.js';
import { pagination, resourceId, searchPattern, textQuery } from '../lib/validation.js';

const router = Router();

async function paged(res, query, select, from, where, values, order) {
  const { page, limit, offset } = pagination(query);
  const [counts] = await pool.execute(`SELECT COUNT(*) AS total ${from} WHERE ${where}`, values);
  const [data] = await pool.execute(`${select} ${from} WHERE ${where} ORDER BY ${order} LIMIT ${limit} OFFSET ${offset}`, values);
  const total = Number(counts[0].total);
  res.json({ data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

function found(res, data) {
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json({ data });
}

router.get('/', async (req, res) => {
  const category = textQuery(req.query, 'category', 80);
  const q = textQuery(req.query, 'q', 200);
  const conditions = ['p.is_active=1'];
  const values = [];
  if (category) { conditions.push('c.slug = ?'); values.push(category); }
  if (q) { conditions.push("p.name LIKE ? ESCAPE '!'"); values.push(searchPattern(q)); }
  await paged(res, req.query,
    `SELECT p.id, p.slug, p.name, p.description, c.slug AS category_slug, c.name AS category_name,
      (SELECT MIN(v.price) FROM product_variants v WHERE v.product_id=p.id AND v.is_active=1) AS price_from,
      (SELECT i.image_url FROM product_images i WHERE i.product_id=p.id ORDER BY i.sort_order,i.id LIMIT 1) AS image_url`,
    'FROM products p JOIN categories c ON c.id=p.category_id', conditions.join(' AND '), values, 'p.created_at DESC,p.id DESC');
});

router.get('/:id/related',async(req,res)=>{
  const id=resourceId(req.params.id);
  const [source]=await pool.execute('SELECT category_id FROM products WHERE id=?',[id]);
  if(!source.length)return res.status(404).json({error:'Không tìm thấy sản phẩm.'});
  const [data]=await pool.execute(`SELECT p.id,p.name,c.name AS category_name,v.id AS variant_id,v.price,v.compare_at_price AS old_price,
    (SELECT image_url FROM product_images i WHERE i.product_id=p.id ORDER BY sort_order,id LIMIT 1) AS image_url
    FROM products p JOIN categories c ON c.id=p.category_id
    JOIN product_variants v ON v.id=(SELECT pv.id FROM product_variants pv WHERE pv.product_id=p.id AND pv.is_active=1 AND pv.stock_quantity>0 ORDER BY pv.price,pv.id LIMIT 1)
    WHERE p.is_active=1 AND p.id<>?
    ORDER BY (p.category_id=?) DESC,p.created_at DESC,p.id DESC LIMIT 4`,[id,source[0].category_id]);
  res.json({data});
});

router.get('/:id', async (req, res) => {
  const id = resourceId(req.params.id);
  const [rows] = await pool.execute(`SELECT p.id,p.slug,p.name,p.description,
    c.slug AS category_slug,c.name AS category_name FROM products p JOIN categories c ON c.id=p.category_id
    WHERE p.id=? AND p.is_active=1`, [id]);
  if (!rows.length) return found(res, null);
  const [variants] = await pool.execute('SELECT id,sku,size_label,color_label,price,compare_at_price,stock_quantity FROM product_variants WHERE product_id=? AND is_active=1 ORDER BY id', [id]);
  const [images] = await pool.execute('SELECT id,image_url,alt_text,sort_order FROM product_images WHERE product_id=? ORDER BY sort_order,id', [id]);
  found(res, { ...rows[0], variants, images });
});

export default router;
