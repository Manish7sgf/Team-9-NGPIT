/**
 * FutureSkillsCard Component
 * Displays future skills needed in 2030 workforce
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FutureSkillsCard = ({ skills = [] }) => {
  const [expandedId, setExpandedId] = useState(null);

  const getCategoryColor = (type) => {
    switch (type) {
      case 'technical':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', label: 'Technical' };
      case 'human':
        return { bg: 'rgba(168, 85, 247, 0.1)', text: '#a855f7', label: 'Human' };
      case 'ai-collaboration':
        return { bg: 'rgba(6, 182, 212, 0.1)', text: '#06b6d4', label: 'AI Collab' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', label: 'Other' };
    }
  };

  const getDemandBadgeColor = (demand) => {
    if (demand >= 95) return { bg: '#ef4444', text: 'white', label: 'Critical' };
    if (demand >= 85) return { bg: '#f59e0b', text: 'white', label: 'High' };
    return { bg: '#10b981', text: 'white', label: 'Medium' };
  };

  return (
    <motion.div
      className="skill-card future-skills-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="skill-card__header">
        <h3 className="skill-card__title">
          <span className="skill-card__icon">🎯</span>
          What 2030 Needs
        </h3>
        <p className="skill-card__count">{skills.length} skill{skills.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Skills Grid */}
      <div className="skill-card__content">
        {skills.length > 0 ? (
          <div className="future-skills-grid">
            {skills.map((skill, index) => {
              const categoryInfo = getCategoryColor(skill.type);
              const demandInfo = getDemandBadgeColor(skill.demand);
              const isExpanded = expandedId === skill.skill;

              return (
                <motion.div
                  key={skill.skill}
                  className="future-skill-item"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => setExpandedId(isExpanded ? null : skill.skill)}
                >
                  {/* Main Content */}
                  <div className="future-skill-item__main">
                    {/* Skill Name */}
                    <h4 className="future-skill-item__name">{skill.skill}</h4>

                    {/* Category and Demand Row */}
                    <div className="future-skill-item__tags">
                      {/* Category Tag */}
                      <span
                        className="future-skill-item__tag future-skill-item__tag--category"
                        style={{
                          backgroundColor: categoryInfo.bg,
                          color: categoryInfo.text
                        }}
                      >
                        {categoryInfo.label}
                      </span>

                      {/* Demand Badge */}
                      <span
                        className="future-skill-item__tag future-skill-item__tag--demand"
                        style={{
                          backgroundColor: demandInfo.bg,
                          color: demandInfo.text
                        }}
                      >
                        {demandInfo.label} Demand
                      </span>
                    </div>

                    {/* Demand Score */}
                    <div className="future-skill-item__demand-score">
                      <span className="future-skill-item__demand-label">Demand:</span>
                      <motion.span
                        className="future-skill-item__demand-value"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {skill.demand}%
                      </motion.span>
                    </div>
                  </div>

                  {/* Expandable Description */}
                  {skill.description && (
                    <motion.div
                      className="future-skill-item__description"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: isExpanded ? 1 : 0,
                        height: isExpanded ? 'auto' : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{skill.description}</p>
                    </motion.div>
                  )}

                  {/* Expand Indicator */}
                  <motion.div
                    className="future-skill-item__expand-icon"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▼
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="skill-card__empty">
            <p>No future skills listed yet</p>
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
            📌 Click items to learn more about each skill
          </p>
        </motion.div>
      )}

      {/* Glass effect */}
      <div className="skill-card__glass-effect"></div>
    </motion.div>
  );
};

export default FutureSkillsCard;
