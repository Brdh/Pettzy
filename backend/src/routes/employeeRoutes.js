import express from "express";
import { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee } from "../controllers/EmployeeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createEmployee);
router.get("/", authMiddleware, getEmployees);
router.get("/:id", authMiddleware, getEmployeeById);
router.put("/:id", authMiddleware, updateEmployee);
router.delete("/:id", authMiddleware, deleteEmployee);

export default router;