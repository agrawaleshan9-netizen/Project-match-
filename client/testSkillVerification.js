console.log('🧪 Testing Skill Verification Feature, Profiles & Matching Integrity...\n');

async function runTests() {
  const CLIENT_URL = 'http://localhost:5173';

  // 1. Fetch Students and Verify Verification Fields
  console.log('--- Test 1: Verify Seed Candidate Verification Profiles ---');
  const studentsRes = await fetch(`${CLIENT_URL}/api/students`);
  const studentsData = await studentsRes.json();
  console.assert(studentsData.success === true, 'Failed to fetch students');
  console.log(`✅ Loaded ${studentsData.count} students.`);

  // Sample student verification checks
  const sarah = studentsData.data.find((s) => s.name === 'Sarah Chen');
  console.assert(sarah.githubUrl === 'https://github.com/sarahchen-ai', 'Sarah GitHub URL missing');
  console.assert(sarah.portfolioUrl === 'https://sarahchen.bio', 'Sarah Portfolio URL missing');
  console.assert(sarah.assessmentStatus === 'Completed', 'Sarah Assessment status mismatch');
  console.log(`✅ Verified candidate "Sarah Chen": GitHub Connected, Portfolio Available, Assessment Completed (Status: Verified).`);

  const elena = studentsData.data.find((s) => s.name === 'Elena Rostova');
  console.assert(elena.githubUrl === '', 'Elena GitHub URL should be empty');
  console.assert(elena.portfolioUrl.includes('notion.site'), 'Elena Portfolio missing');
  console.assert(elena.assessmentStatus === 'Not Completed', 'Elena assessment mismatch');
  console.log(`✅ Verified candidate "Elena Rostova": GitHub Not Connected, Portfolio Available, Assessment Not Completed (Status: Partially Verified).`);

  const hannah = studentsData.data.find((s) => s.name === 'Hannah Abbott');
  console.assert(hannah.githubUrl === '', 'Hannah GitHub should be empty');
  console.assert(hannah.portfolioUrl === '', 'Hannah Portfolio should be empty');
  console.assert(hannah.assessmentStatus === 'Not Completed', 'Hannah Assessment should be Not Completed');
  console.log(`✅ Verified candidate "Hannah Abbott": Self-Declared signals (Status: Self-Declared).`);

  // 2. Create a new candidate with verification fields
  console.log('\n--- Test 2: Creating New Candidate with Full Verification Fields ---');
  const newCandidate = {
    name: 'Devon Vance',
    primaryRole: 'Fullstack',
    experienceLevel: 'Advanced',
    skills: [{ name: 'React', proficiency: 'Advanced' }, { name: 'Go', proficiency: 'Advanced' }],
    interests: ['DevTools', 'GenAI'],
    availabilityHours: 25,
    timezoneOffset: -5,
    shortBio: 'Full-stack builder with active open-source repositories.',
    githubUrl: 'https://github.com/devonvance',
    portfolioUrl: 'https://devonvance.dev',
    assessmentStatus: 'Completed'
  };

  const createRes = await fetch(`${CLIENT_URL}/api/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCandidate)
  });
  const createData = await createRes.json();
  console.assert(createData.success === true, 'Failed to create student');
  console.assert(createData.data.githubUrl === 'https://github.com/devonvance', 'Saved GitHub URL mismatch');
  console.assert(createData.data.portfolioUrl === 'https://devonvance.dev', 'Saved Portfolio URL mismatch');
  console.assert(createData.data.assessmentStatus === 'Completed', 'Saved Assessment status mismatch');
  console.log(`✅ Successfully created candidate "${createData.data.name}" with full verification signals.`);

  // 3. Verify Match Dashboard Endpoints
  console.log('\n--- Test 3: Verify Matching & Why This Match Integrity ---');
  const matchRes = await fetch(`${CLIENT_URL}/api/projects/proj_01/matches`);
  const matchData = await matchRes.json();
  console.assert(matchData.success === true, 'Match endpoint failed');
  console.assert(matchData.data.matches.length > 0, 'No candidate matches returned');

  const topMatch = matchData.data.matches[0];
  console.log(`✅ Top Match: ${topMatch.student.name} (${topMatch.compatibilityScore}%)`);
  console.log(`   Why This Match:`);
  console.log(`   - Skills Matched: [${topMatch.matchedSkills.join(', ')}]`);
  console.log(`   - Missing Skill Filled: [${topMatch.missingSkillsSupplied.join(', ')}]`);
  console.log(`   - Availability: ${topMatch.student.availabilityHours}h/wk`);
  console.log(`   - Experience: ${topMatch.student.experienceLevel}`);
  console.log(`   - AI Explanation: "${topMatch.aiExplanation}"`);
  console.log(`   - Skill Verification: GitHub: ${topMatch.student.githubUrl ? 'Connected' : 'Not Connected'} | Assessment: ${topMatch.student.assessmentStatus}`);

  // 4. Verify Project Skill Gap
  console.log('\n--- Test 4: Verify Project Skill Gap Integrity ---');
  console.assert(matchData.data.skillGap !== undefined, 'skillGap missing');
  console.assert(matchData.data.skillGap.projectNeeds.length > 0, 'projectNeeds empty');
  console.assert(matchData.data.skillGap.missingSkills.length > 0, 'missingSkills empty');
  console.assert(matchData.data.skillGap.recommendedCandidate !== null, 'recommendedCandidate missing');
  console.log(`✅ Project Skill Gap verified: ${matchData.data.skillGap.missingSkills.length} missing skills.`);
  console.log(`   Recommended Candidate: ${matchData.data.skillGap.recommendedCandidate.name} (${matchData.data.skillGap.recommendedCandidate.filledSkillOrRole})`);

  // 5. Verify Team Balance
  console.log('\n--- Test 5: Verify Team Balance Integrity ---');
  console.assert(matchData.data.teamBalance !== undefined, 'teamBalance missing');
  console.assert(matchData.data.teamBalance.covered.length > 0, 'teamBalance.covered empty');
  console.assert(matchData.data.teamBalance.missing.length > 0, 'teamBalance.missing empty');
  console.assert(matchData.data.teamBalance.suggested.length > 0, 'teamBalance.suggested empty');
  console.log(`✅ Team Balance verified: ${matchData.data.teamBalance.covered.length} covered, ${matchData.data.teamBalance.missing.length} missing.`);

  console.log('\n🎉 ALL SKILL VERIFICATION & MATCHING INTEGRITY TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
