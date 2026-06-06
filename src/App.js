import React from 'react';
import SkillGapRadar from './components/features/SkillGapRadar/SkillGapRadar';
import './styles/SkillGapRadar.css';
import './App.css';

function App() {
  const handleAnalysisComplete = (results) => {
    console.log('📊 Analysis Complete:', results);
    console.log('Gap Score:', results.gapScore + '%');
    console.log('Matched Skills:', results.matchedSkills.length);
    console.log('Missing Skills:', results.missingSkills.length);
    if (results.aiLearningPaths) {
      console.log('🤖 AI Learning Paths:', results.aiLearningPaths.learningPaths);
    }
  };

  return (
    <div className="App">
      <style>{`
        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .App {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }
        .header {
          max-width: 1400px;
          margin: 0 auto 40px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 2.5em;
          font-weight: 700;
        }
        .header p {
          margin: 0;
          font-size: 1.1em;
          opacity: 0.95;
        }
      `}</style>
      
      <div className="header">
        <h1>🎯 Skill Gap Radar</h1>
        <p>Discover your skills gap against 2030 workforce requirements</p>
      </div>

      <SkillGapRadar 
        userSkills={['Java', 'Python']}
        enableAI={true}
        onAnalysisComplete={handleAnalysisComplete}
        theme="light"
        showInsights={true}
      />
    </div>
  );
}

export default App;
