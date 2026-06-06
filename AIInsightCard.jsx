/**
 * AIInsightCard Component
 * Displays AI-generated career insight and actionable summary
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AIInsightCard = ({ insight = '' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect
  useEffect(() => {
    if (!insight) return;

    let index = 0;
    let timeoutId;

    const typeNextCharacter = () => {
      if (index < insight.length) {
        setDisplayedText(insight.slice(0, index + 1));
        index++;
        timeoutId = setTimeout(typeNextCharacter, 15); // 15ms per character
      } else {
        setIsTyping(false);
      }
    };

    typeNextCharacter();

    return () => clearTimeout(timeoutId);
  }, [insight]);

  // Split insight into sentences for visual emphasis
  const sentences = insight.split('. ');

  return (
    <motion.div
      className="skill-card ai-insight-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4 }}
    >
      {/* Header with AI Badge */}
      <div className="skill-card__header">
        <div className="ai-insight-header">
          <h3 className="skill-card__title">
            <span className="skill-card__icon">🤖</span>
            AI Career Insight
          </h3>
          <motion.span
            className="ai-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Powered by AI
          </motion.span>
        </div>
      </div>

      {/* Insight Content */}
      <div className="skill-card__content">
        <motion.div
          className="ai-insight-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Main Insight Text with Typewriter Effect */}
          <div className="ai-insight-text">
            {sentences.map((sentence, index) => {
              const trimmedSentence = sentence.trim();
              if (!trimmedSentence) return null;

              // Determine accent color based on sentence content
              let accentColor = '#6b7280';
              if (trimmedSentence.includes('Improving') || trimmedSentence.includes('increase')) {
                accentColor = '#10b981';
              } else if (trimmedSentence.includes('risk') || trimmedSentence.includes('biggest')) {
                accentColor = '#ef4444';
              } else if (trimmedSentence.includes('focus') || trimmedSentence.includes('deepening')) {
                accentColor = '#3b82f6';
              }

              return (
                <motion.p
                  key={index}
                  className="ai-insight-sentence"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
                  style={{ borderLeftColor: accentColor }}
                >
                  {trimmedSentence}.
                </motion.p>
              );
            })}

            {/* Blinking cursor during typing */}
            {isTyping && (
              <motion.span
                className="typing-cursor"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              >
                |
              </motion.span>
            )}
          </div>

          {/* Key Takeaways */}
          <motion.div
            className="ai-insight-takeaways"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h4 className="ai-insight-takeaways__title">Key Takeaways</h4>
            <ul className="ai-insight-takeaways__list">
              <motion.li
                className="ai-insight-takeaway-item"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                whileHover={{ x: 5 }}
              >
                <span className="takeaway-icon">🎯</span>
                <span className="takeaway-text">Focus on high-demand future skills</span>
              </motion.li>

              <motion.li
                className="ai-insight-takeaway-item"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                whileHover={{ x: 5 }}
              >
                <span className="takeaway-icon">📚</span>
                <span className="takeaway-text">Build skills systematically over time</span>
              </motion.li>

              <motion.li
                className="ai-insight-takeaway-item"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                whileHover={{ x: 5 }}
              >
                <span className="takeaway-icon">💪</span>
                <span className="takeaway-text">Leverage your existing strengths</span>
              </motion.li>
            </ul>
          </motion.div>

          {/* Next Steps Suggestion */}
          <motion.div
            className="ai-insight-next-steps"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <div className="next-steps-card">
              <h4 className="next-steps-title">📋 Next Steps</h4>
              <ol className="next-steps-list">
                <li>Review the critical gaps section above</li>
                <li>Start with the top 1-2 high-impact recommendations</li>
                <li>Create a 6-month learning plan</li>
                <li>Track your progress and reassess quarterly</li>
              </ol>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="skill-card__footer ai-insight-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <p className="skill-card__footer-text">
          💡 This insight is based on your current skills and projected 2030 workforce trends.
          Update your skills regularly to get refined recommendations.
        </p>
      </motion.div>

      {/* Glass effect */}
      <div className="skill-card__glass-effect"></div>
    </motion.div>
  );
};

export default AIInsightCard;
