/**
 * CriticalGapsCard Component
 * Displays critical missing skills highlighted as warning
 */

import React from 'react';
import { motion } from 'framer-motion';

const CriticalGapsCard = ({ gaps = [] }) => {
  // Sort gaps by demand (highest first)
  const sortedGaps = [...gaps].sort((a, b) => b.demand - a.demand);

  // Get priority level based on demand
  const getPriorityLevel = (demand) => {
    if (demand >= 95) return { level: 'CRITICAL', color: '#dc2626' };
    if (demand >= 85) return { level: 'HIGH', color: '#f97316' };
    if (demand >= 75) return { level: 'MEDIUM', color: '#eab308' };
    return { level: 'LOW', color: '#84cc16' };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      className="skill-card critical-gaps-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="skill-card__header">
        <h3 className="skill-card__title">
          <span className="skill-card__icon">⚠️</span>
          Critical Gaps
        </h3>
        <p className="skill-card__count">{gaps.length} skill{gaps.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Gaps Pills */}
      <div className="skill-card__content">
        {gaps.length > 0 ? (
          <motion.div
            className="gaps-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedGaps.map((gap, index) => {
              const priority = getPriorityLevel(gap.demand);

              return (
                <motion.div
                  key={gap.skill}
                  className="gap-pill"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    boxShadow: `0 8px 20px ${priority.color}40`
                  }}
                  style={{
                    borderColor: priority.color,
                    backgroundColor: `${priority.color}15`
                  }}
                >
                  {/* Skill Name and Type */}
                  <div className="gap-pill__content">
                    <h4 className="gap-pill__name">{gap.skill}</h4>
                    <p className="gap-pill__type">{gap.type.replace('-', ' ').toUpperCase()}</p>
                  </div>

                  {/* Priority Badge */}
                  <motion.span
                    className="gap-pill__priority"
                    style={{ backgroundColor: priority.color }}
                  >
                    {priority.level}
                  </motion.span>

                  {/* Demand Score */}
                  <div className="gap-pill__demand">
                    <span className="gap-pill__demand-label">Demand</span>
                    <span
                      className="gap-pill__demand-value"
                      style={{ color: priority.color }}
                    >
                      {gap.demand}%
                    </span>
                  </div>

                  {/* Animated indicator dots */}
                  <motion.div
                    className="gap-pill__indicator"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    style={{ backgroundColor: priority.color }}
                  ></motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            className="skill-card__empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p>🎉 No critical gaps! You've covered the essential 2030 skills.</p>
          </motion.div>
        )}
      </div>

      {/* Footer Info */}
      {gaps.length > 0 && (
        <motion.div
          className="skill-card__footer critical-gaps-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="critical-gaps-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#dc2626' }}></span>
              <span>95%+ Demand</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#f97316' }}></span>
              <span>85-95% Demand</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#eab308' }}></span>
              <span>75-85% Demand</span>
            </div>
          </div>
          <p className="skill-card__footer-text">
            Focus on these high-demand skills to stay competitive
          </p>
        </motion.div>
      )}

      {/* Glass effect */}
      <div className="skill-card__glass-effect"></div>
    </motion.div>
  );
};

export default CriticalGapsCard;
