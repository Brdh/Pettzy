import express from "express";
import { registerCompany, loginCompany, sendResetLink, resetPassword, changePassword, updateEmail } from "../controllers/AuthController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rota de cadastro
router.post("/register", registerCompany);

// Rota de login
router.post("/login", loginCompany);

// Rota de recuperação de senha
router.post("/forgot-password", sendResetLink);
router.post("/reset-password/:token", resetPassword);

// Rotas protegidas (requerem autenticação)
router.post("/change-password", authMiddleware, changePassword);
router.put("/update-email", authMiddleware, updateEmail);

export default router;
