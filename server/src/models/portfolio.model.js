import { pool } from "../config/db.js";

/**
 * All DB queries for portfolio_items table.
 * No business logic here — only parameterised SQL.
 */

export const portfolioModel = {
  /**
   * Insert a new verified portfolio item.
   */
  async create({
    userId,
    repoUrl,
    title,
    description,
    techStack,
    aiSummary,
    contributionLevel,
    contributionReason,
    complexityScore,
    skillsDemonstrated,
  }) {
    const { rows } = await pool.query(
      `INSERT INTO portfolio_items
        (user_id, repo_url, title, description, tech_stack, ai_summary,
         contribution_level, contribution_reason, complexity_score,
         skills_demonstrated, verified)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, true)
       RETURNING *`,
      [
        userId,
        repoUrl,
        title,
        description,
        JSON.stringify(techStack),
        aiSummary,
        contributionLevel,
        contributionReason,
        complexityScore,
        JSON.stringify(skillsDemonstrated),
      ]
    );
    return rows[0];
  },

  /**
   * Get all portfolio items for a user, newest first.
   */
  async findByUserId(userId) {
    const { rows } = await pool.query(
      `SELECT * FROM portfolio_items
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },

  /**
   * Count verified portfolio items for a user (used by score service).
   */
  async countByUserId(userId) {
    const { rows } = await pool.query(
      `SELECT COUNT(*) as count FROM portfolio_items WHERE user_id = $1`,
      [userId]
    );
    return parseInt(rows[0].count, 10);
  },

  /**
   * Delete a portfolio item by id.
   * Returns the deleted row so caller can confirm it existed.
   */
  async deleteById(id) {
    const { rows } = await pool.query(
      `DELETE FROM portfolio_items WHERE id = $1 RETURNING *`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Check if a repo URL already exists for this user.
   */
  async existsByRepoUrl(userId, repoUrl) {
    const { rows } = await pool.query(
      `SELECT id FROM portfolio_items WHERE user_id = $1 AND repo_url = $2`,
      [userId, repoUrl]
    );
    return rows.length > 0;
  },
};
