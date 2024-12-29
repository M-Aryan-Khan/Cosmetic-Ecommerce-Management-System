import bcrypt from "bcryptjs";
import pool from "../utils/db.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, phone_number, address } = req.body;

    if (!fullname || !email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    const buyerCount = await pool.query(
      "SELECT COUNT(*) FROM buyer WHERE email = $1",
      [email]
    );

    if (buyerCount.rows[0].count > 0) {
      return res.status(401).json({
        message: "Email is already registered",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO buyer (buyer_name, email, password, phone_number, address) VALUES ($1, $2, $3, $4, $5)",
      [fullname, email, hashedPassword, phone_number, address]
    );

    return res.status(201).json({
      message: "Buyer account created successfully.",
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

    const buyerResult = await pool.query(
      "SELECT * FROM buyer WHERE email = $1",
      [email]
    );
    if (buyerResult.rows.length === 0) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const buyer = buyerResult.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, buyer.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    return res.json({
      message: `Logged in`,
      success: true,
      buyer: {
        buyer_id: buyer.buyer_id,
        fullname: buyer.buyer_name,
        email: buyer.email,
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

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const result = await pool.query(
      "SELECT * FROM product WHERE category_id = $1",
      [categoryId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { term } = req.query;
    const result = await pool.query(
      "SELECT * FROM product WHERE product_name ILIKE $1",
      [`%${term}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { items, seller_id, payment_method } = req.body;

    const { buyerId } = req.params;

    const orderResult = await client.query(
      "INSERT INTO \"order\" (order_date, order_status, buyer_id, seller_id) VALUES (CURRENT_DATE, 'Pending', $1, $2) RETURNING order_id",
      [buyerId, seller_id]
    );
    const orderId = orderResult.rows[0].order_id;

    // Create order items and update stock levels
    let totalAmount = 0;
    for (const item of items) {
      // Check stock level and update atomically
      const updateResult = await client.query(
        "UPDATE product SET stock_level = stock_level - $1 WHERE product_id = $2 AND seller_id = $3 AND stock_level >= $1 RETURNING product_name, stock_level",
        [item.quantity, item.product_id, seller_id]
      );

      if (updateResult.rows.length === 0) {
        const productInfo = await client.query(
          "SELECT product_name, stock_level FROM product WHERE product_id = $1",
          [item.product_id]
        );
        if (productInfo.rows.length > 0) {
          throw new Error(
            `Insufficient stock for ${productInfo.rows[0].product_name}. Available: ${productInfo.rows[0].stock_level}`
          );
        } else {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }
      }

      // Create order item
      await client.query(
        "INSERT INTO order_item (quantity, total_price, product_id, order_id) VALUES ($1, $2, $3, $4)",
        [item.quantity, item.price * item.quantity, item.product_id, orderId]
      );
      totalAmount += item.price * item.quantity;
    }

    // Create invoice
    await client.query(
      "INSERT INTO invoice (invoice_date, total_amount, payment_method, order_id) VALUES (CURRENT_DATE, $1, $2, $3)",
      [totalAmount, payment_method, orderId]
    );

    // Create shipping
    await client.query(
      "INSERT INTO shipping (shipping_date, shipping_status, order_id) VALUES (CURRENT_DATE, 'Pending', $1)",
      [orderId]
    );

    await client.query("COMMIT");
    res.status(201).json({ message: "Order created successfully", orderId });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(400).json({ message: error.message, success: false });
  } finally {
    client.release();
  }
};

export const getSellerOrders = async (req, res) => {
  const { seller_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT o.*, b.buyer_name, b.email, b.phone_number, b.address, 
      s.shipping_status, s.tracking_number, s.estimated_delivery_date
      FROM "order" o
      JOIN buyer b ON o.buyer_id = b.buyer_id
      LEFT JOIN shipping s ON o.order_id = s.order_id
      WHERE o.seller_id = $1
      ORDER BY o.order_date DESC`,
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
    await client.query("BEGIN");
    await client.query(
      'UPDATE "order" SET order_status = $1 WHERE order_id = $2',
      [status, order_id]
    );
    await client.query(
      "INSERT INTO order_status_history (order_id, status, updated_by) VALUES ($1, $2, $3)",
      [order_id, status, seller_id]
    );
    await client.query("COMMIT");
    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  } finally {
    client.release();
  }
};

export const updateShippingStatus = async (req, res) => {
  const { order_id } = req.params;
  const { shipping_status, tracking_number, estimated_delivery_date } =
    req.body;
  try {
    await pool.query(
      "UPDATE shipping SET shipping_status = $1, tracking_number = $2, estimated_delivery_date = $3 WHERE order_id = $4",
      [shipping_status, tracking_number, estimated_delivery_date, order_id]
    );
    res.json({ message: "Shipping status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getBuyerOrders = async (req, res) => {
  const { buyer_id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `SELECT 
        o.*, 
        s.shipping_status, 
        s.tracking_number, 
        s.estimated_delivery_date,
        seller.seller_name, 
        cf.rating, 
        cf.review,
        ARRAY_AGG(p.product_name) AS order_items,
        i.total_amount
      FROM "order" o
      LEFT JOIN shipping s ON o.order_id = s.order_id
      JOIN seller ON o.seller_id = seller.seller_id
      LEFT JOIN customer_feedback cf ON o.order_id = cf.order_id
      LEFT JOIN order_item oi ON o.order_id = oi.order_id
      LEFT JOIN product p ON oi.product_id = p.product_id
      LEFT JOIN invoice i ON o.order_id = i.order_id
      WHERE o.buyer_id = $1
      GROUP BY o.order_id, s.shipping_status, s.tracking_number, 
               s.estimated_delivery_date, seller.seller_name, 
               cf.rating, cf.review, i.total_amount
      ORDER BY o.order_id DESC`,
      [buyer_id]
    );

    // Update shipping status if applicable
    for (let order of result.rows) {
      if (
        order.shipping_status !== 'Delivered' &&
        order.estimated_delivery_date !== null &&
        new Date(order.estimated_delivery_date) <= new Date()
      ) {
        await client.query(
          'UPDATE shipping SET shipping_status = $1 WHERE order_id = $2',
          ['Delivered', order.order_id]
        );
        order.shipping_status = 'Delivered';
      }
    }

    await client.query('COMMIT');
    res.json(result.rows);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  } finally {
    client.release();
  }
};

export const addFeedback = async (req, res) => {
  const { order_id, rating, review } = req.body;
  const { buyerId } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderIdInt = parseInt(order_id, 10);
    const buyerIdInt = parseInt(buyerId, 10);
    const ratingInt = parseInt(rating, 10);

    if (isNaN(orderIdInt) || isNaN(buyerIdInt) || isNaN(ratingInt)) {
      throw new Error("Invalid order_id, buyer_id, or rating");
    }

    const existingFeedback = await client.query(
      "SELECT * FROM customer_feedback WHERE order_id = $1",
      [orderIdInt]
    );

    if (existingFeedback.rows.length > 0) {
      throw new Error("Feedback already submitted for this order");
    }
    await client.query(
      "INSERT INTO customer_feedback (buyer_id, order_id, rating, review) VALUES ($1, $2, $3, $4)",
      [buyerIdInt, orderIdInt, ratingInt, review]
    );

    await client.query('COMMIT');
    res.json({ message: "Feedback added successfully" });
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
      "SELECT * FROM customer_feedback WHERE order_id = $1",
      [order_id]
    );
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
