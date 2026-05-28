import express, { Router } from "express";
import { register, login } from "../controllers/authController.js";
import {
  validateBody,
  validateRegister,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Create new user - /api/auth/register
router.post("/register", validateBody, validateRegister, register);

// Login user - /api/auth/login
router.post("/login", validateBody, login);

export default router;
