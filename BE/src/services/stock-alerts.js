// Emit only on a positive -> zero transition, in the same transaction as stock change.
export async function notifyStockOut(conn,variant){
 await conn.execute(`INSERT INTO notifications(user_id,kind,title,message,target_path)
 SELECT id,'system',?,?, '/admin/admin.html#products' FROM users WHERE role='admin' AND status='active'`,
 ['Hết hàng: '+variant.name,`Biến thể ${variant.sku} (${[variant.size_label,variant.color_label].filter(Boolean).join(' · ')||'mặc định'}) đã hết hàng. Vui lòng bổ sung tồn kho.`]);
}
