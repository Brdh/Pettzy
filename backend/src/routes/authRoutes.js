import express from "express";
import { registerCompany, loginCompany } from "../controllers/AuthController.js";

const router = express.Router();

// Rota de cadastro
router.post("/register", registerCompany);

// Rota de login
router.post("/login", loginCompany);

export default router;
