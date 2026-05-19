import express, { Router } from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Create new user - /api/auth/register
router.post("/register", register);

// Login user - /api/auth/login
router.post("/login", login);

export default router;
