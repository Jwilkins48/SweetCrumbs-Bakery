import express, { Router } from "express";
import { register, login } from "../controllers/authController.js";
import {
  validateBody,
  validateRegister,
} from "../middleware/validationMiddleware.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();

// Create new user - /api/auth/register
router.post("/register", validateBody, validateRegister, register);

// Login user - /api/auth/login
router.post("/login", validateBody, login);

// TEMPORARY (for deployment)
router.post("/make-admin", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });
    res.json({ message: `${user.email} is now an admin` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
