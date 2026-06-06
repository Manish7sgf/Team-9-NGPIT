import { portfolioModel } from "../models/portfolio.model.js";
import { githubService } from "../services/github.service.js";
import { nvidiaService } from "../services/nvidia.service.js";
import { scoreService } from "../services/score.service.js";

// Strict GitHub URL regex
const GITHUB_URL_REGEX = /^https:\/\/github\.com\/([\w-]+)\/([\w.-]+)\/?$/;

export const portfolioController = {
  /**
   * POST /api/portfolio/verify
   * 1. Validate GitHub URL
   * 2. Fetch repo data from GitHub (parallel)
   * 3. Analyse with Nvidia Nemotron
   * 4. Save to DB + trigger score recalculation
   */
  async verify(req, res, next) {
    try {
      const { repo_url } = req.body;
      const userId = req.user.id;

      // Validate URL
      if (!repo_url || typeof repo_url !== "string") {
        return res.status(400).json({
          success: false,
          error: "repo_url is required",
        });
      }

      const match = repo_url.trim().match(GITHUB_URL_REGEX);
      if (!match) {
        return res.status(400).json({
          success: false,
          error: "Must be a valid GitHub repo URL (https://github.com/owner/repo)",
        });
      }

      const [, owner, repo] = match;

      // Check duplicate
      const exists = await portfolioModel.existsByRepoUrl(userId, repo_url.trim());
      if (exists) {
        return res.status(400).json({
          success: false,
          error: "This repository is already in your portfolio.",
        });
      }

      // Fetch repo data from GitHub — throws if not found/private
      const { repoData, languages, readme } = await githubService.fetchRepoData(
        owner,
        repo
      );

      // Analyse with Nvidia Nemotron Nano 9B v2
      const analysis = await nvidiaService.analyseRepo({
        repoData,
        languages,
        readme,
      });

      // Save to portfolio_items
      const item = await portfolioModel.create({
        userId,
        repoUrl: repo_url.trim(),
        title: analysis.title || repoData.name,
        description: analysis.description || repoData.description || "",
        techStack: analysis.tech_stack || [],
        aiSummary: analysis.description || "",
        contributionLevel: analysis.contribution_level || "medium",
        contributionReason: analysis.contribution_reason || "",
        complexityScore: analysis.complexity_score || 5,
        skillsDemonstrated: analysis.skills_demonstrated || [],
      });

      // Recalculate score asynchronously (fire and forget — don't block response)
      scoreService.calculateScore(userId).catch((err) =>
        console.error("[Score] Recalculation failed:", err.message)
      );

      return res.status(201).json({ success: true, data: item });
    } catch (err) {
      // Pass known status errors through; wrap unknown ones as 500
      if (err.status) {
        return res.status(err.status).json({ success: false, error: err.message });
      }
      next(err);
    }
  },

  /**
   * GET /api/portfolio/:userId
   * Returns all portfolio items for a user.
   */
  async getByUser(req, res, next) {
    try {
      const { userId } = req.params;
      const items = await portfolioModel.findByUserId(userId);
      return res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/portfolio/:id
   * Removes a portfolio item and triggers score recalculation.
   */
  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const deleted = await portfolioModel.deleteById(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Portfolio item not found.",
        });
      }

      // Recalculate score after removal
      scoreService.calculateScore(userId).catch((err) =>
        console.error("[Score] Recalculation failed:", err.message)
      );

      return res.json({ success: true, data: { id } });
    } catch (err) {
      next(err);
    }
  },
};
