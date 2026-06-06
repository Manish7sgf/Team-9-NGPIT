import React, { useState } from 'react';
import SkillGapRadar from './features/SkillGapRadar/SkillGapRadar';
import '../styles/SkillGapRadar.css';

/**
 * StudentDashboard - Example integration of Skill Gap Radar
 * 
 * This demonstrates how to:
 * 1. Import the SkillGapRadar component
 * 2. Pass initial user skills
 * 3. Handle analysis results
 * 4. Save results to backend or state
 */

export default function StudentDashboard() {
  // Mock user data - replace with real data from your app
  const [user] = useState({
    id: 'student-123',
    name: 'John Doe',
    skills: ['Java', 'Python', 'SQL', 'Communication']
  });

  const [analysisResults, setAnalysisResults] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  /**
   * Handle when user completes skill gap analysis
   * This function receives the full analysis results
   */
  const handleAnalysisComplete = async (results) => {
    console.log('=== Skill Gap Analysis Complete ===');
    console.log('Gap Score:', results.gapScore);
    console.log('Matched Skills:', results.matchedSkills);
    console.log('Missing Skills:', results.missingSkills);
    console.log('Recommendations:', results.recommendations);
    console.log('Insight:', results.insight);
    console.log('=====================================');

    // Store results in state for immediate display
    setAnalysisResults(results);

    // Example: Save to backend API
    setIsSaving(true);
    try {
      const response = await fetch('/api/skill-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication if needed: 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          userSkills: results.matchedSkills.map(s => s.skill),
          gapScore: results.gapScore,
          missingSkills: results.missingSkills,
          recommendations: results.recommendations,
          insight: results.insight,
          analyzedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        const saved = await response.json();
        setSaveMessage('✓ Analysis saved successfully');
        console.log('Saved to backend:', saved);
      } else {
        setSaveMessage('✗ Failed to save analysis');
      }
    } catch (error) {
      console.log('Note: Backend API not available, storing in local state');
      setSaveMessage('Stored locally (API not connected)');
    } finally {
      setIsSaving(false);
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div className="student-dashboard" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
          Welcome, {user.name}!
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Analyze your skills gap and get actionable recommendations for 2030
        </p>
      </div>

      {/* Save Status Message */}
      {saveMessage && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '16px',
          borderRadius: '8px',
          background: saveMessage.startsWith('✓') ? '#dcfce7' : '#fef2f2',
          color: saveMessage.startsWith('✓') ? '#166534' : '#991b1b',
          fontSize: '13px',
          fontWeight: '500'
        }}>
          {saveMessage}
        </div>
      )}

      {/* Main Feature Component */}
      <SkillGapRadar
        userSkills={user.skills}
        onAnalysisComplete={handleAnalysisComplete}
      />

      {/* Display Saved Results Below (Optional) */}
      {analysisResults && (
        <div style={{
          marginTop: '32px',
          padding: '24px',
          background: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            📊 Analysis Summary
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              padding: '16px',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                Gap Score
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>
                {analysisResults.gapScore}%
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                Your Skills
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
                {analysisResults.matchedSkills.length}
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                Skills to Learn
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
                {analysisResults.missingSkills.length}
              </div>
            </div>
          </div>

          {/* Recommendations Preview */}
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
              Top Recommendations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {analysisResults.recommendations.slice(0, 3).map((rec, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 12px',
                    background: 'white',
                    borderRadius: '6px',
                    border: `2px solid ${
                      rec.impact === 'HIGH' ? '#ef4444' :
                      rec.impact === 'MEDIUM' ? '#f59e0b' :
                      '#10b981'
                    }`,
                    fontSize: '13px'
                  }}
                >
                  <div style={{ marginBottom: '4px' }}>{rec.text}</div>
                  <div style={{
                    fontSize: '11px',
                    color: '#6b7280'
                  }}>
                    Impact: <strong>{rec.impact}</strong> • Timeline: {rec.timeline}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isSaving && (
            <div style={{ marginTop: '16px', textAlign: 'center', color: '#6b7280' }}>
              Saving to backend...
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: '32px',
        padding: '16px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#9ca3af',
        borderTop: '1px solid #e5e7eb'
      }}>
        💡 Tip: Share your analysis with your mentor or career advisor for guidance
      </div>
    </div>
  );
}

/**
 * ADVANCED EXAMPLE: Using with useReducer for complex state
 * 
 * If you need more complex state management:
 */

/*
const [state, dispatch] = useReducer((prevState, action) => {
  switch (action.type) {
    case 'ANALYSIS_STARTED':
      return { ...prevState, loading: true, error: null };
    case 'ANALYSIS_COMPLETE':
      return { ...prevState, loading: false, results: action.payload };
    case 'SAVE_STARTED':
      return { ...prevState, saving: true };
    case 'SAVE_COMPLETE':
      return { ...prevState, saving: false, lastSaved: new Date() };
    case 'ERROR':
      return { ...prevState, error: action.payload };
    default:
      return prevState;
  }
}, {
  loading: false,
  saving: false,
  results: null,
  error: null,
  lastSaved: null
});

const handleAnalysisComplete = async (results) => {
  dispatch({ type: 'ANALYSIS_COMPLETE', payload: results });
  
  dispatch({ type: 'SAVE_STARTED' });
  try {
    // Save logic here
    dispatch({ type: 'SAVE_COMPLETE' });
  } catch (error) {
    dispatch({ type: 'ERROR', payload: error.message });
  }
};
*/
