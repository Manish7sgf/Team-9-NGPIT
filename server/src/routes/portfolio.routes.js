import { Router } from "express";
import auth from "../middleware/auth.js";
import { portfolioController } from "../controllers/portfolio.controller.js";

const router = Router();

// POST /api/portfolio/verify — verify & analyse a GitHub repo
router.post("/verify", auth, portfolioController.verify);

// GET /api/portfolio/:userId — get all portfolio items for a user
router.get("/:userId", auth, portfolioController.getByUser);

// DELETE /api/portfolio/:id — remove a portfolio item
router.delete("/:id", auth, portfolioController.remove);

export default router;
