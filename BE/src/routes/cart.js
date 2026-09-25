import { Router } from 'express';
import { pool } from '../config/database.js';
import { badRequest, resourceId } from '../lib/validation.js';
import { requireAuth } from './auth.js';

const router = Router();
router.use(requireAuth);

function quantity(value) {
  if (!Number.isInteger(value) || value < 1 || value > 99) {
    throw badRequest('Số lượng phải từ 1 đến 99.');
  }
  return value;
}

async function readCart(userId) {
  const [rows] = await pool.execute(`SELECT ci.variant_id, ci.quantity,
    p.id AS product_id, p.name, p.slug,
    v.sku, v.size_label AS size, v.color_label AS color, v.price,
    v.compare_at_price AS old_price, v.stock_quantity AS stock,
    (SELECT image_url FROM product_images i WHERE i.product_id=p.id ORDER BY i.sort_order,i.id LIMIT 1) AS image_url
    FROM cart_items ci
    JOIN product_variants v ON v.id=ci.variant_id AND v.is_active=1
    JOIN products p ON p.id=v.product_id AND p.is_active=1
    WHERE ci.user_id=? ORDER BY ci.updated_at DESC, ci.variant_id`, [userId]);
  return rows;
}

router.get('/suggestions',async(req,res)=>{
  const [data]=await pool.execute(`SELECT p.id,p.name,c.name AS category_name,v.id AS variant_id,
    v.price,v.compare_at_price AS old_price,v.stock_quantity AS stock,
    (SELECT image_url FROM product_images i WHERE i.product_id=p.id ORDER BY sort_order,id LIMIT 1) AS image_url
    FROM products p JOIN categories c ON c.id=p.category_id
    JOIN product_variants v ON v.id=(SELECT pv.id FROM product_variants pv WHERE pv.product_id=p.id AND pv.is_active=1 AND pv.stock_quantity>0 ORDER BY pv.price,pv.id LIMIT 1)
    WHERE p.is_active=1 AND NOT EXISTS(SELECT 1 FROM cart_items ci JOIN product_variants cv ON cv.id=ci.variant_id WHERE ci.user_id=? AND cv.product_id=p.id)
    ORDER BY p.created_at DESC,p.id DESC LIMIT 4`,[req.user.id]);
  res.set('Cache-Control','no-store').json({data});
});

router.get('/addresses', async (req, res) => {
  const [data] = await pool.execute(`SELECT id,recipient_name,phone,address_line,ward,district,province,is_default
    FROM addresses WHERE user_id=? ORDER BY is_default DESC,id DESC`, [req.user.id]);
  res.set('Cache-Control', 'no-store').json({ data });
});

router.get('/', async (req, res) => {
  res.json({ data: await readCart(req.user.id) });
});

router.post('/', async (req, res) => {
  const variantId = resourceId(String(req.body?.variant_id || ''));
  const addedQuantity = quantity(req.body?.quantity);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [variants] = await conn.execute(`SELECT v.id,v.stock_quantity FROM product_variants v
      JOIN products p ON p.id=v.product_id WHERE v.id=? AND v.is_active=1 AND p.is_active=1 FOR UPDATE`, [variantId]);
    if (!variants.length) throw Object.assign(new Error('Sản phẩm không còn bán.'), { status: 404, publicMessage: 'Sản phẩm không còn bán.' });
    const [items] = await conn.execute('SELECT quantity FROM cart_items WHERE user_id=? AND variant_id=? FOR UPDATE', [req.user.id,variantId]);
    const total = Number(items[0]?.quantity || 0) + addedQuantity;
    quantity(total);
    if (total > Number(variants[0].stock_quantity)) throw badRequest('Số lượng trong giỏ vượt quá tồn kho.');
    await conn.execute(`INSERT INTO cart_items(user_id,variant_id,quantity) VALUES(?,?,?)
      ON DUPLICATE KEY UPDATE quantity=?,updated_at=CURRENT_TIMESTAMP`, [req.user.id,variantId,total,total]);
    await conn.commit();
  } catch (error) { await conn.rollback(); throw error; }
  finally { conn.release(); }
  res.status(201).json({ data: await readCart(req.user.id) });
});

router.patch('/:variantId', async (req, res) => {
  const variantId = resourceId(req.params.variantId);
  const requestedQuantity = quantity(req.body?.quantity);
  const [variants] = await pool.execute('SELECT id,stock_quantity FROM product_variants WHERE id=? AND is_active=1', [variantId]);
  if (!variants.length) throw Object.assign(new Error('Không tìm thấy biến thể sản phẩm.'), { status: 404, publicMessage: 'Không tìm thấy biến thể sản phẩm.' });
  if (requestedQuantity > variants[0].stock_quantity) throw badRequest('Số lượng vượt quá tồn kho.');

  const [result] = await pool.execute('UPDATE cart_items SET quantity=? WHERE user_id=? AND variant_id=?', [requestedQuantity, req.user.id, variantId]);
  if (!result.affectedRows) throw Object.assign(new Error('Sản phẩm không có trong giỏ hàng.'), { status: 404, publicMessage: 'Sản phẩm không có trong giỏ hàng.' });
  res.json({ data: await readCart(req.user.id) });
});

router.delete('/:variantId', async (req, res) => {
  const variantId = resourceId(req.params.variantId);
  await pool.execute('DELETE FROM cart_items WHERE user_id=? AND variant_id=?', [req.user.id, variantId]);
  res.json({ data: await readCart(req.user.id) });
});

router.delete('/', async (req, res) => {
  await pool.execute('DELETE FROM cart_items WHERE user_id=?', [req.user.id]);
  res.json({ data: [] });
});

export default router;
