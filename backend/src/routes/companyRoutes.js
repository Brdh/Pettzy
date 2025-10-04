import express from "express";
import { createCompany, getCompanys, getCompanyById, updateCompany, deleteCompany } from "../controllers/CompanyController.js";

const router = express.Router();

router.post("/", createCompany);
router.get("/", getCompanys);
router.get("/:id", getCompanyById);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

export default router;