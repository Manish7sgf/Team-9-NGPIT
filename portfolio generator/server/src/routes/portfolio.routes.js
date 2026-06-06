import { Router } from "express";
import { portfolioController } from "../controllers/portfolio.controller.js";

const router = Router();

// POST /api/portfolio/verify — verify & analyse a GitHub repo (no auth for demo)
router.post("/verify", portfolioController.verify);

// GET /api/portfolio/:userId — get all portfolio items for a user
router.get("/:userId", portfolioController.getByUser);

// DELETE /api/portfolio/:id — remove a portfolio item
router.delete("/:id", portfolioController.remove);

export default router;
