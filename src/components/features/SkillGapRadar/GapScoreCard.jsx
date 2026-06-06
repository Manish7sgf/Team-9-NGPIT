/**
 * GapScoreCard Component
 * Displays the main gap score with animated circular progress
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const GapScoreCard = ({ gapScore = 0 }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  // Animate the score count-up
  useEffect(() => {
    let animationFrame;
    let currentScore = 0;
    const step = gapScore / 50; // Animate over 50 frames

    const animate = () => {
      currentScore += step;
      if (currentScore < gapScore) {
        setDisplayScore(Math.round(currentScore));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayScore(gapScore);
      }
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [gapScore]);

  // Determine color based on gap score
  const getScoreColor = () => {
    if (gapScore <= 30) return '#10b981'; // Green
    if (gapScore <= 60) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const getScoreLabel = () => {
    if (gapScore <= 30) return 'Strong Alignment';
    if (gapScore <= 60) return 'Moderate Gap';
    return 'Significant Gap';
  };

  return (
    <motion.div
      className="gap-score-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="gap-score-container">
        {/* Circular Progress */}
        <div className="gap-score-circle-container">
          <svg
            className="gap-score-circle-svg"
            viewBox="0 0 120 120"
            width="200"
            height="200"
          >
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="rgba(229, 231, 235, 0.5)"
              strokeWidth="8"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke={getScoreColor()}
              strokeWidth="8"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
            />
          </svg>

          {/* Score Text */}
          <div className="gap-score-text">
            <motion.div
              className="gap-score-number"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="gap-score-value">{displayScore}%</span>
            </motion.div>
          </div>
        </div>

        {/* Info Section */}
        <div className="gap-score-info">
          <h2 className="gap-score-title">Skill Gap</h2>
          <p className="gap-score-subtitle">
            Between your skills and 2030 market demands
          </p>
          
          <motion.div
            className="gap-score-status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span
              className="gap-score-label"
              style={{
                backgroundColor: getScoreColor() + '20',
                color: getScoreColor()
              }}
            >
              {getScoreLabel()}
            </span>
          </motion.div>

          {/* Insight Text */}
          <motion.div
            className="gap-score-insight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="gap-score-insight__text">
              {gapScore <= 30
                ? '🎯 You\'re well-aligned with future workforce needs!'
                : gapScore <= 60
                ? '📈 There\'s room for growth in key 2030 skills'
                : '⚠️ Significant upskilling needed for future readiness'}
            </p>
          </motion.div>

          {/* Action Hint */}
          <motion.div
            className="gap-score-action-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="gap-score-action-hint__text">
              👇 Scroll down to see detailed recommendations
            </p>
          </motion.div>
        </div>
      </div>

      {/* Glassmorphism overlay effect */}
      <div className="gap-score-card__glass-effect"></div>
    </motion.div>
  );
};

export default GapScoreCard;
