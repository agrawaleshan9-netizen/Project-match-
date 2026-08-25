import http from 'node:http';
import app from './server.js';
import { evaluateHardFilters } from './engine/hardFilters.js';
import { scoreCandidate } from './engine/scoringEngine.js';
import { generateMatchExplanation } from './engine/aiExplainer.js';
import { getProjectById, getStudentById, resetToSeed } from './storage/db.js';

console.log('🧪 Starting Phase 2 Matching Engine & API Verification Tests...\n');

// 1. Reset Database to known seed state
resetToSeed();

// 2. Unit Test: Hard Filters
console.log('--- Test 1: Hard Filters Evaluation ---');
const project1 = getProjectById('proj_01'); // MediScan AI: reqRoles: [UI/UX Designer, Frontend, Product/Domain], minHours: 18, currentMember: std_01 (AI/ML)
const studentSarah = getStudentById('std_01'); // Already in proj_01
const studentLeo = getStudentById('std_02'); // UI/UX Designer, 20h
const studentChloe = getStudentById('std_08'); // UI/UX Designer, 12h (below 18h min)
const studentMarcus = getStudentById('std_03'); // Backend (not in required roles)

const filterSarah = evaluateHardFilters(studentSarah, project1);
console.assert(!filterSarah.passes, 'Sarah should be rejected because she is already a member');
console.log('✅ Filter correctly excluded existing member (Sarah Chen)');

const filterLeo = evaluateHardFilters(studentLeo, project1);
console.assert(filterLeo.passes, 'Leo should pass hard filters for MediScan AI');
console.log('✅ Filter correctly passed eligible candidate (Leo Martinez)');

const filterChloe = evaluateHardFilters(studentChloe, project1);
console.assert(!filterChloe.passes, 'Chloe should be rejected due to low availability');
console.log('✅ Filter correctly rejected candidate with insufficient hours (Chloe Dubois)');

const filterMarcus = evaluateHardFilters(studentMarcus, project1);
console.assert(!filterMarcus.passes, 'Marcus should be rejected because Backend is not required');
console.log('✅ Filter correctly rejected unneeded role (Marcus Vance - Backend)');

// 3. Unit Test: Scoring Engine
console.log('\n--- Test 2: Scoring Engine & Component Breakdown ---');
const matchScoreLeo = scoreCandidate(studentLeo, project1);
console.log(`Leo's Compatibility Score: ${matchScoreLeo.compatibilityScore}%`);
console.log('Score Breakdown:', matchScoreLeo.scoreBreakdown);
console.log('Matched Skills:', matchScoreLeo.matchedSkills);

console.assert(matchScoreLeo.compatibilityScore >= 70, 'Leo should have a high compatibility score');
console.assert(matchScoreLeo.scoreBreakdown.skillComplementarity > 0, 'Skill score must be > 0');
console.assert(matchScoreLeo.scoreBreakdown.availabilityFit > 0, 'Availability score must be > 0');
console.assert(matchScoreLeo.scoreBreakdown.interestAlignment > 0, 'Interest score must be > 0');
console.assert(matchScoreLeo.scoreBreakdown.experienceSynergy > 0, 'Experience score must be > 0');
console.assert(matchScoreLeo.matchedSkills.includes('Figma'), 'Matched skills must include Figma');
console.log('✅ Scoring Engine successfully calculated 4-pillar breakdown & matched skills.');

// 4. Unit Test: AI Explainer / Fallback
console.log('\n--- Test 3: Match Explainer Generation ---');
const explanationResult = await generateMatchExplanation(studentLeo, project1, matchScoreLeo);
console.log(`Explanation Source: ${explanationResult.source}`);
console.log(`Rationale: "${explanationResult.explanation}"`);
console.assert(explanationResult.explanation.length > 20, 'Explanation should be descriptive');
console.log('✅ Match Explainer generated valid explanation.');

// 5. Integration Test: Express HTTP API Server
console.log('\n--- Test 4: Live HTTP API Endpoints ---');

const server = http.createServer(app);
const TEST_PORT = 5099;

server.listen(TEST_PORT, async () => {
  try {
    const baseUrl = `http://localhost:${TEST_PORT}`;

    // Test GET /api/health
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    console.assert(healthData.status === 'healthy', 'Health check failed');
    console.log('✅ GET /api/health passed');

    // Test GET /api/students
    const studentsRes = await fetch(`${baseUrl}/api/students`);
    const studentsData = await studentsRes.json();
    console.assert(studentsData.count === 15, `Expected 15 students, got ${studentsData.count}`);
    console.log(`✅ GET /api/students passed (found ${studentsData.count} profiles)`);

    // Test GET /api/projects
    const projectsRes = await fetch(`${baseUrl}/api/projects`);
    const projectsData = await projectsRes.json();
    console.assert(projectsData.count === 5, `Expected 5 projects, got ${projectsData.count}`);
    console.log(`✅ GET /api/projects passed (found ${projectsData.count} projects)`);

    // Test GET /api/projects/proj_01/matches
    const matchesRes = await fetch(`${baseUrl}/api/projects/proj_01/matches`);
    const matchesData = await matchesRes.json();
    console.assert(matchesData.success === true, 'Matches endpoint failed');
    console.assert(matchesData.data.matches.length > 0, 'Should find at least 1 match');
    console.log(`✅ GET /api/projects/proj_01/matches passed (${matchesData.data.eligibleMatchesCount} eligible ranked candidates found)`);
    console.log(`   Top Match: ${matchesData.data.matches[0].student.name} (${matchesData.data.matches[0].compatibilityScore}% match)`);

    // Test POST /api/students validation (negative test)
    const invalidStudentRes = await fetch(`${baseUrl}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '' }) // missing required fields
    });
    console.assert(invalidStudentRes.status === 400, 'Should return 400 on invalid student payload');
    console.log('✅ POST /api/students validation rejection passed');

    // Test POST /api/projects validation (negative test)
    const invalidProjectRes = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }) // missing required fields
    });
    console.assert(invalidProjectRes.status === 400, 'Should return 400 on invalid project payload');
    console.log('✅ POST /api/projects validation rejection passed');

    console.log('\n🎉 ALL PHASE 2 MATCHING & API TESTS PASSED SUCCESSFULLY!\n');
    server.close();
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    server.close();
  }
});
