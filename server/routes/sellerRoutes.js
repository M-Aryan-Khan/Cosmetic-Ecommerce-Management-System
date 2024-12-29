import express from "express";
import {
  login,
  register,
  logout,
  getProductById,
  getAllProducts,
  getProductsBySeller,
  createProduct,
  updateCategory,
  updateProduct,
  deleteCategory,
  deleteProduct,
  getAllCategories,
  getCategoryById,
  createCategory,
  getOrderFeedback,
  getSellerOrders,
  updateOrderStatus,
  updateShippingStatus
} from "../controllers/sellerController.js";

const router = express.Router();

router.route("/seller/register").post(register);
router.route("/seller/login").post(login);
router.route("/seller/logout").get(logout);

router.route("/products").get(getAllProducts);
router.route("/products/seller/:sellerId").get(getProductsBySeller);
router.route('/products/:id').get(getProductById);
router.route('/products').post(createProduct);
router.route('/products/:id').put(updateProduct);
router.route('/products/:id').delete(deleteProduct);

router.route('/categories').get(getAllCategories);
router.route('/categories/:id').get(getCategoryById);
router.route('/categories').post(createCategory);
router.route('/categories/:id').put(updateCategory);
router.route('/categories/:id').delete(deleteCategory);

router.route('/orders/:seller_id').get(getSellerOrders);
router.route('/orders/:order_id/status').put(updateOrderStatus);
router.route('/orders/:order_id/shipping').put(updateShippingStatus);
router.route('/orders/:order_id/feedback').get(getOrderFeedback);

export default router;
