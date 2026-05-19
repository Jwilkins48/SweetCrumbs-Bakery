import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all products - /api/products
router.get("/", getProducts);

// Product by ID - /api/products/:id
router.get("/:id", getProductById);

// Admin only routes

// Create new product - /api/products
router.post("/", protect, adminOnly, createProduct);

// Update product - /api/products
router.put("/:id", protect, adminOnly, updateProduct);

// Delete product - /api/products
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
