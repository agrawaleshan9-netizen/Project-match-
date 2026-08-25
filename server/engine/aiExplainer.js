import { GoogleGenAI } from '@google/genai';

/**
 * Generates a local, deterministic explanation as a resilient fallback.
 */
export function generateLocalFallbackExplanation(student, project, matchMetrics) {
  const matched = (matchMetrics.matchedSkills && matchMetrics.matchedSkills.length > 0)
    ? matchMetrics.matchedSkills.join(', ')
    : student.skills.slice(0, 2).map((s) => s.name).join(', ');

  const roleText = student.primaryRole || 'contributor';
  const hoursText = `${student.availabilityHours}h/week`;
  const trackText = project.track || 'project';

  if (matchMetrics.compatibilityScore >= 80) {
    return `${student.name} is an exceptional fit for the ${roleText} opening, supplying key expertise in ${matched}. Their ${hoursText} commitment and shared focus on ${trackText} provide immediate high-velocity momentum.`;
  } else if (matchMetrics.compatibilityScore >= 60) {
    return `${student.name} effectively covers the ${roleText} role with relevant background in ${matched}. Their ${hoursText} availability meets the project's baseline sprint requirements.`;
  } else {
    return `${student.name} brings foundational skills in ${matched} for the ${roleText} track, offering ${hoursText} of active project collaboration.`;
  }
}

/**
 * Generates a concise 2-sentence match explanation using Gemini or local fallback.
 * 
 * @param {object} student 
 * @param {object} project 
 * @param {object} matchMetrics - { compatibilityScore, scoreBreakdown, matchedSkills, missingSkillsSupplied }
 * @returns {Promise<{ explanation: string, source: string }>}
 */
export async function generateMatchExplanation(student, project, matchMetrics) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      explanation: generateLocalFallbackExplanation(student, project, matchMetrics),
      source: 'fallback'
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert hackathon team matchmaker.
Explain in exactly 2 clear, punchy, professional sentences why this candidate is a great match for this project.

PROJECT DETAILS:
- Title: ${project.title}
- Track: ${project.track}
- Description: ${project.description}
- Required Roles: ${(project.requiredRoles || []).join(', ')}
- Required Skills: ${(project.requiredSkills || []).join(', ')}

CANDIDATE DETAILS:
- Name: ${student.name}
- Primary Role: ${student.primaryRole}
- Experience Level: ${student.experienceLevel}
- Matched Skills: ${(matchMetrics.matchedSkills || []).join(', ')}
- Bio: ${student.shortBio || 'Motivated builder'}
- Availability: ${student.availabilityHours} hrs/week
- Compatibility Score: ${matchMetrics.compatibilityScore}%

INSTRUCTIONS:
1. Explain how their specific skills fulfill the open project role.
2. Highlight their availability and domain alignment.
3. Keep it under 40 words. Do not use generic filler.`;

    // Strict timeout promise (2000ms max to prevent UI lag)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini request timeout')), 2000)
    );

    const apiCallPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const response = await Promise.race([apiCallPromise, timeoutPromise]);
    const explanation = response.text ? response.text.trim() : null;

    if (explanation) {
      return { explanation, source: 'ai' };
    }

    return {
      explanation: generateLocalFallbackExplanation(student, project, matchMetrics),
      source: 'fallback'
    };
  } catch (err) {
    // Graceful fallback on API error, missing quota, or network timeout
    return {
      explanation: generateLocalFallbackExplanation(student, project, matchMetrics),
      source: 'fallback'
    };
  }
}
