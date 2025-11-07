import express from "express";
import { createOwner, getOwners, getOwnerById, updateOwner, deleteOwner } from "../controllers/OwnerController.js";

const router = express.Router();

router.post("/", createOwner);
router.get("/", getOwners);
router.get("/:id", getOwnerById);
router.put("/:id", updateOwner);
router.delete("/:id", deleteOwner);

export default router;