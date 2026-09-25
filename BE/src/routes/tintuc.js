import { Router, raw } from 'express';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { rateLimit } from 'express-rate-limit';
import { pool } from '../config/database.js';
import { requireAuth } from './auth.js';
import { badRequest, resourceId, pagination, textQuery } from '../lib/validation.js';
const router=Router();
const directory=new URL('../../uploads/tintuc/',import.meta.url);
const fail=(status,message)=>Object.assign(new Error(message),{status,publicMessage:message});
const guard=(req,res,next)=>{
  if(req.get('X-Requested-With')!=='maianh-web'||req.get('Sec-Fetch-Site')==='cross-site')throw fail(403,'Yêu cầu không hợp lệ.');
  next();
};
router.use((req,res,next)=>{res.set('Cache-Control','no-store');next();});
router.use((req,res,next)=>{
  if(req.method!=='GET')return next();
  requireAuth(req,res,error=>{if(error && error.status!==401)return next(error);next();}).catch(next);
});
router.get('/categories',async(req,res)=>{
  const [data]=await pool.execute(`SELECT c.id,c.slug,c.name,COUNT(p.id) AS post_count FROM post_categories c
    LEFT JOIN posts p ON p.category_id=c.id AND p.status='published' GROUP BY c.id,c.slug,c.name ORDER BY c.id`);
  res.json({data});
});
async function attachments(rows,userId=null) {
  if(!rows.length)return rows;
  const [files]=await pool.execute(`SELECT id,post_id,file_url,original_name,mime_type,kind,size_bytes FROM post_attachments WHERE post_id IN (${rows.map(()=>'?').join(',')}) ORDER BY id`,rows.map(p=>p.id));
  const [images]=await pool.execute(`SELECT post_id,image_url FROM post_images WHERE post_id IN (${rows.map(()=>'?').join(',')}) ORDER BY sort_order,id`,rows.map(p=>p.id));
  const [likes]=userId?await pool.execute(`SELECT post_id FROM post_likes WHERE user_id=? AND post_id IN (${rows.map(()=>'?').join(',')})`,[userId,...rows.map(p=>p.id)]):[[]];
  return rows.map(p=>({...p,can_edit:userId!=null&&String(p.author_id)===String(userId),is_liked:likes.some(l=>String(l.post_id)===String(p.id)),attachments:[...files.filter(f=>String(f.post_id)===String(p.id)),...images.filter(i=>String(i.post_id)===String(p.id)).map(i=>({kind:'image',file_url:i.image_url,original_name:p.title}))]}));
}
const postSelect=`SELECT p.id,p.category_id,p.title,p.content,p.created_at,p.author_id,p.is_pinned,c.name AS category_name,c.slug AS category_slug,
 (SELECT COUNT(*) FROM post_likes l WHERE l.post_id=p.id) AS like_count,
 (SELECT COUNT(*) FROM comments cm WHERE cm.post_id=p.id AND cm.status='published') AS comment_count,
 u.full_name AS author_name,u.avatar_url FROM posts p JOIN users u ON u.id=p.author_id JOIN post_categories c ON c.id=p.category_id`;
router.get('/',async(req,res)=>{
  const {page,limit,offset}=pagination(req.query), category=textQuery(req.query,'category',80),sort=textQuery(req.query,'sort',20)||'new';
  if(!['new','old','pinned'].includes(sort))throw badRequest('Cách sắp xếp không hợp lệ.');
  const where="p.status='published'"+(category?' AND c.slug=?':''), values=category?[category]:[];
  const [[{total}]]=await pool.execute(`SELECT COUNT(*) AS total FROM posts p JOIN post_categories c ON c.id=p.category_id WHERE ${where}`,values);
  const order=sort==='old'?'p.created_at ASC,p.id ASC':sort==='pinned'?'p.is_pinned DESC,p.created_at DESC,p.id DESC':'p.created_at DESC,p.id DESC';
  const [rows]=await pool.execute(`${postSelect} WHERE ${where} ORDER BY ${order} LIMIT ${limit} OFFSET ${offset}`,values);
  res.json({data:await attachments(rows,req.user?.id),pagination:{page,limit,total:Number(total),totalPages:Math.ceil(Number(total)/limit)}});
});
router.get('/:id',async(req,res)=>{
  const [rows]=await pool.execute(`${postSelect} WHERE p.id=? AND p.status='published'`,[resourceId(req.params.id)]);
  if(!rows.length)throw fail(404,'Không tìm thấy bài viết.');
  res.json({data:(await attachments(rows,req.user?.id))[0]});
});
async function publishedPost(id) {
  const [[post]]=await pool.execute("SELECT id FROM posts WHERE id=? AND status='published'",[id]);
  if(!post)throw fail(404,'Không tìm thấy bài viết.');
}
async function likePost(req,res) {
  const id=resourceId(req.params.id);await publishedPost(id);
  if(req.method==='POST'){
    try{await pool.execute('INSERT INTO post_likes(post_id,user_id) VALUES(?,?)',[id,req.user.id]);}
    catch(error){if(error.code!=='ER_DUP_ENTRY')throw error;}
  }else await pool.execute('DELETE FROM post_likes WHERE post_id=? AND user_id=?',[id,req.user.id]);
  const [[{count}]]=await pool.execute('SELECT COUNT(*) AS count FROM post_likes WHERE post_id=?',[id]);
  res.json({data:{is_liked:req.method==='POST',like_count:Number(count)}});
}
router.post('/:id/like',requireAuth,guard,likePost);
router.delete('/:id/like',requireAuth,guard,likePost);
router.get('/:id/comments',async(req,res)=>{
  const id=resourceId(req.params.id);await publishedPost(id);
  const {page,limit,offset}=pagination(req.query);
  const [[{total}]]=await pool.execute("SELECT COUNT(*) AS total FROM comments WHERE post_id=? AND status='published'",[id]);
  const [data]=await pool.execute(`SELECT c.id,c.author_id,c.content,c.created_at,u.full_name AS author_name,u.avatar_url
    FROM comments c JOIN users u ON u.id=c.author_id WHERE c.post_id=? AND c.status='published'
    ORDER BY c.created_at DESC,c.id DESC LIMIT ${limit} OFFSET ${offset}`,[id]);
  res.json({data:data.map(c=>({...c,can_edit:req.user!=null&&String(c.author_id)===String(req.user.id)})),pagination:{page,total:Number(total),totalPages:Math.ceil(Number(total)/limit)}});
});
router.post('/:id/comments',requireAuth,guard,async(req,res)=>{
  const id=resourceId(req.params.id);await publishedPost(id);
  const content=typeof req.body?.content==='string'?req.body.content.trim():'';
  if(!content||content.length>2000)throw badRequest('Bình luận cần từ 1 đến 2.000 ký tự.');
  const [result]=await pool.execute('INSERT INTO comments(post_id,author_id,content) VALUES(?,?,?)',[id,req.user.id,content]);
  res.status(201).json({data:{id:result.insertId}});
});
async function changeComment(req,res) {
  const postId=resourceId(req.params.id),id=resourceId(req.params.commentId);
  const content=typeof req.body?.content==='string'?req.body.content.trim():'';
  if(req.method==='PATCH'&&(!content||content.length>2000))throw badRequest('Bình luận cần từ 1 đến 2.000 ký tự.');
  const conn=await pool.getConnection();
  try{
    await conn.beginTransaction();
    const [[comment]]=await conn.execute(`SELECT c.author_id FROM comments c JOIN posts p ON p.id=c.post_id
      WHERE c.id=? AND c.post_id=? AND c.status='published' AND p.status='published' FOR UPDATE`,[id,postId]);
    if(!comment)throw fail(404,'Không tìm thấy bình luận.');
    if(String(comment.author_id)!==String(req.user.id))throw fail(403,'Bạn chỉ có thể sửa hoặc xóa bình luận của mình.');
    if(req.method==='DELETE')await conn.execute('DELETE FROM comments WHERE id=?',[id]);
    else await conn.execute('UPDATE comments SET content=? WHERE id=?',[content,id]);
    await conn.commit();res.json({data:{id}});
  }catch(error){await conn.rollback();throw error;}finally{conn.release();}
}
router.patch('/:id/comments/:commentId',requireAuth,guard,changeComment);
router.delete('/:id/comments/:commentId',requireAuth,guard,changeComment);
const uploadLimit=rateLimit({windowMs:15*60*1000,limit:40,standardHeaders:true,legacyHeaders:false,message:{error:'Bạn tải quá nhiều file. Vui lòng thử lại sau.'}});
router.post('/uploads',requireAuth,guard,uploadLimit,raw({type:()=>true,limit:'25mb'}),async(req,res)=>{
  const bytes=req.body;
  if(!Buffer.isBuffer(bytes)||!bytes.length)throw badRequest('File trống hoặc không hợp lệ.');
  let name;try{name=decodeURIComponent(req.get('X-File-Name')||'');}catch{throw badRequest('Tên file không hợp lệ.');}
  if(!name||name.length>255||/[\\/\x00-\x1f]/.test(name))throw badRequest('Tên file không hợp lệ.');
  const ext=name.split('.').pop().toLowerCase();
  const types={jpg:['image/jpeg','image'],jpeg:['image/jpeg','image'],png:['image/png','image'],webp:['image/webp','image'],mp4:['video/mp4','video'],webm:['video/webm','video'],pdf:['application/pdf','document'],docx:['application/vnd.openxmlformats-officedocument.wordprocessingml.document','document'],xlsx:['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','document'],pptx:['application/vnd.openxmlformats-officedocument.presentationml.presentation','document']};
  const type=types[ext];if(!type)throw badRequest('Hỗ trợ JPG, PNG, WebP, MP4, WebM, PDF, DOCX, XLSX, PPTX.');
  const valid={jpg:bytes[0]===255&&bytes[1]===216&&bytes[2]===255,jpeg:bytes[0]===255&&bytes[1]===216&&bytes[2]===255,png:bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),webp:bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP',mp4:bytes.toString('ascii',4,8)==='ftyp',webm:bytes.subarray(0,4).equals(Buffer.from([26,69,223,163])),pdf:bytes.toString('ascii',0,5)==='%PDF-',docx:bytes.toString('hex',0,4)==='504b0304',xlsx:bytes.toString('hex',0,4)==='504b0304',pptx:bytes.toString('hex',0,4)==='504b0304'};
  if(!valid[ext])throw badRequest('Nội dung file không đúng định dạng.');
  const filename=randomUUID()+'.'+ext, file=new URL(filename,directory);
  await mkdir(directory,{recursive:true});await writeFile(file,bytes,{flag:'wx'});
  try {
    const [result]=await pool.execute('INSERT INTO post_attachments(user_id,file_url,original_name,mime_type,kind,size_bytes) VALUES(?,?,?,?,?,?)',[req.user.id,'/uploads/tintuc/'+filename,name,...type,bytes.length]);
    res.status(201).json({data:{id:result.insertId,file_url:'/uploads/tintuc/'+filename,original_name:name,mime_type:type[0],kind:type[1],size_bytes:bytes.length}});
  }catch(error){await unlink(file).catch(()=>{});throw error;}
});
router.delete('/uploads/:id',requireAuth,guard,async(req,res)=>{
  const id=resourceId(req.params.id), conn=await pool.getConnection();
  try{
    await conn.beginTransaction();
    const [[file]]=await conn.execute('SELECT file_url FROM post_attachments WHERE id=? AND user_id=? AND post_id IS NULL FOR UPDATE',[id,req.user.id]);
    if(!file)throw fail(404,'Không tìm thấy file chưa đăng.');
    await unlink(new URL(file.file_url.split('/').pop(),directory)).catch(e=>{if(e.code!=='ENOENT')throw e;});
    await conn.execute('DELETE FROM post_attachments WHERE id=?',[id]);await conn.commit();res.json({data:{id}});
  }catch(e){await conn.rollback();throw e;}finally{conn.release();}
});
router.post('/',requireAuth,guard,async(req,res)=>{
  const b=req.body||{};
  const title=typeof b.title==='string'?b.title.trim():'',content=typeof b.content==='string'?b.content.trim():'';
  if(!title||title.length>255||!content||content.length>20000)throw badRequest('Nhập tiêu đề tối đa 255 ký tự và nội dung tối đa 20.000 ký tự.');
  const categoryId=resourceId(String(b.category_id||''));
  if(!Array.isArray(b.attachment_ids)||b.attachment_ids.length>10)throw badRequest('Tối đa 10 file đính kèm.');
  const ids=b.attachment_ids.map(id=>resourceId(String(id)));
  if(new Set(ids).size!==ids.length)throw badRequest('File đính kèm bị trùng.');
  const conn=await pool.getConnection();
  try{
    await conn.beginTransaction();
    const [[category]]=await conn.execute('SELECT id FROM post_categories WHERE id=?',[categoryId]);
    if(!category)throw badRequest('Chủ đề không tồn tại.');
    for(const id of ids){const [[file]]=await conn.execute('SELECT id FROM post_attachments WHERE id=? AND user_id=? AND post_id IS NULL FOR UPDATE',[id,req.user.id]);if(!file)throw badRequest('File không thuộc tài khoản hoặc đã được đăng.');}
    const [post]=await conn.execute("INSERT INTO posts(category_id,author_id,title,slug,content,excerpt,status) VALUES(?,?,?,?,?,?,'published')",[categoryId,req.user.id,title,'bai-viet-'+randomUUID(),content,content.slice(0,500)]);
    for(const id of ids)await conn.execute('UPDATE post_attachments SET post_id=? WHERE id=?',[post.insertId,id]);
    await conn.commit();res.status(201).json({data:{id:post.insertId}});
  }catch(error){await conn.rollback();throw error;}finally{conn.release();}
});
router.put('/:id',requireAuth,guard,async(req,res)=>{
  const id=resourceId(req.params.id),b=req.body||{};
  const title=typeof b.title==='string'?b.title.trim():'',content=typeof b.content==='string'?b.content.trim():'';
  if(!title||title.length>255||!content||content.length>20000)throw badRequest('Tiêu đề hoặc nội dung không hợp lệ.');
  const categoryId=resourceId(String(b.category_id||''));
  if(!Array.isArray(b.attachment_ids)||b.attachment_ids.length>10)throw badRequest('Tối đa 10 file đính kèm.');
  const ids=b.attachment_ids.map(v=>resourceId(String(v)));
  if(new Set(ids).size!==ids.length)throw badRequest('File đính kèm bị trùng.');
  const conn=await pool.getConnection();
  try{
    await conn.beginTransaction();
    const [[post]]=await conn.execute('SELECT author_id FROM posts WHERE id=? FOR UPDATE',[id]);
    if(!post)throw fail(404,'Không tìm thấy bài viết.');
    if(String(post.author_id)!==String(req.user.id))throw fail(403,'Chỉ chủ bài viết mới được chỉnh sửa.');
    const [[category]]=await conn.execute('SELECT id FROM post_categories WHERE id=?',[categoryId]);
    if(!category)throw badRequest('Chủ đề không tồn tại.');
    for(const fileId of ids){
      const [[file]]=await conn.execute('SELECT id FROM post_attachments WHERE id=? AND user_id=? AND (post_id IS NULL OR post_id=?) FOR UPDATE',[fileId,req.user.id,id]);
      if(!file)throw badRequest('File không thuộc tài khoản hoặc thuộc bài viết khác.');
    }
    await conn.execute('UPDATE posts SET title=?,content=?,excerpt=?,category_id=? WHERE id=?',[title,content,content.slice(0,500),categoryId,id]);
    await conn.execute('UPDATE post_attachments SET post_id=NULL WHERE post_id=?',[id]);
    for(const fileId of ids)await conn.execute('UPDATE post_attachments SET post_id=? WHERE id=?',[id,fileId]);
    await conn.commit();res.json({data:{id}});
  }catch(error){await conn.rollback();throw error;}finally{conn.release();}
});
router.delete('/:id',requireAuth,guard,async(req,res)=>{
  const id=resourceId(req.params.id),conn=await pool.getConnection();let files=[];
  try{
    await conn.beginTransaction();
    const [[post]]=await conn.execute('SELECT author_id FROM posts WHERE id=? FOR UPDATE',[id]);
    if(!post)throw fail(404,'Không tìm thấy bài viết.');
    if(String(post.author_id)!==String(req.user.id))throw fail(403,'Chỉ chủ bài viết mới được xóa.');
    [files]=await conn.execute('SELECT file_url FROM post_attachments WHERE post_id=?',[id]);
    await conn.execute('DELETE FROM posts WHERE id=?',[id]);
    await conn.commit();
  }catch(error){await conn.rollback();throw error;}finally{conn.release();}
  for(const file of files){
    const name=file.file_url.split('/').pop();
    if(/^\/uploads\/tintuc\/[a-f0-9-]+\.[a-z0-9]+$/.test(file.file_url))await unlink(new URL(name,directory)).catch(error=>{if(error.code!=='ENOENT')console.error('News file cleanup failed:',error.code);});
  }
  res.json({data:{id}});
});
export default router;
