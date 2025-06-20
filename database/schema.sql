-- PostgreSQL Database Schema for Qrobotics
-- Run this script to create the necessary tables

-- Create database (run this as superuser first)
-- CREATE DATABASE qrobotics;

-- Connect to the qrobotics database and run the following:

-- Users Table
CREATE TABLE Users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(11),
  date_registered TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ NULL,
  deleted_at TIMESTAMPTZ NULL
);

-- UserAddresses Table
CREATE TABLE UserAddresses (
  address_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  address_type VARCHAR(20) NOT NULL CHECK (address_type IN ('billing', 'shipping')),
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Admins Table
CREATE TABLE Admins (
  admin_id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'product_manager', 'order_manager')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

-- Categories Table
CREATE TABLE Categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_category_id INTEGER NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  FOREIGN KEY (parent_category_id) REFERENCES Categories(category_id)
);

-- Products Table
CREATE TABLE Products (
  product_id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_by INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  FOREIGN KEY (category_id) REFERENCES Categories(category_id),
  FOREIGN KEY (created_by) REFERENCES Admins(admin_id)
);

-- ProductImages Table
CREATE TABLE ProductImages (
  image_id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- ProductInventory Table
CREATE TABLE ProductInventory (
  inventory_id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  updated_by INTEGER NOT NULL,
  FOREIGN KEY (product_id) REFERENCES Products(product_id),
  FOREIGN KEY (updated_by) REFERENCES Admins(admin_id)
);

-- Orders Table
CREATE TABLE Orders (
  order_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  order_date TIMESTAMPTZ DEFAULT NOW(),
  total_amount NUMERIC(10,2) NOT NULL,
  shipping_address_id INTEGER NOT NULL,
  billing_address_id INTEGER NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  shipping_status VARCHAR(20) DEFAULT 'processing' CHECK (shipping_status IN ('processing', 'shipped', 'delivered', 'returned')),
  deleted_at TIMESTAMPTZ NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (shipping_address_id) REFERENCES UserAddresses(address_id),
  FOREIGN KEY (billing_address_id) REFERENCES UserAddresses(address_id)
);

-- OrderItems Table
CREATE TABLE OrderItems (
  order_item_id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price_at_time NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES Orders(order_id),
  FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- CartItems Table
CREATE TABLE CartItems (
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- ProductReviews Table
CREATE TABLE ProductReviews (
  review_id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  order_id INTEGER NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NULL,
  review_date TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (product_id, user_id),
  FOREIGN KEY (product_id) REFERENCES Products(product_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- AdminActivityLog Table
CREATE TABLE AdminActivityLog (
  log_id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('product_add', 'product_update', 'inventory_update', 'order_update')),
  entity_id INTEGER NOT NULL,
  description TEXT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address VARCHAR(50) NULL,
  FOREIGN KEY (admin_id) REFERENCES Admins(admin_id)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON Users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_useraddresses_updated_at BEFORE UPDATE ON UserAddresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON Admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON Categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON Products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON Products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON Products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON Products(deleted_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON Users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON Orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON OrderItems(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON OrderItems(product_id);
