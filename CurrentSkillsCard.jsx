/**
 * CurrentSkillsCard Component
 * Displays user's current matched skills with relevance scores
 */

import React from 'react';
import { motion } from 'framer-motion';
import skillGapAnalyzer from '../utils/skillGapAnalyzer';

const CurrentSkillsCard = ({ skills = [] }) => {
  const getRelevanceColor = (score) => {
    if (score > 60) return '#10b981'; // Green
    if (score >= 30) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const getRelevanceBgColor = (score) => {
    if (score > 60) return 'rgba(16, 185, 129, 0.1)';
    if (score >= 30) return 'rgba(245, 158, 11, 0.1)';
    return 'rgba(239, 68, 68, 0.1)';
  };

  const getRelevanceLabel = (score) => {
    if (score > 60) return 'Highly Relevant';
    if (score >= 30) return 'Moderately Relevant';
    return 'Low Relevance';
  };

  return (
    <motion.div
      className="skill-card current-skills-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="skill-card__header">
        <h3 className="skill-card__title">
          <span className="skill-card__icon">✓</span>
          What You Have
        </h3>
        <p className="skill-card__count">{skills.length} skill{skills.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Skills List */}
      <div className="skill-card__content">
        {skills.length > 0 ? (
          <div className="skills-list">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.skill}
                className="skill-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ paddingLeft: '12px' }}
              >
                {/* Skill Name */}
                <div className="skill-row__name-section">
                  <span className="skill-row__icon">▪</span>
                  <span className="skill-row__name">{skill.skill}</span>
                </div>

                {/* Relevance Indicator */}
                <div className="skill-row__relevance-section">
                  {/* Progress Bar */}
                  <div className="skill-row__bar-container">
                    <motion.div
                      className="skill-row__bar"
                      initial={{ width: '0%' }}
                      animate={{ width: `${skill.relevance}%` }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.05, ease: 'easeOut' }}
                      style={{
                        backgroundColor: getRelevanceColor(skill.relevance)
                      }}
                    ></motion.div>
                  </div>

                  {/* Score and Label */}
                  <div className="skill-row__score-info">
                    <span
                      className="skill-row__score"
                      style={{ color: getRelevanceColor(skill.relevance) }}
                    >
                      {skill.relevance}%
                    </span>
                    <span
                      className="skill-row__label"
                      style={{
                        backgroundColor: getRelevanceBgColor(skill.relevance),
                        color: getRelevanceColor(skill.relevance)
                      }}
                    >
                      {getRelevanceLabel(skill.relevance)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="skill-card__empty">
            <p>No matched skills yet. Add more skills to your list!</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {skills.length > 0 && (
        <motion.div
          className="skill-card__footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="skill-card__footer-text">
            💡 These skills align with 2030 workforce demands
          </p>
        </motion.div>
      )}

      {/* Glass effect */}
      <div className="skill-card__glass-effect"></div>
    </motion.div>
  );
};

export default CurrentSkillsCard;
