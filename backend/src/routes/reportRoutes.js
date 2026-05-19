import express from "express";
import { generateOrderReport } from "../controllers/reportController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate order report - Admin only - /api/reports/orders
router.get("/orders", protect, adminOnly, generateOrderReport);

export default router;
