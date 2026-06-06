/**
 * SkillInput Component
 * Multi-select tag input for skill entry
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const SkillInput = ({
  selectedSkills = [],
  onSkillsChange = () => {},
  onAnalyze = () => {},
  isAnalyzing = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  // Predefined suggestions
  const suggestedSkills = [
    'Python', 'Java', 'JavaScript', 'SQL', 'Communication',
    'Problem Solving', 'Data Analysis', 'Machine Learning',
    'Cloud Computing', 'DevOps', 'Leadership', 'Teamwork'
  ];

  /**
   * Handle adding a skill
   */
  const handleAddSkill = useCallback((skill) => {
    const trimmedSkill = skill.trim();
    
    if (trimmedSkill && !selectedSkills.includes(trimmedSkill)) {
      const newSkills = [...selectedSkills, trimmedSkill];
      onSkillsChange(newSkills);
      setInputValue('');
    }
  }, [selectedSkills, onSkillsChange]);

  /**
   * Handle removing a skill
   */
  const handleRemoveSkill = useCallback((skillToRemove) => {
    const newSkills = selectedSkills.filter(skill => skill !== skillToRemove);
    onSkillsChange(newSkills);
  }, [selectedSkills, onSkillsChange]);

  /**
   * Handle input keydown
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && selectedSkills.length > 0) {
      handleRemoveSkill(selectedSkills[selectedSkills.length - 1]);
    }
  };

  /**
   * Filter suggestions based on input
   */
  const filteredSuggestions = suggestedSkills.filter(skill =>
    !selectedSkills.includes(skill) &&
    skill.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="skill-input-container">
      <div className="skill-input-card">
        {/* Header */}
        <div className="skill-input-header">
          <h2 className="skill-input-title">Your Current Skills</h2>
          <p className="skill-input-subtitle">
            Enter or select the skills you currently possess
          </p>
        </div>

        {/* Selected Skills Tags */}
        <div className="skill-tags-container">
          {selectedSkills.map((skill, index) => (
            <motion.div
              key={skill}
              className="skill-tag"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="skill-tag__text">{skill}</span>
              <button
                className="skill-tag__remove"
                onClick={() => handleRemoveSkill(skill)}
                aria-label={`Remove ${skill}`}
              >
                ✕
              </button>
            </motion.div>
          ))}

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            className="skill-input-field"
            placeholder={selectedSkills.length === 0 ? "Type a skill (e.g., 'Python') and press Enter" : "Add more skills..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isAnalyzing}
          />
        </div>

        {/* Suggestions */}
        {inputValue && filteredSuggestions.length > 0 && (
          <motion.div
            className="skill-suggestions"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="skill-suggestions__label">Suggestions:</p>
            <div className="skill-suggestions__list">
              {filteredSuggestions.map((skill) => (
                <button
                  key={skill}
                  className="skill-suggestion-item"
                  onClick={() => handleAddSkill(skill)}
                  type="button"
                >
                  <span className="skill-suggestion-item__icon">+</span>
                  {skill}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Add Buttons */}
        {selectedSkills.length === 0 && !inputValue && (
          <motion.div
            className="skill-quick-add"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <p className="skill-quick-add__label">Popular skills:</p>
            <div className="skill-quick-add__buttons">
              {suggestedSkills.slice(0, 5).map((skill) => (
                <button
                  key={skill}
                  className="skill-quick-add-btn"
                  onClick={() => handleAddSkill(skill)}
                  type="button"
                >
                  {skill}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="skill-input-actions">
          <button
            className={`skill-analyze-btn ${isAnalyzing ? 'loading' : ''}`}
            onClick={onAnalyze}
            disabled={selectedSkills.length === 0 || isAnalyzing}
            type="button"
          >
            {isAnalyzing ? (
              <>
                <span className="skill-analyze-btn__spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                Analyse Gap
                <span className="skill-analyze-btn__arrow">→</span>
              </>
            )}
          </button>
          
          {selectedSkills.length > 0 && (
            <p className="skill-count">
              <span className="skill-count__number">{selectedSkills.length}</span>
              {' '}skill{selectedSkills.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillInput;
