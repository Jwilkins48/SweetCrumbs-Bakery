import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  validateBody,
  validateProduct,
} from "../middleware/validationMiddleware.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all products - /api/products
router.get("/", getProducts);

// Product by ID - /api/products/:id
router.get("/:id", getProductById);

// Admin only routes

// Create new product - /api/products
router.post(
  "/",
  protect,
  adminOnly,
  validateBody,
  validateProduct,
  createProduct,
);

// Update product - /api/products
router.put(
  "/:id",
  protect,
  adminOnly,
  validateBody,
  validateProduct,
  updateProduct,
);

// Delete product - /api/products
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
