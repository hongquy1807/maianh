import { requireAuth } from './auth.js';
import { Router } from 'express';
import { pool } from '../config/database.js';
import { badRequest, resourceId, searchPattern, textQuery, pagination } from '../lib/validation.js';

const router = Router();

function homeLimit(value) {
  const raw = value === undefined ? '8' : value;
  if (typeof raw !== 'string' || !/^[1-9]\d*$/.test(raw)) throw badRequest('Invalid limit');
  const limit = Number(raw);
  if (!Number.isSafeInteger(limit) || limit > 24) throw badRequest('Invalid limit');
  return limit;
}

async function productCategories() {
  const [rows]=await pool.execute(`SELECT c.id,c.slug,c.name,c.icon,COUNT(p.id) AS product_count
    FROM categories c LEFT JOIN products p ON p.category_id=c.id AND p.is_active=1
    GROUP BY c.id,c.slug,c.name,c.icon,c.sort_order ORDER BY c.sort_order,c.id`);
  return rows;
}
router.get('/categories',async(req,res)=>{
  res.set('Cache-Control','no-store');
  res.json({data:await productCategories()});
});

router.get('/', async (req, res) => {
  const category = textQuery(req.query, 'category', 80);
  const q = textQuery(req.query, 'q', 200);
  const limit = homeLimit(req.query.limit);
  const {page,offset}=pagination({...req.query,limit:String(limit)});
  const conditions = ['p.is_active=1'];
  const values = [];
  if (category) { conditions.push('c.slug=?'); values.push(category); }
  if (q) { conditions.push("p.name LIKE ? ESCAPE '!'"); values.push(searchPattern(q)); }

  const categories = await productCategories();
  const [[{total}]]=await pool.execute(`SELECT COUNT(*) AS total FROM products p JOIN categories c ON c.id=p.category_id WHERE ${conditions.join(' AND ')}`,values);
  const [products] = await pool.execute(`SELECT p.id,p.slug,p.name,p.description,
    c.slug AS category_slug,c.name AS category_name,
    (SELECT v.id FROM product_variants v WHERE v.product_id=p.id AND v.is_active=1 ORDER BY v.price,v.id LIMIT 1) AS variant_id,
    (SELECT v.price FROM product_variants v WHERE v.product_id=p.id AND v.is_active=1 ORDER BY v.price,v.id LIMIT 1) AS price,
    (SELECT v.compare_at_price FROM product_variants v WHERE v.product_id=p.id AND v.is_active=1 ORDER BY v.price,v.id LIMIT 1) AS old_price,
    (SELECT v.stock_quantity FROM product_variants v WHERE v.product_id=p.id AND v.is_active=1 ORDER BY v.price,v.id LIMIT 1) AS stock,
    (SELECT i.image_url FROM product_images i WHERE i.product_id=p.id ORDER BY i.sort_order,i.id LIMIT 1) AS image_url
    FROM products p JOIN categories c ON c.id=p.category_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY p.created_at DESC,p.id DESC LIMIT ${limit} OFFSET ${offset}`, values);
  const [posts] = await pool.execute(`SELECT p.id,p.title,LEFT(p.content,240) AS excerpt,p.created_at,
    c.slug AS category_slug,c.name AS category_name
    FROM posts p JOIN post_categories c ON c.id=p.category_id
    WHERE p.status='published' ORDER BY p.is_pinned DESC,p.created_at DESC,p.id DESC LIMIT 3`);

  res.json({ data: { categories, products, posts }, pagination:{page,limit,total:Number(total),totalPages:Math.ceil(total/limit)} });
});

// Favorites belong to the authenticated account; no user_id is accepted from clients.
router.use('/wishlist', requireAuth, (req,res,next)=>{
  res.set('Cache-Control','no-store');
  if(!['GET','HEAD','OPTIONS'].includes(req.method) && (req.get('X-Requested-With')!=='maianh-web' || req.get('Sec-Fetch-Site')==='cross-site')) return res.status(403).json({error:'Yêu cầu không hợp lệ.'});
  next();
});
router.get('/wishlist',async(req,res)=>{
  const [data]=await pool.execute(`SELECT p.id,p.name,p.slug,p.is_active,c.name AS category_name,
    (SELECT MIN(v.price) FROM product_variants v WHERE v.product_id=p.id AND v.is_active=1) AS price,
    (SELECT image_url FROM product_images i WHERE i.product_id=p.id ORDER BY sort_order,id LIMIT 1) AS image_url
    FROM wishlists w JOIN products p ON p.id=w.product_id JOIN categories c ON c.id=p.category_id
    WHERE w.user_id=? ORDER BY w.created_at DESC,w.id DESC`,[req.user.id]);
  res.json({data});
});
router.post('/wishlist/:productId',async(req,res)=>{
  const id=resourceId(req.params.productId);
  const [rows]=await pool.execute('SELECT id FROM products WHERE id=? AND is_active=1',[id]);
  if(!rows.length)return res.status(404).json({error:'Sản phẩm không tồn tại hoặc đã ngừng bán.'});
  try {await pool.execute('INSERT INTO wishlists(user_id,product_id) VALUES(?,?)',[req.user.id,id]);}
  catch(error){if(error.code!=='ER_DUP_ENTRY')throw error;}
  res.json({data:{product_id:id,is_favorite:true}});
});
router.delete('/wishlist/:productId',async(req,res)=>{
  const id=resourceId(req.params.productId);
  await pool.execute('DELETE FROM wishlists WHERE user_id=? AND product_id=?',[req.user.id,id]);
  res.json({data:{product_id:id,is_favorite:false}});
});
export default router;
