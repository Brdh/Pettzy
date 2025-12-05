import express from "express";
import { createCompany, getCompanys, getCompanyById, updateCompany, deleteCompany, getMyCompany } from "../controllers/CompanyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createCompany);
router.get("/me", authMiddleware, getMyCompany); // Rota protegida - ANTES do /:id
router.get("/", getCompanys);
router.get("/:id", getCompanyById);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

export default router;