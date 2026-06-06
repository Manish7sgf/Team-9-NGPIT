/**
 * SkillGapRadar - Main Component
 * A comprehensive skill gap analysis feature for student employability
 * 
 * Usage:
 * <SkillGapRadar 
 *   userSkills={['Java', 'Python']} 
 *   onAnalysisComplete={handleComplete}
 * />
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SkillInput from './components/SkillInput';
import GapScoreCard from './components/GapScoreCard';
import CurrentSkillsCard from './components/CurrentSkillsCard';
import FutureSkillsCard from './components/FutureSkillsCard';
import CriticalGapsCard from './components/CriticalGapsCard';
import RecommendationsCard from './components/RecommendationsCard';
import AIInsightCard from './components/AIInsightCard';
import AILearningPathCard from './components/AILearningPathCard';
import skillGapAnalyzer from './utils/skillGapAnalyzer';
import './styles/SkillGapRadar.css';

const SkillGapRadar = ({
  userSkills = [],
  onAnalysisComplete = null,
  theme = 'light',
  showInsights = true,
  enableAI = true
}) => {
  const [selectedSkills, setSelectedSkills] = useState(userSkills);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * Handle skill analysis with optional AI enhancement
   */
  const handleSkillAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      // Call analysis with AI if enabled
      const result = await skillGapAnalyzer.analyzeGap(selectedSkills, { useAI: enableAI });
      
      // Add slight delay for UX feel
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAnalysisResult(result);

      // Call callback if provided
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback to non-AI analysis
      const result = await skillGapAnalyzer.analyzeGap(selectedSkills, { useAI: false });
      setAnalysisResult(result);
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedSkills, onAnalysisComplete, enableAI]);

  /**
   * Handle skill tag changes
   */
  const handleSkillsChange = useCallback((newSkills) => {
    setSelectedSkills(newSkills);
  }, []);

  /**
   * Reset analysis
   */
  const handleReset = useCallback(() => {
    setAnalysisResult(null);
    setSelectedSkills([]);
  }, []);

  return (
    <div className={`skill-gap-radar skill-gap-radar--${theme}`}>
      {/* Header Section */}
      <motion.div
        className="sgr-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="sgr-header__content">
          <h1 className="sgr-header__title">Skill Gap Radar</h1>
          <p className="sgr-header__subtitle">
            Compare your skills with 2030 workforce requirements
          </p>
        </div>
      </motion.div>

      {/* Input Section */}
      <motion.div
        className="sgr-input-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SkillInput
          selectedSkills={selectedSkills}
          onSkillsChange={handleSkillsChange}
          onAnalyze={handleSkillAnalysis}
          isAnalyzing={isAnalyzing}
        />
      </motion.div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {analysisResult && (
          <motion.div
            className="sgr-results-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Gap Score - Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <GapScoreCard gapScore={analysisResult.gapScore} />
            </motion.div>

            {/* Cards Grid */}
            <div className="sgr-cards-grid">
              {/* Current Skills */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CurrentSkillsCard skills={analysisResult.matchedSkills} />
              </motion.div>

              {/* Future Skills */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <FutureSkillsCard skills={analysisResult.missingSkills} />
              </motion.div>

              {/* Critical Gaps */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <CriticalGapsCard gaps={analysisResult.missingSkills} />
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <RecommendationsCard recommendations={analysisResult.recommendations} />
              </motion.div>
            </div>

            {/* AI Insight */}
            {showInsights && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <AIInsightCard insight={analysisResult.insight} />
              </motion.div>
            )}

            {/* AI Learning Paths */}
            {enableAI && analysisResult.aiLearningPaths && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <AILearningPathCard 
                  learningPaths={analysisResult.aiLearningPaths}
                  isLoading={false}
                />
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              className="sgr-action-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <button
                className="sgr-btn sgr-btn--secondary"
                onClick={handleReset}
              >
                Analyse Another Set
              </button>
              <button
                className="sgr-btn sgr-btn--primary"
                onClick={() => window.print?.()}
              >
                Export Results
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!analysisResult && !isAnalyzing && selectedSkills.length === 0 && (
        <motion.div
          className="sgr-empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="sgr-empty-state__content">
            <div className="sgr-empty-state__icon">📊</div>
            <p className="sgr-empty-state__text">
              Add your current skills above to begin your analysis
            </p>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <motion.div
          className="sgr-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="sgr-loading__spinner"></div>
          <p className="sgr-loading__text">Analyzing your skills...</p>
        </motion.div>
      )}
    </div>
  );
};

export default SkillGapRadar;
