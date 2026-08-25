/**
 * Deterministic Scoring Engine for ProjectMatch.
 * Calculates transparent, mathematically explainable compatibility scores.
 * 
 * Weights:
 * - Skill Complementarity: 40%
 * - Availability / Time Fit: 25%
 * - Interest / Domain Alignment: 20%
 * - Experience Synergy: 15%
 */

const PROFICIENCY_WEIGHTS = {
  advanced: 1.0,
  intermediate: 0.75,
  beginner: 0.5
};

const EXPERIENCE_SCORES = {
  advanced: 95,
  intermediate: 85,
  beginner: 70
};

/**
 * Normalizes a skill/interest string for fuzzy comparison.
 */
function normalizeString(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Calculates Skill Complementarity Score (0-100)
 * Evaluates how well the student's skills fulfill the project's required skills,
 * weighted by skill proficiency level.
 */
function calculateSkillScore(student, project) {
  const projectSkills = Array.isArray(project.requiredSkills) ? project.requiredSkills : [];
  if (projectSkills.length === 0) {
    return { score: 80, matchedSkills: [], missingSkillsSupplied: [] };
  }

  const studentSkills = Array.isArray(student.skills) ? student.skills : [];
  const matchedSkills = [];
  const missingSkillsSupplied = [];
  let totalProficiencyEarned = 0;

  for (const reqSkill of projectSkills) {
    const normReq = normalizeString(reqSkill);
    const foundSkill = studentSkills.find((s) => {
      const normStudentSkill = normalizeString(s.name);
      return normStudentSkill === normReq || normStudentSkill.includes(normReq) || normReq.includes(normStudentSkill);
    });

    if (foundSkill) {
      matchedSkills.push(foundSkill.name);
      missingSkillsSupplied.push(reqSkill);
      const profKey = (foundSkill.proficiency || 'intermediate').toLowerCase();
      const weight = PROFICIENCY_WEIGHTS[profKey] || 0.75;
      totalProficiencyEarned += weight;
    }
  }

  // Calculate percentage of required skills covered with proficiency
  const maxPossiblePoints = projectSkills.length;
  const coverageRatio = totalProficiencyEarned / maxPossiblePoints;
  
  // Base skill score (scaled 0-100)
  let rawScore = Math.min(100, Math.round(coverageRatio * 100));

  // Role fulfillment bonus (if student has the exact required role)
  const requiredRoles = (project.requiredRoles || []).map((r) => normalizeString(r));
  const studentRole = normalizeString(student.primaryRole);
  if (requiredRoles.includes(studentRole)) {
    rawScore = Math.min(100, rawScore + 10);
  }

  return {
    score: Math.max(10, rawScore),
    matchedSkills,
    missingSkillsSupplied
  };
}

/**
 * Calculates Availability & Time Fit Score (0-100)
 * Evaluates weekly hours ratio and timezone compatibility.
 */
function calculateAvailabilityScore(student, project) {
  const minHours = Number(project.minAvailabilityHours) || 10;
  const studentHours = Number(student.availabilityHours) || 10;

  // Hours ratio score (capped at 100)
  const hoursRatio = studentHours / minHours;
  let hoursScore = 100;
  if (hoursRatio < 1.0) {
    hoursScore = Math.round(hoursRatio * 80);
  } else if (hoursRatio > 1.2) {
    hoursScore = 100; // Bonus capacity
  } else {
    hoursScore = 90 + Math.round((hoursRatio - 1.0) * 50);
  }

  // Timezone difference score
  // If project has current members, check offset against the first member's timezone (default -5 if unspecified)
  const projectTimezone = project.timezoneOffset ?? -5;
  const studentTimezone = student.timezoneOffset ?? -5;
  const timezoneDelta = Math.abs(studentTimezone - projectTimezone);

  let timezoneScore = 100;
  if (timezoneDelta <= 2) {
    timezoneScore = 100;
  } else if (timezoneDelta <= 4) {
    timezoneScore = 85;
  } else if (timezoneDelta <= 6) {
    timezoneScore = 70;
  } else {
    timezoneScore = 50;
  }

  const combinedScore = Math.round(0.65 * hoursScore + 0.35 * timezoneScore);
  return Math.max(10, Math.min(100, combinedScore));
}

/**
 * Calculates Interest & Domain Alignment Score (0-100)
 * Evaluates overlap between candidate's interests and the project track/domain.
 */
function calculateInterestScore(student, project) {
  const studentInterests = (student.interests || []).map((i) => normalizeString(i));
  const projectTrack = normalizeString(project.track);
  const projectTitle = normalizeString(project.title);
  const projectDesc = normalizeString(project.description);

  let matchPoints = 0;
  let hasTrackMatch = false;

  for (const interest of studentInterests) {
    if (interest === projectTrack || projectTrack.includes(interest) || interest.includes(projectTrack)) {
      matchPoints += 50;
      hasTrackMatch = true;
    } else if (projectTitle.includes(interest) || projectDesc.includes(interest)) {
      matchPoints += 25;
    }
  }

  if (hasTrackMatch) {
    matchPoints = Math.max(80, matchPoints);
  }

  return Math.max(20, Math.min(100, matchPoints || 40));
}

/**
 * Calculates Experience Level Synergy Score (0-100)
 */
function calculateExperienceScore(student) {
  const expKey = (student.experienceLevel || 'intermediate').toLowerCase();
  return EXPERIENCE_SCORES[expKey] || 85;
}

/**
 * Computes complete compatibility score and returns detailed component breakdown.
 * 
 * @param {object} student 
 * @param {object} project 
 * @returns {object} { compatibilityScore, scoreBreakdown, matchedSkills, missingSkillsSupplied }
 */
export function scoreCandidate(student, project) {
  const { score: skillComplementarity, matchedSkills, missingSkillsSupplied } = calculateSkillScore(student, project);
  const availabilityFit = calculateAvailabilityScore(student, project);
  const interestAlignment = calculateInterestScore(student, project);
  const experienceSynergy = calculateExperienceScore(student);

  // 4 Deterministic Weighted Pillars
  // Skill: 40%, Availability: 25%, Interest: 20%, Experience: 15%
  const compositeScore = (
    0.40 * skillComplementarity +
    0.25 * availabilityFit +
    0.20 * interestAlignment +
    0.15 * experienceSynergy
  );

  const roundedScore = Math.min(100, Math.max(0, Math.round(compositeScore)));

  return {
    compatibilityScore: roundedScore,
    scoreBreakdown: {
      skillComplementarity,
      availabilityFit,
      interestAlignment,
      experienceSynergy
    },
    matchedSkills,
    missingSkillsSupplied,
    roleCovered: student.primaryRole
  };
}
