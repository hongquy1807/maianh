import { Router } from 'express';
import { pool } from '../config/database.js';
import { requireAuth } from './auth.js';
import { resourceId, pagination, textQuery, badRequest } from '../lib/validation.js';
const router=Router();
router.use(requireAuth,(req,res,next)=>{
  res.set('Cache-Control','no-store');
  if(!['GET','HEAD','OPTIONS'].includes(req.method)&&(req.get('X-Requested-With')!=='maianh-web'||req.get('Sec-Fetch-Site')==='cross-site'))return res.status(403).json({error:'Yêu cầu không hợp lệ.'});
  next();
});
router.get('/unread-count',async(req,res)=>{
  const [[row]]=await pool.execute('SELECT COUNT(*) AS total FROM notifications WHERE user_id=? AND read_at IS NULL',[req.user.id]);
  res.json({data:{unread_count:Number(row.total)}});
});
router.get('/',async(req,res)=>{
  const {page,limit,offset}=pagination(req.query);
  const unread=textQuery(req.query,'unread',1);
  if(unread && !['0','1'].includes(unread))throw badRequest('Bộ lọc không hợp lệ.');
  const kind=textQuery(req.query,'kind',20);
  if(kind&&!['order','community','learning','system'].includes(kind))throw badRequest('Loại thông báo không hợp lệ.');
  const conditions=['user_id=?'],values=[req.user.id];
  if(unread==='1')conditions.push('read_at IS NULL');
  if(kind){conditions.push('kind=?');values.push(kind);}
  const where=conditions.join(' AND ');
  const [[count]]=await pool.execute(`SELECT COUNT(*) AS total FROM notifications WHERE ${where}`,values);
  const [data]=await pool.execute(`SELECT id,kind,title,message,target_path,read_at,created_at FROM notifications WHERE ${where} ORDER BY created_at DESC,id DESC LIMIT ${limit} OFFSET ${offset}`,values);
  const [[badge]]=await pool.execute('SELECT COUNT(*) AS total FROM notifications WHERE user_id=? AND read_at IS NULL',[req.user.id]);
  res.json({data,unread_count:Number(badge.total),pagination:{page,limit,total:Number(count.total),totalPages:Math.ceil(Number(count.total)/limit)}});
});
router.patch('/read-all',async(req,res)=>{
  await pool.execute('UPDATE notifications SET read_at=UTC_TIMESTAMP() WHERE user_id=? AND read_at IS NULL',[req.user.id]);
  res.json({ok:true});
});
router.patch('/:id/read',async(req,res)=>{
  const id=resourceId(req.params.id);
  const [result]=await pool.execute('UPDATE notifications SET read_at=COALESCE(read_at,UTC_TIMESTAMP()) WHERE id=? AND user_id=?',[id,req.user.id]);
  if(!result.affectedRows)return res.status(404).json({error:'Không tìm thấy thông báo.'});
  res.json({ok:true});
});
export default router;
