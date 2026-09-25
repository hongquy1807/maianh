CREATE TABLE IF NOT EXISTS auth_otp (
 id CHAR(64) PRIMARY KEY,
 email VARCHAR(254) NOT NULL,
 purpose ENUM('register','reset') NOT NULL,
 code_hash CHAR(64) NOT NULL,
 payload JSON NOT NULL,
 attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
 expires_at DATETIME NOT NULL,
 INDEX (email, purpose)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
