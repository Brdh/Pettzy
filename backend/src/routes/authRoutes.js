import express from "express";
import { registerCompany, loginCompany, sendResetLink, resetPassword } from "../controllers/AuthController.js";

const router = express.Router();

// Rota de cadastro
router.post("/register", registerCompany);

// Rota de login
router.post("/login", loginCompany);

// Rota de recuperação de senha
router.post("/forgot-password", sendResetLink);
router.post("/reset-password/:token", resetPassword);

export default router;
