import { portfolioModel } from "../models/portfolio.model.js";
import { githubService } from "../services/github.service.js";
import { nvidiaService } from "../services/nvidia.service.js";
import { scoreService } from "../services/score.service.js";
import { pool } from "../config/db.js";

// Strict GitHub URL regex
const GITHUB_URL_REGEX = /^https:\/\/github\.com\/([\w-]+)\/([\w.-]+)\/?$/;

// Fixed demo user ID — created on first request if missing
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

async function ensureDemoUser() {
  await pool.query(
    `INSERT INTO users (id, name, email)
     VALUES ($1, $2, $3)
     ON CONFLICT (id) DO NOTHING`,
    [DEMO_USER_ID, "Demo User", "demo@aifuturepassport.dev"]
  );
}

export const portfolioController = {
  /**
   * POST /api/portfolio/verify
   */
  async verify(req, res, next) {
    try {
      const { repo_url } = req.body;
      const userId = req.user?.id || DEMO_USER_ID;

      await ensureDemoUser();

      if (!repo_url || typeof repo_url !== "string") {
        return res.status(400).json({ success: false, error: "repo_url is required" });
      }

      // Strip trailing .git before validation
      const cleanUrl = repo_url.trim().replace(/\.git$/, "");

      const match = cleanUrl.match(GITHUB_URL_REGEX);
      if (!match) {
        return res.status(400).json({
          success: false,
          error: "Must be a valid GitHub repo URL (https://github.com/owner/repo)",
        });
      }

      const [, owner, repo] = match;

      const exists = await portfolioModel.existsByRepoUrl(userId, cleanUrl);
      if (exists) {
        return res.status(400).json({
          success: false,
          error: "This repository is already in your portfolio.",
        });
      }

      // Fetch from GitHub
      const { repoData, languages, readme } = await githubService.fetchRepoData(owner, repo);

      // Analyse with Nvidia Nemotron
      const analysis = await nvidiaService.analyseRepo({ repoData, languages, readme });

      // Save to DB
      const item = await portfolioModel.create({
        userId,
        repoUrl: cleanUrl,
        title: analysis.title || repoData.name,
        description: analysis.description || repoData.description || "",
        techStack: analysis.tech_stack || [],
        aiSummary: analysis.description || "",
        contributionLevel: analysis.contribution_level || "medium",
        contributionReason: analysis.contribution_reason || "",
        complexityScore: analysis.complexity_score || 5,
        skillsDemonstrated: analysis.skills_demonstrated || [],
      });

      scoreService.calculateScore(userId).catch((err) =>
        console.error("[Score] Recalculation failed:", err.message)
      );

      return res.status(201).json({ success: true, data: item });
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ success: false, error: err.message });
      }
      next(err);
    }
  },

  /**
   * GET /api/portfolio/:userId
   */
  async getByUser(req, res, next) {
    try {
      const userId = req.params.userId === "demo" ? DEMO_USER_ID : req.params.userId;
      const items = await portfolioModel.findByUserId(userId);
      return res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/portfolio/:id
   */
  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || DEMO_USER_ID;

      const deleted = await portfolioModel.deleteById(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: "Portfolio item not found." });
      }

      scoreService.calculateScore(userId).catch((err) =>
        console.error("[Score] Recalculation failed:", err.message)
      );

      return res.json({ success: true, data: { id } });
    } catch (err) {
      next(err);
    }
  },
};
