CREATE DATABASE cosmetic_ms;

-- Buyers Table
CREATE TABLE buyer (
    buyer_id SERIAL PRIMARY KEY,
    buyer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    address TEXT NOT NULL,
    loyalty_points INTEGER DEFAULT 0 CHECK (loyalty_points >= 0)
);

-- Sellers Table
CREATE TABLE seller (
    seller_id SERIAL PRIMARY KEY,
    seller_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15)
);

-- Products Table
CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    stock_level INTEGER CHECK (stock_level >= 0),
    price NUMERIC(10, 2) CHECK (price >= 0),
    category_id INTEGER REFERENCES category (category_id) ON DELETE CASCADE,
    seller_id INTEGER REFERENCES seller (seller_id) 
);

-- Order Items Table
CREATE TABLE order_item (
    item_id SERIAL PRIMARY KEY,
    quantity INTEGER CHECK (quantity > 0),
    total_price NUMERIC(10, 2) CHECK (total_price >= 0),
    product_id INTEGER NOT NULL REFERENCES product (product_id),
    order_id INTEGER NOT NULL REFERENCES "order" (order_id)
);

-- Orders Table
CREATE TABLE "order" (
    order_id SERIAL PRIMARY KEY,
    order_date DATE NOT NULL,
    order_status VARCHAR(50) NOT NULL CHECK (order_status IN ('Pending', 'Completed', 'Cancelled')),
    buyer_id INTEGER REFERENCES buyer (buyer_id),
    seller_id INTEGER REFERENCES seller(seller_id)
);

-- Invoice Table
CREATE TABLE invoice (
    invoice_id SERIAL PRIMARY KEY,
    invoice_date DATE NOT NULL,
    total_amount NUMERIC(10, 2) CHECK (total_amount >= 0),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('Credit Card', 'Cash', 'Online')),
    order_id INTEGER NOT NULL REFERENCES "order" (order_id) UNIQUE
);

-- Shipping Table
CREATE TABLE shipping (
    shipping_id SERIAL PRIMARY KEY,
    shipping_date DATE NOT NULL,
    shipping_status VARCHAR(50) NOT NULL CHECK (shipping_status IN ('In Transit', 'Delivered', 'Pending')),
    delivery_time TIMESTAMP,
    order_id INTEGER NOT NULL REFERENCES "order" (order_id) UNIQUE,
    tracking_number VARCHAR(50),
    estimated_delivery_date DATE
);

-- Categories Table
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- Customer Feedback Table
CREATE TABLE customer_feedback (
    feedback_id SERIAL PRIMARY KEY,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    buyer_id INTEGER NOT NULL REFERENCES buyer (buyer_id),
    order_id INTEGER REFERENCES "order"(order_id)
);

-- order status history
CREATE TABLE order_status_history (
    history_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES "order"(order_id),
    status VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES seller(seller_id)
);