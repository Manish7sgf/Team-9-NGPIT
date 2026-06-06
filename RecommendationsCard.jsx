/**
 * RecommendationsCard Component
 * Displays top 3 actionable recommendations with impact levels
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RecommendationsCard = ({ recommendations = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Get impact color
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'HIGH':
        return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'HIGH IMPACT', icon: '🔴' };
      case 'MEDIUM':
        return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', label: 'MEDIUM IMPACT', icon: '🟠' };
      case 'LOW':
        return { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', label: 'LOW IMPACT', icon: '🟢' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', label: 'IMPACT', icon: '⚪' };
    }
  };

  // Get type emoji
  const getTypeEmoji = (type) => {
    switch (type) {
      case 'technical':
        return '💻';
      case 'human':
        return '👥';
      case 'ai-collaboration':
        return '🤖';
      default:
        return '⭐';
    }
  };

  // Top recommendations only
  const topRecommendations = recommendations.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="skill-card recommendations-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="skill-card__header">
        <h3 className="skill-card__title">
          <span className="skill-card__icon">💡</span>
          Top Recommendations
        </h3>
        <p className="skill-card__count">{Math.min(topRecommendations.length, 3)} actions</p>
      </div>

      {/* Recommendations List */}
      <div className="skill-card__content">
        {topRecommendations.length > 0 ? (
          <motion.div
            className="recommendations-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {topRecommendations.map((rec, index) => {
              const impactInfo = getImpactColor(rec.impact);
              const isSelected = selectedIndex === index;

              return (
                <motion.div
                  key={index}
                  className={`recommendation-item ${isSelected ? 'expanded' : ''}`}
                  variants={itemVariants}
                  onClick={() => setSelectedIndex(isSelected ? null : index)}
                  whileHover={{ paddingLeft: '12px' }}
                  animate={{
                    backgroundColor: isSelected ? impactInfo.bg : 'transparent'
                  }}
                >
                  {/* Left accent bar */}
                  <motion.div
                    className="recommendation-item__accent"
                    style={{ backgroundColor: impactInfo.text }}
                    animate={{ width: isSelected ? '4px' : '2px' }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>

                  {/* Main Content */}
                  <div className="recommendation-item__content">
                    {/* Rank */}
                    <div className="recommendation-item__rank">
                      <span className="recommendation-item__rank-number">{index + 1}</span>
                      <span className="recommendation-item__rank-label">
                        {index === 0 ? 'Priority' : index === 1 ? 'Secondary' : 'Tertiary'}
                      </span>
                    </div>

                    {/* Action Text */}
                    <div className="recommendation-item__action">
                      <p className="recommendation-item__action-text">
                        <span className="recommendation-item__action-emoji">
                          {getTypeEmoji(rec.type)}
                        </span>
                        {rec.action}
                      </p>

                      {/* Skill Tag */}
                      <span
                        className="recommendation-item__skill-tag"
                        style={{
                          backgroundColor: impactInfo.bg,
                          color: impactInfo.text
                        }}
                      >
                        {rec.skill}
                      </span>
                    </div>

                    {/* Impact Badge */}
                    <motion.div
                      className="recommendation-item__impact"
                      style={{
                        backgroundColor: impactInfo.text,
                        color: 'white'
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="recommendation-item__impact-icon">
                        {impactInfo.icon}
                      </span>
                      <span className="recommendation-item__impact-label">
                        {impactInfo.label}
                      </span>
                    </motion.div>
                  </div>

                  {/* Expand Indicator */}
                  <motion.div
                    className="recommendation-item__expand"
                    animate={{ rotate: isSelected ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ▼
                  </motion.div>
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
            <p>No recommendations available</p>
          </motion.div>
        )}
      </div>

      {/* Footer Info */}
      {topRecommendations.length > 0 && (
        <motion.div
          className="skill-card__footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="recommendations-help">
            <p className="skill-card__footer-text">
              ✨ Click on items to see more details about each action
            </p>
            <div className="recommendations-timeline">
              <div className="timeline-item">
                <span className="timeline-marker">immediate</span>
                <span className="timeline-label">0-3 months</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-marker">short-term</span>
                <span className="timeline-label">3-6 months</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-marker">long-term</span>
                <span className="timeline-label">6-12 months</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Glass effect */}
      <div className="skill-card__glass-effect"></div>
    </motion.div>
  );
};

export default RecommendationsCard;
