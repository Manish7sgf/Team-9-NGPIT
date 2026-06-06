import { nvidia } from "../config/nvidia.js";

/**
 * Nvidia NIM AI service.
 * Model: nvidia/nvidia-nemotron-nano-9b-v2
 * All prompts demand JSON-only responses to enable reliable parsing.
 *
 * Retry strategy: if JSON.parse fails on first attempt, retry once.
 * On second failure → throw structured error (never surface raw API error).
 */

const MODEL = "nvidia/nvidia-nemotron-nano-9b-v2";

/**
 * Helper: call Nvidia NIM and parse the JSON response.
 * Retries once on JSON parse failure.
 */
async function callNvidiaJSON(prompt, maxTokens = 1024) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const completion = await nvidia.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        top_p: 0.95,
        max_tokens: maxTokens,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false,
        // Nemotron thinking tokens — ensures thorough reasoning
        extra_body: {
          min_thinking_tokens: 512,
          max_thinking_tokens: 1024,
        },
      });

      const raw = completion.choices[0].message.content;

      // Strip markdown fences if model wraps output despite instructions
      const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      return JSON.parse(cleaned);
    } catch (err) {
      if (attempt === 2) {
        // Second failure — give up with a clean error
        throw new Error("AI response malformed, please try again");
      }
      // First failure — loop and retry
      console.warn(`[Nvidia] JSON parse failed on attempt ${attempt}, retrying...`);
    }
  }
}

export const nvidiaService = {
  /**
   * Analyse a GitHub repo and return structured assessment.
   * Used by Portfolio Generator.
   *
   * @param {{ repoData, languages, readme }} - GitHub data
   * @returns Parsed JSON object with title, description, tech_stack, etc.
   */
  async analyseRepo({ repoData, languages, readme }) {
    const prompt = `You are a technical project evaluator. Analyse this GitHub repository and assess the student's contribution level.

Repository info:
- Name: ${repoData.name || "Unknown"}
- Description: ${repoData.description || "None provided"}
- Stars: ${repoData.stargazers_count ?? 0}
- Forks: ${repoData.forks_count ?? 0}
- Languages: ${JSON.stringify(languages)}
- README (first 2000 chars): ${readme || "Not available"}

Respond ONLY with valid JSON. No explanation. No markdown fences. Just the raw JSON object:
{
  "title": "<clean human-readable project title>",
  "description": "<2 sentence summary of what the project does and its purpose>",
  "tech_stack": ["tech1", "tech2", "tech3"],
  "contribution_level": "high|medium|low",
  "contribution_reason": "<1 sentence explaining why you rated the contribution at this level>",
  "complexity_score": <integer 1-10>,
  "skills_demonstrated": ["skill1", "skill2", "skill3", "skill4"]
}

Scoring guide for contribution_level:
- high: Original project, meaningful commits, clear architecture, README present
- medium: Fork or tutorial project with some customisation, partial documentation
- low: Minimal changes, boilerplate only, no documentation`;

    return callNvidiaJSON(prompt, 1024);
  },

  /**
   * Predict future career paths based on current skills.
   * Used by Career Time Machine.
   */
  async predictCareers({ skills, interests }) {
    const prompt = `You are a future career analyst specialising in AI-era employment (2025–2040).

Student profile:
- Current skills: ${skills.join(", ")}
- Interests: ${interests.join(", ")}

Respond ONLY with valid JSON. No explanation. No markdown. Just the raw JSON object:
{
  "readiness_score": <integer 0-100>,
  "predicted_jobs": [
    {
      "title": "<job title>",
      "year_emerging": "<2026-2040>",
      "description": "<2 sentence description>",
      "fit_score": <integer 0-100>,
      "skills_needed": ["skill1", "skill2"],
      "skills_you_have": ["skill1"]
    }
  ],
  "gap_summary": "<1 sentence summary of biggest skill gap>",
  "top_recommendation": "<1 actionable next step>"
}

Return exactly 4 predicted_jobs. No more, no less.`;

    return callNvidiaJSON(prompt, 1200);
  },

  /**
   * Analyse skill gap between current skills and 2030 market demands.
   * Used by Skill Gap Radar.
   */
  async analyseSkillGap({ skills }) {
    const prompt = `You are a workforce analytics AI. Analyse the skill gap between what a student has now vs what 2030 employers will demand.

Student current skills: ${skills.join(", ")}

Respond ONLY with valid JSON. No explanation. No markdown fences. Just the raw JSON:
{
  "current_skills": [{ "name": "skill", "relevance_2030": <0-100> }],
  "future_demanded_skills": [{ "name": "skill", "demand_score": <0-100>, "category": "technical|human|ai-collaboration" }],
  "gap_percentage": <integer 0-100>,
  "missing_critical": ["skill1", "skill2"],
  "recommendations": [{ "action": "<specific action>", "impact": "high|medium|low" }]
}

Return exactly 6 future_demanded_skills and exactly 3 recommendations.`;

    return callNvidiaJSON(prompt, 900);
  },
};
