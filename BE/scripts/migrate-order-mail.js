import {pool} from '../src/config/database.js';
try{await pool.query(`CREATE TABLE IF NOT EXISTS order_mail_outbox(
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,order_id BIGINT UNSIGNED NOT NULL UNIQUE,
 recipient VARCHAR(254) NOT NULL,payload JSON NOT NULL,
 status ENUM('pending','sending','sent') NOT NULL DEFAULT 'pending',attempts INT NOT NULL DEFAULT 0,
 next_attempt_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,sent_at TIMESTAMP NULL,last_error VARCHAR(80) NULL,
 FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,KEY mail_due(status,next_attempt_at)
 ) ENGINE=InnoDB`);console.log('Order email queue ready.');}finally{await pool.end();}
