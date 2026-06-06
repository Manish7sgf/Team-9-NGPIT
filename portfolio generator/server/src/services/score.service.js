import { pool } from "../config/db.js";
import { portfolioModel } from "../models/portfolio.model.js";

/**
 * Score calculation service.
 * Computes employability score from passport + portfolio data.
 * Writes updated score back to DB immediately.
 *
 * Total: 100 points
 *   Projects verified : count × 10  (max 30)
 *   Skills count      : count × 2   (max 20)
 *   Hackathons        : count × 5   (max 20)
 *   Open source PRs   : count × 3   (max 15)
 *   Mentoring sessions: count × 5   (max 15)
 */
export const scoreService = {
  async calculateScore(userId) {
    // Fetch passport
    const { rows: passportRows } = await pool.query(
      `SELECT * FROM passports WHERE user_id = $1`,
      [userId]
    );

    if (!passportRows.length) {
      return { total: 0, breakdown: {} };
    }

    const passport = passportRows[0];
    const projectCount = await portfolioModel.countByUserId(userId);

    const skills = Array.isArray(passport.skills) ? passport.skills : [];

    // Calculate each component
    const projects  = Math.min(projectCount * 10, 30);
    const skillPts  = Math.min(skills.length * 2, 20);
    const hackathon = Math.min((passport.hackathons || 0) * 5, 20);
    const openSrc   = Math.min((passport.open_source_prs || 0) * 3, 15);
    const mentoring = Math.min((passport.mentoring_sessions || 0) * 5, 15);

    const total = Math.min(projects + skillPts + hackathon + openSrc + mentoring, 100);

    const breakdown = {
      projects:  { score: projects,  max: 30 },
      skills:    { score: skillPts,  max: 20 },
      hackathons:{ score: hackathon, max: 20 },
      openSource:{ score: openSrc,   max: 15 },
      mentoring: { score: mentoring, max: 15 },
    };

    // Persist score back to DB
    await pool.query(
      `UPDATE passports
       SET employability_score = $1, score_breakdown = $2, last_updated = NOW()
       WHERE user_id = $3`,
      [total, JSON.stringify(breakdown), userId]
    );

    return { total, breakdown };
  },
};
