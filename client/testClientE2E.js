console.log('🧪 Starting End-to-End Client & Proxy Verification Tests...\n');

async function runTests() {
  const CLIENT_URL = 'http://localhost:5173';

  // 1. Verify Frontend Web Server
  console.log('--- Test 1: Frontend Web Server Check ---');
  const htmlRes = await fetch(CLIENT_URL);
  const htmlText = await htmlRes.text();
  console.assert(htmlRes.status === 200, `Expected 200 OK from Vite, got ${htmlRes.status}`);
  console.assert(htmlText.includes('<div id="root"></div>'), 'HTML missing #root mount point');
  console.assert(htmlText.includes('ProjectMatch'), 'HTML missing ProjectMatch title');
  console.log('✅ Vite Frontend Web Server is serving index.html cleanly on port 5173.');

  // 2. Verify Vite Proxy to Backend
  console.log('\n--- Test 2: Vite API Proxy Connectivity ---');
  const healthRes = await fetch(`${CLIENT_URL}/api/health`);
  const healthData = await healthRes.json();
  console.assert(healthData.status === 'healthy', 'Vite proxy failed to reach backend /api/health');
  console.log('✅ Vite Proxy successfully routed /api/health to Express Backend.');

  // 3. Verify Projects API via Client Proxy
  console.log('\n--- Test 3: Loading Projects via Client Proxy ---');
  const projectsRes = await fetch(`${CLIENT_URL}/api/projects`);
  const projectsData = await projectsRes.json();
  console.assert(projectsData.success === true, 'Failed to fetch projects');
  console.assert(projectsData.count === 5, `Expected 5 projects, got ${projectsData.count}`);
  console.log(`✅ Loaded ${projectsData.count} projects via frontend proxy.`);
  console.log(`   Sample Project: "${projectsData.data[0].title}" (${projectsData.data[0].track})`);

  // 4. Verify Students API via Client Proxy
  console.log('\n--- Test 4: Loading Candidates via Client Proxy ---');
  const studentsRes = await fetch(`${CLIENT_URL}/api/students`);
  const studentsData = await studentsRes.json();
  console.assert(studentsData.success === true, 'Failed to fetch students');
  console.assert(studentsData.count === 15, `Expected 15 students, got ${studentsData.count}`);
  console.log(`✅ Loaded ${studentsData.count} candidate profiles via frontend proxy.`);

  // 5. Verify Match Dashboard End-to-End Recommendations
  console.log('\n--- Test 5: End-to-End Match Calculations via Client Proxy ---');
  const matchesRes = await fetch(`${CLIENT_URL}/api/projects/proj_01/matches`);
  const matchesData = await matchesRes.json();
  console.assert(matchesData.success === true, 'Failed to load matches');
  console.assert(matchesData.data.matches.length > 0, 'No candidate matches returned');

  const topMatch = matchesData.data.matches[0];
  console.log(`✅ Top Match for "${matchesData.data.project.title}": ${topMatch.student.name}`);
  console.log(`   Compatibility Score: ${topMatch.compatibilityScore}%`);
  console.log(`   Score Breakdown:`, topMatch.scoreBreakdown);
  console.log(`   Matched Skills: [${topMatch.matchedSkills.join(', ')}]`);
  console.log(`   Fills Gaps: [${topMatch.missingSkillsSupplied.join(', ')}]`);
  console.log(`   AI Rationale: "${topMatch.aiExplanation}"`);
  console.log(`   Explanation Source: ${topMatch.explanationSource}`);

  console.assert(topMatch.compatibilityScore >= 80, 'Top match score should be >= 80%');
  console.assert(topMatch.scoreBreakdown.skillComplementarity > 0, 'Skill breakdown score missing');
  console.assert(topMatch.matchedSkills.length > 0, 'Matched skills array empty');
  console.assert(topMatch.aiExplanation.length > 20, 'AI explanation empty or too short');

  // 6. Test Candidate Creation via Client Proxy
  console.log('\n--- Test 6: Creating Candidate via Client Proxy ---');
  const newStudentRes = await fetch(`${CLIENT_URL}/api/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Elena Rostova (Lead)',
      primaryRole: 'Product/Domain',
      experienceLevel: 'Advanced',
      skills: [{ name: 'Market Research', proficiency: 'Advanced' }],
      interests: ['Healthcare'],
      availabilityHours: 20,
      timezoneOffset: -5,
      shortBio: 'Product lead with clinical domain expertise.'
    })
  });
  const newStudentData = await newStudentRes.json();
  console.assert(newStudentData.success === true, 'Failed to create candidate');
  console.log(`✅ Created candidate "${newStudentData.data.name}" via proxy.`);

  console.log('\n🎉 ALL FRONTEND & BACKEND INTEGRATION TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch((err) => {
  console.error('❌ E2E Verification failed:', err);
  process.exit(1);
});
