import {Router} from 'express';
import {pool} from '../../config/database.js';
import {resourceId} from '../../lib/validation.js';
const router=Router(),fail=(status,message)=>Object.assign(new Error(message),{status,publicMessage:message});
const fields={external_id:100,korean:255,romanization:255,vietnamese:16000,word_type:80,example_ko:16000,example_vi:16000,audio_url:1024};
router.use('/vocabulary',(req,res,next)=>{res.set('Cache-Control','no-store');if(!['GET','HEAD'].includes(req.method)&&(req.get('X-Requested-With')!=='maianh-web'||req.get('Sec-Fetch-Site')==='cross-site'))return next(fail(403,'Yêu cầu không hợp lệ.'));next();});
router.get('/vocabulary/categories',async(req,res)=>{const [data]=await pool.query('SELECT id,code,name FROM vocabulary_categories ORDER BY id');res.json({data});});
router.get('/vocabulary',async(req,res)=>{
 const q=String(req.query.q||'').trim(),page=Number(req.query.page||1);if(q.length>255||!Number.isSafeInteger(page)||page<1||page>100000)throw fail(400,'Tìm kiếm không hợp lệ.');
 const term='%'+q.replace(/[!%_]/g,c=>'!'+c)+'%';
 const where="WHERE v.korean LIKE ? ESCAPE '!' OR v.vietnamese LIKE ? ESCAPE '!' OR v.romanization LIKE ? ESCAPE '!' OR v.external_id LIKE ? ESCAPE '!'";
 const args=[term,term,term,term];const [[count]]=await pool.execute('SELECT COUNT(*) AS n FROM vocabulary v '+where,args);
 const [data]=await pool.execute('SELECT v.*,c.name AS category_name FROM vocabulary v JOIN vocabulary_categories c ON c.id=v.category_id '+where+' ORDER BY v.id DESC LIMIT 25 OFFSET '+((page-1)*25),args);
 res.json({data,total:Number(count.n),page});
});
function validate(body){
 if(!body||typeof body!=='object'||Array.isArray(body)||Object.keys(body).some(k=>!Object.hasOwn(fields,k)&&!['category_id','level','is_active'].includes(k)))throw fail(400,'Dữ liệu không hợp lệ.');
 const result={};for(const [key,max] of Object.entries(fields)){const v=body[key]??'';if(typeof v!=='string'||v.length>max)throw fail(400,'Trường '+key+' không hợp lệ.');result[key]=v.trim()||null;}
 for(const key of ['external_id','korean','vietnamese'])if(!result[key])throw fail(400,'Vui lòng nhập '+key+'.');
 result.category_id=resourceId(String(body.category_id||''));if(!['beginner','intermediate','advanced'].includes(body.level)||![0,1].includes(body.is_active))throw fail(400,'Trình độ hoặc trạng thái không hợp lệ.');
 if(result.audio_url&&!/^https?:\/\/|^\/(?!\/)/i.test(result.audio_url))throw fail(400,'URL âm thanh phải là HTTP(S) hoặc đường dẫn nội bộ.');
 result.level=body.level;result.is_active=body.is_active;return result;
}
async function save(req,res){const values=validate(req.body),id=req.params.id?resourceId(req.params.id):null;
 try{if(id){const [r]=await pool.execute('UPDATE vocabulary SET '+Object.keys(values).map(k=>k+'=?').join(',')+' WHERE id=?',[...Object.values(values),id]);if(!r.affectedRows)throw fail(404,'Không tìm thấy từ vựng.');res.json({data:{id}});}else{const [r]=await pool.execute('INSERT INTO vocabulary('+Object.keys(values).join(',')+') VALUES('+Object.keys(values).map(()=>'?').join(',')+')',Object.values(values));res.status(201).json({data:{id:String(r.insertId)}});}}
 catch(e){if(e.code==='ER_DUP_ENTRY')throw fail(409,'Mã external_id đã tồn tại.');if(e.code==='ER_NO_REFERENCED_ROW_2')throw fail(400,'Chủ đề không tồn tại.');throw e;}}
router.post('/vocabulary',save);router.put('/vocabulary/:id',save);
router.delete('/vocabulary/:id',async(req,res)=>{const id=resourceId(req.params.id);const [r]=await pool.execute('DELETE FROM vocabulary WHERE id=?',[id]);if(!r.affectedRows)throw fail(404,'Không tìm thấy từ vựng.');res.json({data:{id}});});
export default router;
