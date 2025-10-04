import express from "express";
import { registerOwner, loginOwner } from "../controllers/AuthController.js";

const router = express.Router();

// Rota de cadastro
router.post("/register", registerOwner);

// Rota de login
router.post("/login", loginOwner);

export default router;
