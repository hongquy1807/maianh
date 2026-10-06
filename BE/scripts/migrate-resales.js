import {pool} from '../src/config/database.js';
try {
 await pool.query(`CREATE TABLE IF NOT EXISTS item_resales (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 order_item_id BIGINT UNSIGNED NOT NULL,
 request_key VARCHAR(36) NOT NULL,
 quantity INT UNSIGNED NOT NULL,
 amount DECIMAL(16,2) NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY resale_request(user_id,request_key),
 KEY resale_item(order_item_id),
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY(order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
 CHECK(quantity>0), CHECK(amount>=0)
 ) ENGINE=InnoDB`);
 console.log('Resale ledger ready.');
} finally {await pool.end();}
