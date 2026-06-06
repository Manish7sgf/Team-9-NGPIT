const futureSkills2030 = [
  {
    skill: 'AI Collaboration',
    type: 'ai-collaboration',
    demand: 98,
    description: 'Working effectively with AI tools and systems'
  },
  {
    skill: 'Prompt Engineering',
    type: 'technical',
    demand: 95,
    description: 'Crafting effective prompts for AI systems'
  },
  {
    skill: 'Data Analysis',
    type: 'technical',
    demand: 90,
    description: 'Interpreting and deriving insights from data'
  },
  {
    skill: 'Critical Thinking',
    type: 'human',
    demand: 92,
    description: 'Analytical reasoning and problem-solving'
  },
  {
    skill: 'Leadership',
    type: 'human',
    demand: 87,
    description: 'Guiding teams and making strategic decisions'
  },
  {
    skill: 'Automation',
    type: 'technical',
    demand: 93,
    description: 'Creating efficient automated workflows'
  },
  {
    skill: 'AI Tool Usage',
    type: 'ai-collaboration',
    demand: 96,
    description: 'Proficiency with modern AI tools and platforms'
  }
];

/**
 * Call NVIDIA API for AI-powered recommendations
 * @param {Object} analysisData - The gap analysis data
 * @returns {Promise<Object>} AI-generated learning paths
 */
const callNvidiaAPI = async (analysisData) => {
  try {
    const apiKey = process.env.VITE_API_KEY || localStorage.getItem('nvidia_api_key');
    
    if (!apiKey) {
      console.warn('No NVIDIA API key found. Using fallback recommendations.');
      return null;
    }

    const prompt = buildPrompt(analysisData);

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'nvidia/llama-2-70b-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      console.error('NVIDIA API Error:', response.statusText);
      return null;
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    return parseAIResponse(aiResponse, analysisData);
  } catch (error) {
    console.error('Error calling NVIDIA API:', error);
    return null;
  }
};

/**
 * Build prompt for NVIDIA API
 * @private
 */
const buildPrompt = (analysisData) => {
  const { matchedSkills, missingSkills, gapScore } = analysisData;
  
  return `You are a career advisor specializing in 2030 workforce skills.

User Profile:
- Current Skills: ${matchedSkills.map(s => s.skill).join(', ') || 'None'}
- Missing Critical Skills: ${missingSkills.map(s => s.skill).join(', ')}
- Skill Gap: ${gapScore}%

Generate 3 personalized learning path recommendations in this format:
1. [Skill Name]: [2-3 sentence explanation] | [Time: e.g., "3-6 months"]
2. [Skill Name]: [explanation] | [Time]
3. [Skill Name]: [explanation] | [Time]

Focus on practical, achievable paths.`;
};

/**
 * Parse AI response and structure learning paths
 * @private
 */
const parseAIResponse = (response, analysisData) => {
  try {
    const paths = [];
    const lines = response.split('\n').filter(line => line.trim());

    lines.forEach((line, index) => {
      if (line.match(/^\d+\./)) {
        const parts = line.split('|');
        const skillPart = parts[0].replace(/^\d+\.\s*/, '').trim();
        const timePart = parts[1] ? parts[1].trim() : 'Self-paced';

        paths.push({
          id: index,
          skill: skillPart.split(':')[0].trim(),
          description: skillPart.split(':').slice(1).join(':').trim(),
          timeEstimate: timePart,
          source: 'AI Generated'
        });
      }
    });

    return {
      learningPaths: paths.length > 0 ? paths : generateFallbackPaths(analysisData),
      source: 'nvidia-ai',
      timestamp: new Date().toISOString(),
      success: true
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return null;
  }
};

/**
 * Fallback learning paths if API fails
 * @private
 */
const generateFallbackPaths = (analysisData) => {
  const { missingSkills } = analysisData;
  const topMissing = missingSkills.slice(0, 3);

  return topMissing.map((skill, index) => ({
    id: index,
    skill: skill.skill,
    description: getDetailedLearningPath(skill),
    timeEstimate: getTimeEstimate(skill),
    source: 'fallback'
  }));
};

/**
 * Get detailed learning path for a skill
 * @private
 */
const getDetailedLearningPath = (skill) => {
  const pathMap = {
    'AI Collaboration': 'Learn to work with AI systems through collaborative projects and understanding AI capabilities.',
    'Prompt Engineering': 'Master crafting effective prompts for AI models and learning optimization techniques.',
    'Data Analysis': 'Develop skills in analyzing datasets, visualizations, and extracting insights.',
    'Critical Thinking': 'Build analytical reasoning through case studies and problem-solving.',
    'Leadership': 'Develop leadership through mentoring, project ownership, and strategic decisions.',
    'Automation': 'Create automated workflows and master RPA and workflow tools.',
    'AI Tool Usage': 'Gain hands-on experience with ChatGPT, Claude, Gemini, and other platforms.'
  };

  return pathMap[skill.skill] || `Master ${skill.skill} through structured learning.`;
};

/**
 * Get time estimate for skill development
 * @private
 */
const getTimeEstimate = (skill) => {
  const estimateMap = {
    'AI Collaboration': '2-3 months',
    'Prompt Engineering': '4-6 weeks',
    'Data Analysis': '3-4 months',
    'Critical Thinking': '2-3 months',
    'Leadership': '6-12 months',
    'Automation': '3-4 months',
    'AI Tool Usage': '2-3 weeks'
  };

  return estimateMap[skill.skill] || '2-3 months';
};

/**
 * Analyze skill gaps against future workforce requirements
 * @param {Array<string>} userSkills - Array of user's current skills
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} Analysis result with gap score, matched skills, missing skills, and recommendations
 */
const analyzeGap = async (userSkills = [], options = {}) => {
  const { useAI = true } = options;
  // Normalize user skills to lowercase for comparison
  const normalizedUserSkills = userSkills.map(skill => skill.toLowerCase().trim());

  // Find matched skills
  const matchedSkills = futureSkills2030.filter(futureSkill =>
    normalizedUserSkills.some(userSkill =>
      userSkill.includes(futureSkill.skill.toLowerCase()) ||
      futureSkill.skill.toLowerCase().includes(userSkill)
    )
  );

  // Find missing skills
  const missingSkills = futureSkills2030.filter(futureSkill =>
    !matchedSkills.some(matched => matched.skill === futureSkill.skill)
  );

  // Calculate gap score (percentage of missing skills)
  const gapScore = Math.round((missingSkills.length / futureSkills2030.length) * 100);

  // Calculate relevance scores for matched skills
  const matchedSkillsWithRelevance = matchedSkills.map(skill => ({
    ...skill,
    relevance: skill.demand // Use demand as relevance score
  }));

  // Generate recommendations based on missing skills and their demand
  const recommendations = generateRecommendations(missingSkills, matchedSkills);

  // Generate AI insight
  const insight = generateInsight(matchedSkills, missingSkills);

  // Calculate category breakdown
  const categoryBreakdown = calculateCategoryBreakdown(matchedSkills, missingSkills);

  // Try to get AI-powered learning paths
  let aiLearningPaths = null;
  if (useAI) {
    const analysisData = {
      matchedSkills,
      missingSkills,
      gapScore,
      recommendations
    };
    aiLearningPaths = await callNvidiaAPI(analysisData);
  }

  return {
    gapScore,
    matchedSkills: matchedSkillsWithRelevance,
    missingSkills,
    recommendations,
    insight,
    categoryBreakdown,
    aiLearningPaths,
    totalSkills: futureSkills2030.length,
    matchedCount: matchedSkills.length,
    missingCount: missingSkills.length,
    timestamp: new Date().toISOString()
  };
};

/**
 * Generate actionable recommendations based on analysis
 * @private
 */
const generateRecommendations = (missingSkills, matchedSkills) => {
  const recommendations = [];

  // Sort missing skills by demand
  const sortedMissing = [...missingSkills].sort((a, b) => b.demand - a.demand);

  // Get top 3 missing skills
  const topMissing = sortedMissing.slice(0, 3);

  topMissing.forEach(skill => {
    const impact = skill.demand >= 95 ? 'HIGH' : skill.demand >= 85 ? 'MEDIUM' : 'LOW';
    const action = getRecommendationAction(skill);

    recommendations.push({
      action,
      impact,
      skill: skill.skill,
      type: skill.type,
      relevance: skill.demand
    });
  });

  return recommendations;
};

/**
 * Generate specific action text for a skill
 * @private
 */
const getRecommendationAction = (skill) => {
  const actionMap = {
    'AI Collaboration': 'Partner on AI-driven projects and cross-functional teams',
    'Prompt Engineering': 'Complete prompt engineering courses and practice daily',
    'Data Analysis': 'Take advanced data analytics certifications',
    'Critical Thinking': 'Solve complex case studies and join problem-solving groups',
    'Leadership': 'Take on leadership roles in projects and mentoring',
    'Automation': 'Build automation projects and learn scripting languages',
    'AI Tool Usage': 'Experiment with ChatGPT, Claude, and other AI platforms weekly'
  };

  return actionMap[skill.skill] || `Master ${skill.skill} through continuous learning`;
};

/**
 * Generate AI career insight based on skill analysis
 * @private
 */
const generateInsight = (matchedSkills, missingSkills) => {
  const totalMatched = matchedSkills.length;
  const totalMissing = missingSkills.length;

  // Determine strongest category
  const categoryStrength = {};
  matchedSkills.forEach(skill => {
    categoryStrength[skill.type] = (categoryStrength[skill.type] || 0) + 1;
  });

  const strongestCategory = Object.entries(categoryStrength).sort((a, b) => b[1] - a[1])[0];
  const strongestCategoryLabel = {
    'technical': 'Technical Skills',
    'human': 'Human Skills',
    'ai-collaboration': 'AI Collaboration'
  }[strongestCategory?.[0]] || 'Technical Skills';

  // Find biggest risk
  const riskCategories = {};
  missingSkills.forEach(skill => {
    riskCategories[skill.type] = (riskCategories[skill.type] || 0) + skill.demand;
  });

  const riskCategory = Object.entries(riskCategories).sort((a, b) => b[1] - a[1])[0];
  const riskCategoryLabel = {
    'technical': 'Technical Skills',
    'human': 'Human Skills',
    'ai-collaboration': 'AI Collaboration'
  }[riskCategory?.[0]] || 'General Skills';

  const baseInsight = `Your strongest area is ${strongestCategoryLabel}. Your biggest employability risk is ${riskCategoryLabel}.`;

  const actionInsight = riskCategory
    ? `Improving ${riskCategoryLabel.toLowerCase()} could significantly reduce your skill gap and boost your 2030 employability.`
    : `You're well-positioned for 2030! Continue building on your ${strongestCategoryLabel.toLowerCase()}.`;

  const consistencyInsight = totalMatched > 3
    ? 'You have a diverse skill portfolio—focus on deepening expertise in high-demand areas.'
    : 'Build breadth in your skills by learning across different categories.';

  return `${baseInsight} ${actionInsight} ${consistencyInsight}`;
};

/**
 * Calculate skill breakdown by category
 * @private
 */
const calculateCategoryBreakdown = (matchedSkills, missingSkills) => {
  const breakdown = {
    technical: { matched: 0, missing: 0 },
    human: { matched: 0, missing: 0 },
    'ai-collaboration': { matched: 0, missing: 0 }
  };

  matchedSkills.forEach(skill => {
    breakdown[skill.type].matched += 1;
  });

  missingSkills.forEach(skill => {
    breakdown[skill.type].missing += 1;
  });

  return breakdown;
};

/**
 * Calculate relevance score color
 * @param {number} score - Score between 0-100
 * @returns {string} Color indicator ('green', 'amber', 'red')
 */
const getRelevanceColor = (score) => {
  if (score > 60) return 'green';
  if (score >= 30) return 'amber';
  return 'red';
};

/**
 * Get all future skills
 * @returns {Array} Array of future skills
 */
const getFutureSkills = () => [...futureSkills2030];

/**
 * Get skill by name
 * @param {string} skillName - Name of the skill
 * @returns {Object|null} Skill object or null if not found
 */
const getSkillByName = (skillName) => {
  return futureSkills2030.find(
    skill => skill.skill.toLowerCase() === skillName.toLowerCase()
  ) || null;
};

export default {
  analyzeGap,
  futureSkills2030,
  getFutureSkills,
  getSkillByName,
  getRelevanceColor,
  callNvidiaAPI,
  generateFallbackPaths
};
