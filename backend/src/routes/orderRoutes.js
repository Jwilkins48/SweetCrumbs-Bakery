import express from "express";
import {
  placeOrder,
  getOrders,
  getUserOrders,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Place order - /api/orders
router.post("/", protect, placeOrder);

// Get all orders - admin only - /api/orders
router.get("/", protect, adminOnly, getOrders);

// Orders for logged in user - /api/orders/myOrders
router.get("/myOrders", protect, getUserOrders);

export default router;
