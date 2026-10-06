import {Router} from 'express';
import {pool} from '../../config/database.js';
import newsRouter,{postSelect,attachments} from '../tintuc.js';
import {pagination,resourceId} from '../../lib/validation.js';
const router=Router();
router.get('/posts',async(req,res)=>{const {page,limit,offset}=pagination(req.query);const [[{total}]]=await pool.query('SELECT COUNT(*) AS total FROM posts');const [rows]=await pool.query(postSelect+` ORDER BY p.created_at DESC,p.id DESC LIMIT ${limit} OFFSET ${offset}`);res.set('Cache-Control','no-store').json({data:await attachments(rows,req.user.id),pagination:{page,total:Number(total),totalPages:Math.ceil(Number(total)/limit)}});});
router.get('/posts/:id',async(req,res,next)=>{if(req.params.id==='categories')return next();const [rows]=await pool.execute(postSelect+' WHERE p.id=?',[resourceId(req.params.id)]);if(!rows.length)return res.status(404).json({error:'Không tìm thấy bài viết.'});res.set('Cache-Control','no-store').json({data:(await attachments(rows,req.user.id))[0]});});
// Reuse existing validated publishing, upload ownership checks and deletion cleanup.
router.use('/posts',newsRouter);
export default router;
