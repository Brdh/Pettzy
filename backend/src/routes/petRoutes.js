import express from "express";
import { createPet, getPets, getPetById, updatePet, deletePet } from "../controllers/PetController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPet);
router.get("/", authMiddleware, getPets);
router.get("/:id", authMiddleware, getPetById);
router.put("/:id", authMiddleware, updatePet);
router.delete("/:id", authMiddleware, deletePet);

export default router;