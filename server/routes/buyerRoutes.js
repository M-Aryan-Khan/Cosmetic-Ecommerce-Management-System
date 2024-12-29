import express from "express";
import {
  login,
  register,
  logout,
  createOrder,
  getProductsByCategory,
  searchProducts,
  addFeedback,
  getBuyerOrders
} from "../controllers/buyerController.js";

const router = express.Router();

router.route("/buyer/register").post(register);
router.route("/buyer/login").post(login);
router.route("/buyer/logout").get(logout);

router.route('/products/category/:categoryId').get(getProductsByCategory);
router.route('/products/search').get(searchProducts);

router.route('/orders/:buyerId').post(createOrder);
router.route('/orders/feedback/:buyerId').post(addFeedback);
router.route('/buyer/:buyer_id').get(getBuyerOrders);


export default router;