import bcrypt from "bcryptjs";
import pool from "../utils/db.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, phone_number } = req.body;

    if (!fullname || !email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    const sellerCount = await pool.query(
      "SELECT COUNT(*) FROM seller WHERE email = $1",
      [email]
    );
    
    if (sellerCount.rows[0].count > 0) {
      return res.status(401).json({
        message: "Email is already registered",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO seller (seller_name, email, password, phone_number) VALUES ($1, $2, $3, $4)",
      [fullname, email, hashedPassword, phone_number]
    );

    return res.status(201).json({
      message: "seller account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    const sellerResult = await pool.query(
      "SELECT * FROM seller WHERE email = $1",
      [email]
    );
    if (sellerResult.rows.length === 0) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const seller = sellerResult.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, seller.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    return res.json({
        message: `Logged in`,
        success: true,
        seller: {
          seller_id: seller.seller_id,
          fullname: seller.seller_name,
          email: seller.email,
        },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const logout = async (_, res) => {
  try {
    return res.json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT product_id, product_name, product_description, stock_level, price, p.category_id, p.seller_id, s.seller_name, c.category_name FROM product p join seller s on p.seller_id = s.seller_id join category c on p.category_id = c.category_id");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getProductsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const result = await pool.query("SELECT * FROM product WHERE seller_id = $1", [sellerId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM product WHERE product_id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found", success: false });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { product_name, product_description, stock_level, price, category_id, seller_id } = req.body;
    const result = await pool.query(
      "INSERT INTO product (product_name, product_description, stock_level, price, category_id, seller_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [product_name, product_description, stock_level, price, category_id, seller_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, product_description, stock_level, price, category_id, seller_id } = req.body;
    const result = await pool.query(
      "UPDATE product SET product_name = $1, product_description = $2, stock_level = $3, price = $4, category_id = $5 WHERE product_id = $6 AND seller_id = $7 RETURNING *",
      [product_name, product_description, stock_level, price, category_id, id, seller_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found or you don't have permission to update it", success: false });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { seller_id } = req.body;
    const result = await pool.query("DELETE FROM product WHERE product_id = $1 AND seller_id = $2 RETURNING *", [id, seller_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found or you don't have permission to delete it", success: false });
    }
    res.json({ message: "Product deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM category");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM category WHERE category_id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found", success: false });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    const result = await pool.query(
      "INSERT INTO category (category_name) VALUES ($1) RETURNING *",
      [category_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;
    const result = await pool.query(
      "UPDATE category SET category_name = $1 WHERE category_id = $2 RETURNING *",
      [category_name, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found", success: false });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM category WHERE category_id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found", success: false });
    }
    res.json({ message: "Category deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getSellerOrders = async (req, res) => {
  const { seller_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        o.*, 
        b.buyer_name, 
        b.email, 
        b.phone_number, 
        b.address, 
        s.shipping_status, 
        s.tracking_number, 
        s.estimated_delivery_date,
        cf.rating, 
        cf.review,
        ARRAY_AGG(p.product_name) AS order_items,
        i.total_amount
      FROM "order" o
      JOIN buyer b ON o.buyer_id = b.buyer_id
      LEFT JOIN shipping s ON o.order_id = s.order_id
      LEFT JOIN customer_feedback cf ON o.order_id = cf.order_id
      LEFT JOIN order_item oi ON o.order_id = oi.order_id
      LEFT JOIN product p ON oi.product_id = p.product_id
      LEFT JOIN invoice i ON o.order_id = i.order_id
      WHERE o.seller_id = $1
      GROUP BY o.order_id, b.buyer_name, b.email, b.phone_number, b.address,
               s.shipping_status, s.tracking_number, s.estimated_delivery_date,
               cf.rating, cf.review, i.total_amount
      ORDER BY o.order_id DESC`,
      [seller_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  const { status, seller_id } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if the order exists and get its current status
    const orderResult = await client.query(
      'SELECT order_status FROM "order" WHERE order_id = $1',
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      throw new Error('Order not found');
    }

    const currentStatus = orderResult.rows[0].order_status;

    // Only allow specific status transitions
    if (
      (currentStatus === 'Pending' && (status === 'Completed' || status === 'Cancelled')) ||
      (currentStatus === 'Completed' && status === 'Cancelled')
    ) {
      await client.query(
        'UPDATE "order" SET order_status = $1 WHERE order_id = $2',
        [status, order_id]
      );
      await client.query(
        'INSERT INTO order_status_history (order_id, status, updated_by) VALUES ($1, $2, $3)',
        [order_id, status, seller_id]
      );
      await client.query('COMMIT');
      res.json({ message: "Order status updated successfully" });
    } else {
      throw new Error('Invalid status transition');
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(400).json({ message: error.message, success: false });
  } finally {
    client.release();
  }
};

export const updateShippingStatus = async (req, res) => {
  const { order_id } = req.params;
  const { shipping_status, tracking_number, estimated_delivery_date } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      'SELECT order_status FROM "order" WHERE order_id = $1',
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      throw new Error('Order not found');
    }

    if (orderResult.rows[0].order_status !== 'Completed') {
      throw new Error('Can only update shipping for completed orders');
    }

    await client.query(
      'UPDATE shipping SET shipping_status = $1, tracking_number = $2, estimated_delivery_date = $3 WHERE order_id = $4',
      [shipping_status, tracking_number, estimated_delivery_date, order_id]
    );

    await client.query('COMMIT');
    res.json({ message: "Shipping status updated successfully" });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(400).json({ message: error.message, success: false });
  } finally {
    client.release();
  }
};

export const getOrderFeedback = async (req, res) => {
  const { order_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM customer_feedback WHERE order_id = $1',
      [order_id]
    );
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};