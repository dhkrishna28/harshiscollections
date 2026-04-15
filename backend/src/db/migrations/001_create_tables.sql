-- ============================================================
-- Harshis Collections Database Schema
-- Run once against a freshly created MySQL database.
-- Sequelize sync will handle most table creation, but this
-- file serves as a reference / seed for the initial structure.
-- ============================================================

CREATE DATABASE IF NOT EXISTS harshis_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE harshis_db;

-- ─── Admin Users ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('superadmin','admin','editor') DEFAULT 'admin',
  is_active TINYINT(1) DEFAULT 1,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── Users ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  is_active TINYINT(1) DEFAULT 1,
  is_verified TINYINT(1) DEFAULT 0,
  verification_token VARCHAR(255),
  reset_token VARCHAR(255),
  reset_token_expiry DATETIME,
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(80) DEFAULT 'India',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── Categories ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  image VARCHAR(255),
  parent_id INT UNSIGNED,
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ─── Products ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  -- ── Descriptive attributes (maps to AddProduct form fields) ──
  brand VARCHAR(120),
  material VARCHAR(80),
  craft_print_type VARCHAR(150),
  style VARCHAR(150),
  neckline VARCHAR(80),
  -- ── Rich-text content sections ────────────────────────────────
  description LONGTEXT,
  short_description TEXT,
  specifications LONGTEXT,
  wash_care LONGTEXT,
  shipping_info LONGTEXT,
  ideal_for LONGTEXT,
  -- ── Sizes – stored as JSON array e.g. ["S","M","L","XL","34"] ─
  sizes JSON,
  -- ── Identifiers ───────────────────────────────────────────────
  sku VARCHAR(80) UNIQUE,
  -- ── Pricing ───────────────────────────────────────────────────
  price DECIMAL(10,2) NOT NULL,            -- selling / actual price
  compare_at_price DECIMAL(10,2),          -- MRP / crossed-out price ("Compare-at Price" in form)
  -- ── Availability ──────────────────────────────────────────────
  availability_status ENUM('in_stock','out_of_stock') DEFAULT 'in_stock',
  stock_quantity INT DEFAULT 0,
  weight DECIMAL(8,2),
  -- ── Publishing ────────────────────────────────────────────────
  status ENUM('draft','published') DEFAULT 'published',   -- Save as Draft / Publish
  is_active TINYINT(1) DEFAULT 1,
  is_featured TINYINT(1) DEFAULT 0,
  -- ── SEO ───────────────────────────────────────────────────────
  meta_title VARCHAR(200),
  meta_description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- ─── Product Images ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  alt_text VARCHAR(200),
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ─── Carts ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS carts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL UNIQUE,
  session_token VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── Cart Items ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cart_id INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ─── Orders ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  order_number VARCHAR(40) NOT NULL UNIQUE,
  status ENUM('pending','processing','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
  payment_status ENUM('unpaid','paid','failed','refunded') DEFAULT 'unpaid',
  payment_method VARCHAR(60),
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_charge DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  notes TEXT,
  shipping_name VARCHAR(160) NOT NULL,
  shipping_phone VARCHAR(20),
  shipping_address VARCHAR(255) NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_state VARCHAR(100) NOT NULL,
  shipping_postal VARCHAR(20) NOT NULL,
  shipping_country VARCHAR(80) DEFAULT 'India',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- ─── Order Items ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  product_sku VARCHAR(80),
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- ─── Transactions ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL UNIQUE,
  transaction_id VARCHAR(120),
  gateway VARCHAR(60),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status ENUM('pending','success','failed','refunded') DEFAULT 'pending',
  gateway_response JSON,
  paid_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ─── CMS Pages ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms_pages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_key ENUM('about_us','faq','privacy_policy','terms_conditions') NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  content LONGTEXT,
  meta_title VARCHAR(200),
  meta_description TEXT,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── Contacts ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  status ENUM('new','read','replied','closed') DEFAULT 'new',
  replied_at DATETIME,
  admin_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── Seed: Default CMS Pages ──────────────────────────────────────────────────
INSERT IGNORE INTO cms_pages (page_key, title, content) VALUES
('about_us',         'About Us',              '<p>Add your About Us content here.</p>'),
('faq',              'Frequently Asked Questions', '<p>Add your FAQ content here.</p>'),
('privacy_policy',   'Privacy Policy',        '<p>Add your Privacy Policy content here.</p>'),
('terms_conditions', 'Terms &amp; Conditions','<p>Add your Terms &amp; Conditions here.</p>');

-- ─── Seed: Default Admin User ────────────────────────────────────────────────
-- Default credentials: admin@example.com / Admin@123
-- Change the password immediately after first login.
INSERT IGNORE INTO admin_users (name, email, password, role) VALUES
('Super Admin', 'admin@example.com', '$2a$12$YcRdMyafpEfDJNnMKr7fW.eXoxQC4CS3erGBAtvyYrjMZ.wDgjj3q', 'superadmin');
