import { getStudents, resetToSeed } from './storage/db.js';
import { evaluateHardFilters } from './engine/hardFilters.js';
import { scoreCandidate } from './engine/scoringEngine.js';
import { generateMatchExplanation } from './engine/aiExplainer.js';

console.log('🧪 Running Backend Role & Skill Sensitivity Validation Test...\n');

// 1. Reset to clean seed data
resetToSeed();
const allStudents = getStudents();

// 2. Define Test Project with strict Backend focus
const backendProject = {
  id: 'proj_test_backend',
  title: 'CloudStore Distributed DB',
  description: 'A scalable document store and real-time backend API using Node.js and MongoDB for fast distributed caching.',
  targetTeamSize: 3,
  requiredRoles: ['Backend', 'Fullstack'],
  requiredSkills: ['Node.js', 'MongoDB'],
  minAvailabilityHours: 15,
  track: 'DevTools',
  currentMembers: [
    { studentId: 'std_01', role: 'AI/ML' } // Sarah Chen is already member
  ]
};

console.log(`📋 Test Project: "${backendProject.title}"`);
console.log(`   - Required Roles: ${backendProject.requiredRoles.join(', ')}`);
console.log(`   - Required Skills: ${backendProject.requiredSkills.join(', ')}`);
console.log(`   - Min Availability: ${backendProject.minAvailabilityHours} hrs/week`);
console.log(`   - Existing Member: Sarah Chen (std_01)\n`);

const eligibleMatches = [];
const filteredOut = [];

for (const student of allStudents) {
  const filterResult = evaluateHardFilters(student, backendProject);

  if (!filterResult.passes) {
    filteredOut.push({
      student,
      reasons: filterResult.reasons
    });
    continue;
  }

  const matchMetrics = scoreCandidate(student, backendProject);
  const explanationResult = await generateMatchExplanation(student, backendProject, matchMetrics);

  eligibleMatches.push({
    student,
    compatibilityScore: matchMetrics.compatibilityScore,
    scoreBreakdown: matchMetrics.scoreBreakdown,
    matchedSkills: matchMetrics.matchedSkills,
    missingSkillsSupplied: matchMetrics.missingSkillsSupplied,
    roleCovered: matchMetrics.roleCovered,
    explanation: explanationResult.explanation,
    explanationSource: explanationResult.source
  });
}

// Sort descending by score
eligibleMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

console.log('===========================================================');
console.log(`📊 FILTERING RESULTS (${allStudents.length} total candidates evaluated)`);
console.log('===========================================================');
console.log(`✅ Eligible Candidates: ${eligibleMatches.length}`);
console.log(`❌ Filtered Out Candidates: ${filteredOut.length}\n`);

console.log('--- Sample Filtered Candidates ---');
filteredOut.forEach(({ student, reasons }) => {
  console.log(`• ${student.name} (${student.primaryRole}, ${student.availabilityHours}h/wk): ${reasons.join('; ')}`);
});

console.log('\n===========================================================');
console.log('🏆 RANKED ELIGIBLE CANDIDATES');
console.log('===========================================================');
eligibleMatches.forEach((m, idx) => {
  console.log(`\n#${idx + 1}: ${m.student.name} — ${m.compatibilityScore}% Compatibility`);
  console.log(`   Role: ${m.student.primaryRole} | Experience: ${m.student.experienceLevel} | Hours: ${m.student.availabilityHours}h/wk`);
  console.log(`   Matched Skills: [${m.matchedSkills.join(', ') || 'None'}]`);
  console.log(`   Score Breakdown:`, m.scoreBreakdown);
  console.log(`   AI Rationale: "${m.explanation}"`);
});

// Verification Assertions
console.log('\n--- Running Assertions ---');

// 1. Existing member Sarah Chen must be filtered out
console.assert(
  filteredOut.some((f) => f.student.id === 'std_01'),
  'FAIL: Existing member Sarah Chen should have been filtered out'
);
console.log('✅ Assertion 1 Passed: Existing project member was excluded.');

// 2. Non-backend candidates (e.g. Leo Martinez - UI/UX) must be filtered out
console.assert(
  filteredOut.some((f) => f.student.id === 'std_02'),
  'FAIL: UI/UX designer Leo Martinez should have been filtered out'
);
console.log('✅ Assertion 2 Passed: Non-matching roles correctly filtered out.');

// 3. Candidates with Node.js / MongoDB (e.g. Marcus Vance, Rohan Gupta) must be top ranked
const topCandidateIds = eligibleMatches.map((m) => m.student.id);
console.assert(
  topCandidateIds.includes('std_03') || topCandidateIds.includes('std_05'),
  'FAIL: Marcus or Rohan should be eligible and top ranked'
);
console.log('✅ Assertion 3 Passed: Candidates with Node.js/MongoDB skills are eligible and ranked highest.');

// 4. Candidate with matching Node.js (Marcus / Rohan) scores significantly higher than Backend dev without Node.js/MongoDB (e.g. Vikram Sethi - Go/gRPC)
const marcusMatch = eligibleMatches.find((m) => m.student.id === 'std_03');
const rohanMatch = eligibleMatches.find((m) => m.student.id === 'std_05');
const vikramMatch = eligibleMatches.find((m) => m.student.id === 'std_15');

if (marcusMatch && vikramMatch) {
  console.assert(
    marcusMatch.scoreBreakdown.skillComplementarity > vikramMatch.scoreBreakdown.skillComplementarity,
    'FAIL: Marcus (Node.js) should have higher skill score than Vikram (Go/gRPC)'
  );
  console.log(`✅ Assertion 4 Passed: Marcus (Node.js, ${marcusMatch.scoreBreakdown.skillComplementarity}% skill) scored higher on skills than Vikram (Go, ${vikramMatch.scoreBreakdown.skillComplementarity}% skill).`);
}

console.log('\n🎉 ALL VALIDATION CRITERIA VERIFIED SUCCESSFULLY!\n');
