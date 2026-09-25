-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: maianh
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `recipient_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ward` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_addresses_default_per_user` (`user_id`,`is_default`),
  KEY `idx_addresses_user` (`user_id`),
  CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `addresses_chk_1` CHECK ((`is_default` in (0,1)))
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (5,1,'hongquys','0379997387','147/1 - tổ 5, kp.Hòa Lân 2','p.Thuận Giao','','Bình Dương',1,'2026-09-23 18:18:54'),(6,1,'hongquys','0379997387','106/16 Bình Chuẩn 74','Bình Quới A','Thuận Giao','Hồ Chí Minh',0,'2026-09-23 18:19:37'),(43,2,'maianh','0123456789','cầu sông hàn','sss','','đà nẵng',1,'2026-09-24 13:00:50');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_sessions`
--

DROP TABLE IF EXISTS `auth_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_auth_sessions_token_hash` (`token_hash`),
  KEY `idx_auth_sessions_user` (`user_id`),
  KEY `idx_auth_sessions_expires_at` (`expires_at`),
  CONSTRAINT `fk_auth_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=216 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_sessions`
--

LOCK TABLES `auth_sessions` WRITE;
/*!40000 ALTER TABLE `auth_sessions` DISABLE KEYS */;
INSERT INTO `auth_sessions` VALUES (10,1,'2901141d7cbd2d8e0c362997b41ec22d45a2e2c9c8bb61b07ca92064f0aad82c','2026-10-23 12:43:21','2026-09-23 12:43:21'),(86,1,'3d4be6bd89737c843fc3369fe03e4e4eba5ac35089dcdd56fa1c586057be2b16','2026-10-23 19:11:19','2026-09-23 19:11:18'),(139,2,'fdf38229f1c797754f5ccf451610f1eb2f35c977a1147c90bd38cf0f3d3d4056','2026-10-24 08:41:59','2026-09-24 08:41:58');
/*!40000 ALTER TABLE `auth_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `user_id` bigint unsigned NOT NULL,
  `variant_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`variant_id`),
  KEY `idx_cart_items_variant` (`variant_id`),
  CONSTRAINT `fk_cart_items_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_items_chk_1` CHECK ((`quantity` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (9,'gau-bong','gấu bông',NULL,0,'2026-09-23 14:50:49');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint unsigned NOT NULL,
  `author_id` bigint unsigned NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('published','hidden') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'published',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_comments_post` (`post_id`,`created_at`),
  KEY `idx_comments_author` (`author_id`),
  CONSTRAINT `fk_comments_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comments_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (2,3,2,'chào nhaa','published','2026-09-24 08:42:23');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_type` enum('percent','fixed') COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_value` decimal(14,0) NOT NULL,
  `minimum_order` decimal(14,0) NOT NULL DEFAULT '0',
  `maximum_discount` decimal(14,0) DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `per_user_limit` int NOT NULL DEFAULT '1',
  `starts_at` datetime NOT NULL,
  `ends_at` datetime NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_coupons_code` (`code`),
  CONSTRAINT `coupons_chk_1` CHECK ((`discount_value` > 0)),
  CONSTRAINT `coupons_chk_2` CHECK ((`discount_type` in (_utf8mb4'percent',_utf8mb4'fixed'))),
  CONSTRAINT `coupons_chk_3` CHECK ((`minimum_order` >= 0)),
  CONSTRAINT `coupons_chk_4` CHECK (((`maximum_discount` is null) or (`maximum_discount` > 0))),
  CONSTRAINT `coupons_chk_5` CHECK (((`usage_limit` is null) or (`usage_limit` > 0))),
  CONSTRAINT `coupons_chk_6` CHECK ((`per_user_limit` > 0)),
  CONSTRAINT `coupons_chk_7` CHECK ((`ends_at` > `starts_at`)),
  CONSTRAINT `coupons_chk_8` CHECK ((`is_active` in (0,1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_gifts`
--

DROP TABLE IF EXISTS `customer_gifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_gifts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `admin_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `request_key` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_gift_request` (`admin_id`,`request_key`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `customer_gifts_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`),
  CONSTRAINT `customer_gifts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `customer_gifts_chk_1` CHECK ((`amount` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_gifts`
--

LOCK TABLES `customer_gifts` WRITE;
/*!40000 ALTER TABLE `customer_gifts` DISABLE KEYS */;
INSERT INTO `customer_gifts` VALUES (2,1,2,20000.00,'3a92049e-b5f3-445c-8c9b-409746fd5248','2026-09-24 12:54:58');
/*!40000 ALTER TABLE `customer_gifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_categories`
--

DROP TABLE IF EXISTS `food_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_food_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_categories`
--

LOCK TABLES `food_categories` WRITE;
/*!40000 ALTER TABLE `food_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `food_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_category_items`
--

DROP TABLE IF EXISTS `food_category_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_category_items` (
  `food_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`food_id`,`category_id`),
  KEY `idx_food_category_items_category` (`category_id`),
  CONSTRAINT `fk_food_category_items_category` FOREIGN KEY (`category_id`) REFERENCES `food_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_food_category_items_food` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_category_items`
--

LOCK TABLES `food_category_items` WRITE;
/*!40000 ALTER TABLE `food_category_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `food_category_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_favorites`
--

DROP TABLE IF EXISTS `food_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_favorites` (
  `user_id` bigint unsigned NOT NULL,
  `food_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`food_id`),
  KEY `idx_food_favorites_food` (`food_id`),
  CONSTRAINT `fk_food_favorites_food` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_food_favorites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_favorites`
--

LOCK TABLES `food_favorites` WRITE;
/*!40000 ALTER TABLE `food_favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `food_favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_random_history`
--

DROP TABLE IF EXISTS `food_random_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_random_history` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `food_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_food_random_history_user` (`user_id`,`created_at`),
  KEY `idx_food_random_history_food` (`food_id`),
  CONSTRAINT `fk_food_random_history_food` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_food_random_history_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_random_history`
--

LOCK TABLES `food_random_history` WRITE;
/*!40000 ALTER TABLE `food_random_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `food_random_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `foods`
--

DROP TABLE IF EXISTS `foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_hint` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_must_try` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_foods_slug` (`slug`),
  CONSTRAINT `foods_chk_1` CHECK ((`is_must_try` in (0,1))),
  CONSTRAINT `foods_chk_2` CHECK ((`is_active` in (0,1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foods`
--

LOCK TABLES `foods` WRITE;
/*!40000 ALTER TABLE `foods` DISABLE KEYS */;
/*!40000 ALTER TABLE `foods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `kind` enum('order','community','learning','system') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `target_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `read_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user` (`user_id`,`read_at`,`created_at`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (15,1,'order','Đã tạo đơn hàng HQ-0f478b3c-f6b7-4481-854f-105345a635f9','Đơn hàng của bạn đã được ghi nhận. Tổng tiền: 555.000đ.','/html/profile.html#orders','2026-09-24 08:21:13','2026-09-24 08:20:56'),(16,1,'order','Đã tạo đơn hàng HQ-3076c3b3-a46f-4bdf-b6e8-e7705cd2e8f4','Đơn hàng của bạn đã được ghi nhận. Tổng tiền: 40.000đ.','/html/profile.html#orders','2026-09-24 08:23:51','2026-09-24 08:23:07'),(63,1,'order','Đơn hàng đã xác nhận','Shop đã xác nhận và đang chuẩn bị đơn hàng.','/html/profile.html#orders',NULL,'2026-09-24 12:42:55'),(64,1,'order','Đơn hàng đã xác nhận','Shop đã xác nhận và đang chuẩn bị đơn hàng.','/html/profile.html#orders',NULL,'2026-09-24 12:43:17'),(65,1,'order','Đơn hàng đã xác nhận','Shop đã xác nhận và đang chuẩn bị đơn hàng.','/html/profile.html#orders',NULL,'2026-09-24 12:43:17'),(66,1,'order','Đơn hàng đã xác nhận','Shop đã xác nhận và đang chuẩn bị đơn hàng.','/html/profile.html#orders',NULL,'2026-09-24 12:43:18'),(67,1,'order','Đơn hàng đã xác nhận','Shop đã xác nhận và đang chuẩn bị đơn hàng.','/html/profile.html#orders',NULL,'2026-09-24 12:43:18'),(68,1,'order','Đơn hàng đã xác nhận','Shop đã xác nhận và đang chuẩn bị đơn hàng.','/html/profile.html#orders',NULL,'2026-09-24 12:43:18'),(81,2,'system','Bạn nhận được quà từ cửa hàng','Quý khách được chủ cửa hàng tặng một phần quà nho nhỏ trị giá 20.000đ. Chúc bạn mua sắm thật vui vẻ nhé!','/html/profile.html','2026-09-24 13:01:12','2026-09-24 12:54:58'),(94,2,'order','Đã tạo đơn hàng HQ-42ed5dff-bbdd-46fb-9bf2-ce8957bd557d','Đơn hàng của bạn đã được ghi nhận. Tổng tiền: 130.000đ.','/html/profile.html#orders',NULL,'2026-09-24 13:08:02'),(95,2,'order','Đơn hàng đã xác nhận','Shop đã xác nhận và đang chuẩn bị đơn hàng.','/html/profile.html#orders',NULL,'2026-09-24 13:08:33');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `variant_id` bigint unsigned NOT NULL,
  `product_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size_label` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `color_label` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `unit_price` decimal(14,0) NOT NULL DEFAULT '0',
  `quantity` int NOT NULL,
  `line_total` decimal(16,0) GENERATED ALWAYS AS ((`unit_price` * `quantity`)) STORED,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order` (`order_id`),
  KEY `idx_order_items_variant` (`variant_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `order_items_chk_1` CHECK ((`unit_price` >= 0)),
  CONSTRAINT `order_items_chk_2` CHECK ((`quantity` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` (`id`, `order_id`, `variant_id`, `product_name`, `sku`, `size_label`, `color_label`, `unit_price`, `quantity`) VALUES (2,2,10,'con cìuuuuu','cìuuu','36','màu trén',2000,1),(3,2,11,'dễ huônggg','gấu bông','36','dèn',36000,2),(4,2,6,'gấu bông trắng','ttaabf','34','tragw',200000,1),(5,2,8,'gauasuu bôngg','Teddy Yêu Thương Soft • Cute • Lovely','123','hognof',1000,2),(6,2,9,'con thỏoo','thỏoo','36','trahnwgw',15000,1),(7,3,11,'dễ huônggg','gấu bông','36','dèn',36000,1),(9,5,6,'gấu bông trắng','ttaabf','34','tragw',200000,1),(10,6,11,'dễ huônggg','gấu bông','36','dèn',36000,1),(17,13,9,'con thỏoo','thỏoo','36','trahnwgw',15000,37),(18,14,6,'gấu bông trắng','ttaabf','34','tragw',200000,1),(29,41,8,'gauasuu bôngg','Teddy Yêu Thương Soft • Cute • Lovely','123','hognof',100000,1);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status_history`
--

DROP TABLE IF EXISTS `order_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status_history` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `actor_user_id` bigint unsigned DEFAULT NULL,
  `status` enum('pending','confirmed','shipping','delivered','cancelled','returned') COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status_history_order` (`order_id`,`created_at`),
  KEY `idx_status_history_actor` (`actor_user_id`),
  CONSTRAINT `fk_order_history_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_order_history_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status_history`
--

LOCK TABLES `order_status_history` WRITE;
/*!40000 ALTER TABLE `order_status_history` DISABLE KEYS */;
INSERT INTO `order_status_history` VALUES (35,14,1,'confirmed','Shop xác nhận đơn hàng','2026-09-24 12:42:55'),(36,13,1,'confirmed','Shop xác nhận đơn hàng','2026-09-24 12:43:17'),(37,6,1,'confirmed','Shop xác nhận đơn hàng','2026-09-24 12:43:17'),(38,5,1,'confirmed','Shop xác nhận đơn hàng','2026-09-24 12:43:18'),(39,3,1,'confirmed','Shop xác nhận đơn hàng','2026-09-24 12:43:18'),(40,2,1,'confirmed','Shop xác nhận đơn hàng','2026-09-24 12:43:18'),(59,41,1,'confirmed','Shop xác nhận đơn hàng','2026-09-24 13:08:33');
/*!40000 ALTER TABLE `order_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `coupon_id` bigint unsigned DEFAULT NULL,
  `status` enum('pending','confirmed','shipping','delivered','cancelled','returned') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `recipient_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient_phone` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_note` text COLLATE utf8mb4_unicode_ci,
  `subtotal` decimal(14,0) NOT NULL DEFAULT '0',
  `shipping_fee` decimal(14,0) NOT NULL DEFAULT '0',
  `discount_amount` decimal(14,0) NOT NULL DEFAULT '0',
  `total_amount` decimal(14,0) GENERATED ALWAYS AS (((`subtotal` + `shipping_fee`) - `discount_amount`)) STORED,
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VND',
  `coupon_code_snapshot` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_orders_number` (`order_number`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_coupon` (`coupon_id`),
  CONSTRAINT `fk_orders_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `orders_chk_1` CHECK ((`subtotal` >= 0)),
  CONSTRAINT `orders_chk_2` CHECK ((`shipping_fee` >= 0)),
  CONSTRAINT `orders_chk_3` CHECK ((`discount_amount` >= 0)),
  CONSTRAINT `orders_chk_4` CHECK ((`discount_amount` <= `subtotal`)),
  CONSTRAINT `orders_chk_5` CHECK ((`currency` = _utf8mb4'VND'))
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `coupon_id`, `status`, `recipient_name`, `recipient_phone`, `shipping_address`, `customer_note`, `subtotal`, `shipping_fee`, `discount_amount`, `currency`, `coupon_code_snapshot`, `created_at`, `updated_at`) VALUES (2,'HQ-d19dd077-b369-4f51-8b48-eb8abfe8ebc4',1,NULL,'confirmed','hongquys','0379997387','147/1 - tổ 5, kp.Hòa Lân 2, p.Thuận Giao, Bình Dương','{\"coupons\":[]}',291000,30000,0,'VND',NULL,'2026-09-23 18:51:34','2026-09-24 12:43:18'),(3,'HQ-7c49c9bc-638d-49e1-b585-6df02cef6737',1,NULL,'confirmed','hongquys','0379997387','147/1 - tổ 5, kp.Hòa Lân 2, p.Thuận Giao, Bình Dương','{\"coupons\":[]}',36000,30000,0,'VND',NULL,'2026-09-23 18:57:31','2026-09-24 12:43:18'),(5,'HQ-b3d87a76-5b8c-4b21-9709-35f38e8d1599',1,NULL,'confirmed','hongquys','0379997387','147/1 - tổ 5, kp.Hòa Lân 2, p.Thuận Giao, Bình Dương','{\"coupons\":[]}',200000,30000,0,'VND',NULL,'2026-09-23 19:08:18','2026-09-24 12:43:18'),(6,'HQ-189c3931-ae66-4ea4-be46-8893b0738fd3',1,NULL,'confirmed','hongquys','0379997387','147/1 - tổ 5, kp.Hòa Lân 2, p.Thuận Giao, Bình Dương','{\"coupons\":[]}',36000,30000,0,'VND',NULL,'2026-09-23 19:10:37','2026-09-24 12:43:17'),(13,'HQ-0f478b3c-f6b7-4481-854f-105345a635f9',1,NULL,'confirmed','hongquys','0379997387','147/1 - tổ 5, kp.Hòa Lân 2, p.Thuận Giao, Bình Dương','{\"coupons\":[]}',555000,0,0,'VND',NULL,'2026-09-24 08:20:56','2026-09-24 12:43:17'),(14,'HQ-3076c3b3-a46f-4bdf-b6e8-e7705cd2e8f4',1,NULL,'confirmed','hongquys','0379997387','147/1 - tổ 5, kp.Hòa Lân 2, p.Thuận Giao, Bình Dương','{\"coupons\":[\"iuhongquy\",\"hongquyfreeship\",\"chaohongquy\",\"iuhongquy20\"]}',200000,0,160000,'VND',NULL,'2026-09-24 08:23:07','2026-09-24 12:42:55'),(41,'HQ-42ed5dff-bbdd-46fb-9bf2-ce8957bd557d',2,NULL,'confirmed','maianh','0123456789','cầu sông hàn, sss, đà nẵng','{\"coupons\":[]}',100000,30000,0,'VND',NULL,'2026-09-24 13:08:02','2026-09-24 13:08:33');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reset_tokens_token_hash` (`token_hash`),
  KEY `idx_reset_tokens_user` (`user_id`),
  CONSTRAINT `fk_reset_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `method` enum('cod','bank_transfer','momo','card','store_pay') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','paid','failed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `provider_reference` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idempotency_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(14,0) NOT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_payments_idempotency_key` (`idempotency_key`),
  UNIQUE KEY `uq_payments_provider_method` (`method`,`provider_reference`),
  KEY `idx_payments_order` (`order_id`),
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `payments_chk_1` CHECK ((`amount` >= 0)),
  CONSTRAINT `payments_chk_2` CHECK ((`status` in (_utf8mb4'pending',_utf8mb4'paid',_utf8mb4'failed',_utf8mb4'cancelled'))),
  CONSTRAINT `payments_chk_3` CHECK (((`status` <> _utf8mb4'paid') or (`paid_at` is not null)))
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (2,2,'store_pay','paid','d8cc437149ef4871ccfa044a026ecab69bcf33c7ed5fa835dcb81215382c614b','checkout:1:d19dd077-b369-4f51-8b48-eb8abfe8ebc4',321000,'2026-09-23 18:51:34','2026-09-23 18:51:34'),(3,3,'cod','pending','3605ec4650f863e30f647dad416158ffa20ea4bf6a04cbce77968620f0e1662b','checkout:1:7c49c9bc-638d-49e1-b585-6df02cef6737',66000,NULL,'2026-09-23 18:57:31'),(5,5,'bank_transfer','pending','bc2445be1e6d70e1d40453d3086242f1fb5f1d1fcf02f2a1c19cd90b1dfb8b3d','checkout:1:b3d87a76-5b8c-4b21-9709-35f38e8d1599',230000,NULL,'2026-09-23 19:08:18'),(6,6,'bank_transfer','pending','898c7c07522a95c8aca8c15a542866d4f4027843e4a6ecb38fce98e3987b97ef','checkout:1:189c3931-ae66-4ea4-be46-8893b0738fd3',66000,NULL,'2026-09-23 19:10:37'),(13,13,'store_pay','paid','7f4e7d140ad1b3ce7b0b218d46c5e9b49c6d32dc8dc234c76b81edb5099d28a8','checkout:1:0f478b3c-f6b7-4481-854f-105345a635f9',555000,'2026-09-24 08:20:57','2026-09-24 08:20:56'),(14,14,'store_pay','paid','d728331a7d8ffd52acec6456c2334151f795c608401cf763cbecd28b9c18b81b','checkout:1:3076c3b3-a46f-4bdf-b6e8-e7705cd2e8f4',40000,'2026-09-24 08:23:08','2026-09-24 08:23:07'),(28,41,'store_pay','paid','5632310ef54f14d232bfdcf4d7c8d1a3eb476e8f6e732107e09cfec24c93c71e','checkout:2:42ed5dff-bbdd-46fb-9bf2-ce8957bd557d',130000,'2026-09-24 13:08:03','2026-09-24 13:08:02');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `points_ledger`
--

DROP TABLE IF EXISTS `points_ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `points_ledger` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `points` int NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_key` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_points_event_key` (`event_key`),
  KEY `idx_points_user` (`user_id`),
  CONSTRAINT `fk_points_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `points_ledger_chk_1` CHECK ((`points` <> 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `points_ledger`
--

LOCK TABLES `points_ledger` WRITE;
/*!40000 ALTER TABLE `points_ledger` DISABLE KEYS */;
/*!40000 ALTER TABLE `points_ledger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_attachments`
--

DROP TABLE IF EXISTS `post_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `file_url` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `original_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime_type` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kind` enum('image','video','document') COLLATE utf8mb4_unicode_ci NOT NULL,
  `size_bytes` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_attachment_post` (`post_id`,`id`),
  KEY `idx_attachment_user` (`user_id`),
  CONSTRAINT `fk_attachment_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_attachment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_attachments`
--

LOCK TABLES `post_attachments` WRITE;
/*!40000 ALTER TABLE `post_attachments` DISABLE KEYS */;
INSERT INTO `post_attachments` VALUES (5,2,1,'/uploads/tintuc/4c8aef66-3788-42dc-8e5f-1b5d7e9e5d47.png','screenshot_1790180496.png','image/png','image',22853,'2026-09-24 08:38:15'),(6,2,1,'/uploads/tintuc/c3152671-42c2-4d60-a48e-3d8b294194c3.jpg','479614493ca45715ef6b2f84422237b2.jpg','image/jpeg','image',75967,'2026-09-24 08:38:15');
/*!40000 ALTER TABLE `post_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_bookmarks`
--

DROP TABLE IF EXISTS `post_bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_bookmarks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_post_bookmarks_user_post` (`user_id`,`post_id`),
  KEY `idx_post_bookmarks_user` (`user_id`),
  KEY `fk_post_bookmarks_post` (`post_id`),
  CONSTRAINT `fk_post_bookmarks_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_post_bookmarks_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_bookmarks`
--

LOCK TABLES `post_bookmarks` WRITE;
/*!40000 ALTER TABLE `post_bookmarks` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_bookmarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_categories`
--

DROP TABLE IF EXISTS `post_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_post_categories_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_categories`
--

LOCK TABLES `post_categories` WRITE;
/*!40000 ALTER TABLE `post_categories` DISABLE KEYS */;
INSERT INTO `post_categories` VALUES (1,'collection','Khoe bộ sưu tập','2026-09-24 08:31:29'),(2,'review','Đánh giá sản phẩm','2026-09-24 08:31:29'),(3,'question','Hỏi đáp','2026-09-24 08:31:29'),(4,'diy','Tự làm gấu','2026-09-24 08:31:29'),(5,'chat','Tán gẫu','2026-09-24 08:31:29');
/*!40000 ALTER TABLE `post_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_images`
--

DROP TABLE IF EXISTS `post_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint unsigned NOT NULL,
  `image_url` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_post_images_post` (`post_id`,`sort_order`),
  CONSTRAINT `fk_post_images_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_images`
--

LOCK TABLES `post_images` WRITE;
/*!40000 ALTER TABLE `post_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_likes`
--

DROP TABLE IF EXISTS `post_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_likes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_post_likes_user_post` (`user_id`,`post_id`),
  KEY `idx_post_likes_post` (`post_id`),
  CONSTRAINT `fk_post_likes_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_post_likes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_likes`
--

LOCK TABLES `post_likes` WRITE;
/*!40000 ALTER TABLE `post_likes` DISABLE KEYS */;
INSERT INTO `post_likes` VALUES (3,3,2,'2026-09-24 08:42:15');
/*!40000 ALTER TABLE `post_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_tags`
--

DROP TABLE IF EXISTS `post_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_tags` (
  `post_id` bigint unsigned NOT NULL,
  `tag_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`post_id`,`tag_id`),
  KEY `idx_post_tags_tag` (`tag_id`),
  CONSTRAINT `fk_post_tags_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_post_tags_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_tags`
--

LOCK TABLES `post_tags` WRITE;
/*!40000 ALTER TABLE `post_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `author_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail_url` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `is_pinned` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_posts_slug` (`slug`),
  KEY `idx_posts_category` (`category_id`),
  KEY `idx_posts_author` (`author_id`),
  KEY `idx_posts_published_date` (`status`,`created_at`),
  CONSTRAINT `fk_posts_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_posts_category` FOREIGN KEY (`category_id`) REFERENCES `post_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `posts_chk_1` CHECK ((`is_pinned` in (0,1)))
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (2,2,1,'alooo','bai-viet-dce246d9-b14d-423a-bfad-d850feccd7ac','xin chào','xin chào',NULL,'published',0,'2026-09-24 08:38:15','2026-09-24 08:38:15'),(3,1,1,'xin chào','bai-viet-2ebe20a6-a8ce-4fba-9b8f-15f56c59f93b','ấdasdasd','ấdasdasd',NULL,'published',0,'2026-09-24 08:38:47','2026-09-24 08:38:47');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `image_url` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_images_product` (`product_id`,`sort_order`),
  CONSTRAINT `fk_product_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (10,10,'/uploads/avatars/product-87e139f3-03e6-4b18-a8ec-e40e9ef2ddf7.jpg','bd91c63b6dd6dd07ec065efda5d94c47.jpg',0,'2026-09-23 14:52:25'),(63,16,'/uploads/products/product-e299c679-3cb3-4c87-8dca-59b95e8425b4.jpg','479614493ca45715ef6b2f84422237b2.jpg',0,'2026-09-24 13:06:06'),(64,15,'/uploads/products/product-e434f297-c7a4-4222-939f-ce3c374d4cdf.jpg','dc13b42e7b2401140c6ca5b5f130d4cd.jpg',0,'2026-09-24 13:06:15'),(65,14,'/uploads/products/product-2d10a242-e04b-444c-88d6-4f1d341e71ed.jpg','062dd2c5f5e50ab2dc2614990740a7c3.jpg',0,'2026-09-24 13:06:27'),(66,13,'/uploads/products/product-6bc4df78-618d-40a5-9b17-5310e305e736.jpg','7e4cb1d424ce6a785ae006361dd1b130.jpg',0,'2026-09-24 13:06:35');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_item_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `rating` tinyint unsigned NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_product_review_order_item` (`order_item_id`),
  KEY `idx_reviews_user` (`user_id`),
  KEY `idx_reviews_product` (`product_id`),
  CONSTRAINT `fk_reviews_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reviews`
--

LOCK TABLES `product_reviews` WRITE;
/*!40000 ALTER TABLE `product_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `sku` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size_label` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `color_label` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `price` decimal(14,0) NOT NULL DEFAULT '0',
  `compare_at_price` decimal(14,0) DEFAULT NULL,
  `stock_quantity` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_product_variants_sku` (`sku`),
  KEY `idx_variants_product` (`product_id`),
  CONSTRAINT `fk_product_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_variants_chk_1` CHECK ((`price` >= 0)),
  CONSTRAINT `product_variants_chk_2` CHECK ((`stock_quantity` >= 0)),
  CONSTRAINT `product_variants_chk_3` CHECK ((`is_active` in (0,1)))
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (6,10,'ttaabf','34','tragw',200000,300000,120,1,'2026-09-23 14:52:25','2026-09-24 08:23:07'),(8,13,'Teddy Yêu Thương Soft • Cute • Lovely','123','hognof',100000,200000,309,1,'2026-09-23 15:14:28','2026-09-24 13:08:02'),(9,14,'thỏoo','36','trahnwgw',150000,200000,283,1,'2026-09-23 15:19:33','2026-09-24 13:06:27'),(10,15,'cìuuu','36','màu trén',200000,20000000,31,1,'2026-09-23 15:43:54','2026-09-24 13:06:15'),(11,16,'gấu bông','36','dèn',360000,3636000,32,1,'2026-09-23 15:46:34','2026-09-24 13:06:06');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `slug` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_slug` (`slug`),
  KEY `idx_products_category` (`category_id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `products_chk_1` CHECK ((`is_active` in (0,1)))
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (10,9,'gau-bongz','gấu bông trắng','E:\\project\\maianh\\maianh\\BE\\src\\routes\\admin',1,'2026-09-23 14:52:25','2026-09-23 14:52:25'),(13,9,'gauasuu-bongg','gauasuu bôngg','Teddy Yêu Thương\nSoft • Cute • Lovely\nTeddy Yêu Thương\nSoft • Cute • Lovely',1,'2026-09-23 15:14:28','2026-09-23 15:14:28'),(14,9,'con-thooo','con thỏoo','Teddy Yêu Thương\nSoft • Cute • Lovely\nTeddy Yêu Thương\nSoft • Cute • Lovely',1,'2026-09-23 15:19:33','2026-09-23 15:19:33'),(15,9,'con-ciuuuuu','con cìuuuuu','Teddy Yêu Thương\nSoft • Cute • Lovely\nE:\\project\\maianh\\maianh\\BE\\uploads\\products',1,'2026-09-23 15:43:54','2026-09-23 15:43:54'),(16,9,'de-huonggg','dễ huônggg','E:\\project\\maianh\\maianh\\BE\\uploads\\products',1,'2026-09-23 15:46:34','2026-09-23 15:46:34');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refunds`
--

DROP TABLE IF EXISTS `refunds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refunds` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `payment_id` bigint unsigned NOT NULL,
  `order_id` bigint unsigned NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(14,0) NOT NULL,
  `status` enum('requested','approved','rejected','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'requested',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_refunds_payment` (`payment_id`),
  KEY `idx_refunds_order` (`order_id`),
  CONSTRAINT `fk_refunds_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_refunds_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `refunds_chk_1` CHECK ((`amount` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refunds`
--

LOCK TABLES `refunds` WRITE;
/*!40000 ALTER TABLE `refunds` DISABLE KEYS */;
/*!40000 ALTER TABLE `refunds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tags_slug` (`slug`),
  UNIQUE KEY `uq_tags_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_preferences`
--

DROP TABLE IF EXISTS `user_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_preferences` (
  `user_id` bigint unsigned NOT NULL,
  `receive_newsletter` tinyint(1) NOT NULL DEFAULT '1',
  `receive_sms` tinyint(1) NOT NULL DEFAULT '0',
  `preferred_language` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'vi',
  `preferred_currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VND',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_user_preferences_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_preferences_chk_1` CHECK ((`receive_newsletter` in (0,1))),
  CONSTRAINT `user_preferences_chk_2` CHECK ((`receive_sms` in (0,1))),
  CONSTRAINT `user_preferences_chk_3` CHECK ((`preferred_language` in (_utf8mb4'vi',_utf8mb4'en',_utf8mb4'ko')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_preferences`
--

LOCK TABLES `user_preferences` WRITE;
/*!40000 ALTER TABLE `user_preferences` DISABLE KEYS */;
INSERT INTO `user_preferences` VALUES (1,1,1,'vi','VND','2026-09-23 18:33:34');
/*!40000 ALTER TABLE `user_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(24) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cash` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Số dư ví của người dùng dùng để thanh toán',
  `address` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Địa chỉ của người dùng',
  `role` enum('customer','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `status` enum('active','inactive','banned') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  CONSTRAINT `users_chk_1` CHECK ((`email` <> _utf8mb4''))
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'hongquy@gmail.com','scrypt-v1$d7fb39c940b9a37afe1219c4b080f9c5$80222161a706a0b5f2c9913b2176f0fa0c041e8c54906301dcd28f26766aca4b057b6726b50564c300ea539feb1e64d005c30321612592030c3ba89270b3d223','hongquys','0379997387','/uploads/avatars/avatar-acd4ff54-6195-4f51-b564-02a73a51bf5f.png',528033000.00,'thuận giao','admin','active','2026-09-21 16:54:44','2026-09-24 08:23:07'),(2,'maianh@gmail.com','scrypt-v1$d3d2ceac6613f237a14d2dffa4a6dc72$a6adc7096a21e8294ee420f0dad68d7d4182e1d2e961afb6391afb77b8299cfc1a291bd1204dca8c8cb193a752d84e7b6a587ca725a26185daed89248c9a826f','maianh','0123456789','/uploads/avatars/avatar-da00a5e9-9688-47be-a3fd-1bbb9b2a9560.jpg',390000.00,NULL,'customer','active','2026-09-21 17:07:16','2026-09-24 13:08:02');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vocabulary`
--

DROP TABLE IF EXISTS `vocabulary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vocabulary` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `external_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `korean` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `romanization` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vietnamese` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `word_type` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `example_ko` text COLLATE utf8mb4_unicode_ci,
  `example_vi` text COLLATE utf8mb4_unicode_ci,
  `level` enum('beginner','intermediate','advanced') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'beginner',
  `audio_url` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_import_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_vocabulary_external_id` (`external_id`),
  KEY `idx_vocabulary_category` (`category_id`),
  KEY `idx_vocabulary_level` (`level`),
  KEY `idx_vocabulary_korean` (`korean`),
  KEY `idx_vocabulary_active` (`is_active`),
  KEY `fk_vocabulary_import` (`last_import_id`),
  CONSTRAINT `fk_vocabulary_category` FOREIGN KEY (`category_id`) REFERENCES `vocabulary_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_vocabulary_import` FOREIGN KEY (`last_import_id`) REFERENCES `vocabulary_imports` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vocabulary_chk_1` CHECK ((`is_active` in (0,1)))
) ENGINE=InnoDB AUTO_INCREMENT=1251 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vocabulary`
--

LOCK TABLES `vocabulary` WRITE;
/*!40000 ALTER TABLE `vocabulary` DISABLE KEYS */;
INSERT INTO `vocabulary` VALUES (201,'topik1_001',1,'가게','ga-ge','cửa hàng, tiệm','Danh từ','가게에서 빵을 사요.','Tôi mua bánh ở cửa hàng.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(202,'topik1_002',1,'가격','ga-gyeok','giá cả','Danh từ','가격이 비싸요.','Giá cả đắt quá.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(203,'topik1_003',1,'가구','ga-gu','đồ nội thất','Danh từ','가구가 예뻐요.','Đồ nội thất đẹp.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(204,'topik1_004',1,'가깝다','ga-kkap-da','gần','Tính từ','집이 학교에서 가까워요.','Nhà gần trường học.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(205,'topik1_005',1,'가끔','ga-kkeum','thỉnh thoảng','Phó từ','가끔 영화를 봐요.','Thỉnh thoảng tôi xem phim.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(206,'topik1_006',1,'가다','ga-da','đi','Động từ','학교에 가요.','Tôi đi đến trường.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(207,'topik1_007',1,'가르치다','ga-reu-chi-da','dạy','Động từ','한국어를 가르쳐요.','Tôi dạy tiếng Hàn.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(208,'topik1_008',1,'가방','ga-bang','cái túi, cặp sách','Danh từ','가방이 커요.','Cái cặp to.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(209,'topik1_009',1,'가볍다','ga-byeop-da','nhẹ','Tính từ','가방이 가벼워요.','Cái túi nhẹ.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(210,'topik1_010',1,'가수','ga-su','ca sĩ','Danh từ','가수가 노래를 불러요.','Ca sĩ hát.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(211,'topik1_011',1,'가슴','ga-seum','ngực, lồng ngực','Danh từ','가슴이 아파요.','Ngực tôi đau.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(212,'topik1_012',1,'가요','ga-yo','nhạc pop, ca khúc','Danh từ','가요를 들어요.','Tôi nghe nhạc pop.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(213,'topik1_013',1,'가운데','ga-un-de','ở giữa','Danh từ','가운데에 앉아요.','Tôi ngồi ở giữa.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(214,'topik1_014',1,'가위','ga-wi','cái kéo','Danh từ','가위로 종이를 잘라요.','Tôi cắt giấy bằng kéo.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(215,'topik1_015',1,'가을','ga-eul','mùa thu','Danh từ','가을을 좋아해요.','Tôi thích mùa thu.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(216,'topik1_016',1,'가장','ga-jang','nhất','Phó từ','가장 좋아하는 음식이 뭐예요?','Món ăn bạn thích nhất là gì?','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(217,'topik1_017',1,'가져가다','ga-jyeo-ga-da','mang đi','Động từ','책을 가져가세요.','Hãy mang sách đi.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(218,'topik1_018',1,'가져오다','ga-jyeo-o-da','mang đến','Động từ','물을 가져오세요.','Hãy mang nước đến.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(219,'topik1_019',1,'가족','ga-jok','gia đình','Danh từ','가족이 네 명이에요.','Gia đình tôi có bốn người.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(220,'topik1_020',1,'가지','ga-ji','loại, cái','Danh từ','사과를 세 개 주세요.','Cho tôi ba quả táo.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(221,'topik1_021',1,'가지다','ga-ji-da','có, mang','Động từ','돈을 가지고 있어요?','Bạn có tiền không?','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(222,'topik1_022',1,'간단하다','gan-dan-ha-da','đơn giản','Tính từ','문제가 간단해요.','Vấn đề đơn giản.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(223,'topik1_023',1,'간식','gan-sik','đồ ăn nhẹ, đồ ăn vặt','Danh từ','간식으로 과자를 먹어요.','Tôi ăn bánh như đồ ăn nhẹ.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(224,'topik1_024',1,'간호사','gan-ho-sa','y tá','Danh từ','간호사가 친절해요.','Y tá thân thiện.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(225,'topik1_025',1,'갈비','gal-bi','sườn (nướng)','Danh từ','갈비를 먹고 싶어요.','Tôi muốn ăn sườn nướng.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(226,'topik1_026',1,'갈색','gal-saek','màu nâu','Danh từ','갈색 가방을 샀어요.','Tôi đã mua túi màu nâu.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(227,'topik1_027',1,'감','gam','quả hồng','Danh từ','감이 맛있어요.','Quả hồng ngon.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(228,'topik1_028',1,'감기','gam-gi','cảm cúm','Danh từ','감기에 걸렸어요.','Tôi bị cảm cúm.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(229,'topik1_029',1,'감사하다','gam-sa-ha-da','cảm ơn','Động từ','도와주셔서 감사합니다.','Cảm ơn vì đã giúp đỡ.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(230,'topik1_030',1,'감자','gam-ja','khoai tây','Danh từ','감자를 좋아해요.','Tôi thích khoai tây.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(231,'topik1_031',1,'값','gap','giá','Danh từ','값이 얼마예요?','Giá bao nhiêu?','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(232,'topik1_032',1,'강','gang','sông','Danh từ','강에서 수영해요.','Tôi bơi ở sông.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(233,'topik1_033',1,'강아지','gang-a-ji','chó con','Danh từ','강아지가 귀여워요.','Chó con dễ thương.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(234,'topik1_034',1,'같다','gat-da','giống, như nhau','Tính từ','우리는 키가 같아요.','Chúng tôi có chiều cao giống nhau.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(235,'topik1_035',1,'같이','ga-chi','cùng nhau','Phó từ','같이 밥을 먹어요.','Chúng tôi ăn cơm cùng nhau.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(236,'topik1_036',1,'개','gae','con (động vật); cái, chiếc','Danh từ','개가 두 마리 있어요.','Có hai con chó.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(237,'topik1_037',1,'거기','geo-gi','đó, chỗ đó','Đại từ','거기에 앉아요.','Tôi ngồi ở đó.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(238,'topik1_038',1,'거실','geo-sil','phòng khách','Danh từ','거실에서 TV를 봐요.','Tôi xem TV ở phòng khách.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(239,'topik1_039',1,'거울','geo-ul','gương','Danh từ','거울을 봐요.','Tôi nhìn gương.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(240,'topik1_040',1,'걱정하다','geok-jeong-ha-da','lo lắng','Động từ','시험을 걱정해요.','Tôi lo lắng về kỳ thi.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(241,'topik1_041',1,'건강하다','geon-gang-ha-da','khỏe mạnh','Tính từ','건강하게 지내세요.','Hãy sống khỏe mạnh.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(242,'topik1_042',1,'건물','geon-mul','tòa nhà','Danh từ','건물이 높아요.','Tòa nhà cao.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(243,'topik1_043',1,'걷다','geot-da','đi bộ','Động từ','공원에서 걸어요.','Tôi đi bộ ở công viên.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(244,'topik1_044',1,'검은색','geo-meun-saek','màu đen','Danh từ','검은색 옷을 입어요.','Tôi mặc quần áo màu đen.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(245,'topik1_045',1,'것','geot','cái, thứ, điều','Danh từ','이것은 뭐예요?','Cái này là gì?','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(246,'topik1_046',1,'게임','ge-im','trò chơi','Danh từ','게임을 좋아해요.','Tôi thích trò chơi.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(247,'topik1_047',1,'겨울','gyeo-ul','mùa đông','Danh từ','겨울에 눈이 와요.','Mùa đông tuyết rơi.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(248,'topik1_048',1,'결혼하다','gyeo-ron-ha-da','kết hôn','Động từ','내년에 결혼해요.','Tôi kết hôn vào năm sau.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(249,'topik1_049',1,'경찰','gyeong-chal','cảnh sát','Danh từ','경찰이 도와줘요.','Cảnh sát giúp đỡ.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(250,'topik1_050',1,'경험','gyeong-heom','kinh nghiệm','Danh từ','좋은 경험이에요.','Đó là kinh nghiệm tốt.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(251,'topik1_051',1,'계단','gye-dan','cầu thang','Danh từ','계단으로 올라가요.','Tôi lên bằng cầu thang.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(252,'topik1_052',1,'계란','gye-ran','trứng gà','Danh từ','계란을 사요.','Tôi mua trứng gà.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(253,'topik1_053',1,'고기','go-gi','thịt','Danh từ','고기를 먹어요.','Tôi ăn thịt.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(254,'topik1_054',1,'고맙다','go-map-da','cảm ơn','Tính từ','정말 고마워요.','Cảm ơn rất nhiều.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(255,'topik1_055',1,'고양이','go-yang-i','con mèo','Danh từ','고양이가 있어요.','Có một con mèo.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(256,'topik1_056',1,'고향','go-hyang','quê hương','Danh từ','고향이 어디예요?','Quê bạn ở đâu?','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(257,'topik1_057',1,'곧','got','sắp, ngay','Phó từ','곧 도착해요.','Sắp đến rồi.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(258,'topik1_058',1,'공부하다','gong-bu-ha-da','học','Động từ','한국어를 공부해요.','Tôi học tiếng Hàn.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(259,'topik1_059',1,'공원','gong-won','công viên','Danh từ','공원에서 놀아요.','Tôi chơi ở công viên.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(260,'topik1_060',1,'과일','gwa-il','hoa quả, trái cây','Danh từ','과일을 좋아해요.','Tôi thích trái cây.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(261,'topik1_061',1,'과자','gwa-ja','bánh kẹo, bánh snack','Danh từ','과자를 먹어요.','Tôi ăn bánh snack.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(262,'topik1_062',1,'관심','gwan-sim','sự quan tâm','Danh từ','음악에 관심이 있어요.','Tôi quan tâm đến âm nhạc.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(263,'topik1_063',1,'광장','gwang-jang','quảng trường','Danh từ','광장에서 만나요.','Chúng ta gặp ở quảng trường.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(264,'topik1_064',1,'교실','gyo-sil','lớp học','Danh từ','교실에서 공부해요.','Tôi học ở lớp học.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(265,'topik1_065',1,'교통','gyo-tong','giao thông','Danh từ','교통이 편리해요.','Giao thông thuận tiện.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(266,'topik1_066',1,'구두','gu-du','giày da','Danh từ','구두를 신어요.','Tôi đi giày da.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(267,'topik1_067',1,'구름','gu-reum','mây','Danh từ','구름이 많아요.','Có nhiều mây.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(268,'topik1_068',1,'국','guk','canh, súp','Danh từ','국을 먹어요.','Tôi ăn canh.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(269,'topik1_069',1,'국수','guk-su','mì','Danh từ','국수를 좋아해요.','Tôi thích mì.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(270,'topik1_070',1,'권','gwon','quyển (sách)','Danh từ','책 한 권을 읽어요.','Tôi đọc một quyển sách.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(271,'topik1_071',1,'귀엽다','gwi-yeop-da','dễ thương','Tính từ','아기가 귀여워요.','Em bé dễ thương.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(272,'topik1_072',1,'그냥','geu-nyang','cứ, chỉ','Phó từ','그냥 집에 있어요.','Tôi chỉ ở nhà thôi.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(273,'topik1_073',1,'그렇다','geu-reo-ta','như vậy, như thế','Tính từ','그래요? 정말요?','Vậy à? Thật không?','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(274,'topik1_074',1,'그리고','geu-ri-go','và','Liên từ','밥을 먹고 그리고 공부해요.','Tôi ăn cơm và sau đó học.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(275,'topik1_075',1,'그저께','geu-jeo-kke','hôm trước hôm qua','Danh từ','그저께 친구를 만났어요.','Tôi đã gặp bạn vào hôm trước hôm qua.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(276,'topik1_076',1,'극장','geuk-jang','rạp hát, rạp chiếu phim','Danh từ','극장에서 영화를 봐요.','Tôi xem phim ở rạp.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(277,'topik1_077',1,'금요일','geu-myo-il','thứ Sáu','Danh từ','금요일에 만나요.','Chúng ta gặp nhau vào thứ Sáu.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(278,'topik1_078',1,'기다리다','gi-da-ri-da','đợi, chờ','Động từ','친구를 기다려요.','Tôi đợi bạn.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(279,'topik1_079',1,'기차','gi-cha','tàu hỏa','Danh từ','기차를 타요.','Tôi đi tàu hỏa.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(280,'topik1_080',1,'김치','gim-chi','kimchi','Danh từ','김치를 먹어요.','Tôi ăn kimchi.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(281,'topik1_081',1,'김밥','gim-bap','cơm cuộn rong biển','Danh từ','김밥을 좋아해요.','Tôi thích cơm cuộn.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(282,'topik1_082',1,'꼭','kkok','nhất định, chắc chắn','Phó từ','꼭 와 주세요.','Nhất định hãy đến nhé.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(283,'topik1_083',1,'꽃','kkot','hoa','Danh từ','꽃이 예뻐요.','Hoa đẹp.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(284,'topik1_084',1,'끝나다','kkeut-na-da','kết thúc','Động từ','수업이 끝났어요.','Buổi học đã kết thúc.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(285,'topik1_085',1,'나','na','tôi, tớ','Đại từ','나는 학생이에요.','Tôi là học sinh.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(286,'topik1_086',1,'나라','na-ra','đất nước','Danh từ','어느 나라에서 왔어요?','Bạn đến từ nước nào?','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(287,'topik1_087',1,'나무','na-mu','cây','Danh từ','나무가 커요.','Cây to.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(288,'topik1_088',1,'나쁘다','na-ppeu-da','xấu, tồi','Tính từ','날씨가 나빠요.','Thời tiết xấu.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(289,'topik1_089',1,'날씨','nal-ssi','thời tiết','Danh từ','날씨가 좋아요.','Thời tiết đẹp.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(290,'topik1_090',1,'남자','nam-ja','đàn ông, con trai','Danh từ','남자가 많아요.','Có nhiều đàn ông.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(291,'topik1_091',1,'내일','nae-il','ngày mai','Danh từ','내일 만나요.','Ngày mai gặp nhé.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(292,'topik1_092',1,'냄비','naem-bi','cái nồi','Danh từ','냄비에 물을 넣어요.','Tôi cho nước vào nồi.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(293,'topik1_093',1,'냉장고','naeng-jang-go','tủ lạnh','Danh từ','냉장고에 우유가 있어요.','Có sữa trong tủ lạnh.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(294,'topik1_094',1,'너무','neo-mu','quá, rất','Phó từ','너무 바빠요.','Tôi quá bận.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(295,'topik1_095',1,'노래','no-rae','bài hát','Danh từ','노래를 불러요.','Tôi hát.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(296,'topik1_096',1,'놀다','nol-da','chơi','Động từ','주말에 놀아요.','Tôi chơi vào cuối tuần.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(297,'topik1_097',1,'높다','nop-da','cao','Tính từ','산이 높아요.','Núi cao.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(298,'topik1_098',1,'눈','nun','mắt; tuyết','Danh từ','눈이 예뻐요.','Mắt đẹp.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(299,'topik1_099',1,'누구','nu-gu','ai','Đại từ','누구예요?','Đó là ai?','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(300,'topik1_100',1,'다니다','da-ni-da','đi lại, theo học','Động từ','학교에 다녀요.','Tôi đi học.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(301,'topik1_101',1,'다리','da-ri','chân; cầu','Danh từ','다리가 아파요.','Chân tôi đau.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(302,'topik1_102',1,'다시','da-si','lại, lần nữa','Phó từ','다시 말해 주세요.','Hãy nói lại lần nữa.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(303,'topik1_103',1,'닭','dak','con gà','Danh từ','닭을 먹어요.','Tôi ăn thịt gà.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(304,'topik1_104',1,'당근','dang-geun','cà rốt','Danh từ','당근을 좋아해요.','Tôi thích cà rốt.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(305,'topik1_105',1,'대답','dae-dap','câu trả lời','Danh từ','대답을 잘해요.','Tôi trả lời tốt.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(306,'topik1_106',1,'대학교','dae-hak-gyo','trường đại học','Danh từ','대학교에 다녀요.','Tôi học đại học.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(307,'topik1_107',1,'더','deo','hơn, thêm','Phó từ','더 주세요.','Cho tôi thêm.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(308,'topik1_108',1,'도서관','do-seo-gwan','thư viện','Danh từ','도서관에서 공부해요.','Tôi học ở thư viện.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(309,'topik1_109',1,'돈','don','tiền','Danh từ','돈이 없어요.','Tôi không có tiền.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(310,'topik1_110',1,'동생','dong-saeng','em','Danh từ','동생이 있어요.','Tôi có em.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(311,'topik1_111',1,'동물','dong-mul','động vật','Danh từ','동물을 좋아해요.','Tôi thích động vật.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(312,'topik1_112',1,'두부','du-bu','đậu phụ','Danh từ','두부를 먹어요.','Tôi ăn đậu phụ.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(313,'topik1_113',1,'듣다','deut-da','nghe','Động từ','음악을 들어요.','Tôi nghe nhạc.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(314,'topik1_114',1,'들다','deul-da','cầm, nâng; vào','Động từ','가방을 들어요.','Tôi cầm túi.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(315,'topik1_115',1,'따뜻하다','tta-tteut-ha-da','ấm áp','Tính từ','날씨가 따뜻해요.','Thời tiết ấm áp.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(316,'topik1_116',1,'떡','tteok','bánh gạo','Danh từ','떡을 먹어요.','Tôi ăn bánh gạo.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(317,'topik1_117',1,'떡볶이','tteok-bo-kki','bánh gạo xào cay','Danh từ','떡볶이를 좋아해요.','Tôi thích bánh gạo xào cay.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(318,'topik1_118',1,'또','tto','lại, nữa','Phó từ','또 왔어요.','Lại đến nữa rồi.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(319,'topik1_119',1,'라면','ra-myeon','mì gói, mì ăn liền','Danh từ','라면을 끓여요.','Tôi nấu mì gói.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(320,'topik1_120',1,'마시다','ma-si-da','uống','Động từ','물을 마셔요.','Tôi uống nước.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(321,'topik1_121',1,'마음','ma-eum','trái tim, tấm lòng','Danh từ','마음이 좋아요.','Trong lòng tôi vui.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(322,'topik1_122',1,'만나다','man-na-da','gặp gỡ','Động từ','친구를 만나요.','Tôi gặp bạn.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(323,'topik1_123',1,'많다','man-ta','nhiều','Tính từ','사람이 많아요.','Có nhiều người.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(324,'topik1_124',1,'맛있다','ma-sit-da','ngon','Tính từ','음식이 맛있어요.','Món ăn ngon.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(325,'topik1_125',1,'맛없다','ma-deop-da','không ngon','Tính từ','이 음식은 맛없어요.','Món này không ngon.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(326,'topik1_126',1,'매일','mae-il','mỗi ngày','Phó từ','매일 운동해요.','Tôi tập thể dục mỗi ngày.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(327,'topik1_127',1,'머리','meo-ri','đầu, tóc','Danh từ','머리를 감아요.','Tôi gội đầu.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(328,'topik1_128',1,'먹다','meok-da','ăn','Động từ','밥을 먹어요.','Tôi ăn cơm.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(329,'topik1_129',1,'메뉴','me-nyu','thực đơn','Danh từ','메뉴를 보여 주세요.','Hãy cho tôi xem thực đơn.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(330,'topik1_130',1,'며칠','myeo-chil','mấy ngày, ngày mấy','Danh từ','며칠이에요?','Hôm nay là ngày mấy?','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(331,'topik1_131',1,'명','myeong','người (đơn vị đếm)','Danh từ','세 명이에요.','Có ba người.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(332,'topik1_132',1,'모르다','mo-reu-da','không biết','Động từ','저는 몰라요.','Tôi không biết.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(333,'topik1_133',1,'모자','mo-ja','mũ, nón','Danh từ','모자를 써요.','Tôi đội mũ.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(334,'topik1_134',1,'목요일','mo-gyo-il','thứ Năm','Danh từ','목요일에 만나요.','Chúng ta gặp nhau vào thứ Năm.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(335,'topik1_135',1,'무겁다','mu-geop-da','nặng','Tính từ','가방이 무거워요.','Cặp nặng.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(336,'topik1_136',1,'무엇','mu-eot','cái gì','Đại từ','무엇을 먹어요?','Bạn ăn gì?','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(337,'topik1_137',1,'물','mul','nước','Danh từ','물을 주세요.','Cho tôi nước.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(338,'topik1_138',1,'물건','mul-geon','đồ vật','Danh từ','물건을 사요.','Tôi mua đồ.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(339,'topik1_139',1,'미안하다','mi-an-ha-da','xin lỗi','Tính từ','미안해요.','Xin lỗi.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(340,'topik1_140',1,'밑','mit','dưới, phía dưới','Danh từ','책상 밑에 있어요.','Nó ở dưới bàn.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(341,'topik1_141',1,'바다','ba-da','biển','Danh từ','바다를 봐요.','Tôi ngắm biển.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(342,'topik1_142',1,'바쁘다','ba-ppeu-da','bận rộn','Tính từ','요즘 바빠요.','Dạo này tôi bận.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(343,'topik1_143',1,'밥','bap','cơm','Danh từ','밥을 먹어요.','Tôi ăn cơm.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(344,'topik1_144',1,'방','bang','phòng','Danh từ','방이 커요.','Phòng rộng.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(345,'topik1_145',1,'배','bae','quả lê; bụng; thuyền','Danh từ','배가 아파요.','Bụng tôi đau.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(346,'topik1_146',1,'배우다','bae-u-da','học','Động từ','한국어를 배워요.','Tôi học tiếng Hàn.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(347,'topik1_147',1,'백화점','baek-hwa-jeom','trung tâm thương mại','Danh từ','백화점에서 쇼핑해요.','Tôi mua sắm ở trung tâm thương mại.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(348,'topik1_148',1,'버스','beo-seu','xe buýt','Danh từ','버스를 타요.','Tôi đi xe buýt.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(349,'topik1_149',1,'번','beon','số, lần','Danh từ','일 번이에요.','Là số một.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(350,'topik1_150',1,'벌써','beol-sseo','đã rồi','Phó từ','벌써 왔어요?','Đã đến rồi à?','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(351,'topik1_151',1,'병','byeong','chai, lọ','Danh từ','물 한 병을 사요.','Tôi mua một chai nước.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(352,'topik1_152',1,'병원','byeong-won','bệnh viện','Danh từ','병원에 가요.','Tôi đi bệnh viện.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(353,'topik1_153',1,'보다','bo-da','xem, nhìn','Động từ','영화를 봐요.','Tôi xem phim.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(354,'topik1_154',1,'부모','bu-mo','bố mẹ, cha mẹ','Danh từ','부모님을 사랑해요.','Tôi yêu bố mẹ.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(355,'topik1_155',1,'부산','bu-san','Busan','Danh từ','부산에 가요.','Tôi đi Busan.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(356,'topik1_156',1,'불고기','bul-go-gi','thịt nướng','Danh từ','불고기를 먹어요.','Tôi ăn thịt nướng.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(357,'topik1_157',1,'비','bi','mưa','Danh từ','비가 와요.','Trời mưa.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(358,'topik1_158',1,'비싸다','bi-ssa-da','đắt','Tính từ','가방이 비싸요.','Cái túi đắt.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(359,'topik1_159',1,'비행기','bi-haeng-gi','máy bay','Danh từ','비행기를 타요.','Tôi đi máy bay.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(360,'topik1_160',1,'빌리다','bil-li-da','mượn, vay','Động từ','책을 빌려요.','Tôi mượn sách.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(361,'topik1_161',1,'빠르다','ppa-reu-da','nhanh','Tính từ','버스가 빨라요.','Xe buýt nhanh.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(362,'topik1_162',1,'빵','ppang','bánh mì','Danh từ','빵을 좋아해요.','Tôi thích bánh mì.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(363,'topik1_163',1,'뿐','ppun','chỉ, thôi','Trợ từ','물만 마셔요.','Tôi chỉ uống nước thôi.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(364,'topik1_164',1,'사과','sa-gwa','quả táo; lời xin lỗi','Danh từ','사과를 먹어요.','Tôi ăn táo.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(365,'topik1_165',1,'사다','sa-da','mua','Động từ','옷을 사요.','Tôi mua quần áo.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(366,'topik1_166',1,'사람','sa-ram','người','Danh từ','사람이 많아요.','Có nhiều người.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(367,'topik1_167',1,'사랑하다','sa-rang-ha-da','yêu','Động từ','부모님을 사랑해요.','Tôi yêu bố mẹ.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(368,'topik1_168',1,'사무실','sa-mu-sil','văn phòng','Danh từ','사무실에서 일해요.','Tôi làm việc ở văn phòng.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(369,'topik1_169',1,'산','san','núi','Danh từ','산에 가요.','Tôi đi lên núi.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(370,'topik1_170',1,'살다','sal-da','sống','Động từ','서울에서 살아요.','Tôi sống ở Seoul.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(371,'topik1_171',1,'삼','sam','số ba','Số từ','삼 층이에요.','Là tầng ba.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(372,'topik1_172',1,'새','sae','chim','Danh từ','새가 날아요.','Chim bay.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(373,'topik1_173',1,'색','saek','màu sắc','Danh từ','무슨 색을 좋아해요?','Bạn thích màu gì?','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(374,'topik1_174',1,'생일','saeng-il','sinh nhật','Danh từ','생일을 축하해요.','Chúc mừng sinh nhật.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(375,'topik1_175',1,'서울','seo-ul','Seoul','Danh từ','서울에 살아요.','Tôi sống ở Seoul.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(376,'topik1_176',1,'선물','seon-mul','quà tặng','Danh từ','선물을 줘요.','Tôi tặng quà.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(377,'topik1_177',1,'선생님','seon-saeng-nim','giáo viên','Danh từ','선생님이에요.','Tôi là giáo viên.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(378,'topik1_178',1,'설날','seol-nal','Tết Nguyên Đán','Danh từ','설날에 떡국을 먹어요.','Vào Tết tôi ăn canh bánh gạo.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(379,'topik1_179',1,'세수하다','se-su-ha-da','rửa mặt','Động từ','아침에 세수해요.','Buổi sáng tôi rửa mặt.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(380,'topik1_180',1,'소금','so-geum','muối','Danh từ','소금을 넣어요.','Tôi cho muối vào.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(381,'topik1_181',1,'소포','so-po','bưu kiện','Danh từ','소포를 보내요.','Tôi gửi bưu kiện.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(382,'topik1_182',1,'속','sok','bên trong','Danh từ','가방 속에 있어요.','Nó ở trong túi.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(383,'topik1_183',1,'손','son','tay','Danh từ','손을 씻어요.','Tôi rửa tay.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(384,'topik1_184',1,'수업','su-eop','buổi học, tiết học','Danh từ','수업이 있어요.','Tôi có tiết học.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(385,'topik1_185',1,'숙제','suk-je','bài tập về nhà','Danh từ','숙제를 해요.','Tôi làm bài tập.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(386,'topik1_186',1,'쉬다','swi-da','nghỉ ngơi','Động từ','집에서 쉬어요.','Tôi nghỉ ngơi ở nhà.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(387,'topik1_187',1,'쓰다','sseu-da','viết; đội (mũ); đắng','Động từ','편지를 써요.','Tôi viết thư.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(388,'topik1_188',1,'씨','ssi','hạt giống; ngài/cô (kính ngữ)','Danh từ','김 씨, 안녕하세요.','Anh Kim, xin chào.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(389,'topik1_189',1,'아기','a-gi','em bé','Danh từ','아기가 자요.','Em bé ngủ.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(390,'topik1_190',1,'아래','a-rae','dưới, phía dưới','Danh từ','아래에 있어요.','Nó ở dưới.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(391,'topik1_191',1,'아버지','a-beo-ji','bố, cha','Danh từ','아버지가 계세요.','Bố tôi có nhà.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(392,'topik1_192',1,'아침','a-chim','buổi sáng','Danh từ','아침에 일어나요.','Buổi sáng tôi thức dậy.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(393,'topik1_193',1,'안경','an-gyeong','kính (đeo mắt)','Danh từ','안경을 써요.','Tôi đeo kính.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(394,'topik1_194',1,'앉다','an-da','ngồi','Động từ','여기에 앉아요.','Tôi ngồi ở đây.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(395,'topik1_195',1,'알다','al-da','biết','Động từ','저는 알아요.','Tôi biết.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(396,'topik1_196',1,'약','yak','thuốc','Danh từ','약을 먹어요.','Tôi uống thuốc.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(397,'topik1_197',1,'약국','yak-guk','hiệu thuốc','Danh từ','약국에 가요.','Tôi đi hiệu thuốc.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(398,'topik1_198',1,'어디','eo-di','ở đâu','Đại từ','어디에 있어요?','Nó ở đâu?','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(399,'topik1_199',1,'어머니','eo-meo-ni','mẹ','Danh từ','어머니가 요리해요.','Mẹ tôi nấu ăn.','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(400,'topik1_200',1,'어제','eo-je','hôm qua','Danh từ','어제 뭐 했어요?','Hôm qua bạn làm gì?','beginner',NULL,1,NULL,'2026-09-24 13:41:06','2026-09-24 13:41:06'),(401,'topik2_001',2,'가능하다','ga-neung-ha-da','có thể, khả thi','Tính từ','내일 가능해요?','Ngày mai có thể không?','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(402,'topik2_002',2,'가득','ga-deuk','đầy, tràn đầy','Phó từ','사람이 가득해요.','Người đông đầy.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(403,'topik2_003',2,'가사','ga-sa','lời bài hát; việc nhà','Danh từ','가사를 외워요.','Tôi học thuộc lời bài hát.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(404,'topik2_004',2,'가상','ga-sang','giả tưởng, ảo','Danh từ','가상 현실을 체험해요.','Tôi trải nghiệm thực tế ảo.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(405,'topik2_005',2,'가정','ga-jeong','gia đình; giả định','Danh từ','가정을 중요하게 생각해요.','Tôi coi trọng gia đình.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(406,'topik2_006',2,'각각','gak-gak','mỗi cái, từng cái','Phó từ','각각 다른 색이에요.','Mỗi cái có màu khác nhau.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(407,'topik2_007',2,'간판','gan-pan','biển hiệu','Danh từ','간판이 눈에 잘 띄어요.','Biển hiệu rất dễ thấy.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(408,'topik2_008',2,'갈등','gal-deung','mâu thuẫn, xung đột','Danh từ','친구와 갈등이 생겼어요.','Tôi nảy sinh mâu thuẫn với bạn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(409,'topik2_009',2,'감동','gam-dong','sự cảm động','Danh từ','그 영화는 감동을 줘요.','Bộ phim đó mang lại sự cảm động.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(410,'topik2_010',2,'감상','gam-sang','sự thưởng thức, cảm thụ','Danh từ','음악 감상을 좋아해요.','Tôi thích thưởng thức âm nhạc.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(411,'topik2_011',2,'강조하다','gang-jo-ha-da','nhấn mạnh','Động từ','건강을 강조했어요.','Anh ấy nhấn mạnh sức khỏe.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(412,'topik2_012',2,'개선하다','gae-seon-ha-da','cải thiện','Động từ','환경을 개선해야 해요.','Chúng ta phải cải thiện môi trường.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(413,'topik2_013',2,'개인','gae-in','cá nhân','Danh từ','개인 정보를 보호해요.','Tôi bảo vệ thông tin cá nhân.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(414,'topik2_014',2,'거래','geo-rae','giao dịch','Danh từ','인터넷으로 거래해요.','Tôi giao dịch qua internet.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(415,'topik2_015',2,'건강','geon-gang','sức khỏe','Danh từ','건강이 가장 중요해요.','Sức khỏe là quan trọng nhất.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(416,'topik2_016',2,'걱정','geok-jeong','nỗi lo lắng','Danh từ','걱정이 많아요.','Tôi có nhiều nỗi lo.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(417,'topik2_017',2,'검사','geom-sa','kiểm tra, xét nghiệm','Danh từ','건강 검사를 받아요.','Tôi đi kiểm tra sức khỏe.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(418,'topik2_018',2,'결과','gyeol-gwa','kết quả','Danh từ','시험 결과를 기다려요.','Tôi chờ kết quả thi.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(419,'topik2_019',2,'경제','gyeong-je','kinh tế','Danh từ','경제가 어려워요.','Nền kinh tế khó khăn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(420,'topik2_020',2,'경쟁','gyeong-jaeng','cạnh tranh','Danh từ','경쟁이 심해요.','Sự cạnh tranh gay gắt.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(421,'topik2_021',2,'계획','gye-hoek','kế hoạch','Danh từ','여행 계획을 세워요.','Tôi lập kế hoạch du lịch.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(422,'topik2_022',2,'고민','go-min','nỗi trăn trở, lo nghĩ','Danh từ','취직 고민이 있어요.','Tôi có nỗi lo về việc làm.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(423,'topik2_023',2,'고장','go-jang','sự hỏng hóc','Danh từ','컴퓨터가 고장 났어요.','Máy tính bị hỏng rồi.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(424,'topik2_024',2,'관계','gwan-gye','mối quan hệ','Danh từ','인간 관계가 중요해요.','Quan hệ giữa người với người rất quan trọng.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(425,'topik2_025',2,'관광','gwan-gwang','du lịch, tham quan','Danh từ','관광 명소를 방문해요.','Tôi tham quan danh lam thắng cảnh.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(426,'topik2_026',2,'교육','gyo-yuk','giáo dục','Danh từ','교육의 질을 높여요.','Nâng cao chất lượng giáo dục.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(427,'topik2_027',2,'교환','gyo-hwan','trao đổi','Danh từ','옷을 교환하고 싶어요.','Tôi muốn đổi áo.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(428,'topik2_028',2,'구경','gu-gyeong','sự ngắm, tham quan','Danh từ','시장을 구경해요.','Tôi dạo chợ.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(429,'topik2_029',2,'구체적','gu-che-jeok','cụ thể','Tính từ','구체적으로 설명해 주세요.','Hãy giải thích cụ thể.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(430,'topik2_030',2,'국제','guk-je','quốc tế','Danh từ','국제 회의에 참석해요.','Tôi tham dự hội nghị quốc tế.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(431,'topik2_031',2,'규칙','gyu-chik','quy tắc','Danh từ','규칙을 지켜야 해요.','Phải tuân thủ quy tắc.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(432,'topik2_032',2,'그만두다','geu-man-du-da','nghỉ, từ bỏ','Động từ','회사를 그만뒀어요.','Tôi đã nghỉ việc công ty.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(433,'topik2_033',2,'극복하다','geuk-bok-ha-da','vượt qua, khắc phục','Động từ','어려움을 극복했어요.','Tôi đã vượt qua khó khăn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(434,'topik2_034',2,'기념','gi-nyeom','kỷ niệm','Danh từ','기념 사진을 찍어요.','Tôi chụp ảnh kỷ niệm.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(435,'topik2_035',2,'기술','gi-sul','kỹ thuật, công nghệ','Danh từ','기술이 발달했어요.','Kỹ thuật đã phát triển.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(436,'topik2_036',2,'기억','gi-eok','ký ức, sự ghi nhớ','Danh từ','어릴 적 기억이 나요.','Tôi nhớ lại ký ức thời thơ ấu.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(437,'topik2_037',2,'기후','gi-hu','khí hậu','Danh từ','기후가 변하고 있어요.','Khí hậu đang thay đổi.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(438,'topik2_038',2,'깨끗이','kkae-kkeu-si','sạch sẽ','Phó từ','방을 깨끗이 청소해요.','Tôi dọn phòng sạch sẽ.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(439,'topik2_039',2,'꼼꼼하다','kkom-kkom-ha-da','tỉ mỉ, kỹ lưỡng','Tính từ','그는 일을 꼼꼼하게 해요.','Anh ấy làm việc tỉ mỉ.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(440,'topik2_040',2,'나누다','na-nu-da','chia sẻ, chia','Động từ','친구와 이야기를 나눠요.','Tôi chia sẻ câu chuyện với bạn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(441,'topik2_041',2,'낙서','nak-seo','hình vẽ bậy, graffiti','Danh từ','벽에 낙서를 하면 안 돼요.','Không được vẽ bậy lên tường.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(442,'topik2_042',2,'난방','nan-bang','sưởi ấm','Danh từ','난방을 켜 주세요.','Hãy bật sưởi.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(443,'topik2_043',2,'날짜','nal-jja','ngày tháng','Danh từ','날짜를 정했어요.','Tôi đã ấn định ngày.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(444,'topik2_044',2,'낭비','nang-bi','sự lãng phí','Danh từ','시간 낭비예요.','Thật là lãng phí thời gian.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(445,'topik2_045',2,'내용','nae-yong','nội dung','Danh từ','책 내용이 어려워요.','Nội dung sách khó.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(446,'topik2_046',2,'냄새','naem-sae','mùi','Danh từ','좋은 냄새가 나요.','Có mùi thơm.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(447,'topik2_047',2,'노력','no-ryeok','nỗ lực','Danh từ','노력하면 될 거예요.','Nếu nỗ lực sẽ làm được.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(448,'topik2_048',2,'논문','non-mun','luận văn','Danh từ','논문을 쓰고 있어요.','Tôi đang viết luận văn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(449,'topik2_049',2,'농사','nong-sa','nông nghiệp, việc đồng áng','Danh từ','부모님이 농사를 지어요.','Bố mẹ tôi làm nông.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(450,'topik2_050',2,'능력','neung-ryeok','năng lực','Danh từ','능력을 키워야 해요.','Phải phát triển năng lực.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(451,'topik2_051',2,'다양하다','da-yang-ha-da','đa dạng','Tính từ','음식이 다양해요.','Món ăn đa dạng.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(452,'topik2_052',2,'다음','da-eum','tiếp theo, sau','Danh từ','다음 주에 만나요.','Tuần sau gặp nhé.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(453,'topik2_053',2,'단점','dan-jeom','nhược điểm','Danh từ','단점을 고치려고 해요.','Tôi cố sửa nhược điểm.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(454,'topik2_054',2,'달다','dal-da','ngọt','Tính từ','이 과자는 너무 달아요.','Bánh này quá ngọt.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(455,'topik2_055',2,'담배','dam-bae','thuốc lá','Danh từ','담배를 끊었어요.','Tôi đã bỏ thuốc lá.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(456,'topik2_056',2,'답장','dap-jang','thư trả lời, hồi âm','Danh từ','답장을 빨리 보내 주세요.','Hãy gửi hồi âm sớm.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(457,'topik2_057',2,'당연하다','dang-yeon-ha-da','đương nhiên, tất nhiên','Tính từ','그건 당연한 일이에요.','Đó là việc đương nhiên.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(458,'topik2_058',2,'대출','dae-chul','vay tiền','Danh từ','은행에서 대출을 받았어요.','Tôi đã vay tiền ở ngân hàng.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(459,'topik2_059',2,'대회','dae-hoe','đại hội, cuộc thi','Danh từ','말하기 대회에 나가요.','Tôi tham gia cuộc thi nói.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(460,'topik2_060',2,'더욱','deo-uk','càng, hơn nữa','Phó từ','더욱 열심히 공부해요.','Tôi càng học chăm chỉ hơn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(461,'topik2_061',2,'도전','do-jeon','sự thử thách','Danh từ','새로운 일에 도전해요.','Tôi thử thách với việc mới.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(462,'topik2_062',2,'도착','do-chak','sự đến, sự tới','Danh từ','곧 도착할 예정이에요.','Tôi dự định sẽ đến ngay.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(463,'topik2_063',2,'독서','dok-seo','đọc sách','Danh từ','독서를 취미로 해요.','Tôi lấy đọc sách làm sở thích.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(464,'topik2_064',2,'동기','dong-gi','động lực, động cơ','Danh từ','공부할 동기가 생겼어요.','Tôi có động lực học tập.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(465,'topik2_065',2,'동아리','dong-a-ri','câu lạc bộ','Danh từ','동아리에 가입했어요.','Tôi đã tham gia câu lạc bộ.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(466,'topik2_066',2,'동의하다','dong-ui-ha-da','đồng ý','Động từ','그 의견에 동의해요.','Tôi đồng ý với ý kiến đó.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(467,'topik2_067',2,'두껍다','du-kkeop-da','dày','Tính từ','책이 두꺼워요.','Sách dày.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(468,'topik2_068',2,'뒤','dwi','phía sau','Danh từ','집 뒤에 정원이 있어요.','Sau nhà có vườn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(469,'topik2_069',2,'등록','deung-rok','sự đăng ký','Danh từ','수강 신청을 등록했어요.','Tôi đã đăng ký môn học.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(470,'topik2_070',2,'디자인','di-ja-in','thiết kế','Danh từ','디자인이 예뻐요.','Thiết kế đẹp.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(471,'topik2_071',2,'때','ttae','lúc, khi; bụi bẩn','Danh từ','어릴 때를 기억해요.','Tôi nhớ thời thơ bé.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(472,'topik2_072',2,'떠나다','tteo-na-da','rời đi, khởi hành','Động từ','내일 여행을 떠나요.','Ngày mai tôi khởi hành đi du lịch.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(473,'topik2_073',2,'마련하다','ma-ryeon-ha-da','chuẩn bị, sắm sửa','Động từ','선물을 마련했어요.','Tôi đã chuẩn bị quà.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(474,'topik2_074',2,'만족하다','man-jok-ha-da','hài lòng','Tính từ','결과에 만족해요.','Tôi hài lòng với kết quả.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(475,'topik2_075',2,'매력','mae-ryeok','sức hấp dẫn','Danh từ','그 도시는 매력이 있어요.','Thành phố đó có sức hấp dẫn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(476,'topik2_076',2,'머물다','meo-mul-da','lưu lại, ở lại','Động từ','호텔에 머물렀어요.','Tôi đã ở lại khách sạn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(477,'topik2_077',2,'면접','myeon-jeop','phỏng vấn','Danh từ','면접을 잘 봤어요.','Tôi đã phỏng vấn tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(478,'topik2_078',2,'모습','mo-seup','hình dáng, dáng vẻ','Danh từ','웃는 모습이 예뻐요.','Dáng vẻ cười rất đẹp.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(479,'topik2_079',2,'목적','mok-jeok','mục đích','Danh từ','여행의 목적이 뭐예요?','Mục đích chuyến đi là gì?','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(480,'topik2_080',2,'무료','mu-ryo','miễn phí','Danh từ','입장료가 무료예요.','Vé vào cửa miễn phí.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(481,'topik2_081',2,'문제점','mun-je-jeom','vấn đề, điểm vấn đề','Danh từ','문제점을 찾아야 해요.','Phải tìm ra vấn đề.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(482,'topik2_082',2,'문화','mun-hwa','văn hóa','Danh từ','한국 문화를 배워요.','Tôi học văn hóa Hàn Quốc.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(483,'topik2_083',2,'발견하다','bal-gyeon-ha-da','phát hiện','Động từ','새로운 사실을 발견했어요.','Tôi đã phát hiện sự thật mới.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(484,'topik2_084',2,'발달','bal-dal','sự phát triển','Danh từ','과학이 발달했어요.','Khoa học đã phát triển.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(485,'topik2_085',2,'발음','bal-eum','phát âm','Danh từ','발음이 정확해요.','Phát âm chính xác.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(486,'topik2_086',2,'방법','bang-beop','phương pháp, cách','Danh từ','좋은 방법이 있어요.','Có cách hay.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(487,'topik2_087',2,'방송','bang-song','phát sóng','Danh từ','방송을 보고 있어요.','Tôi đang xem chương trình phát sóng.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(488,'topik2_088',2,'배달','bae-dal','sự giao hàng','Danh từ','음식을 배달시켜요.','Tôi đặt giao đồ ăn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(489,'topik2_089',2,'배경','bae-gyeong','bối cảnh','Danh từ','배경이 아름다워요.','Bối cảnh đẹp.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(490,'topik2_090',2,'번역','beon-yeok','dịch thuật','Danh từ','번역을 잘해요.','Tôi dịch tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(491,'topik2_091',2,'벌금','beol-geum','tiền phạt','Danh từ','벌금을 내야 해요.','Phải nộp tiền phạt.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(492,'topik2_092',2,'변화','byeon-hwa','sự thay đổi','Danh từ','날씨가 변화가 심해요.','Thời tiết thay đổi thất thường.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(493,'topik2_093',2,'보고서','bo-go-seo','báo cáo','Danh từ','보고서를 제출했어요.','Tôi đã nộp báo cáo.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(494,'topik2_094',2,'보관','bo-gwan','sự bảo quản, giữ gìn','Danh từ','귀중품을 보관해요.','Tôi bảo quản đồ quý.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(495,'topik2_095',2,'보험','bo-heom','bảo hiểm','Danh từ','건강 보험에 가입했어요.','Tôi đã tham gia bảo hiểm sức khỏe.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(496,'topik2_096',2,'복잡하다','bok-jap-ha-da','phức tạp, đông đúc','Tính từ','길이 복잡해요.','Đường đông đúc.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(497,'topik2_097',2,'본격적','bon-gyeok-jeok','mang tính chính thức, toàn diện','Tính từ','본격적으로 시작했어요.','Chúng tôi đã bắt đầu một cách toàn diện.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(498,'topik2_098',2,'봉사','bong-sa','tình nguyện, phục vụ','Danh từ','봉사 활동을 해요.','Tôi làm hoạt động tình nguyện.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(499,'topik2_099',2,'부담','bu-dam','gánh nặng, sự đảm nhận','Danh từ','비용이 부담이 돼요.','Chi phí là gánh nặng.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(500,'topik2_100',2,'부족하다','bu-jok-ha-da','thiếu, không đủ','Tính từ','시간이 부족해요.','Thời gian không đủ.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(501,'topik2_101',2,'분위기','bun-wi-gi','bầu không khí','Danh từ','분위기가 좋아요.','Bầu không khí tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(502,'topik2_102',2,'불편하다','bul-pyeon-ha-da','bất tiện, không thoải mái','Tính từ','여기가 불편해요.','Chỗ này không thoải mái.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(503,'topik2_103',2,'비교하다','bi-gyo-ha-da','so sánh','Động từ','가격을 비교해 봐요.','Hãy so sánh giá.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(504,'topik2_104',2,'비상','bi-sang','tình trạng khẩn cấp','Danh từ','비상 연락처를 알려 주세요.','Hãy cho tôi số liên lạc khẩn cấp.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(505,'topik2_105',2,'비용','bi-yong','chi phí','Danh từ','비용이 많이 들어요.','Chi phí tốn nhiều.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(506,'topik2_106',2,'빌딩','bil-ding','tòa nhà','Danh từ','빌딩이 높아요.','Tòa nhà cao.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(507,'topik2_107',2,'뿌리','ppu-ri','rễ cây, nguồn gốc','Danh từ','나무 뿌리가 깊어요.','Rễ cây ăn sâu.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(508,'topik2_108',2,'사고','sa-go','tai nạn, sự cố','Danh từ','교통사고가 났어요.','Đã xảy ra tai nạn giao thông.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(509,'topik2_109',2,'사례','sa-rye','ví dụ, trường hợp','Danh từ','좋은 사례를 소개해요.','Tôi giới thiệu ví dụ hay.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(510,'topik2_110',2,'사업','sa-eop','sự nghiệp kinh doanh','Danh từ','사업을 시작했어요.','Tôi đã bắt đầu kinh doanh.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(511,'topik2_111',2,'상대방','sang-dae-bang','đối phương','Danh từ','상대방의 의견을 들어요.','Tôi lắng nghe ý kiến đối phương.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(512,'topik2_112',2,'상상','sang-sang','sự tưởng tượng','Danh từ','상상을 많이 해요.','Tôi tưởng tượng nhiều.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(513,'topik2_113',2,'상태','sang-tae','trạng thái, tình trạng','Danh từ','건강 상태가 좋아요.','Tình trạng sức khỏe tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(514,'topik2_114',2,'새롭다','sae-rop-da','mới mẻ','Tính từ','새로운 경험이에요.','Đó là trải nghiệm mới mẻ.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(515,'topik2_115',2,'생각','saeng-gak','suy nghĩ','Danh từ','좋은 생각이에요.','Đó là suy nghĩ hay.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(516,'topik2_116',2,'생활','saeng-hwal','cuộc sống, sinh hoạt','Danh từ','한국 생활이 즐거워요.','Cuộc sống ở Hàn vui vẻ.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(517,'topik2_117',2,'서비스','seo-bi-seu','dịch vụ','Danh từ','서비스가 좋아요.','Dịch vụ tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(518,'topik2_118',2,'선택','seon-taek','sự lựa chọn','Danh từ','선택을 잘했어요.','Tôi đã lựa chọn tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(519,'topik2_119',2,'성격','seong-gyeok','tính cách','Danh từ','성격이 밝아요.','Tính cách vui vẻ.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(520,'topik2_120',2,'성공','seong-gong','thành công','Danh từ','성공을 기원해요.','Tôi cầu chúc thành công.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(521,'topik2_121',2,'세금','se-geum','thuế','Danh từ','세금을 내야 해요.','Phải nộp thuế.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(522,'topik2_122',2,'소개','so-gae','sự giới thiệu','Danh từ','자기소개를 해 보세요.','Hãy thử tự giới thiệu.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(523,'topik2_123',2,'소비','so-bi','tiêu dùng','Danh từ','과소비를 줄여야 해요.','Phải giảm tiêu dùng quá mức.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(524,'topik2_124',2,'속도','sok-do','tốc độ','Danh từ','속도를 줄여 주세요.','Hãy giảm tốc độ.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(525,'topik2_125',2,'수단','su-dan','phương tiện, biện pháp','Danh từ','교통수단을 이용해요.','Tôi sử dụng phương tiện giao thông.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(526,'topik2_126',2,'수입','su-ip','thu nhập; nhập khẩu','Danh từ','수입이 늘었어요.','Thu nhập tăng lên.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(527,'topik2_127',2,'순서','sun-seo','thứ tự','Danh từ','순서대로 줄을 서요.','Hãy xếp hàng theo thứ tự.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(528,'topik2_128',2,'습관','seup-gwan','thói quen','Danh từ','좋은 습관을 길러요.','Tôi rèn thói quen tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(529,'topik2_129',2,'승진','seung-jin','sự thăng chức','Danh từ','승진을 축하해요.','Chúc mừng thăng chức.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(530,'topik2_130',2,'시간','si-gan','thời gian','Danh từ','시간이 없어요.','Tôi không có thời gian.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(531,'topik2_131',2,'신문','sin-mun','báo','Danh từ','신문을 읽어요.','Tôi đọc báo.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(532,'topik2_132',2,'신청','sin-cheong','sự đăng ký, yêu cầu','Danh từ','수강 신청을 했어요.','Tôi đã đăng ký môn học.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(533,'topik2_133',2,'실력','sil-ryeok','thực lực, năng lực','Danh từ','실력이 늘었어요.','Thực lực đã tăng.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(534,'topik2_134',2,'실수','sil-su','sai sót, lỗi','Danh từ','실수를 했어요.','Tôi đã mắc lỗi.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(535,'topik2_135',2,'심하다','sim-ha-da','nghiêm trọng, gay gắt','Tính từ','교통 체증이 심해요.','Tắc đường nghiêm trọng.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(536,'topik2_136',2,'쓰레기','sseu-re-gi','rác','Danh từ','쓰레기를 버려요.','Tôi vứt rác.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(537,'topik2_137',2,'아이디어','a-i-di-eo','ý tưởng','Danh từ','좋은 아이디어가 있어요.','Tôi có ý tưởng hay.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(538,'topik2_138',2,'안내','an-nae','sự hướng dẫn','Danh từ','안내를 잘해 줘요.','Họ hướng dẫn tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(539,'topik2_139',2,'안전','an-jeon','an toàn','Danh từ','안전에 주의하세요.','Hãy chú ý an toàn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(540,'topik2_140',2,'약속','yak-sok','lời hứa, cuộc hẹn','Danh từ','약속을 지켜요.','Tôi giữ lời hứa.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(541,'topik2_141',2,'양보','yang-bo','sự nhường nhịn','Danh từ','자리를 양보했어요.','Tôi đã nhường chỗ.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(542,'topik2_142',2,'어렵다','eo-ryeop-da','khó','Tính từ','한국어가 어려워요.','Tiếng Hàn khó.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(543,'topik2_143',2,'어울리다','eo-ul-ri-da','hòa hợp, phù hợp','Động từ','옷이 잘 어울려요.','Quần áo rất hợp.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(544,'topik2_144',2,'언어','eon-eo','ngôn ngữ','Danh từ','외국어를 배워요.','Tôi học ngoại ngữ.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(545,'topik2_145',2,'업무','eop-mu','công việc, nghiệp vụ','Danh từ','업무가 많아요.','Công việc nhiều.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(546,'topik2_146',2,'여건','yeo-geon','điều kiện, hoàn cảnh','Danh từ','여건이 안 돼요.','Hoàn cảnh không cho phép.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(547,'topik2_147',2,'여유','yeo-yu','sự thư thái, dư dả','Danh từ','시간적 여유가 있어요.','Tôi có thời gian dư dả.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(548,'topik2_148',2,'연구','yeon-gu','nghiên cứu','Danh từ','연구를 계속해요.','Tôi tiếp tục nghiên cứu.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(549,'topik2_149',2,'연락','yeol-lak','sự liên lạc','Danh từ','연락을 주세요.','Hãy liên lạc cho tôi.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(550,'topik2_150',2,'연습','yeon-seup','sự luyện tập','Danh từ','매일 연습해요.','Tôi luyện tập mỗi ngày.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(551,'topik2_151',2,'열정','yeol-jeong','nhiệt huyết','Danh từ','열정이 대단해요.','Nhiệt huyết thật lớn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(552,'topik2_152',2,'영향','yeong-hyang','ảnh hưởng','Danh từ','큰 영향을 줬어요.','Đã gây ảnh hưởng lớn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(553,'topik2_153',2,'예약','ye-yak','sự đặt trước','Danh từ','식당을 예약했어요.','Tôi đã đặt nhà hàng.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(554,'topik2_154',2,'예절','ye-jeol','lễ nghi, phép tắc','Danh từ','예절을 지켜야 해요.','Phải giữ phép tắc.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(555,'topik2_155',2,'오염','o-yeom','sự ô nhiễm','Danh từ','환경 오염이 심각해요.','Ô nhiễm môi trường nghiêm trọng.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(556,'topik2_156',2,'요금','yo-geum','phí, cước','Danh từ','요금이 얼마예요?','Phí là bao nhiêu?','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(557,'topik2_157',2,'용돈','yong-don','tiền tiêu vặt','Danh từ','용돈을 아껴 써요.','Tôi tiết kiệm tiền tiêu vặt.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(558,'topik2_158',2,'우선','u-seon','trước tiên, ưu tiên','Phó từ','우선 이것부터 해요.','Trước tiên làm cái này đã.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(559,'topik2_159',2,'운동','un-dong','thể dục, vận động','Danh từ','매일 운동해요.','Tôi tập thể dục mỗi ngày.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(560,'topik2_160',2,'원인','won-in','nguyên nhân','Danh từ','원인을 찾아야 해요.','Phải tìm ra nguyên nhân.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(561,'topik2_161',2,'위험하다','wi-heom-ha-da','nguy hiểm','Tính từ','여기는 위험해요.','Chỗ này nguy hiểm.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(562,'topik2_162',2,'의견','ui-gyeon','ý kiến','Danh từ','의견을 말해 보세요.','Hãy nêu ý kiến của bạn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(563,'topik2_163',2,'의미','ui-mi','ý nghĩa','Danh từ','의미가 깊어요.','Ý nghĩa sâu sắc.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(564,'topik2_164',2,'이용하다','i-yong-ha-da','sử dụng, lợi dụng','Động từ','도서관을 이용해요.','Tôi sử dụng thư viện.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(565,'topik2_165',2,'이해하다','i-hae-ha-da','hiểu','Động từ','이해가 잘 돼요.','Tôi hiểu rõ.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(566,'topik2_166',2,'인간','in-gan','con người','Danh từ','인간은 사회적 동물이에요.','Con người là động vật xã hội.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(567,'topik2_167',2,'인기','in-gi','sự được yêu thích','Danh từ','인기가 많아요.','Rất được yêu thích.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(568,'topik2_168',2,'인터넷','in-teo-net','internet','Danh từ','인터넷으로 검색해요.','Tôi tìm kiếm trên internet.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(569,'topik2_169',2,'일정','il-jeong','lịch trình','Danh từ','일정이 어떻게 돼요?','Lịch trình thế nào?','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(570,'topik2_170',2,'입장','ip-jang','sự vào cửa; lập trường','Danh từ','입장을 밝혀 주세요.','Hãy nêu rõ lập trường.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(571,'topik2_171',2,'자료','ja-ryo','tài liệu','Danh từ','자료를 준비해요.','Tôi chuẩn bị tài liệu.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(572,'topik2_172',2,'자연','ja-yeon','tự nhiên','Danh từ','자연을 보호해요.','Tôi bảo vệ thiên nhiên.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(573,'topik2_173',2,'자유','ja-yu','tự do','Danh từ','자유를 원해요.','Tôi muốn tự do.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(574,'topik2_174',2,'작품','jak-pum','tác phẩm','Danh từ','좋은 작품이에요.','Đó là tác phẩm hay.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(575,'topik2_175',2,'장점','jang-jeom','ưu điểm','Danh từ','장점이 많아요.','Có nhiều ưu điểm.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(576,'topik2_176',2,'재미있다','jae-mi-it-da','thú vị','Tính từ','영화가 재미있어요.','Phim thú vị.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(577,'topik2_177',2,'적극적','jeok-geuk-jeok','tích cực','Tính từ','적극적으로 참여해요.','Tôi tham gia tích cực.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(578,'topik2_178',2,'전문가','jeon-mun-ga','chuyên gia','Danh từ','전문가에게 물어봐요.','Tôi hỏi chuyên gia.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(579,'topik2_179',2,'전통','jeon-tong','truyền thống','Danh từ','전통 문화를 체험해요.','Tôi trải nghiệm văn hóa truyền thống.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(580,'topik2_180',2,'절약','jeol-yak','sự tiết kiệm','Danh từ','전기를 절약해요.','Tôi tiết kiệm điện.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(581,'topik2_181',2,'점점','jeom-jeom','dần dần','Phó từ','점점 따뜻해져요.','Trời dần ấm lên.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(582,'topik2_182',2,'정도','jeong-do','mức độ','Danh từ','어느 정도예요?','Mức độ thế nào?','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(583,'topik2_183',2,'정리','jeong-ri','sự sắp xếp, dọn dẹp','Danh từ','방을 정리해요.','Tôi dọn phòng.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(584,'topik2_184',2,'정보','jeong-bo','thông tin','Danh từ','정보를 알려 주세요.','Hãy cho tôi thông tin.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(585,'topik2_185',2,'제출','je-chul','sự nộp, trình','Danh từ','과제를 제출했어요.','Tôi đã nộp bài tập.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(586,'topik2_186',2,'조건','jo-geon','điều kiện','Danh từ','조건이 맞아요.','Điều kiện phù hợp.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(587,'topik2_187',2,'조사','jo-sa','sự điều tra','Danh từ','설문 조사를 해요.','Tôi làm khảo sát.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(588,'topik2_188',2,'존경','jon-gyeong','sự kính trọng','Danh từ','부모님을 존경해요.','Tôi kính trọng bố mẹ.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(589,'topik2_189',2,'종류','jong-ryu','chủng loại','Danh từ','종류가 다양해요.','Chủng loại đa dạng.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(590,'topik2_190',2,'주말','ju-mal','cuối tuần','Danh từ','주말에 쉬어요.','Tôi nghỉ vào cuối tuần.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(591,'topik2_191',2,'주변','ju-byeon','xung quanh, vùng lân cận','Danh từ','주변을 둘러봐요.','Tôi nhìn quanh.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(592,'topik2_192',2,'주제','ju-je','chủ đề','Danh từ','주제가 재미있어요.','Chủ đề thú vị.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(593,'topik2_193',2,'준비','jun-bi','sự chuẩn bị','Danh từ','여행 준비를 해요.','Tôi chuẩn bị cho chuyến đi.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(594,'topik2_194',2,'중요하다','jung-yo-ha-da','quan trọng','Tính từ','건강이 중요해요.','Sức khỏe quan trọng.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(595,'topik2_195',2,'즐기다','jeul-gi-da','thưởng thức, tận hưởng','Động từ','음악을 즐겨요.','Tôi thưởng thức âm nhạc.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(596,'topik2_196',2,'증가','jeung-ga','sự tăng lên','Danh từ','인구가 증가해요.','Dân số tăng lên.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(597,'topik2_197',2,'지식','ji-sik','tri thức','Danh từ','지식을 쌓아요.','Tôi tích lũy tri thức.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(598,'topik2_198',2,'진짜','jin-jja','thật, thực sự','Phó từ','진짜 맛있어요.','Thật sự ngon.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(599,'topik2_199',2,'질문','jil-mun','câu hỏi','Danh từ','질문이 있어요.','Tôi có câu hỏi.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(600,'topik2_200',2,'집중','jip-jung','sự tập trung','Danh từ','공부에 집중해요.','Tôi tập trung vào học.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(601,'topik2_201',2,'차이','cha-i','sự khác biệt','Danh từ','차이가 커요.','Sự khác biệt lớn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(602,'topik2_202',2,'참석','cham-seok','sự tham dự','Danh từ','회의에 참석해요.','Tôi tham dự cuộc họp.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(603,'topik2_203',2,'창의적','chang-ui-jeok','sáng tạo','Tính từ','창의적인 생각이 필요해요.','Cần suy nghĩ sáng tạo.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(604,'topik2_204',2,'처리','cheo-ri','sự xử lý','Danh từ','업무를 처리해요.','Tôi xử lý công việc.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(605,'topik2_205',2,'체험','che-heom','sự trải nghiệm','Danh từ','농촌 체험을 해요.','Tôi trải nghiệm nông thôn.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(606,'topik2_206',2,'초대','cho-dae','sự mời','Danh từ','초대를 받았어요.','Tôi đã được mời.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(607,'topik2_207',2,'최선','choe-seon','điều tốt nhất, cố gắng hết sức','Danh từ','최선을 다해요.','Tôi cố gắng hết sức.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(608,'topik2_208',2,'추천','chu-cheon','sự đề xuất, gợi ý','Danh từ','좋은 책을 추천해요.','Tôi gợi ý cuốn sách hay.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(609,'topik2_209',2,'취미','chwi-mi','sở thích','Danh từ','취미가 뭐예요?','Sở thích của bạn là gì?','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(610,'topik2_210',2,'치료','chi-ryo','sự điều trị','Danh từ','병원에서 치료를 받아요.','Tôi điều trị ở bệnh viện.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(611,'topik2_211',2,'친절하다','chin-jeol-ha-da','tốt bụng, thân thiện','Tính từ','직원이 친절해요.','Nhân viên thân thiện.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(612,'topik2_212',2,'특별하다','teuk-byeol-ha-da','đặc biệt','Tính từ','오늘은 특별한 날이에요.','Hôm nay là ngày đặc biệt.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(613,'topik2_213',2,'특징','teuk-jing','đặc điểm','Danh từ','특징을 설명해 주세요.','Hãy mô tả đặc điểm.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(614,'topik2_214',2,'판단','pan-dan','sự phán đoán','Danh từ','판단이 어려워요.','Khó phán đoán.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(615,'topik2_215',2,'편리하다','pyeon-ri-ha-da','tiện lợi','Tính từ','교통이 편리해요.','Giao thông tiện lợi.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(616,'topik2_216',2,'평가','pyeong-ga','sự đánh giá','Danh từ','평가를 받았어요.','Tôi đã nhận đánh giá.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(617,'topik2_217',2,'포기하다','po-gi-ha-da','từ bỏ','Động từ','꿈을 포기하지 마세요.','Đừng từ bỏ ước mơ.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(618,'topik2_218',2,'표현','pyo-hyeon','sự biểu đạt, diễn đạt','Danh từ','감정을 표현해요.','Tôi biểu đạt cảm xúc.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(619,'topik2_219',2,'필요하다','pil-yo-ha-da','cần thiết','Tính từ','휴식이 필요해요.','Cần nghỉ ngơi.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(620,'topik2_220',2,'환경','hwan-gyeong','môi trường','Danh từ','환경을 보호해요.','Tôi bảo vệ môi trường.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(621,'topik2_221',2,'효과','hyo-gwa','hiệu quả','Danh từ','효과가 좋아요.','Hiệu quả tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(622,'topik2_222',2,'훈련','hun-ryeon','sự huấn luyện','Danh từ','훈련을 받아요.','Tôi được huấn luyện.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(623,'topik2_223',2,'흥미','heung-mi','sự hứng thú','Danh từ','흥미를 느껴요.','Tôi cảm thấy hứng thú.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(624,'topik2_224',2,'희망','hui-mang','hy vọng','Danh từ','희망을 잃지 마세요.','Đừng đánh mất hy vọng.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(625,'topik2_225',2,'힘들다','him-deul-da','vất vả, mệt mỏi','Tính từ','일이 힘들어요.','Công việc vất vả.','intermediate',NULL,1,NULL,'2026-09-24 13:45:27','2026-09-24 13:45:27'),(626,'topik3_001',3,'가급적','ga-geup-jeok','nếu có thể, càng... càng tốt','Phó từ','가급적 일찍 오세요.','Nếu có thể hãy đến sớm.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(627,'topik3_002',3,'가치관','ga-chi-gwan','quan điểm giá trị','Danh từ','가치관이 사람마다 달라요.','Quan điểm giá trị mỗi người khác nhau.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(628,'topik3_003',3,'각오','gak-o','sự quyết tâm, chuẩn bị tinh thần','Danh từ','각오를 다졌어요.','Tôi đã quyết tâm.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(629,'topik3_004',3,'간섭','gan-seop','sự can thiệp','Danh từ','남의 일에 간섭하지 마세요.','Đừng can thiệp vào việc người khác.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(630,'topik3_005',3,'감각','gam-gak','giác quan, cảm giác','Danh từ','감각이 뛰어나요.','Giác quan rất nhạy bén.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(631,'topik3_006',3,'감소','gam-so','sự giảm sút','Danh từ','인구가 감소하고 있어요.','Dân số đang giảm.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(632,'topik3_007',3,'강력하다','gang-ryeok-ha-da','mạnh mẽ, quyết liệt','Tính từ','강력한 조치가 필요해요.','Cần biện pháp mạnh mẽ.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(633,'topik3_008',3,'개최','gae-choe','sự tổ chức, khai mạc','Danh từ','행사가 개최됐어요.','Sự kiện đã được tổ chức.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(634,'topik3_009',3,'거부하다','geo-bu-ha-da','từ chối','Động từ','제안을 거부했어요.','Tôi đã từ chối đề nghị.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(635,'topik3_010',3,'건조하다','geon-jo-ha-da','khô hanh, khô ráo','Tính từ','날씨가 건조해요.','Thời tiết khô hanh.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(636,'topik3_011',3,'겪다','gyeok-da','trải qua, nếm trải','Động từ','많은 어려움을 겪었어요.','Tôi đã trải qua nhiều khó khăn.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(637,'topik3_012',3,'결심','gyeol-sim','sự quyết tâm','Danh từ','결심을 굳혔어요.','Tôi đã củng cố quyết tâm.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(638,'topik3_013',3,'겸손','gyeom-son','sự khiêm tốn','Danh từ','그는 겸손한 사람이에요.','Anh ấy là người khiêm tốn.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(639,'topik3_014',3,'경향','gyeong-hyang','khuynh hướng, xu hướng','Danh từ','최근 경향을 살펴봐요.','Hãy xem xu hướng gần đây.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(640,'topik3_015',3,'고려하다','go-ryeo-ha-da','xem xét, cân nhắc','Động từ','상황을 고려해 주세요.','Hãy cân nhắc tình hình.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(641,'topik3_016',3,'공감','gong-gam','sự đồng cảm','Danh từ','그 이야기에 공감했어요.','Tôi đồng cảm với câu chuyện đó.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(642,'topik3_017',3,'공공','gong-gong','công cộng','Danh từ','공공 시설을 이용해요.','Tôi sử dụng cơ sở công cộng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(643,'topik3_018',3,'공정하다','gong-jeong-ha-da','công bằng','Tính từ','심사가 공정했어요.','Việc chấm thi công bằng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(644,'topik3_019',3,'과제','gwa-je','nhiệm vụ, đề tài','Danh từ','과제를 해결했어요.','Tôi đã giải quyết nhiệm vụ.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(645,'topik3_020',3,'관점','gwan-jeom','quan điểm','Danh từ','다른 관점에서 봐요.','Hãy nhìn từ quan điểm khác.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(646,'topik3_021',3,'구성','gu-seong','sự cấu thành, bố cục','Danh từ','구성이 잘 짜여 있어요.','Bố cục được sắp xếp tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(647,'topik3_022',3,'규모','gyu-mo','quy mô','Danh từ','규모가 커요.','Quy mô lớn.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(648,'topik3_023',3,'극단적','geuk-dan-jeok','cực đoan','Tính từ','극단적인 선택은 안 돼요.','Không được chọn lựa cực đoan.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(649,'topik3_024',3,'근본적','geun-bon-jeok','căn bản, cơ bản','Tính từ','근본적인 해결이 필요해요.','Cần giải pháp căn bản.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(650,'topik3_025',3,'기대','gi-dae','sự kỳ vọng','Danh từ','기대가 커요.','Kỳ vọng lớn.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(651,'topik3_026',3,'기여하다','gi-yeo-ha-da','đóng góp','Động từ','사회에 기여하고 싶어요.','Tôi muốn đóng góp cho xã hội.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(652,'topik3_027',3,'긍정적','geung-jeong-jeok','tích cực','Tính từ','긍정적으로 생각해요.','Tôi suy nghĩ tích cực.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(653,'topik3_028',3,'논리','non-ri','logic','Danh từ','논리가 부족해요.','Logic còn thiếu.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(654,'topik3_029',3,'다루다','da-ru-da','xử lý, giải quyết; cầm','Động từ','주제를 잘 다뤄요.','Tôi xử lý chủ đề tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(655,'topik3_030',3,'단계','dan-gye','giai đoạn, bước','Danh từ','단계별로 진행해요.','Tiến hành theo từng bước.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(656,'topik3_031',3,'당황하다','dang-hwang-ha-da','bối rối, lúng túng','Tính từ','그 말을 듣고 당황했어요.','Nghe câu đó tôi bối rối.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(657,'topik3_032',3,'대체로','dae-che-ro','đại thể, nhìn chung','Phó từ','대체로 만족해요.','Nhìn chung tôi hài lòng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(658,'topik3_033',3,'도입','do-ip','sự đưa vào, áp dụng','Danh từ','새 제도를 도입했어요.','Đã áp dụng chế độ mới.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(659,'topik3_034',3,'독특하다','dok-teuk-ha-da','độc đáo','Tính từ','독특한 아이디어예요.','Đó là ý tưởng độc đáo.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(660,'topik3_035',3,'동기','dong-gi','động cơ, động lực','Danh từ','동기가 분명해요.','Động cơ rõ ràng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(661,'topik3_036',3,'동향','dong-hyang','động thái, xu hướng','Danh từ','시장 동향을 파악해요.','Tôi nắm bắt động thái thị trường.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(662,'topik3_037',3,'두드러지다','du-deu-reo-ji-da','nổi bật, rõ rệt','Động từ','차이가 두드러져요.','Sự khác biệt nổi bật.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(663,'topik3_038',3,'뒤처지다','dwi-cheo-ji-da','tụt lại phía sau','Động từ','경쟁에서 뒤처졌어요.','Tôi đã tụt lại trong cuộc cạnh tranh.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(664,'topik3_039',3,'마련되다','ma-ryeon-doe-da','được chuẩn bị, được sắp xếp','Động từ','자리가 마련됐어요.','Chỗ ngồi đã được sắp xếp.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(665,'topik3_040',3,'매체','mae-che','phương tiện truyền thông','Danh từ','다양한 매체를 활용해요.','Tôi sử dụng nhiều phương tiện truyền thông.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(666,'topik3_041',3,'면밀하다','myeon-mil-ha-da','tỉ mỉ, kỹ càng','Tính từ','면밀한 검토가 필요해요.','Cần xem xét kỹ càng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(667,'topik3_042',3,'모색하다','mo-saek-ha-da','tìm kiếm, tìm tòi','Động từ','해결책을 모색해요.','Tôi tìm kiếm giải pháp.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(668,'topik3_043',3,'목표','mok-pyo','mục tiêu','Danh từ','목표를 세웠어요.','Tôi đã đặt mục tiêu.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(669,'topik3_044',3,'무관하다','mu-gwan-ha-da','không liên quan','Tính từ','그것과 무관해요.','Không liên quan đến điều đó.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(670,'topik3_045',3,'문학','mun-hak','văn học','Danh từ','문학을 전공해요.','Tôi học chuyên ngành văn học.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(671,'topik3_046',3,'반영','ban-yeong','sự phản ánh','Danh từ','의견을 반영했어요.','Tôi đã phản ánh ý kiến.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(672,'topik3_047',3,'발전','bal-jeon','sự phát triển','Danh từ','경제가 발전했어요.','Kinh tế đã phát triển.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(673,'topik3_048',3,'방안','bang-an','phương án','Danh từ','좋은 방안을 찾았어요.','Tôi tìm được phương án hay.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(674,'topik3_049',3,'번거롭다','beon-geo-rop-da','phiền phức, rườm rà','Tính từ','절차가 번거로워요.','Thủ tục rườm rà.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(675,'topik3_050',3,'보완','bo-wan','sự bổ sung, khắc phục','Danh từ','단점을 보완했어요.','Tôi đã bổ sung nhược điểm.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(676,'topik3_051',3,'부작용','bu-jak-yong','tác dụng phụ','Danh từ','약의 부작용이 있어요.','Thuốc có tác dụng phụ.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(677,'topik3_052',3,'분석','bun-seok','sự phân tích','Danh từ','자료를 분석해요.','Tôi phân tích tài liệu.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(678,'topik3_053',3,'불구하고','bul-gu-ha-go','bất chấp, mặc dù','Liên từ','어려움에도 불구하고 성공했어요.','Bất chấp khó khăn, tôi đã thành công.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(679,'topik3_054',3,'비판','bi-pan','sự phê bình, chỉ trích','Danh từ','비판을 받아들여요.','Tôi chấp nhận lời phê bình.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(680,'topik3_055',3,'사례','sa-rye','ví dụ, trường hợp','Danh từ','구체적인 사례를 들어요.','Tôi đưa ra ví dụ cụ thể.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(681,'topik3_056',3,'상당하다','sang-dang-ha-da','đáng kể, khá','Tính từ','시간이 상당히 걸려요.','Mất khá nhiều thời gian.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(682,'topik3_057',3,'상황','sang-hwang','tình huống, hoàn cảnh','Danh từ','상황이 어려워요.','Tình huống khó khăn.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(683,'topik3_058',3,'생산','saeng-san','sự sản xuất','Danh từ','생산량이 늘었어요.','Sản lượng tăng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(684,'topik3_059',3,'설득하다','seol-deuk-ha-da','thuyết phục','Động từ','친구를 설득했어요.','Tôi đã thuyết phục bạn.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(685,'topik3_060',3,'성과','seong-gwa','thành quả, kết quả','Danh từ','좋은 성과를 냈어요.','Tôi đã đạt thành quả tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(686,'topik3_061',3,'소극적','so-geuk-jeok','tiêu cực, thụ động','Tính từ','소극적인 태도를 버려요.','Hãy từ bỏ thái độ thụ động.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(687,'topik3_062',3,'수용하다','su-yong-ha-da','chấp nhận, tiếp nhận','Động từ','의견을 수용했어요.','Tôi đã tiếp nhận ý kiến.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(688,'topik3_063',3,'시도','si-do','sự thử, nỗ lực','Danh từ','새로운 시도를 해요.','Tôi thử điều mới.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(689,'topik3_064',3,'실현하다','sil-hyeon-ha-da','thực hiện, biến thành hiện thực','Động từ','꿈을 실현했어요.','Tôi đã thực hiện ước mơ.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(690,'topik3_065',3,'심각하다','sim-gak-ha-da','nghiêm trọng','Tính từ','문제가 심각해요.','Vấn đề nghiêm trọng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(691,'topik3_066',3,'쓸모','sseul-mo','công dụng, ích lợi','Danh từ','쓸모가 많아요.','Có nhiều công dụng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(692,'topik3_067',3,'암시','am-si','sự ám chỉ, gợi ý','Danh từ','암시를 주었어요.','Tôi đã đưa ra gợi ý.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(693,'topik3_068',3,'야기하다','ya-gi-ha-da','gây ra, dẫn đến','Động từ','논란을 야기했어요.','Đã gây ra tranh cãi.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(694,'topik3_069',3,'억지로','eok-ji-ro','miễn cưỡng, gượng ép','Phó từ','억지로 웃었어요.','Tôi gượng cười.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(695,'topik3_070',3,'역할','yeok-hal','vai trò','Danh từ','중요한 역할을 해요.','Tôi đóng vai trò quan trọng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(696,'topik3_071',3,'연관되다','yeon-gwan-doe-da','có liên quan','Động từ','그 사건과 연관돼 있어요.','Nó có liên quan đến vụ việc đó.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(697,'topik3_072',3,'예측','ye-cheuk','sự dự đoán','Danh từ','결과를 예측하기 어려워요.','Khó dự đoán kết quả.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(698,'topik3_073',3,'요구','yo-gu','yêu cầu, đòi hỏi','Danh từ','고객의 요구를 들어줘요.','Tôi đáp ứng yêu cầu khách hàng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(699,'topik3_074',3,'우려','u-ryeo','sự lo ngại','Danh từ','우려되는 점이 있어요.','Có điểm đáng lo ngại.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(700,'topik3_075',3,'원활하다','won-hwal-ha-da','thuận lợi, trôi chảy','Tính từ','소통이 원활해요.','Giao tiếp trôi chảy.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(701,'topik3_076',3,'유지하다','yu-ji-ha-da','duy trì, giữ gìn','Động từ','건강을 유지해요.','Tôi duy trì sức khỏe.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(702,'topik3_077',3,'의미하다','ui-mi-ha-da','có nghĩa là','Động từ','그것은 성공을 의미해요.','Điều đó có nghĩa là thành công.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(703,'topik3_078',3,'이룩하다','i-ruk-ha-da','đạt được, giành được','Động từ','큰 발전을 이룩했어요.','Đã đạt được phát triển lớn.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(704,'topik3_079',3,'인정하다','in-jeong-ha-da','thừa nhận, công nhận','Động từ','잘못을 인정했어요.','Tôi đã thừa nhận sai lầm.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(705,'topik3_080',3,'일반적','il-ban-jeok','phổ biến, thông thường','Tính từ','일반적인 생각이에요.','Đó là suy nghĩ phổ biến.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(706,'topik3_081',3,'입증하다','ip-jeung-ha-da','chứng minh','Động từ','사실을 입증했어요.','Tôi đã chứng minh sự thật.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(707,'topik3_082',3,'자발적','ja-bal-jeok','tự nguyện','Tính từ','자발적으로 참여했어요.','Tôi tự nguyện tham gia.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(708,'topik3_083',3,'잠재력','jam-jae-ryeok','tiềm năng','Danh từ','잠재력이 커요.','Tiềm năng lớn.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(709,'topik3_084',3,'적용','jeok-yong','sự áp dụng','Danh từ','규칙을 적용해요.','Tôi áp dụng quy tắc.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(710,'topik3_085',3,'전망','jeon-mang','triển vọng, dự báo','Danh từ','전망이 밝아요.','Triển vọng sáng sủa.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(711,'topik3_086',3,'절실하다','jeol-sil-ha-da','cấp thiết, thiết tha','Tính từ','도움이 절실해요.','Rất cần sự giúp đỡ.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(712,'topik3_087',3,'점차','jeom-cha','dần dần','Phó từ','점차 나아지고 있어요.','Đang dần tốt lên.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(713,'topik3_088',3,'제시하다','je-si-ha-da','đề xuất, trình bày','Động từ','방안을 제시했어요.','Tôi đã đề xuất phương án.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(714,'topik3_089',3,'조정','jo-jeong','sự điều chỉnh','Danh từ','일정을 조정했어요.','Tôi đã điều chỉnh lịch trình.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(715,'topik3_090',3,'종합적','jong-hap-jeok','tổng hợp','Tính từ','종합적으로 판단해요.','Tôi đánh giá một cách tổng hợp.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(716,'topik3_091',3,'주장','ju-jang','chủ trương, lập luận','Danh từ','그의 주장은 타당해요.','Lập luận của anh ấy hợp lý.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(717,'topik3_092',3,'중대하다','jung-dae-ha-da','trọng đại, hệ trọng','Tính từ','중대한 결정이에요.','Đó là quyết định hệ trọng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(718,'topik3_093',3,'지속적','ji-sok-jeok','liên tục, bền vững','Tính từ','지속적인 노력이 필요해요.','Cần nỗ lực liên tục.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(719,'topik3_094',3,'진행','jin-haeng','sự tiến hành','Danh từ','회의가 진행 중이에요.','Cuộc họp đang tiến hành.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(720,'topik3_095',3,'차별','cha-byeol','sự phân biệt đối xử','Danh từ','차별을 없애야 해요.','Phải xóa bỏ phân biệt đối xử.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(721,'topik3_096',3,'창출','chang-chul','sự tạo ra, sáng tạo','Danh từ','일자리를 창출해요.','Tôi tạo ra việc làm.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(722,'topik3_097',3,'추구하다','chu-gu-ha-da','theo đuổi','Động từ','행복을 추구해요.','Tôi theo đuổi hạnh phúc.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(723,'topik3_098',3,'축소','chuk-so','sự thu nhỏ, cắt giảm','Danh từ','규모를 축소했어요.','Tôi đã thu nhỏ quy mô.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(724,'topik3_099',3,'치열하다','chi-yeol-ha-da','khốc liệt, gay gắt','Tính từ','경쟁이 치열해요.','Cạnh tranh khốc liệt.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(725,'topik3_100',3,'탁월하다','tak-wol-ha-da','xuất sắc, trội','Tính từ','그는 능력이 탁월해요.','Anh ấy có năng lực xuất sắc.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(726,'topik3_101',3,'통계','tong-gye','thống kê','Danh từ','통계를 보면 알 수 있어요.','Nhìn thống kê là biết.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(727,'topik3_102',3,'통일','tong-il','sự thống nhất','Danh từ','의견을 통일했어요.','Chúng tôi đã thống nhất ý kiến.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(728,'topik3_103',3,'퇴보','toe-bo','sự thụt lùi, thoái bộ','Danh từ','기술이 퇴보했어요.','Kỹ thuật đã thụt lùi.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(729,'topik3_104',3,'특성','teuk-seong','đặc tính','Danh từ','특성을 파악해요.','Tôi nắm bắt đặc tính.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(730,'topik3_105',3,'판단하다','pan-dan-ha-da','phán đoán','Động từ','신중하게 판단해요.','Tôi phán đoán thận trọng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(731,'topik3_106',3,'편견','pyeon-gyeon','định kiến, thành kiến','Danh từ','편견을 버려요.','Hãy từ bỏ định kiến.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(732,'topik3_107',3,'포함하다','po-ham-ha-da','bao gồm','Động từ','모든 사람을 포함해요.','Bao gồm tất cả mọi người.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(733,'topik3_108',3,'표현하다','pyo-hyeon-ha-da','biểu đạt, diễn đạt','Động từ','감정을 표현해요.','Tôi biểu đạt cảm xúc.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(734,'topik3_109',3,'풍부하다','pung-bu-ha-da','phong phú','Tính từ','경험이 풍부해요.','Kinh nghiệm phong phú.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(735,'topik3_110',3,'합리적','ham-ri-jeok','hợp lý','Tính từ','합리적인 선택이에요.','Đó là lựa chọn hợp lý.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(736,'topik3_111',3,'해결하다','hae-gyeol-ha-da','giải quyết','Động từ','문제를 해결했어요.','Tôi đã giải quyết vấn đề.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(737,'topik3_112',3,'핵심','haek-sim','hạt nhân, cốt lõi','Danh từ','핵심을 파악해요.','Tôi nắm bắt cốt lõi.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(738,'topik3_113',3,'확대','hwak-dae','sự mở rộng','Danh từ','사업을 확대해요.','Tôi mở rộng kinh doanh.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(739,'topik3_114',3,'확립','hwang-rip','sự thiết lập, xác lập','Danh từ','체계를 확립했어요.','Tôi đã thiết lập hệ thống.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(740,'topik3_115',3,'환영하다','hwan-yeong-ha-da','hoan nghênh, chào đón','Động từ','손님을 환영해요.','Tôi chào đón khách.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(741,'topik3_116',3,'활발하다','hwal-bal-ha-da','sôi nổi, nhộn nhịp','Tính từ','활동이 활발해요.','Hoạt động sôi nổi.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(742,'topik3_117',3,'효율적','hyo-yul-jeok','hiệu quả','Tính từ','효율적인 방법이에요.','Đó là phương pháp hiệu quả.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(743,'topik3_118',3,'희생','hui-saeng','sự hy sinh','Danh từ','많은 희생이 있었어요.','Đã có nhiều hy sinh.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(744,'topik3_119',3,'기초','gi-cho','cơ sở, nền tảng','Danh từ','기초를 다져요.','Tôi xây dựng nền tảng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(745,'topik3_120',3,'논의','non-ui','sự thảo luận','Danh từ','논의를 거쳤어요.','Đã trải qua thảo luận.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(746,'topik3_121',3,'대안','dae-an','phương án thay thế','Danh từ','대안을 마련해요.','Tôi chuẩn bị phương án thay thế.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(747,'topik3_122',3,'도전적','do-jeon-jeok','mang tính thách thức','Tính từ','도전적인 목표예요.','Đó là mục tiêu đầy thách thức.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(748,'topik3_123',3,'부응하다','bu-eung-ha-da','đáp ứng, đáp lại','Động từ','기대에 부응했어요.','Tôi đã đáp ứng kỳ vọng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(749,'topik3_124',3,'불가피하다','bul-ga-pi-ha-da','không thể tránh khỏi','Tính từ','불가피한 선택이었어요.','Đó là lựa chọn không thể tránh khỏi.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(750,'topik3_125',3,'사고방식','sa-go-bang-sik','cách tư duy','Danh từ','사고방식이 달라요.','Cách tư duy khác nhau.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(751,'topik3_126',3,'상징','sang-jing','biểu tượng','Danh từ','비둘기는 평화의 상징이에요.','Chim bồ câu là biểu tượng hòa bình.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(752,'topik3_127',3,'설명하다','seol-myeong-ha-da','giải thích','Động từ','자세히 설명해 주세요.','Hãy giải thích chi tiết.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(753,'topik3_128',3,'소통','so-tong','sự giao tiếp, thông hiểu','Danh từ','소통이 중요해요.','Giao tiếp rất quan trọng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(754,'topik3_129',3,'실태','sil-tae','thực trạng','Danh từ','실태를 조사해요.','Tôi điều tra thực trạng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(755,'topik3_130',3,'억제','eok-je','sự ức chế, kìm hãm','Danh từ','감정을 억제했어요.','Tôi kìm hãm cảm xúc.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(756,'topik3_131',3,'여론','yeo-ron','dư luận','Danh từ','여론을 존중해요.','Tôi tôn trọng dư luận.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(757,'topik3_132',3,'원동력','won-dong-ryeok','động lực chính','Danh từ','성장의 원동력이에요.','Đó là động lực chính của sự phát triển.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(758,'topik3_133',3,'유발하다','yu-bal-ha-da','gây ra, dẫn đến','Động từ','문제를 유발했어요.','Đã gây ra vấn đề.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(759,'topik3_134',3,'의존','ui-jon','sự phụ thuộc','Danh từ','약에 의존하지 마세요.','Đừng phụ thuộc vào thuốc.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(760,'topik3_135',3,'전반적','jeon-ban-jeok','toàn diện, tổng thể','Tính từ','전반적으로 좋아요.','Nhìn tổng thể thì tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(761,'topik3_136',3,'정착','jeong-chak','sự định cư, ổn định','Danh từ','새로운 곳에 정착했어요.','Tôi đã định cư ở nơi mới.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(762,'topik3_137',3,'조화','jo-hwa','sự hài hòa','Danh từ','자연과 조화를 이뤄요.','Tôi hài hòa với thiên nhiên.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(763,'topik3_138',3,'주도하다','ju-do-ha-da','dẫn dắt, chủ đạo','Động từ','회의를 주도했어요.','Tôi đã dẫn dắt cuộc họp.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(764,'topik3_139',3,'지원','ji-won','sự hỗ trợ','Danh từ','지원을 받았어요.','Tôi đã nhận được hỗ trợ.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(765,'topik3_140',3,'책임','chaek-im','trách nhiệm','Danh từ','책임을 다해요.','Tôi hoàn thành trách nhiệm.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(766,'topik3_141',3,'추세','chu-se','xu thế','Danh từ','추세를 따라가요.','Tôi đi theo xu thế.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(767,'topik3_142',3,'탐구','tam-gu','sự thăm dò, tìm tòi','Danh từ','진리를 탐구해요.','Tôi tìm tòi chân lý.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(768,'topik3_143',3,'토대','to-dae','nền tảng, cơ sở','Danh từ','토대를 마련했어요.','Tôi đã tạo nền tảng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(769,'topik3_144',3,'파악하다','pa-ak-ha-da','nắm bắt','Động từ','상황을 파악했어요.','Tôi đã nắm bắt tình hình.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(770,'topik3_145',3,'편의','pyeon-ui','sự tiện lợi','Danh từ','고객 편의를 생각해요.','Tôi nghĩ đến sự tiện lợi của khách hàng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(771,'topik3_146',3,'평등','pyeong-deung','sự bình đẳng','Danh từ','평등을 추구해요.','Tôi theo đuổi sự bình đẳng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(772,'topik3_147',3,'폭넓다','pok-neol-da','rộng rãi, bao quát','Tính từ','폭넓은 경험이 있어요.','Tôi có kinh nghiệm rộng rãi.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(773,'topik3_148',3,'합의','ha-bui','sự đồng thuận, thỏa thuận','Danh từ','합의에 도달했어요.','Chúng tôi đã đạt được đồng thuận.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(774,'topik3_149',3,'해소','hae-so','sự giải tỏa, giải quyết','Danh từ','스트레스를 해소해요.','Tôi giải tỏa căng thẳng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(775,'topik3_150',3,'혁신','hyeok-sin','sự đổi mới, cách tân','Danh từ','기술 혁신이 필요해요.','Cần đổi mới công nghệ.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(776,'topik3_151',3,'현저하다','hyeon-jeo-ha-da','rõ rệt, đáng kể','Tính từ','차이가 현저해요.','Sự khác biệt rõ rệt.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(777,'topik3_152',3,'협력','hyeop-ryeok','sự hợp tác','Danh từ','협력을 요청해요.','Tôi yêu cầu hợp tác.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(778,'topik3_153',3,'확산','hwak-san','sự lan rộng, khuếch tán','Danh từ','정보가 빠르게 확산돼요.','Thông tin lan rộng nhanh chóng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(779,'topik3_154',3,'환경 친화적','hwan-gyeong chin-hwa-jeok','thân thiện với môi trường','Tính từ','환경 친화적인 제품이에요.','Đó là sản phẩm thân thiện môi trường.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(780,'topik3_155',3,'활용','hwal-yong','sự vận dụng, tận dụng','Danh từ','자원을 활용해요.','Tôi tận dụng tài nguyên.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(781,'topik3_156',3,'효율성','hyo-yul-seong','tính hiệu quả','Danh từ','효율성을 높여요.','Tôi nâng cao hiệu quả.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(782,'topik3_157',3,'희망하다','hui-mang-ha-da','hy vọng, mong muốn','Động từ','좋은 결과를 희망해요.','Tôi hy vọng kết quả tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(783,'topik3_158',3,'기회','gi-hoe','cơ hội','Danh từ','기회를 잡았어요.','Tôi đã nắm bắt cơ hội.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(784,'topik3_159',3,'노하우','no-ha-u','bí quyết, kinh nghiệm','Danh từ','노하우를 배워요.','Tôi học bí quyết.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(785,'topik3_160',3,'대비','dae-bi','sự chuẩn bị, đối phó','Danh từ','미래에 대비해요.','Tôi chuẩn bị cho tương lai.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(786,'topik3_161',3,'반성','ban-seong','sự tự kiểm điểm','Danh từ','반성을 많이 했어요.','Tôi đã tự kiểm điểm nhiều.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(787,'topik3_162',3,'부각되다','bu-gak-doe-da','được nổi bật, được nhấn mạnh','Động từ','중요성이 부각됐어요.','Tầm quan trọng được nhấn mạnh.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(788,'topik3_163',3,'산업','san-eop','công nghiệp','Danh từ','산업이 발달했어요.','Công nghiệp phát triển.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(789,'topik3_164',3,'선진국','seon-jin-guk','nước tiên tiến','Danh từ','선진국과 비교해요.','So sánh với nước tiên tiến.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(790,'topik3_165',3,'실질적','sil-jil-jeok','thực chất, thiết thực','Tính từ','실질적인 도움이 됐어요.','Đã giúp ích thiết thực.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(791,'topik3_166',3,'악화','ak-hwa','sự xấu đi, trầm trọng hơn','Danh từ','관계가 악화됐어요.','Mối quan hệ đã xấu đi.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(792,'topik3_167',3,'연계','yeon-gye','sự liên kết, kết nối','Danh từ','기업과 연계해요.','Tôi liên kết với doanh nghiệp.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(793,'topik3_168',3,'우수하다','u-su-ha-da','ưu tú, xuất sắc','Tính từ','성적이 우수해요.','Thành tích xuất sắc.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(794,'topik3_169',3,'의무','ui-mu','nghĩa vụ','Danh từ','의무를 다해요.','Tôi hoàn thành nghĩa vụ.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(795,'topik3_170',3,'이점','i-jeom','ưu điểm, lợi thế','Danh từ','많은 이점이 있어요.','Có nhiều lợi thế.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(796,'topik3_171',3,'장기적','jang-gi-jeok','mang tính lâu dài','Tính từ','장기적인 계획을 세워요.','Tôi lập kế hoạch lâu dài.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(797,'topik3_172',3,'전략','jeon-ryak','chiến lược','Danh từ','전략을 짜요.','Tôi xây dựng chiến lược.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(798,'topik3_173',3,'주체적','ju-che-jeok','chủ động, tự chủ','Tính từ','주체적으로 행동해요.','Tôi hành động chủ động.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(799,'topik3_174',3,'증진','jeung-jin','sự tăng tiến, thúc đẩy','Danh từ','건강 증진에 힘써요.','Tôi nỗ lực thúc đẩy sức khỏe.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(800,'topik3_175',3,'지속 가능','ji-sok ga-neung','có thể duy trì, bền vững','Tính từ','지속 가능한 발전이 필요해요.','Cần phát triển bền vững.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(801,'topik3_176',3,'촉진','chok-jin','sự thúc đẩy','Danh từ','성장을 촉진해요.','Tôi thúc đẩy tăng trưởng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(802,'topik3_177',3,'친화력','chin-hwa-ryeok','khả năng thân thiện','Danh từ','친화력이 좋아요.','Khả năng thân thiện tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(803,'topik3_178',3,'필수적','pil-su-jeok','thiết yếu, bắt buộc','Tính từ','필수적인 요소예요.','Là yếu tố thiết yếu.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(804,'topik3_179',3,'함양','ham-yang','sự trau dồi, bồi dưỡng','Danh từ','인성을 함양해요.','Tôi trau dồi nhân cách.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(805,'topik3_180',3,'확고하다','hwak-go-ha-da','vững chắc, kiên định','Tính từ','의지가 확고해요.','Ý chí kiên định.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(806,'topik3_181',3,'효과적','hyo-gwa-jeok','hiệu quả','Tính từ','효과적인 방법이에요.','Đó là cách hiệu quả.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(807,'topik3_182',3,'희박하다','hui-bak-ha-da','mong manh, ít ỏi','Tính từ','가능성이 희박해요.','Khả năng rất mong manh.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(808,'topik3_183',3,'기반','gi-ban','nền tảng, cơ sở','Danh từ','기반을 다져요.','Tôi xây dựng nền tảng.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(809,'topik3_184',3,'대규모','dae-gyu-mo','quy mô lớn','Danh từ','대규모 행사예요.','Đó là sự kiện quy mô lớn.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(810,'topik3_185',3,'발휘하다','bal-hwi-ha-da','phát huy, thể hiện','Động từ','능력을 발휘했어요.','Tôi đã phát huy năng lực.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(811,'topik3_186',3,'보편적','bo-pyeon-jeok','phổ biến, mang tính phổ quát','Tính từ','보편적인 가치예요.','Đó là giá trị phổ quát.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(812,'topik3_187',3,'성숙하다','seong-suk-ha-da','trưởng thành, chín chắn','Tính từ','그는 생각이 성숙해요.','Anh ấy suy nghĩ chín chắn.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(813,'topik3_188',3,'수립하다','su-rip-ha-da','thiết lập, xây dựng','Động từ','계획을 수립했어요.','Tôi đã xây dựng kế hoạch.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(814,'topik3_189',3,'실천','sil-cheon','sự thực hành, thực hiện','Danh từ','약속을 실천해요.','Tôi thực hiện lời hứa.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(815,'topik3_190',3,'심화','sim-hwa','sự làm sâu sắc thêm','Danh từ','관계가 심화됐어요.','Mối quan hệ trở nên sâu sắc hơn.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(816,'topik3_191',3,'안정','an-jeong','sự ổn định','Danh từ','생활이 안정됐어요.','Cuộc sống đã ổn định.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(817,'topik3_192',3,'역량','yeok-ryang','năng lực, thực lực','Danh từ','역량을 키워요.','Tôi phát triển năng lực.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(818,'topik3_193',3,'완화','wan-hwa','sự nới lỏng, giảm nhẹ','Danh từ','규제를 완화했어요.','Đã nới lỏng quy định.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(819,'topik3_194',3,'유도하다','yu-do-ha-da','dẫn dắt, hướng dẫn','Động từ','대화를 유도했어요.','Tôi đã dẫn dắt cuộc trò chuyện.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(820,'topik3_195',3,'전환','jeon-hwan','sự chuyển đổi','Danh từ','생각을 전환했어요.','Tôi đã chuyển đổi suy nghĩ.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(821,'topik3_196',3,'지향하다','ji-hyang-ha-da','hướng tới, nhắm tới','Động từ','미래를 지향해요.','Tôi hướng tới tương lai.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(822,'topik3_197',3,'촉구하다','chok-gu-ha-da','thúc giục, kêu gọi','Động từ','참여를 촉구했어요.','Tôi đã kêu gọi tham gia.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(823,'topik3_198',3,'포괄적','po-gwal-jeok','bao quát, toàn diện','Tính từ','포괄적인 내용이에요.','Nội dung bao quát.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(824,'topik3_199',3,'함축하다','ham-chuk-ha-da','hàm ý, bao hàm','Động từ','깊은 의미를 함축해요.','Nó hàm ý nghĩa sâu sắc.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(825,'topik3_200',3,'활성화','hwal-seong-hwa','sự kích hoạt, làm sôi động','Danh từ','경제를 활성화해요.','Tôi kích thích nền kinh tế.','intermediate',NULL,1,NULL,'2026-09-24 13:46:50','2026-09-24 13:46:50'),(826,'topik4_001',4,'가공하다','ga-gong-ha-da','gia công, chế biến','Động từ','식품을 가공해서 팔아요.','Họ chế biến thực phẩm rồi bán.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(827,'topik4_002',4,'가늠하다','ga-neum-ha-da','ước lượng, phỏng đoán','Động từ','결과를 가늠하기 어려워요.','Khó phỏng đoán kết quả.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(828,'topik4_003',4,'가동','ga-dong','sự vận hành, khởi động','Danh từ','공장을 가동했어요.','Nhà máy đã được vận hành.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(829,'topik4_004',4,'가사','ga-sa','ca từ; việc nhà','Danh từ','가사를 분담해요.','Chúng tôi chia sẻ việc nhà.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(830,'topik4_005',4,'각인되다','gak-in-doe-da','được khắc sâu, in đậm','Động từ','그 장면이 각인됐어요.','Cảnh đó đã khắc sâu trong tôi.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(831,'topik4_006',4,'감안하다','gam-an-ha-da','cân nhắc, tính đến','Động từ','여러 상황을 감안했어요.','Tôi đã tính đến nhiều tình huống.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(832,'topik4_007',4,'강구하다','gang-gu-ha-da','tìm cách, mưu cầu','Động từ','대책을 강구하고 있어요.','Chúng tôi đang tìm đối sách.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(833,'topik4_008',4,'개괄적','gae-gwal-jeok','khái quát','Tính từ','개괄적으로 설명해 주세요.','Hãy giải thích một cách khái quát.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(834,'topik4_009',4,'개방적','gae-bang-jeok','cởi mở','Tính từ','개방적인 태도가 필요해요.','Cần thái độ cởi mở.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(835,'topik4_010',4,'거듭하다','geo-deup-ha-da','lặp lại nhiều lần','Động từ','실수를 거듭했어요.','Tôi đã lặp lại sai lầm nhiều lần.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(836,'topik4_011',4,'검증','geom-jeung','sự kiểm chứng, xác minh','Danh từ','실험으로 검증했어요.','Tôi đã kiểm chứng bằng thí nghiệm.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(837,'topik4_012',4,'격차','gyeok-cha','khoảng cách, sự chênh lệch','Danh từ','소득 격차가 커요.','Khoảng cách thu nhập lớn.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(838,'topik4_013',4,'결부되다','gyeol-bu-doe-da','gắn liền, gắn với','Động từ','그 문제는 정치와 결부돼 있어요.','Vấn đề đó gắn liền với chính trị.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(839,'topik4_014',4,'경계','gyeong-gye','ranh giới; sự cảnh giác','Danh từ','경계를 넘었어요.','Tôi đã vượt qua ranh giới.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(840,'topik4_015',4,'계기','gye-gi','cơ hội, bước ngoặt','Danh từ','좋은 계기가 됐어요.','Đó đã trở thành cơ hội tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(841,'topik4_016',4,'고려','go-ryeo','sự cân nhắc, xem xét','Danh từ','고려 끝에 결정했어요.','Sau khi cân nhắc, tôi đã quyết định.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(842,'topik4_017',4,'고안하다','go-an-ha-da','phát minh, thiết kế','Động từ','새로운 장치를 고안했어요.','Tôi đã thiết kế thiết bị mới.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(843,'topik4_018',4,'고취하다','go-chwi-ha-da','khích lệ, nâng cao','Động từ','의욕을 고취했어요.','Tôi đã khích lệ ý chí.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(844,'topik4_019',4,'공론화','gong-ron-hwa','sự đưa ra thảo luận công khai','Danh từ','문제를 공론화했어요.','Chúng tôi đã đưa vấn đề ra thảo luận công khai.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(845,'topik4_020',4,'과감하다','gwa-gam-ha-da','quả cảm, dứt khoát','Tính từ','과감한 결정을 내렸어요.','Tôi đã đưa ra quyết định dứt khoát.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(846,'topik4_021',4,'관행','gwan-haeng','thông lệ, tập quán','Danh từ','오래된 관행을 바꿔요.','Tôi thay đổi tập quán lâu đời.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(847,'topik4_022',4,'괴리','goe-ri','sự tách rời, khoảng cách','Danh từ','이상과 현실의 괴리가 커요.','Khoảng cách giữa lý tưởng và thực tế lớn.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(848,'topik4_023',4,'구축하다','gu-chuk-ha-da','xây dựng, thiết lập','Động từ','시스템을 구축했어요.','Tôi đã xây dựng hệ thống.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(849,'topik4_024',4,'규명하다','gyu-myeong-ha-da','làm rõ, xác minh','Động từ','원인을 규명했어요.','Tôi đã làm rõ nguyên nhân.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(850,'topik4_025',4,'극대화','geuk-dae-hwa','sự tối đa hóa','Danh từ','효과를 극대화해요.','Tôi tối đa hóa hiệu quả.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(851,'topik4_026',4,'근거','geun-geo','căn cứ','Danh từ','근거가 부족해요.','Thiếu căn cứ.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(852,'topik4_027',4,'기대하다','gi-dae-ha-da','kỳ vọng, mong đợi','Động từ','좋은 결과를 기대해요.','Tôi mong đợi kết quả tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(853,'topik4_028',4,'기인하다','gi-in-ha-da','bắt nguồn từ, do','Động từ','실수는 부주의에 기인해요.','Sai sót bắt nguồn từ sự bất cẩn.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(854,'topik4_029',4,'난제','nan-je','vấn đề nan giải','Danh từ','난제를 해결했어요.','Tôi đã giải quyết vấn đề nan giải.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(855,'topik4_030',4,'내포하다','nae-po-ha-da','hàm chứa, bao hàm','Động từ','깊은 뜻을 내포해요.','Nó hàm chứa ý nghĩa sâu sắc.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(856,'topik4_031',4,'논란','non-ran','sự tranh luận, tranh cãi','Danh từ','논란이 일었어요.','Đã dấy lên tranh cãi.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(857,'topik4_032',4,'다각적','da-gak-jeok','đa chiều, nhiều mặt','Tính từ','다각적으로 분석해요.','Tôi phân tích đa chiều.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(858,'topik4_033',4,'다분하다','da-bun-ha-da','khá nhiều, phần nhiều','Tính từ','그럴 가능성이 다분해요.','Khả năng như vậy khá cao.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(859,'topik4_034',4,'단축','dan-chuk','sự rút ngắn','Danh từ','시간을 단축했어요.','Tôi đã rút ngắn thời gian.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(860,'topik4_035',4,'당위성','dang-wi-seong','tính tất yếu, tính đúng đắn','Danh từ','당위성을 설명해요.','Tôi giải thích tính tất yếu.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(861,'topik4_036',4,'대두되다','dae-du-doe-da','nổi lên, được đặt ra','Động từ','환경 문제가 대두됐어요.','Vấn đề môi trường đã nổi lên.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(862,'topik4_037',4,'대응','dae-eung','sự ứng phó, đối phó','Danh từ','위기에 대응해요.','Tôi ứng phó với khủng hoảng.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(863,'topik4_038',4,'도출하다','do-chul-ha-da','rút ra, đưa ra','Động từ','결론을 도출했어요.','Tôi đã rút ra kết luận.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(864,'topik4_039',4,'동참','dong-cham','sự cùng tham gia','Danh từ','행사에 동참했어요.','Tôi đã cùng tham gia sự kiện.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(865,'topik4_040',4,'두드러지다','du-deu-reo-ji-da','nổi bật, rõ rệt','Động từ','성과가 두드러져요.','Thành tích rất nổi bật.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(866,'topik4_041',4,'등장','deung-jang','sự xuất hiện','Danh từ','새로운 인물이 등장했어요.','Nhân vật mới đã xuất hiện.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(867,'topik4_042',4,'모순','mo-sun','mâu thuẫn','Danh từ','모순이 드러났어요.','Mâu thuẫn đã lộ ra.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(868,'topik4_043',4,'목격하다','mok-gyeok-ha-da','chứng kiến, mục kích','Động từ','사고를 목격했어요.','Tôi đã chứng kiến vụ tai nạn.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(869,'topik4_044',4,'무분별하다','mu-bun-byeol-ha-da','vô ý thức, thiếu suy xét','Tính từ','무분별한 개발을 막아야 해요.','Phải ngăn chặn sự phát triển thiếu suy xét.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(870,'topik4_045',4,'발상','bal-sang','ý tưởng, cách nghĩ','Danh từ','발상이 독특해요.','Ý tưởng độc đáo.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(871,'topik4_046',4,'방침','bang-chim','phương châm, chính sách','Danh từ','방침을 정했어요.','Tôi đã định ra phương châm.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(872,'topik4_047',4,'배제하다','bae-je-ha-da','loại trừ, gạt bỏ','Động từ','가능성을 배제할 수 없어요.','Không thể loại trừ khả năng.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(873,'topik4_048',4,'번영','beon-yeong','sự phồn vinh, thịnh vượng','Danh từ','국가의 번영을 빌어요.','Tôi cầu chúc đất nước phồn vinh.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(874,'topik4_049',4,'보편화','bo-pyeon-hwa','sự phổ biến hóa','Danh từ','스마트폰이 보편화됐어요.','Điện thoại thông minh đã phổ biến.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(875,'topik4_050',4,'부합하다','bu-hap-ha-da','phù hợp, đáp ứng','Động từ','기준에 부합해요.','Nó phù hợp với tiêu chuẩn.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(876,'topik4_051',4,'분류','bul-lyu','sự phân loại','Danh từ','자료를 분류했어요.','Tôi đã phân loại tài liệu.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(877,'topik4_052',4,'불가결하다','bul-ga-gyeol-ha-da','không thể thiếu','Tính từ','물은 생활에 불가결해요.','Nước không thể thiếu trong đời sống.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(878,'topik4_053',4,'비약','bi-yak','sự nhảy vọt','Danh từ','경제가 비약적으로 성장했어요.','Kinh tế đã phát triển nhảy vọt.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(879,'topik4_054',4,'불가피하다','bul-ga-pi-ha-da','không thể tránh khỏi','Tính từ','불가피하게 결정을 내렸어요.','Tôi đã đưa ra quyết định không thể tránh khỏi.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(880,'topik4_055',4,'사물','sa-mul','sự vật, đồ vật','Danh từ','사물을 관찰해요.','Tôi quan sát sự vật.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(881,'topik4_056',4,'상응하다','sang-eung-ha-da','tương ứng, đáp ứng','Động từ','능력에 상응하는 대우를 받아요.','Tôi được đối xử tương ứng với năng lực.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(882,'topik4_057',4,'상쇄','sang-soe','sự bù trừ, triệt tiêu','Danh từ','효과가 상쇄됐어요.','Hiệu quả đã bị triệt tiêu.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(883,'topik4_058',4,'생략','saeng-ryak','sự lược bỏ','Danh từ','설명을 생략했어요.','Tôi đã lược bỏ phần giải thích.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(884,'topik4_059',4,'설득력','seol-deuk-ryeok','sức thuyết phục','Danh từ','설득력이 있어요.','Rất có sức thuyết phục.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(885,'topik4_060',4,'성찰','seong-chal','sự suy ngẫm, tự vấn','Danh từ','자기 성찰을 해요.','Tôi tự suy ngẫm bản thân.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(886,'topik4_061',4,'세대','se-dae','thế hệ','Danh từ','젊은 세대가 달라요.','Thế hệ trẻ đã khác.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(887,'topik4_062',4,'수반하다','su-ban-ha-da','kèm theo, đi kèm','Động từ','책임이 수반돼요.','Đi kèm với trách nhiệm.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(888,'topik4_063',4,'수용','su-yong','sự chấp nhận, tiếp nhận','Danh từ','의견을 수용했어요.','Tôi đã tiếp nhận ý kiến.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(889,'topik4_064',4,'쇠퇴','soe-toe','sự suy tàn, suy thoái','Danh từ','산업이 쇠퇴했어요.','Ngành công nghiệp đã suy thoái.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(890,'topik4_065',4,'시사하다','si-sa-ha-da','gợi ý, ám chỉ','Động từ','많은 점을 시사해요.','Nó gợi ra nhiều điều.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(891,'topik4_066',4,'실증적','sil-jeung-jeok','mang tính thực chứng','Tính từ','실증적 연구가 필요해요.','Cần nghiên cứu mang tính thực chứng.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(892,'topik4_067',4,'심화되다','sim-hwa-doe-da','trở nên sâu sắc, trầm trọng','Động từ','갈등이 심화됐어요.','Xung đột trở nên trầm trọng.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(893,'topik4_068',4,'양극화','yang-geuk-hwa','sự phân cực','Danh từ','소득 양극화가 심해요.','Phân cực thu nhập trầm trọng.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(894,'topik4_069',4,'억제하다','eok-je-ha-da','kìm hãm, ức chế','Động từ','욕구를 억제했어요.','Tôi kìm hãm ham muốn.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(895,'topik4_070',4,'여파','yeo-pa','dư chấn, ảnh hưởng','Danh từ','사건의 여파가 컸어요.','Dư chấn của vụ việc lớn.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(896,'topik4_071',4,'역설적','yeok-seol-jeok','nghịch lý','Tính từ','역설적인 상황이에요.','Đó là tình huống nghịch lý.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(897,'topik4_072',4,'연쇄','yeon-soe','sự dây chuyền, liên hoàn','Danh từ','연쇄 반응이 일어났어요.','Đã xảy ra phản ứng dây chuyền.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(898,'topik4_073',4,'예견하다','ye-gyeon-ha-da','dự báo, tiên đoán','Động từ','미래를 예견했어요.','Tôi đã tiên đoán tương lai.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(899,'topik4_074',4,'완화되다','wan-hwa-doe-da','được nới lỏng, giảm nhẹ','Động từ','긴장이 완화됐어요.','Căng thẳng đã được giảm nhẹ.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(900,'topik4_075',4,'요인','yo-in','yếu tố, nhân tố','Danh từ','성공 요인이 뭐예요?','Yếu tố thành công là gì?','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(901,'topik4_076',4,'용이하다','yong-i-ha-da','dễ dàng, thuận lợi','Tính từ','접근이 용이해요.','Tiếp cận dễ dàng.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(902,'topik4_077',4,'우려되다','u-ryeo-doe-da','được lo ngại','Động từ','결과가 우려돼요.','Kết quả đang bị lo ngại.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(903,'topik4_078',4,'위축되다','wi-chuk-doe-da','bị thu hẹp, bị co lại','Động từ','소비가 위축됐어요.','Tiêu dùng bị thu hẹp.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(904,'topik4_079',4,'유도','yu-do','sự dẫn dắt, hướng dẫn','Danh từ','대화를 유도했어요.','Tôi đã dẫn dắt cuộc trò chuyện.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(905,'topik4_080',4,'의식','ui-sik','ý thức','Danh từ','안전 의식이 부족해요.','Ý thức an toàn còn thiếu.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(906,'topik4_081',4,'이례적','i-rye-jeok','bất thường, hiếm có','Tính từ','이례적인 현상이에요.','Đó là hiện tượng bất thường.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(907,'topik4_082',4,'이점','i-jeom','lợi thế, ưu điểm','Danh từ','이점을 살려요.','Tôi tận dụng lợi thế.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(908,'topik4_083',4,'인식','in-sik','sự nhận thức','Danh từ','인식이 바뀌었어요.','Nhận thức đã thay đổi.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(909,'topik4_084',4,'입증','ip-jeung','sự chứng minh','Danh từ','입증이 필요해요.','Cần chứng minh.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(910,'topik4_085',4,'자극','ja-geuk','sự kích thích','Danh từ','좋은 자극이 됐어요.','Đó là sự kích thích tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(911,'topik4_086',4,'잔존하다','jan-jon-ha-da','tồn tại, còn lại','Động từ','옛 풍습이 잔존해요.','Phong tục cũ vẫn còn tồn tại.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(912,'topik4_087',4,'장려하다','jang-ryeo-ha-da','khuyến khích, cổ vũ','Động từ','독서를 장려해요.','Tôi khuyến khích đọc sách.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(913,'topik4_088',4,'재고하다','jae-go-ha-da','xem xét lại','Động từ','계획을 재고했어요.','Tôi đã xem xét lại kế hoạch.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(914,'topik4_089',4,'저해하다','jeo-hae-ha-da','cản trở, gây trở ngại','Động từ','발전을 저해해요.','Nó cản trở sự phát triển.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(915,'topik4_090',4,'적극성','jeok-geuk-seong','tính tích cực','Danh từ','적극성이 부족해요.','Tính tích cực còn thiếu.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(916,'topik4_091',4,'전제','jeon-je','tiền đề, điều kiện','Danh từ','전제가 틀렸어요.','Tiền đề sai.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(917,'topik4_092',4,'절충','jeol-chung','sự dung hòa, thỏa hiệp','Danh từ','절충안을 마련했어요.','Chúng tôi đưa ra phương án dung hòa.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(918,'topik4_093',4,'점진적','jeom-jin-jeok','mang tính dần dần, từng bước','Tính từ','점진적으로 개선해요.','Cải thiện từng bước.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(919,'topik4_094',4,'정당화','jeong-dang-hwa','sự chính đáng hóa, biện minh','Danh từ','행동을 정당화했어요.','Anh ấy biện minh cho hành động.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(920,'topik4_095',4,'제고','je-go','sự nâng cao','Danh từ','효율을 제고해요.','Tôi nâng cao hiệu quả.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(921,'topik4_096',4,'조성하다','jo-seong-ha-da','tạo nên, kiến tạo','Động từ','분위기를 조성했어요.','Tôi đã tạo nên bầu không khí.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(922,'topik4_097',4,'종합하다','jong-hap-ha-da','tổng hợp','Động từ','의견을 종합했어요.','Tôi đã tổng hợp ý kiến.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(923,'topik4_098',4,'주목받다','ju-mok-bat-da','được chú ý','Động từ','그 작품이 주목받아요.','Tác phẩm đó đang được chú ý.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(924,'topik4_099',4,'중시하다','jung-si-ha-da','coi trọng','Động từ','과정을 중시해요.','Tôi coi trọng quá trình.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(925,'topik4_100',4,'증대','jeung-dae','sự gia tăng','Danh từ','수요가 증대됐어요.','Nhu cầu đã gia tăng.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(926,'topik4_101',4,'지배','ji-bae','sự thống trị, chi phối','Danh từ','감정에 지배당했어요.','Tôi bị cảm xúc chi phối.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(927,'topik4_102',4,'지속되다','ji-sok-doe-da','được duy trì, kéo dài','Động từ','논쟁이 지속됐어요.','Cuộc tranh luận đã kéo dài.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(928,'topik4_103',4,'진전','jin-jeon','sự tiến triển','Danh từ','협상에 진전이 있어요.','Đàm phán có tiến triển.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(929,'topik4_104',4,'촉진하다','chok-jin-ha-da','thúc đẩy','Động từ','성장을 촉진해요.','Tôi thúc đẩy tăng trưởng.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(930,'topik4_105',4,'추구','chu-gu','sự theo đuổi','Danh từ','가치를 추구해요.','Tôi theo đuổi giá trị.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(931,'topik4_106',4,'축적','chuk-jeok','sự tích lũy','Danh từ','경험을 축적해요.','Tôi tích lũy kinh nghiệm.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(932,'topik4_107',4,'치밀하다','chi-mil-ha-da','tinh vi, chặt chẽ','Tính từ','치밀한 계획이에요.','Đó là kế hoạch chặt chẽ.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(933,'topik4_108',4,'탁월하다','tak-wol-ha-da','xuất sắc','Tính từ','능력이 탁월해요.','Năng lực xuất sắc.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(934,'topik4_109',4,'통합','tong-hap','sự tích hợp, hợp nhất','Danh từ','부서를 통합했어요.','Chúng tôi đã hợp nhất các phòng ban.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(935,'topik4_110',4,'투명성','tu-myeong-seong','tính minh bạch','Danh từ','투명성을 높여야 해요.','Phải nâng cao tính minh bạch.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(936,'topik4_111',4,'파급','pa-geup','sự lan tỏa, ảnh hưởng','Danh từ','파급 효과가 커요.','Hiệu ứng lan tỏa lớn.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(937,'topik4_112',4,'편중','pyeon-jung','sự thiên lệch, mất cân đối','Danh từ','자원이 편중돼 있어요.','Nguồn lực bị phân bổ thiên lệch.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(938,'topik4_113',4,'폐해','pye-hae','tác hại, tai hại','Danh từ','폐해가 크다.','Tác hại rất lớn.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(939,'topik4_114',4,'포용','po-yong','sự bao dung, tiếp nhận','Danh từ','포용력이 있어요.','Có sự bao dung.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(940,'topik4_115',4,'표출','pyo-chul','sự bộc lộ, thể hiện','Danh từ','감정 표출이 서툴러요.','Tôi vụng về trong việc bộc lộ cảm xúc.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(941,'topik4_116',4,'품격','pum-gyeok','phẩm cách, đẳng cấp','Danh từ','품격 있는 태도예요.','Thái độ đầy phẩm cách.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(942,'topik4_117',4,'필연적','pil-yeon-jeok','tất yếu','Tính từ','필연적인 결과예요.','Đó là kết quả tất yếu.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(943,'topik4_118',4,'한계','han-gye','giới hạn','Danh từ','한계를 극복해요.','Tôi vượt qua giới hạn.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(944,'topik4_119',4,'함의','ham-ui','hàm ý','Danh từ','함의를 파악해요.','Tôi nắm bắt hàm ý.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(945,'topik4_120',4,'해석','hae-seok','sự giải thích, diễn giải','Danh từ','다르게 해석했어요.','Tôi đã diễn giải khác.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(946,'topik4_121',4,'확립되다','hwang-rip-doe-da','được thiết lập, xác lập','Động từ','체계가 확립됐어요.','Hệ thống đã được thiết lập.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(947,'topik4_122',4,'환기','hwan-gi','sự khơi gợi, thông gió','Danh từ','관심을 환기했어요.','Tôi đã khơi gợi sự quan tâm.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(948,'topik4_123',4,'활성화되다','hwal-seong-hwa-doe-da','được kích hoạt, trở nên sôi động','Động từ','경제가 활성화됐어요.','Kinh tế trở nên sôi động.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(949,'topik4_124',4,'회복','hoe-bok','sự hồi phục','Danh từ','건강이 회복됐어요.','Sức khỏe đã hồi phục.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(950,'topik4_125',4,'효과성','hyo-gwa-seong','tính hiệu quả','Danh từ','효과성을 검증해요.','Tôi kiểm chứng tính hiệu quả.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(951,'topik4_126',4,'희생되다','hui-saeng-doe-da','bị hy sinh','Động từ','많은 사람이 희생됐어요.','Nhiều người đã bị hy sinh.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(952,'topik4_127',4,'강제','gang-je','sự cưỡng chế, ép buộc','Danh từ','강제로 퇴직당했어요.','Tôi bị buộc nghỉ việc.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(953,'topik4_128',4,'거론되다','geo-ron-doe-da','được đề cập, được nhắc đến','Động từ','그 문제가 거론됐어요.','Vấn đề đó đã được đề cập.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(954,'topik4_129',4,'견지하다','gyeon-ji-ha-da','kiên trì, giữ vững','Động từ','원칙을 견지했어요.','Tôi đã giữ vững nguyên tắc.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(955,'topik4_130',4,'결집','gyeol-jip','sự tập hợp, đoàn kết','Danh từ','힘을 결집했어요.','Chúng tôi đã tập hợp sức mạnh.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(956,'topik4_131',4,'경시하다','gyeong-si-ha-da','xem nhẹ, coi thường','Động từ','과정을 경시하면 안 돼요.','Không được xem nhẹ quá trình.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(957,'topik4_132',4,'과도하다','gwa-do-ha-da','quá mức, thái quá','Tính từ','과도한 규제예요.','Đó là quy định quá mức.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(958,'topik4_133',4,'관철하다','gwan-cheol-ha-da','thực hiện triệt để, xuyên suốt','Động từ','의지를 관철했어요.','Tôi đã thực hiện triệt để ý chí.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(959,'topik4_134',4,'궤도','gwe-do','quỹ đạo, đường ray','Danh từ','사업이 궤도에 올랐어요.','Công việc đã vào guồng.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(960,'topik4_135',4,'규제','gyu-je','sự quy định, điều tiết','Danh từ','규제를 완화해요.','Tôi nới lỏng quy định.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(961,'topik4_136',4,'급부상하다','geup-bu-sang-ha-da','nhanh chóng nổi lên','Động từ','그 분야가 급부상했어요.','Lĩnh vực đó đã nhanh chóng nổi lên.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(962,'topik4_137',4,'기여','gi-yeo','sự đóng góp','Danh từ','사회에 기여했어요.','Tôi đã đóng góp cho xã hội.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(963,'topik4_138',4,'난관','nan-gwan','khó khăn, trở ngại','Danh từ','난관을 극복했어요.','Tôi đã vượt qua khó khăn.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(964,'topik4_139',4,'내재되다','nae-jae-doe-da','tồn tại bên trong, tiềm ẩn','Động từ','위험이 내재돼 있어요.','Nguy hiểm tiềm ẩn bên trong.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(965,'topik4_140',4,'논거','non-geo','luận cứ','Danh từ','논거가 부족해요.','Luận cứ còn thiếu.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(966,'topik4_141',4,'단행하다','dan-haeng-ha-da','tiến hành, thực thi','Động từ','개혁을 단행했어요.','Tôi đã tiến hành cải cách.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(967,'topik4_142',4,'대두','dae-du','sự nổi lên, sự xuất hiện','Danh từ','새로운 이슈의 대두예요.','Đây là sự nổi lên của vấn đề mới.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(968,'topik4_143',4,'도래','do-rae','sự đến, sự tới','Danh từ','새 시대의 도래예요.','Đây là sự đến của thời đại mới.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(969,'topik4_144',4,'배척','bae-cheok','sự bài xích, loại trừ','Danh từ','배척을 받았어요.','Tôi đã bị bài xích.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(970,'topik4_145',4,'보완되다','bo-wan-doe-da','được bổ sung, khắc phục','Động từ','약점이 보완됐어요.','Điểm yếu đã được khắc phục.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(971,'topik4_146',4,'불식하다','bul-sik-ha-da','xóa tan, loại bỏ','Động từ','의혹을 불식했어요.','Tôi đã xóa tan nghi ngờ.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(972,'topik4_147',4,'상실','sang-sil','sự mất mát, đánh mất','Danh từ','의욕을 상실했어요.','Tôi đã đánh mất ý chí.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(973,'topik4_148',4,'선도하다','seon-do-ha-da','dẫn đầu, tiên phong','Động từ','시장을 선도해요.','Tôi dẫn đầu thị trường.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(974,'topik4_149',4,'쇄신','soe-sin','sự canh tân, đổi mới','Danh từ','조직을 쇄신했어요.','Tôi đã đổi mới tổ chức.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(975,'topik4_150',4,'수렴','su-ryeom','sự thu hút, hội tụ','Danh từ','의견을 수렴했어요.','Tôi đã thu thập ý kiến.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(976,'topik4_151',4,'시급하다','si-geup-ha-da','cấp bách','Tính từ','시급한 문제예요.','Đó là vấn đề cấp bách.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(977,'topik4_152',4,'심의','sim-ui','sự thẩm định, xem xét','Danh từ','위원회에서 심의했어요.','Ủy ban đã thẩm định.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(978,'topik4_153',4,'역행','yeok-haeng','sự đi ngược lại','Danh từ','시대에 역행하는 행동이에요.','Đó là hành động đi ngược thời đại.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(979,'topik4_154',4,'연대','yeon-dae','sự liên kết, đoàn kết','Danh từ','연대를 강화했어요.','Chúng tôi đã tăng cường liên kết.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(980,'topik4_155',4,'열악하다','yeo-rak-ha-da','tồi tệ, nghèo nàn','Tính từ','환경이 열악해요.','Môi trường tồi tệ.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(981,'topik4_156',4,'완화하다','wan-hwa-ha-da','nới lỏng, làm dịu','Động từ','규정을 완화했어요.','Tôi đã nới lỏng quy định.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(982,'topik4_157',4,'위기','wi-gi','khủng hoảng','Danh từ','위기를 극복했어요.','Tôi đã vượt qua khủng hoảng.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(983,'topik4_158',4,'유례','yu-rye','tiền lệ, ví dụ','Danh từ','유례가 없는 일이에요.','Đây là việc chưa từng có tiền lệ.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(984,'topik4_159',4,'은폐','eun-pye','sự che giấu, che đậy','Danh từ','사실을 은폐했어요.','Họ đã che giấu sự thật.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(985,'topik4_160',4,'일관성','il-gwan-seong','tính nhất quán','Danh từ','일관성을 유지해요.','Tôi duy trì tính nhất quán.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(986,'topik4_161',4,'자율성','ja-yul-seong','tính tự chủ','Danh từ','자율성을 보장해요.','Tôi bảo đảm tính tự chủ.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(987,'topik4_162',4,'전망하다','jeon-mang-ha-da','dự báo, nhìn nhận','Động từ','미래를 밝게 전망해요.','Tôi nhìn nhận tương lai tươi sáng.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(988,'topik4_163',4,'절박하다','jeol-bak-ha-da','tuyệt vọng, cấp bách','Tính từ','절박한 상황이에요.','Đó là tình huống cấp bách.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(989,'topik4_164',4,'정립','jeong-rip','sự thiết lập, định hình','Danh từ','이론을 정립했어요.','Tôi đã thiết lập lý thuyết.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(990,'topik4_165',4,'제기되다','je-gi-doe-da','được đặt ra, được nêu lên','Động từ','문제가 제기됐어요.','Vấn đề đã được nêu ra.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(991,'topik4_166',4,'조율','jo-yul','sự điều chỉnh, hòa giải','Danh từ','의견을 조율했어요.','Chúng tôi đã điều chỉnh ý kiến.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(992,'topik4_167',4,'종용하다','jong-yong-ha-da','khuyên nhủ, xúi giục','Động từ','그는 나를 종용했어요.','Anh ấy đã khuyên nhủ tôi.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(993,'topik4_168',4,'주관적','ju-gwan-jeok','chủ quan','Tính từ','주관적인 의견이에요.','Đó là ý kiến chủ quan.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(994,'topik4_169',4,'직관','jik-gwan','trực giác','Danh từ','직관이 뛰어나요.','Trực giác rất nhạy.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(995,'topik4_170',4,'진단','jin-dan','sự chẩn đoán','Danh từ','정확한 진단이 필요해요.','Cần chẩn đoán chính xác.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(996,'topik4_171',4,'차원','cha-won','chiều, cấp độ, phương diện','Danh từ','다른 차원의 문제예요.','Đây là vấn đề ở phương diện khác.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(997,'topik4_172',4,'철저하다','cheol-jeo-ha-da','triệt để, kỹ lưỡng','Tính từ','철저한 준비가 필요해요.','Cần chuẩn bị kỹ lưỡng.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(998,'topik4_173',4,'축소되다','chuk-so-doe-da','bị thu nhỏ, bị cắt giảm','Động từ','예산이 축소됐어요.','Ngân sách đã bị cắt giảm.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(999,'topik4_174',4,'탄력적','tan-ryeok-jeok','linh hoạt','Tính từ','탄력적으로 대응해요.','Tôi ứng phó linh hoạt.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1000,'topik4_175',4,'통찰','tong-chal','sự thấu hiểu, nhìn thấu','Danh từ','통찰력이 뛰어나요.','Khả năng nhìn thấu rất tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1001,'topik4_176',4,'편향','pyeon-hyang','sự thiên lệch','Danh từ','편향된 시각이에요.','Đó là góc nhìn thiên lệch.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1002,'topik4_177',4,'포화','po-hwa','sự bão hòa','Danh từ','시장이 포화 상태예요.','Thị trường đang ở trạng thái bão hòa.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1003,'topik4_178',4,'표명하다','pyo-myeong-ha-da','bày tỏ, tuyên bố','Động từ','입장을 표명했어요.','Tôi đã bày tỏ lập trường.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1004,'topik4_179',4,'필연성','pil-yeon-seong','tính tất yếu','Danh từ','필연성을 설명해요.','Tôi giải thích tính tất yếu.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1005,'topik4_180',4,'합당하다','hap-dang-ha-da','hợp lý, thích đáng','Tính từ','합당한 조치예요.','Đó là biện pháp thích đáng.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1006,'topik4_181',4,'해명','hae-myeong','sự giải thích, làm rõ','Danh từ','해명을 요구했어요.','Tôi đã yêu cầu giải thích.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1007,'topik4_182',4,'허용','heo-yong','sự cho phép, chấp nhận','Danh từ','허용 범위를 넘었어요.','Đã vượt quá phạm vi cho phép.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1008,'topik4_183',4,'확고부동','hwak-go-bu-dong','vững như bàn thạch','Tính từ','확고부동한 신념이에요.','Đó là niềm tin vững như bàn thạch.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1009,'topik4_184',4,'활로','hwal-ro','lối thoát, đường sống','Danh từ','활로를 찾았어요.','Tôi đã tìm được lối thoát.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1010,'topik4_185',4,'회의적','hoe-ui-jeok','hoài nghi, bi quan','Tính từ','회의적인 시각이에요.','Đó là góc nhìn hoài nghi.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1011,'topik4_186',4,'효용','hyo-yong','công dụng, ích lợi','Danh từ','효용 가치가 있어요.','Có giá trị công dụng.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1012,'topik4_187',4,'흡수','heup-su','sự hấp thụ, tiếp thu','Danh từ','기술을 흡수했어요.','Tôi đã tiếp thu kỹ thuật.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1013,'topik4_188',4,'기정사실','gi-jeong-sa-sil','sự việc đã rõ ràng','Danh từ','기정사실이 됐어요.','Đã trở thành sự việc rõ ràng.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1014,'topik4_189',4,'낙관적','nak-gwan-jeok','lạc quan','Tính từ','낙관적으로 전망해요.','Tôi nhìn nhận một cách lạc quan.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1015,'topik4_190',4,'당면하다','dang-myeon-ha-da','đối mặt, trước mắt','Động từ','당면한 과제예요.','Đó là nhiệm vụ trước mắt.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1016,'topik4_191',4,'모호하다','mo-ho-ha-da','mơ hồ','Tính từ','설명이 모호해요.','Lời giải thích mơ hồ.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1017,'topik4_192',4,'반감','ban-gam','sự phản cảm, ác cảm','Danh từ','반감을 샀어요.','Tôi đã gây ác cảm.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1018,'topik4_193',4,'배경','bae-gyeong','bối cảnh, nền tảng','Danh từ','배경을 이해해야 해요.','Phải hiểu bối cảnh.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1019,'topik4_194',4,'상충되다','sang-chung-doe-da','xung đột, mâu thuẫn','Động từ','이해가 상충돼요.','Lợi ích xung đột.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1020,'topik4_195',4,'실효성','sil-hyo-seong','tính hiệu quả thực tế','Danh từ','실효성이 없어요.','Không có hiệu quả thực tế.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1021,'topik4_196',4,'심미적','sim-mi-jeok','mang tính thẩm mỹ','Tính từ','심미적 가치가 있어요.','Có giá trị thẩm mỹ.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1022,'topik4_197',4,'엄중하다','eom-jung-ha-da','nghiêm trọng, nghiêm khắc','Tính từ','엄중한 처벌이 필요해요.','Cần hình phạt nghiêm khắc.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1023,'topik4_198',4,'입지','ip-ji','vị trí, địa thế','Danh từ','입지가 좋아요.','Vị trí tốt.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1024,'topik4_199',4,'제고되다','je-go-doe-da','được nâng cao','Động từ','인식이 제고됐어요.','Nhận thức đã được nâng cao.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1025,'topik4_200',4,'필연','pil-yeon','sự tất yếu','Danh từ','필연의 결과예요.','Đây là kết quả tất yếu.','intermediate',NULL,1,NULL,'2026-09-24 13:47:52','2026-09-24 13:47:52'),(1026,'topik5_001',5,'가관이다','ga-gwan-i-da','thật là nực cười, thật là đáng xem','Tính từ','그 태도는 가관이었어요.','Thái độ đó thật là nực cười.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1027,'topik5_002',5,'가공할','ga-gong-hal','đáng kinh ngạc, phi thường','Tính từ','가공할 만한 성과예요.','Đó là thành tựu đáng kinh ngạc.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1028,'topik5_003',5,'가닥','ga-dak','sợi, tao, nhánh','Danh từ','실 한 가닥이 끊어졌어요.','Một sợi chỉ đã đứt.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1029,'topik5_004',5,'가리다','ga-ri-da','che, giấu; kén chọn','Động từ','음식을 가려서 먹어요.','Tôi kén chọn khi ăn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1030,'topik5_005',5,'가사','ga-sa','việc nhà; ca từ','Danh từ','가사를 분담하지 않으면 힘들어요.','Nếu không chia sẻ việc nhà thì sẽ vất vả.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1031,'topik5_006',5,'가상','ga-sang','giả định, ảo','Danh từ','가상 시나리오를 만들어요.','Tôi xây dựng kịch bản giả định.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1032,'topik5_007',5,'가세','ga-se','sự hùa theo, tham gia','Danh từ','그도 논쟁에 가세했어요.','Anh ấy cũng tham gia vào cuộc tranh luận.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1033,'topik5_008',5,'가속','ga-sok','sự gia tốc, tăng tốc','Danh từ','성장에 가속이 붙었어요.','Sự phát triển đã tăng tốc.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1034,'topik5_009',5,'가시적','ga-si-jeok','hữu hình, có thể thấy','Tính từ','가시적 성과가 나타났어요.','Thành quả hữu hình đã xuất hiện.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1035,'topik5_010',5,'가언','ga-eon','giả ngôn, giả thuyết','Danh từ','가언적 명제예요.','Đó là mệnh đề giả thuyết.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1036,'topik5_011',5,'각론','gang-ron','sự bàn luận chi tiết từng phần','Danh từ','각론으로 들어갔어요.','Chúng tôi đi vào bàn luận chi tiết.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1037,'topik5_012',5,'각인','gak-in','sự khắc sâu','Danh từ','강한 각인을 남겼어요.','Đã để lại ấn tượng khắc sâu.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1038,'topik5_013',5,'간과하다','gan-gwa-ha-da','xem nhẹ, bỏ qua','Động từ','중요한 사실을 간과했어요.','Tôi đã bỏ qua sự thật quan trọng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1039,'topik5_014',5,'간극','gan-geuk','khoảng cách, sự khác biệt','Danh từ','이론과 실제의 간극이 커요.','Khoảng cách giữa lý thuyết và thực tế lớn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1040,'topik5_015',5,'간파하다','gan-pa-ha-da','nhìn thấu, thấu hiểu','Động từ','그는 의도를 간파했어요.','Anh ấy đã nhìn thấu ý đồ.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1041,'topik5_016',5,'갈등','gal-deung','mâu thuẫn, xung đột','Danh từ','갈등을 해소했어요.','Tôi đã giải quyết mâu thuẫn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1042,'topik5_017',5,'감개무량','gam-gae-mu-ryang','cảm xúc vô vàn','Danh từ','감개무량한 마음이에요.','Lòng tôi cảm xúc vô vàn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1043,'topik5_018',5,'감내하다','gam-nae-ha-da','chịu đựng, cam chịu','Động từ','고통을 감내했어요.','Tôi đã chịu đựng nỗi đau.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1044,'topik5_019',5,'감률','gam-ryul','sự giảm tỷ lệ','Danh từ','감률이 높아졌어요.','Tỷ lệ giảm đã tăng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1045,'topik5_020',5,'감지덕지','gam-ji-deok-ji','vô cùng biết ơn','Tính từ','도와주셔서 감지덕지예요.','Tôi vô cùng biết ơn vì được giúp.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1046,'topik5_021',5,'강구','gang-gu','sự tìm cách, mưu cầu','Danh từ','대책 강구가 시급해요.','Việc tìm đối sách là cấp bách.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1047,'topik5_022',5,'강령','gang-ryeong','cương lĩnh','Danh từ','정당의 강령을 발표했어요.','Đảng đã công bố cương lĩnh.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1048,'topik5_023',5,'개략','gae-ryak','sự khái lược, đại cương','Danh từ','개략적으로 설명했어요.','Tôi đã giải thích khái lược.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1049,'topik5_024',5,'개연성','gae-yeon-seong','tính khả dĩ, tính có thể xảy ra','Danh từ','개연성이 높은 이야기예요.','Đó là câu chuyện có tính khả dĩ cao.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1050,'topik5_025',5,'객관식','gaek-gwan-sik','hình thức trắc nghiệm','Danh từ','객관식 문제가 많아요.','Có nhiều câu hỏi trắc nghiệm.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1051,'topik5_026',5,'거론','geo-ron','sự đề cập, nhắc đến','Danh từ','그 문제는 거론조차 안 됐어요.','Vấn đề đó thậm chí không được đề cập.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1052,'topik5_027',5,'건지다','geon-ji-da','vớt lên, cứu vớt','Động từ','물에서 건져냈어요.','Tôi đã vớt nó lên khỏi nước.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1053,'topik5_028',5,'걸맞다','geol-mat-da','thích hợp, xứng đáng','Tính từ','나이에 걸맞은 행동을 해요.','Hãy hành động phù hợp với tuổi.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1054,'topik5_029',5,'격조','gyeok-jo','phong cách, khí chất','Danh từ','격조 높은 문장이에요.','Đó là câu văn mang phong cách cao.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1055,'topik5_030',5,'견강부회','gyeon-gang-bu-hoe','gán ghép khiên cưỡng','Danh từ','견강부회식 해석이에요.','Đó là cách giải thích gán ghép khiên cưỡng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1056,'topik5_031',5,'견해','gyeon-hae','kiến giải, quan điểm','Danh từ','견해 차이가 커요.','Sự khác biệt quan điểm lớn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1057,'topik5_032',5,'결부','gyeol-bu','sự gắn liền, liên hệ','Danh từ','정치와의 결부는 곤란해요.','Gắn liền với chính trị là điều khó.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1058,'topik5_033',5,'결집','gyeol-jip','sự tập hợp, đoàn kết','Danh từ','힘의 결집이 필요해요.','Cần tập hợp sức mạnh.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1059,'topik5_034',5,'겸허','gyeom-heo','sự khiêm nhường','Danh từ','겸허한 자세로 배워요.','Tôi học với thái độ khiêm nhường.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1060,'topik5_035',5,'경도','gyeong-do','kinh độ; độ cứng','Danh từ','경도를 측정했어요.','Tôi đã đo kinh độ.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1061,'topik5_036',5,'경시','gyeong-si','sự xem nhẹ, coi thường','Danh từ','경시 풍조가 문제예요.','Xu hướng coi thường là vấn đề.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1062,'topik5_037',5,'경직되다','gyeong-jik-doe-da','bị cứng nhắc, bị đóng băng','Động từ','조직이 경직됐어요.','Tổ chức trở nên cứng nhắc.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1063,'topik5_038',5,'계도','gye-do','sự khai sáng, dẫn dắt','Danh từ','계도 활동을 했어요.','Chúng tôi đã làm hoạt động khai sáng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1064,'topik5_039',5,'고답적','go-dap-jeok','cổ hủ, lỗi thời','Tính từ','고답적인 사고방식이에요.','Đó là cách tư duy cổ hủ.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1065,'topik5_040',5,'고도','go-do','trình độ cao','Danh từ','고도의 기술이 필요해요.','Cần kỹ thuật trình độ cao.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1066,'topik5_041',5,'고매하다','go-mae-ha-da','cao thượng, cao quý','Tính từ','고매한 인격이에요.','Đó là nhân cách cao thượng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1067,'topik5_042',5,'고발','go-bal','sự tố giác, tố cáo','Danh từ','부패를 고발했어요.','Tôi đã tố giác tham nhũng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1068,'topik5_043',5,'고뇌','go-noe','sự khổ não, trăn trở','Danh từ','고뇌에 찬 표정이에요.','Vẻ mặt đầy khổ não.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1069,'topik5_044',5,'고답','go-dap','sự cổ hủ, lỗi thời','Danh từ','고답을 벗어나야 해요.','Phải thoát khỏi sự cổ hủ.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1070,'topik5_045',5,'곡해하다','gok-hae-ha-da','hiểu sai, xuyên tạc','Động từ','의도를 곡해했어요.','Tôi đã hiểu sai ý định.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1071,'topik5_046',5,'공공연히','gong-gong-yeon-hi','công khai, hiển nhiên','Phó từ','공공연히 비판했어요.','Anh ấy đã công khai chỉ trích.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1072,'topik5_047',5,'공론','gong-ron','công luận, thảo luận công khai','Danh từ','공론을 모았어요.','Chúng tôi đã thu thập công luận.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1073,'topik5_048',5,'공리','gong-ri','công lý, lẽ phải chung','Danh từ','공리에 맞는 판단이에요.','Đó là phán đoán đúng với lẽ phải.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1074,'topik5_049',5,'공변되다','gong-byeon-doe-da','cùng biến đổi, tương quan','Động từ','두 요소가 공변돼요.','Hai yếu tố cùng biến đổi.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1075,'topik5_050',5,'공시되다','gong-si-doe-da','được công bố, được niêm yết','Động từ','가격이 공시됐어요.','Giá đã được niêm yết.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1076,'topik5_051',5,'과대평가','gwa-dae-pyeong-ga','sự đánh giá quá cao','Danh từ','과대평가된 면이 있어요.','Có mặt được đánh giá quá cao.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1077,'topik5_052',5,'과시하다','gwa-si-ha-da','phô trương, khoe khoang','Động từ','실력을 과시했어요.','Anh ấy đã phô trương thực lực.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1078,'topik5_053',5,'관념','gwan-nyeom','quan niệm','Danh từ','고정 관념을 버려요.','Hãy từ bỏ quan niệm cố định.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1079,'topik5_054',5,'관류하다','gwan-ryu-ha-da','xuyên suốt, chảy qua','Động từ','작품에 일관성이 관류해요.','Tính nhất quán xuyên suốt tác phẩm.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1080,'topik5_055',5,'괴리감','goe-ri-gam','cảm giác tách rời','Danh từ','괴리감을 느꼈어요.','Tôi cảm thấy sự tách rời.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1081,'topik5_056',5,'교감','gyo-gam','sự đồng cảm, giao cảm','Danh từ','독자와 교감했어요.','Tôi đã đồng cảm với độc giả.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1082,'topik5_057',5,'구태의연','gu-tae-ui-yeon','vẫn như cũ, không đổi mới','Tính từ','구태의연한 방식이에요.','Đó là cách làm cũ kỹ.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1083,'topik5_058',5,'구획','gu-hoek','sự phân chia khu vực','Danh từ','구획을 나눴어요.','Chúng tôi đã phân chia khu vực.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1084,'topik5_059',5,'국한되다','guk-han-doe-da','bị giới hạn, bị hạn chế','Động từ','범위가 국한돼 있어요.','Phạm vi bị giới hạn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1085,'topik5_060',5,'궁극적','gung-geuk-jeok','mang tính cuối cùng, tột cùng','Tính từ','궁극적인 목표예요.','Đó là mục tiêu cuối cùng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1086,'topik5_061',5,'권고','gwon-go','sự khuyến nghị, đề nghị','Danh từ','권고를 받아들였어요.','Tôi đã chấp nhận khuyến nghị.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1087,'topik5_062',5,'궤변','gwe-byeon','ngụy biện','Danh từ','궤변을 늘어놓았어요.','Anh ấy đã nói lời ngụy biện.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1088,'topik5_063',5,'귀결되다','gwi-gyeol-doe-da','dẫn đến, quy về','Động từ','결국 실패로 귀결됐어요.','Cuối cùng dẫn đến thất bại.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1089,'topik5_064',5,'귀속','gwi-sok','sự quy thuộc','Danh từ','재산 귀속 문제예요.','Đây là vấn đề quy thuộc tài sản.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1090,'topik5_065',5,'규명','gyu-myeong','sự làm rõ, xác minh','Danh từ','진상 규명이 필요해요.','Cần làm rõ sự thật.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1091,'topik5_066',5,'균형','gyun-hyeong','sự cân bằng','Danh từ','균형을 잡았어요.','Tôi đã lấy lại cân bằng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1092,'topik5_067',5,'극명하다','geung-myeong-ha-da','rõ rệt, tương phản','Tính từ','대비가 극명해요.','Sự tương phản rõ rệt.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1093,'topik5_068',5,'극복','geuk-bok','sự khắc phục, vượt qua','Danh từ','위기 극복의 계기예요.','Đó là cơ hội vượt qua khủng hoảng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1094,'topik5_069',5,'근간','geun-gan','nền tảng, căn cơ','Danh từ','사회의 근간이에요.','Đó là nền tảng của xã hội.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1095,'topik5_070',5,'근거리','geun-geo-ri','cự ly gần','Danh từ','근거리 통신이 발달했어요.','Truyền thông cự ly gần đã phát triển.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1096,'topik5_071',5,'금기시되다','geum-gi-si-doe-da','bị coi là điều cấm kỵ','Động từ','그 주제는 금기시돼요.','Chủ đề đó bị coi là cấm kỵ.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1097,'topik5_072',5,'급진적','geup-jin-jeok','cấp tiến, cực đoan','Tính từ','급진적인 주장이에요.','Đó là chủ trương cấp tiến.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1098,'topik5_073',5,'기대다','gi-dae-da','dựa vào, ỷ lại','Động từ','남에게 기대지 마세요.','Đừng ỷ lại vào người khác.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1099,'topik5_074',5,'기승','gi-seung','sự hoành hành, lan tràn','Danh từ','폭염이 기승을 부려요.','Nắng nóng đang hoành hành.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1100,'topik5_075',5,'기인','gi-in','nguyên nhân, sự bắt nguồn','Danh từ','실패는 방심에 기인해요.','Thất bại bắt nguồn từ sự lơ là.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1101,'topik5_076',5,'기저','gi-jeo','nền tảng, cơ sở','Danh từ','기저에 깔린 문제예요.','Đây là vấn đề nằm ở nền tảng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1102,'topik5_077',5,'긴요하다','gin-yo-ha-da','cần thiết, quan trọng','Tính từ','긴요한 사안이에요.','Đây là vấn đề quan trọng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1103,'topik5_078',5,'난맥상','nan-maek-sang','tình trạng rối ren','Danh từ','난맥상을 드러냈어요.','Tình trạng rối ren đã lộ ra.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1104,'topik5_079',5,'난무하다','nan-mu-ha-da','tràn lan, hoành hành','Động từ','가짜 뉴스가 난무해요.','Tin giả tràn lan.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1105,'topik5_080',5,'남용','nam-yong','sự lạm dụng','Danh từ','권력 남용을 막아야 해요.','Phải ngăn chặn lạm dụng quyền lực.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1106,'topik5_081',5,'낭만적','nang-man-jeok','mang tính lãng mạn','Tính từ','낭만적인 분위기예요.','Bầu không khí lãng mạn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1107,'topik5_082',5,'내포','nae-po','sự hàm chứa','Danh từ','깊은 내포가 있어요.','Có sự hàm chứa sâu sắc.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1108,'topik5_083',5,'냉철하다','naeng-cheol-ha-da','lạnh lùng, sáng suốt','Tính từ','냉철한 판단이 필요해요.','Cần phán đoán sáng suốt.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1109,'topik5_084',5,'논지','non-ji','luận điểm','Danh từ','논지가 명확해요.','Luận điểm rõ ràng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1110,'topik5_085',5,'논평','non-pyeong','bình luận','Danh từ','논평을 발표했어요.','Tôi đã đưa ra bình luận.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1111,'topik5_086',5,'다기능','da-gi-neung','đa chức năng','Danh từ','다기능 기기예요.','Đó là thiết bị đa chức năng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1112,'topik5_087',5,'다변화','da-byeon-hwa','sự đa dạng hóa','Danh từ','시장 다변화가 필요해요.','Cần đa dạng hóa thị trường.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1113,'topik5_088',5,'다층적','da-cheung-jeok','mang tính đa tầng','Tính từ','다층적인 구조예요.','Đó là cấu trúc đa tầng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1114,'topik5_089',5,'단기적','dan-gi-jeok','mang tính ngắn hạn','Tính từ','단기적인 성과를 원해요.','Tôi muốn thành quả ngắn hạn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1115,'topik5_090',5,'단언하다','dan-eon-ha-da','khẳng định','Động từ','그는 확실하다고 단언했어요.','Anh ấy khẳng định là chắc chắn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1116,'topik5_091',5,'당위','dang-wi','tính tất yếu, lẽ phải','Danh từ','당위성을 강조했어요.','Tôi đã nhấn mạnh tính tất yếu.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1117,'topik5_092',5,'대두','dae-du','sự nổi lên','Danh từ','새로운 이슈의 대두예요.','Đây là sự nổi lên của vấn đề mới.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1118,'topik5_093',5,'대립','dae-rip','sự đối lập, đối đầu','Danh từ','양측이 대립했어요.','Hai bên đã đối đầu.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1119,'topik5_094',5,'대변하다','dae-byeon-ha-da','đại diện, phản ánh','Động từ','국민을 대변해요.','Tôi đại diện cho nhân dân.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1120,'topik5_095',5,'대안적','dae-an-jeok','mang tính thay thế','Tính từ','대안적 방안을 찾아요.','Tôi tìm phương án thay thế.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1121,'topik5_096',5,'도급','do-geup','sự thầu khoán','Danh từ','도급 계약을 했어요.','Chúng tôi đã ký hợp đồng thầu.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1122,'topik5_097',5,'도래하다','do-rae-ha-da','đến, tới','Động từ','새 시대가 도래했어요.','Thời đại mới đã đến.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1123,'topik5_098',5,'도모하다','do-mo-ha-da','mưu cầu, tìm cách','Động từ','발전을 도모해요.','Tôi mưu cầu sự phát triển.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1124,'topik5_099',5,'도사리다','do-sa-ri-da','ẩn chứa, tiềm ẩn','Động từ','위험이 도사리고 있어요.','Nguy hiểm đang tiềm ẩn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1125,'topik5_100',5,'독려하다','dok-ryeo-ha-da','khích lệ, động viên','Động từ','직원들을 독려했어요.','Tôi đã động viên nhân viên.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1126,'topik5_101',5,'동반되다','dong-ban-doe-da','đi kèm, song hành','Động từ','위험이 동반돼요.','Nguy hiểm đi kèm.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1127,'topik5_102',5,'동원되다','dong-won-doe-da','được huy động','Động từ','인력이 동원됐어요.','Nhân lực đã được huy động.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1128,'topik5_103',5,'두각','du-gak','sự nổi trội','Danh từ','두각을 나타냈어요.','Anh ấy đã thể hiện sự nổi trội.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1129,'topik5_104',5,'등한시','deung-han-si','sự xem nhẹ','Danh từ','건강을 등한시했어요.','Tôi đã xem nhẹ sức khỏe.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1130,'topik5_105',5,'매개','mae-gae','sự trung gian, môi giới','Danh từ','매개 역할을 했어요.','Tôi đã đóng vai trò trung gian.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1131,'topik5_106',5,'매진하다','mae-jin-ha-da','dốc toàn lực, nỗ lực hết mình','Động từ','목표를 위해 매진해요.','Tôi dốc toàn lực vì mục tiêu.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1132,'topik5_107',5,'맹목적','maeng-mok-jeok','mù quáng','Tính từ','맹목적인 추종이에요.','Đó là sự theo đuổi mù quáng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1133,'topik5_108',5,'면모','myeon-mo','diện mạo, bộ mặt','Danh từ','새로운 면모를 보여줬어요.','Anh ấy đã thể hiện diện mạo mới.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1134,'topik5_109',5,'모색','mo-saek','sự tìm kiếm','Danh từ','해결책 모색이 필요해요.','Cần tìm kiếm giải pháp.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1135,'topik5_110',5,'모순되다','mo-sun-doe-da','mâu thuẫn','Động từ','말과 행동이 모순돼요.','Lời nói và hành động mâu thuẫn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1136,'topik5_111',5,'목전','mok-jeon','trước mắt','Danh từ','목전에 닥친 문제예요.','Đó là vấn đề trước mắt.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1137,'topik5_112',5,'무마하다','mu-ma-ha-da','xoa dịu, dàn xếp','Động từ','논란을 무마했어요.','Họ đã dàn xếp cuộc tranh cãi.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1138,'topik5_113',5,'무용지물','mu-yong-ji-mul','vô dụng, đồ bỏ đi','Danh từ','이제 무용지물이 됐어요.','Giờ nó trở nên vô dụng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1139,'topik5_114',5,'무자비하다','mu-ja-bi-ha-da','tàn nhẫn, vô tình','Tính từ','무자비한 비판이에요.','Đó là lời chỉ trích tàn nhẫn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1140,'topik5_115',5,'문란하다','mul-lan-ha-da','hỗn loạn, rối ren','Tính từ','질서가 문란해요.','Trật tự hỗn loạn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1141,'topik5_116',5,'미시적','mi-si-jeok','mang tính vi mô','Tính từ','미시적으로 분석해요.','Tôi phân tích ở góc độ vi mô.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1142,'topik5_117',5,'민감하다','min-gam-ha-da','nhạy cảm','Tính từ','그 문제에 민감해요.','Tôi nhạy cảm với vấn đề đó.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1143,'topik5_118',5,'반감','ban-gam','sự phản cảm','Danh từ','반감을 샀어요.','Tôi đã gây phản cảm.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1144,'topik5_119',5,'반증','ban-jeung','bằng chứng phản bác','Danh từ','반증을 제시했어요.','Tôi đã đưa ra bằng chứng phản bác.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1145,'topik5_120',5,'발현되다','bal-hyeon-doe-da','được biểu hiện, bộc lộ','Động từ','증상이 발현됐어요.','Triệu chứng đã bộc lộ.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1146,'topik5_121',5,'방관하다','bang-gwan-ha-da','đứng nhìn, khoanh tay đứng nhìn','Động từ','그냥 방관했어요.','Tôi đã chỉ khoanh tay đứng nhìn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1147,'topik5_122',5,'배격','bae-gyeok','sự bài xích, bác bỏ','Danh từ','배격해야 할 사상이에요.','Đó là tư tưởng cần bác bỏ.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1148,'topik5_123',5,'배제','bae-je','sự loại trừ','Danh từ','가능성 배제는 안 돼요.','Không được loại trừ khả năng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1149,'topik5_124',5,'번복하다','beon-bok-ha-da','lật ngược, thay đổi','Động từ','결정을 번복했어요.','Tôi đã thay đổi quyết định.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1150,'topik5_125',5,'범람하다','beom-ram-ha-da','tràn ngập, tràn lan','Động từ','정보가 범람해요.','Thông tin tràn ngập.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1151,'topik5_126',5,'변모','byeon-mo','sự biến đổi, thay đổi diện mạo','Danh từ','도시가 변모했어요.','Thành phố đã biến đổi.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1152,'topik5_127',5,'변별','byeon-byeol','sự phân biệt','Danh từ','변별력이 있어야 해요.','Phải có khả năng phân biệt.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1153,'topik5_128',5,'보편타당','bo-pyeon-ta-dang','phổ quát và đúng đắn','Tính từ','보편타당한 원리예요.','Đó là nguyên lý phổ quát và đúng đắn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1154,'topik5_129',5,'복합적','bok-hap-jeok','mang tính phức hợp','Tính từ','복합적인 문제예요.','Đó là vấn đề phức hợp.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1155,'topik5_130',5,'부각','bu-gak','sự nổi bật','Danh từ','중요성이 부각됐어요.','Tầm quan trọng đã nổi bật.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1156,'topik5_131',5,'부단하다','bu-dan-ha-da','không ngừng, miệt mài','Tính từ','부단한 노력이 필요해요.','Cần nỗ lực không ngừng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1157,'topik5_132',5,'부정적','bu-jeong-jeok','tiêu cực','Tính từ','부정적 영향을 줬어요.','Đã gây ảnh hưởng tiêu cực.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1158,'topik5_133',5,'분간하다','bun-gan-ha-da','phân biệt, nhận rõ','Động từ','진위를 분간했어요.','Tôi đã phân biệt thật giả.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1159,'topik5_134',5,'불가피','bul-ga-pi','sự không thể tránh khỏi','Danh từ','불가피한 선택이에요.','Đó là lựa chọn không thể tránh khỏi.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1160,'topik5_135',5,'불문하고','bul-mun-ha-go','bất kể, không kể','Liên từ','이유를 불문하고 안 돼요.','Bất kể lý do gì cũng không được.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1161,'topik5_136',5,'불식','bul-sik','sự xóa tan','Danh từ','의혹을 불식했어요.','Tôi đã xóa tan nghi ngờ.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1162,'topik5_137',5,'비등하다','bi-deung-ha-da','ngang bằng, tương đương','Tính từ','실력이 비등해요.','Thực lực ngang bằng nhau.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1163,'topik5_138',5,'비약적','bi-yak-jeok','mang tính nhảy vọt','Tính từ','비약적 발전이에요.','Đó là sự phát triển nhảy vọt.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1164,'topik5_139',5,'비판적','bi-pan-jeok','mang tính phê phán','Tính từ','비판적 사고가 필요해요.','Cần tư duy phê phán.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1165,'topik5_140',5,'사대주의','sa-dae-ju-ui','chủ nghĩa sùng ngoại','Danh từ','사대주의를 경계해요.','Tôi cảnh giác với chủ nghĩa sùng ngoại.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1166,'topik5_141',5,'사료되다','sa-ryo-doe-da','được cho là, được xem là','Động từ','타당하다고 사료돼요.','Được cho là hợp lý.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1167,'topik5_142',5,'상당','sang-dang','sự tương đương, khá nhiều','Danh từ','상당한 시간이 걸려요.','Mất khá nhiều thời gian.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1168,'topik5_143',5,'상반되다','sang-ban-doe-da','tương phản, trái ngược','Động từ','의견이 상반돼요.','Ý kiến trái ngược nhau.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1169,'topik5_144',5,'상쇄되다','sang-soe-doe-da','bị triệt tiêu, bù trừ','Động từ','효과가 상쇄됐어요.','Hiệu quả bị triệt tiêu.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1170,'topik5_145',5,'상정하다','sang-jeong-ha-da','đặt giả định, đưa ra','Động từ','안건을 상정했어요.','Chúng tôi đã đưa ra nghị án.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1171,'topik5_146',5,'색채','saek-chae','màu sắc, sắc thái','Danh từ','정치적 색채가 강해요.','Sắc thái chính trị mạnh.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1172,'topik5_147',5,'선행','seon-haeng','sự đi trước, tiên phong','Danh từ','선행 학습을 해요.','Tôi học trước chương trình.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1173,'topik5_148',5,'섭리','seop-ri','sự an bài, thiên lý','Danh từ','자연의 섭리예요.','Đó là thiên lý của tự nhiên.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1174,'topik5_149',5,'성찰적','seong-chal-jeok','mang tính tự vấn','Tính từ','성찰적 태도가 필요해요.','Cần thái độ tự vấn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1175,'topik5_150',5,'소지','so-ji','khả năng tiềm ẩn, sự sở hữu','Danh từ','문제 소지가 있어요.','Có khả năng tiềm ẩn vấn đề.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1176,'topik5_151',5,'수렴되다','su-ryeom-doe-da','được hội tụ, thu thập','Động từ','의견이 수렴됐어요.','Ý kiến đã được thu thập.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1177,'topik5_152',5,'수반','su-ban','sự đi kèm','Danh từ','책임이 수반되는 일이에요.','Đó là công việc đi kèm trách nhiệm.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1178,'topik5_153',5,'수용성','su-yong-seong','tính tiếp nhận, khả năng chấp nhận','Danh từ','수용성이 높아요.','Khả năng tiếp nhận cao.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1179,'topik5_154',5,'순기능','sun-gi-neung','chức năng tích cực','Danh từ','순기능도 있어요.','Cũng có chức năng tích cực.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1180,'topik5_155',5,'시사점','si-sa-jeom','điểm gợi mở, bài học','Danh từ','시사점을 던져줬어요.','Nó đã mang lại bài học gợi mở.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1181,'topik5_156',5,'실효','sil-hyo','hiệu quả thực tế','Danh từ','실효를 거뒀어요.','Đã đạt hiệu quả thực tế.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1182,'topik5_157',5,'심층적','sim-cheung-jeok','mang tính chiều sâu','Tính từ','심층적인 분석이에요.','Đó là phân tích có chiều sâu.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1183,'topik5_158',5,'쓰라리다','sseu-ra-ri-da','đau xót, cay đắng','Tính từ','마음이 쓰라려요.','Lòng tôi đau xót.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1184,'topik5_159',5,'아우르다','a-u-reu-da','bao trùm, bao quát','Động từ','모든 분야를 아울러요.','Bao quát mọi lĩnh vực.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1185,'topik5_160',5,'안이하다','an-i-ha-da','dễ dãi, cẩu thả','Tính từ','안이한 생각이에요.','Đó là suy nghĩ dễ dãi.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1186,'topik5_161',5,'암시되다','am-si-doe-da','được ám chỉ','Động từ','그 사실이 암시됐어요.','Sự thật đó đã được ám chỉ.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1187,'topik5_162',5,'애매모호','ae-mae-mo-ho','mơ hồ, không rõ ràng','Tính từ','답변이 애매모호해요.','Câu trả lời mơ hồ.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1188,'topik5_163',5,'양산하다','yang-san-ha-da','sản sinh hàng loạt','Động từ','문제를 양산했어요.','Nó đã sản sinh ra hàng loạt vấn đề.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1189,'topik5_164',5,'역기능','yeok-gi-neung','chức năng tiêu cực','Danh từ','역기능이 나타났어요.','Chức năng tiêu cực đã xuất hiện.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1190,'topik5_165',5,'역설','yeok-seol','nghịch lý','Danh từ','역설적인 상황이에요.','Đó là tình huống nghịch lý.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1191,'topik5_166',5,'연계되다','yeon-gye-doe-da','được liên kết','Động từ','사업이 연계됐어요.','Các dự án đã được liên kết.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1192,'topik5_167',5,'열거하다','yeol-geo-ha-da','liệt kê','Động từ','사례를 열거했어요.','Tôi đã liệt kê các ví dụ.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1193,'topik5_168',5,'예시','ye-si','sự ví dụ, dẫn chứng','Danh từ','예시를 들어 설명해요.','Tôi giải thích bằng ví dụ.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1194,'topik5_169',5,'요약','yo-yak','sự tóm tắt','Danh từ','내용을 요약했어요.','Tôi đã tóm tắt nội dung.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1195,'topik5_170',5,'용인되다','yong-in-doe-da','được dung thứ, chấp nhận','Động từ','그런 행동은 용인되지 않아요.','Hành vi như vậy không được chấp nhận.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1196,'topik5_171',5,'우회적','u-hoe-jeok','mang tính vòng vo, gián tiếp','Tính từ','우회적으로 표현했어요.','Tôi đã diễn đạt một cách vòng vo.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1197,'topik5_172',5,'원론적','won-ron-jeok','mang tính nguyên tắc','Tính từ','원론적인 답변이에요.','Đó là câu trả lời mang tính nguyên tắc.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1198,'topik5_173',5,'위상','wi-sang','vị thế, địa vị','Danh từ','위상이 높아졌어요.','Vị thế đã được nâng cao.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1199,'topik5_174',5,'유기적','yu-gi-jeok','mang tính hữu cơ, gắn kết','Tính từ','유기적인 관계예요.','Đó là mối quan hệ hữu cơ.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1200,'topik5_175',5,'유보하다','yu-bo-ha-da','bảo lưu, để lại','Động từ','결정을 유보했어요.','Tôi đã bảo lưu quyết định.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1201,'topik5_176',5,'융합','yung-hap','sự dung hợp, hòa trộn','Danh từ','기술 융합이 활발해요.','Sự dung hợp công nghệ đang sôi động.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1202,'topik5_177',5,'의거하다','ui-geo-ha-da','căn cứ vào, dựa vào','Động từ','사실에 의거해 판단해요.','Tôi phán đoán dựa trên sự thật.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1203,'topik5_178',5,'이견','i-gyeon','ý kiến khác biệt','Danh từ','이견이 좁혀지지 않아요.','Ý kiến khác biệt chưa được thu hẹp.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1204,'topik5_179',5,'이면','i-myeon','mặt trái, khía cạnh ẩn','Danh từ','이면을 살펴봐야 해요.','Phải xem xét mặt trái.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1205,'topik5_180',5,'이식되다','i-sik-doe-da','được cấy ghép, du nhập','Động từ','제도가 이식됐어요.','Chế độ đã được du nhập.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1206,'topik5_181',5,'인과관계','in-gwa-gwan-gye','quan hệ nhân quả','Danh từ','인과관계를 따져요.','Tôi xem xét quan hệ nhân quả.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1207,'topik5_182',5,'일축하다','il-chuk-ha-da','bác bỏ ngay, phủ nhận','Động từ','소문을 일축했어요.','Anh ấy đã bác bỏ tin đồn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1208,'topik5_183',5,'잠재적','jam-jae-jeok','mang tính tiềm ẩn','Tính từ','잠재적 위험이 있어요.','Có nguy hiểm tiềm ẩn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1209,'topik5_184',5,'재고','jae-go','sự xem xét lại; tồn kho','Danh từ','계획 재고가 필요해요.','Cần xem xét lại kế hoạch.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1210,'topik5_185',5,'쟁점','jaeng-jeom','điểm tranh cãi','Danh từ','쟁점을 정리했어요.','Tôi đã sắp xếp các điểm tranh cãi.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1211,'topik5_186',5,'저변','jeo-byeon','nền tảng, cơ sở rộng','Danh từ','저변이 확대됐어요.','Nền tảng đã được mở rộng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1212,'topik5_187',5,'전제되다','jeon-je-doe-da','được tiền đề hóa','Động từ','신뢰가 전제돼 있어요.','Niềm tin được đặt làm tiền đề.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1213,'topik5_188',5,'절충안','jeol-chung-an','phương án dung hòa','Danh từ','절충안을 마련했어요.','Chúng tôi đã đưa ra phương án dung hòa.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1214,'topik5_189',5,'점증하다','jeom-jeung-ha-da','tăng dần','Động từ','관심이 점증해요.','Sự quan tâm đang tăng dần.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1215,'topik5_190',5,'정당성','jeong-dang-seong','tính chính đáng','Danh từ','정당성을 입증했어요.','Tôi đã chứng minh tính chính đáng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1216,'topik5_191',5,'제고','je-go','sự nâng cao','Danh từ','효율 제고가 필요해요.','Cần nâng cao hiệu quả.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1217,'topik5_192',5,'조장하다','jo-jang-ha-da','khuyến khích, cổ xúy (tiêu cực)','Động từ','부정을 조장해요.','Nó cổ xúy cho tiêu cực.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1218,'topik5_193',5,'주지하다','ju-ji-ha-da','biết rõ, nhận thức rõ','Động từ','주지하다시피 중요해요.','Như đã biết rõ, nó rất quan trọng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1219,'topik5_194',5,'지양하다','ji-yang-ha-da','tránh, bài trừ','Động từ','과소비를 지양해요.','Tôi tránh tiêu dùng quá mức.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1220,'topik5_195',5,'지향','ji-hyang','sự hướng tới','Danh từ','미래 지향의 사고예요.','Đó là tư duy hướng tới tương lai.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1221,'topik5_196',5,'직시하다','jik-si-ha-da','nhìn thẳng vào, đối diện','Động từ','현실을 직시해야 해요.','Phải nhìn thẳng vào thực tế.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1222,'topik5_197',5,'진일보','jin-il-bo','sự tiến thêm một bước','Danh từ','진일보한 모습이에요.','Đó là bước tiến mới.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1223,'topik5_198',5,'차별화','cha-byeol-hwa','sự tạo khác biệt','Danh từ','차별화 전략이 필요해요.','Cần chiến lược tạo khác biệt.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1224,'topik5_199',5,'척도','cheok-do','thước đo, tiêu chuẩn','Danh từ','성공의 척도예요.','Đó là thước đo của thành công.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1225,'topik5_200',5,'촉발하다','chok-bal-ha-da','châm ngòi, khơi mào','Động từ','논쟁을 촉발했어요.','Nó đã châm ngòi cho cuộc tranh luận.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1226,'topik5_201',5,'추론','chu-ron','sự suy luận','Danh từ','추론을 통해 답을 찾아요.','Tôi tìm đáp án qua suy luận.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1227,'topik5_202',5,'축소','chuk-so','sự thu nhỏ, cắt giảm','Danh từ','예산 축소가 불가피해요.','Việc cắt giảm ngân sách là không thể tránh khỏi.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1228,'topik5_203',5,'치부되다','chi-bu-doe-da','bị coi là, bị xem như','Động từ','그것은 실수로 치부됐어요.','Điều đó bị coi là sai sót.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1229,'topik5_204',5,'탕평','tang-pyeong','sự công bằng, không thiên vị','Danh từ','탕평 인사를 했어요.','Họ đã bổ nhiệm nhân sự công bằng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1230,'topik5_205',5,'토대','to-dae','nền tảng','Danh từ','토대를 마련했어요.','Tôi đã tạo nền tảng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1231,'topik5_206',5,'통용되다','tong-yong-doe-da','được thông dụng, lưu hành','Động từ','이 표현은 통용돼요.','Cách diễn đạt này được thông dụng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1232,'topik5_207',5,'투영되다','tu-yeong-doe-da','được phản chiếu','Động từ','시대상이 투영됐어요.','Tinh thần thời đại đã được phản chiếu.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1233,'topik5_208',5,'파급력','pa-geup-ryeok','sức lan tỏa','Danh từ','파급력이 커요.','Sức lan tỏa lớn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1234,'topik5_209',5,'편파적','pyeon-pa-jeok','thiên vị, phiến diện','Tính từ','편파적 보도예요.','Đó là bản tin thiên vị.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1235,'topik5_210',5,'평이하다','pyeong-i-ha-da','bình dị, dễ hiểu','Tính từ','평이한 문체예요.','Văn phong bình dị.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1236,'topik5_211',5,'포괄하다','po-gwal-ha-da','bao quát, bao hàm','Động từ','모든 경우를 포괄해요.','Bao quát mọi trường hợp.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1237,'topik5_212',5,'표방하다','pyo-bang-ha-da','đề xướng, tuyên bố theo đuổi','Động từ','중립을 표방했어요.','Họ tuyên bố theo đuổi sự trung lập.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1238,'topik5_213',5,'품격','pum-gyeok','phẩm cách','Danh từ','품격을 갖춘 태도예요.','Đó là thái độ có phẩm cách.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1239,'topik5_214',5,'함의되다','ham-ui-doe-da','được hàm ý','Động từ','그 뜻이 함의돼 있어요.','Ý nghĩa đó được hàm ý sẵn.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1240,'topik5_215',5,'해소되다','hae-so-doe-da','được giải tỏa, giải quyết','Động từ','갈등이 해소됐어요.','Xung đột đã được giải quyết.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1241,'topik5_216',5,'허구','heo-gu','sự hư cấu, bịa đặt','Danh từ','허구임이 드러났어요.','Đã lộ ra đó là hư cấu.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1242,'topik5_217',5,'현저하다','hyeon-jeo-ha-da','rõ rệt','Tính từ','차이가 현저해요.','Sự khác biệt rõ rệt.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1243,'topik5_218',5,'환원','hwan-won','sự quy về, hoàn nguyên','Danh từ','문제를 단순화시켜 환원했어요.','Tôi quy vấn đề về dạng đơn giản.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1244,'topik5_219',5,'활로','hwal-ro','lối thoát','Danh từ','활로를 모색했어요.','Tôi đã tìm kiếm lối thoát.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1245,'topik5_220',5,'회자되다','hoe-ja-doe-da','được truyền tụng, bàn tán','Động từ','그 말이 회자돼요.','Câu nói đó đang được bàn tán.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1246,'topik5_221',5,'획기적','hoek-gi-jeok','mang tính đột phá','Tính từ','획기적인 발명이에요.','Đó là phát minh mang tính đột phá.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1247,'topik5_222',5,'효시','hyo-si','sự khởi đầu, tiên phong','Danh từ','그것이 효시가 됐어요.','Điều đó đã trở thành sự khởi đầu.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1248,'topik5_223',5,'흡수되다','heup-su-doe-da','được hấp thụ, tiếp thu','Động từ','기술이 흡수됐어요.','Kỹ thuật đã được tiếp thu.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1249,'topik5_224',5,'희석되다','hui-seok-doe-da','bị pha loãng, giảm nhẹ','Động từ','의미가 희석됐어요.','Ý nghĩa đã bị pha loãng.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11'),(1250,'topik5_225',5,'가일층','ga-il-cheung','càng thêm, hơn nữa','Phó từ','가일층 노력해야 해요.','Phải càng thêm nỗ lực.','advanced',NULL,1,NULL,'2026-09-24 13:49:11','2026-09-24 13:49:11');
/*!40000 ALTER TABLE `vocabulary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vocabulary_attempts`
--

DROP TABLE IF EXISTS `vocabulary_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vocabulary_attempts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `word_id` bigint unsigned NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `attempted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_attempts_user_word` (`user_id`,`word_id`,`attempted_at`),
  KEY `idx_attempts_word` (`word_id`),
  CONSTRAINT `fk_attempts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_attempts_word` FOREIGN KEY (`word_id`) REFERENCES `vocabulary` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `vocabulary_attempts_chk_1` CHECK ((`is_correct` in (0,1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vocabulary_attempts`
--

LOCK TABLES `vocabulary_attempts` WRITE;
/*!40000 ALTER TABLE `vocabulary_attempts` DISABLE KEYS */;
/*!40000 ALTER TABLE `vocabulary_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vocabulary_categories`
--

DROP TABLE IF EXISTS `vocabulary_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vocabulary_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_vocabulary_categories_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vocabulary_categories`
--

LOCK TABLES `vocabulary_categories` WRITE;
/*!40000 ALTER TABLE `vocabulary_categories` DISABLE KEYS */;
INSERT INTO `vocabulary_categories` VALUES (1,'topik1','TOPIK 1 - Từ vựng sơ cấp','2026-09-24 13:41:06'),(2,'topik2','TOPIK 2 - Từ vựng trung cấp','2026-09-24 13:45:27'),(3,'topik3','TOPIK 3 - Từ vựng trung cao cấp','2026-09-24 13:46:50'),(4,'topik4','TOPIK 4 - Từ vựng trung cao cấp','2026-09-24 13:47:52'),(5,'topik5','TOPIK 5 - Từ vựng cao cấp','2026-09-24 13:49:11');
/*!40000 ALTER TABLE `vocabulary_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vocabulary_imports`
--

DROP TABLE IF EXISTS `vocabulary_imports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vocabulary_imports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `source_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_sha256` char(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `row_count` int NOT NULL DEFAULT '0',
  `imported_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_vocabulary_imports_sha256` (`file_sha256`),
  KEY `idx_vocabulary_imports_user` (`imported_by`),
  CONSTRAINT `fk_vocabulary_imports_user` FOREIGN KEY (`imported_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vocabulary_imports_chk_1` CHECK ((`row_count` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vocabulary_imports`
--

LOCK TABLES `vocabulary_imports` WRITE;
/*!40000 ALTER TABLE `vocabulary_imports` DISABLE KEYS */;
/*!40000 ALTER TABLE `vocabulary_imports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vocabulary_progress`
--

DROP TABLE IF EXISTS `vocabulary_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vocabulary_progress` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `word_id` bigint unsigned NOT NULL,
  `mastery_level` tinyint unsigned NOT NULL DEFAULT '0',
  `correct_count` int NOT NULL DEFAULT '0',
  `wrong_count` int NOT NULL DEFAULT '0',
  `last_reviewed_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_vocabulary_progress_user_word` (`user_id`,`word_id`),
  KEY `idx_progress_word` (`word_id`),
  CONSTRAINT `fk_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_progress_word` FOREIGN KEY (`word_id`) REFERENCES `vocabulary` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `vocabulary_progress_chk_1` CHECK ((`mastery_level` between 0 and 100)),
  CONSTRAINT `vocabulary_progress_chk_2` CHECK ((`correct_count` >= 0)),
  CONSTRAINT `vocabulary_progress_chk_3` CHECK ((`wrong_count` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vocabulary_progress`
--

LOCK TABLES `vocabulary_progress` WRITE;
/*!40000 ALTER TABLE `vocabulary_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `vocabulary_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wishlist_user_product` (`user_id`,`product_id`),
  KEY `idx_wishlist_product` (`product_id`),
  CONSTRAINT `fk_wishlist_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
INSERT INTO `wishlists` VALUES (3,1,15,'2026-09-23 18:28:13'),(5,1,14,'2026-09-23 18:28:35'),(6,1,13,'2026-09-23 18:28:36'),(7,1,10,'2026-09-23 18:28:38');
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-24 20:58:38
