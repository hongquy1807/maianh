import { Router, raw } from 'express';
import { mkdir, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { pool } from '../../config/database.js';
import { badRequest, resourceId, textQuery, searchPattern } from '../../lib/validation.js';

const router = Router();
const fail = (status, message) => Object.assign(new Error(message), { status, publicMessage: message });
const str = (value, label, max, required = false) => {
  if (typeof value !== 'string' || value.trim().length > max || (required && !value.trim())) throw badRequest(`${label} không hợp lệ.`);
  return value.trim();
};
const number = (value, label, max) => {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0 || value > max) throw badRequest(`${label} không hợp lệ.`);
  return value;
};
const active = value => {
  if (![0, 1].includes(value)) throw badRequest('Trạng thái không hợp lệ.');
  return value;
};
export function validateProduct(body) {
  if (!body || typeof body !== 'object') throw badRequest('Thiếu dữ liệu sản phẩm.');
  const result = {
    name: str(body.name, 'Tên sản phẩm', 180, true),
    slug: str(body.slug, 'Slug', 180, true),
    category_id: resourceId(String(body.category_id)),
    description: str(body.description ?? '', 'Mô tả', 15000),
    is_active: active(body.is_active)
  };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result.slug)) throw badRequest('Slug chỉ gồm chữ thường, số và dấu gạch ngang.');
  if (!Array.isArray(body.variants) || !body.variants.length || body.variants.length > 100) throw badRequest('Cần từ 1 đến 100 biến thể.');
  result.variants = body.variants.map(v => {
    if (!v || typeof v !== 'object') throw badRequest('Biến thể không hợp lệ.');
    return { id: v.id == null ? null : resourceId(String(v.id)), sku: str(v.sku, 'SKU', 80, true),
      size_label: str(v.size_label ?? '', 'Size', 80), color_label: str(v.color_label ?? '', 'Màu', 80),
      price: number(v.price, 'Giá', 99999999999999),
      compare_at_price: v.compare_at_price == null ? null : number(v.compare_at_price, 'Giá gốc', 99999999999999),
      stock_quantity: number(v.stock_quantity, 'Tồn kho', 2147483647), is_active: active(v.is_active) };
  });
  if (new Set(result.variants.map(v => v.sku.toLowerCase())).size !== result.variants.length) throw badRequest('SKU bị trùng.');
  const ids = result.variants.filter(v => v.id).map(v => v.id);
  if (new Set(ids).size !== ids.length) throw badRequest('ID biến thể bị trùng.');
  if (!Array.isArray(body.images) || body.images.length > 30) throw badRequest('Tối đa 30 ảnh.');
  result.images = body.images.map(i => {
    const url = str(i?.image_url, 'URL ảnh', 500, true);
    if (!/^https?:\/\/[^\s]+$/i.test(url) && !/^\/(?!\/)[^\s\\]*$/.test(url)) throw badRequest('Ảnh phải là URL HTTP(S) hoặc đường dẫn bắt đầu bằng /.');
    return { image_url: url, alt_text: str(i.alt_text ?? '', 'Mô tả ảnh', 180) };
  });
  return result;
}

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  if (!['GET','HEAD','OPTIONS'].includes(req.method)) {
    if (req.get('X-Requested-With') !== 'maianh-web' || req.get('Sec-Fetch-Site') === 'cross-site') return next(fail(403, 'Yêu cầu không hợp lệ.'));
    if (!(req.method === 'POST' && req.path === '/product-images') && !req.is('application/json')) return next(fail(415, 'Vui lòng gửi JSON.'));
  }
  next();
});
// Upload one binary file per request, after the admin and CSRF guards.
router.post('/product-images', raw({ type: ['image/jpeg', 'image/png', 'image/webp'], limit: '5mb' }), async (req, res) => {
  const data = req.body;
  if (!Buffer.isBuffer(data) || !data.length) throw fail(415, 'Chỉ nhận ảnh JPG, PNG hoặc WebP.');
  let extension;
  if (data.length >= 24 && data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) && data.toString('ascii',12,16) === 'IHDR') extension = 'png';
  else if (data.length >= 4 && data[0] === 255 && data[1] === 216 && data[2] === 255 && data[data.length-2] === 255 && data[data.length-1] === 217) extension = 'jpg';
  else if (data.length >= 16 && data.toString('ascii',0,4) === 'RIFF' && data.toString('ascii',8,12) === 'WEBP') extension = 'webp';
  const mime = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp' }[extension];
  if (!mime || !req.is(mime)) throw badRequest('Nội dung file không đúng định dạng ảnh.');
  const directory = new URL('../../../uploads/products/', import.meta.url);
  await mkdir(directory, { recursive: true });
  const filename = `product-${randomUUID()}.${extension}`;
  await writeFile(new URL(filename, directory), data, { flag: 'wx' });
  res.status(201).json({ data: { image_url: `/uploads/products/${filename}` } });
});
router.get('/product-categories', async (req, res) => {
  const [data] = await pool.query('SELECT id,name FROM categories ORDER BY sort_order,id');
  res.json({ data });
});
router.post('/product-categories', async (req, res) => {
  const name = str(req.body?.name, 'Tên danh mục', 120, true);
  const generatedSlug = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0,80).replace(/-$/, '');
  const slug = str(req.body?.slug ?? generatedSlug, 'Slug danh mục', 80, true);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw badRequest('Slug chỉ gồm chữ thường, số và dấu gạch ngang.');
  try {
    const [result] = await pool.execute('INSERT INTO categories(name,slug) VALUES(?,?)', [name,slug]);
    res.status(201).json({ data: { id: String(result.insertId), name, slug }, message: 'Đã thêm danh mục.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') throw fail(409, 'Danh mục có slug này đã tồn tại. Vui lòng dùng slug khác.');
    throw error;
  }
});
router.get('/products', async (req, res) => {
  const categoryId = textQuery(req.query, 'category_id', 20);
  const q = textQuery(req.query, 'q', 200);
  const conditions = [], values = [];
  if (categoryId) { conditions.push('p.category_id=?'); values.push(resourceId(categoryId)); }
  if (q) { conditions.push("p.name LIKE ? ESCAPE '!'"); values.push(searchPattern(q)); }
  const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';
  const [rows] = await pool.execute(`SELECT p.id,p.name,p.category_id,c.name AS category,
    COALESCE((SELECT MIN(v.price) FROM product_variants v WHERE v.product_id=p.id AND v.is_active=1),0) AS price,
    COALESCE((SELECT SUM(v.stock_quantity) FROM product_variants v WHERE v.product_id=p.id AND v.is_active=1),0) AS stock,
    COALESCE((SELECT SUM(i.quantity) FROM order_items i JOIN product_variants v ON v.id=i.variant_id WHERE v.product_id=p.id),0) AS sold,
    IF(p.is_active=1,'active','inactive') AS status,
    (SELECT image_url FROM product_images pi WHERE pi.product_id=p.id ORDER BY pi.sort_order,pi.id LIMIT 1) AS image_url
    FROM products p JOIN categories c ON c.id=p.category_id${where} ORDER BY p.created_at DESC,p.id DESC`, values);
  res.json({ data: rows });
});

router.get('/products/:id', async (req, res) => {
  const id = resourceId(req.params.id);
  const [rows] = await pool.execute('SELECT p.*,c.name AS category_name FROM products p JOIN categories c ON c.id=p.category_id WHERE p.id=?', [id]);
  if (!rows.length) throw fail(404, 'Không tìm thấy sản phẩm.');
  const [variants] = await pool.execute('SELECT * FROM product_variants WHERE product_id=? ORDER BY id', [id]);
  const [images] = await pool.execute('SELECT * FROM product_images WHERE product_id=? ORDER BY sort_order,id', [id]);
  res.json({ data: { ...rows[0], variants, images } });
});
async function save(req, res) {
  const p = validateProduct(req.body);
  let id = req.params.id ? resourceId(req.params.id) : null;
  if (!id && p.variants.some(v => v.id)) throw badRequest('Sản phẩm mới không được có ID biến thể.');
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    if (id) {
      const [rows] = await conn.execute('SELECT id FROM products WHERE id=? FOR UPDATE', [id]);
      if (!rows.length) throw fail(404, 'Không tìm thấy sản phẩm.');
    }
    const [categories] = await conn.execute('SELECT id FROM categories WHERE id=?', [p.category_id]);
    if (!categories.length) throw badRequest('Danh mục không tồn tại.');
    const values = [p.category_id,p.slug,p.name,p.description,p.is_active];
    if (id) await conn.execute('UPDATE products SET category_id=?,slug=?,name=?,description=?,is_active=? WHERE id=?', [...values,id]);
    else {
      const [insert] = await conn.execute('INSERT INTO products(category_id,slug,name,description,is_active) VALUES(?,?,?,?,?)', values);
      id = String(insert.insertId);
    }
    const [existing] = await conn.execute('SELECT id FROM product_variants WHERE product_id=? FOR UPDATE', [id]);
    const existingIds = new Set(existing.map(v => String(v.id)));
    for (const v of p.variants) {
      const values = [v.sku,v.size_label,v.color_label,v.price,v.compare_at_price,v.stock_quantity,v.is_active];
      if (v.id) {
        if (!existingIds.has(v.id)) throw badRequest('Biến thể không thuộc sản phẩm này.');
        await conn.execute('UPDATE product_variants SET sku=?,size_label=?,color_label=?,price=?,compare_at_price=?,stock_quantity=?,is_active=? WHERE id=? AND product_id=?', [...values,v.id,id]);
      } else await conn.execute('INSERT INTO product_variants(sku,size_label,color_label,price,compare_at_price,stock_quantity,is_active,product_id) VALUES(?,?,?,?,?,?,?,?)', [...values,id]);
    }
    for (const v of existing) {
      if (!p.variants.some(item => item.id === String(v.id))) await conn.execute('DELETE FROM product_variants WHERE id=? AND product_id=?', [v.id,id]);
    }
    await conn.execute('DELETE FROM product_images WHERE product_id=?', [id]);
    for (const [index, image] of p.images.entries()) await conn.execute('INSERT INTO product_images(product_id,image_url,alt_text,sort_order) VALUES(?,?,?,?)', [id,image.image_url,image.alt_text,index]);
    await conn.commit();
    res.status(req.params.id ? 200 : 201).json({ data: { id }, message: 'Đã lưu sản phẩm.' });
  } catch (error) {
    await conn.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw fail(409, 'Slug hoặc SKU đã tồn tại.');
    if (error.code === 'ER_ROW_IS_REFERENCED_2') throw fail(409, 'Biến thể đã có đơn hàng; hãy chuyển sang ngừng bán thay vì xóa.');
    if (error.code === 'ER_NO_REFERENCED_ROW_2') throw badRequest('Danh mục không tồn tại.');
    throw error;
  } finally { conn.release(); }
}
router.post('/products', save);
router.put('/products/:id', save);
router.delete('/products/:id', async (req, res) => {
  const id = resourceId(req.params.id);
  try {
    const [result] = await pool.execute('DELETE FROM products WHERE id=?', [id]);
    if (!result.affectedRows) throw fail(404, 'Không tìm thấy sản phẩm.');
    res.json({ message: 'Đã xóa sản phẩm.' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') throw fail(409, 'Sản phẩm đã có đơn hàng; hãy chuyển sang ngừng bán thay vì xóa.');
    throw error;
  }
});
export default router;
