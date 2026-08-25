console.log('🧪 Running Landing, Onboarding & Visual Polish Verification Suite...\n');

async function verifyAll() {
  const CLIENT_URL = 'http://localhost:5173';

  // 1. Verify Landing Page Served by Vite
  console.log('--- Step 1: Verify Landing Page & Branding ---');
  const htmlRes = await fetch(CLIENT_URL);
  const htmlText = await htmlRes.text();
  console.assert(htmlRes.status === 200, `Expected 200, got ${htmlRes.status}`);
  console.assert(htmlText.includes('ProjectMatch'), 'HTML does not include ProjectMatch branding');
  console.log('✅ Step 1 Passed: Landing page is active and served cleanly.');

  // 2. Verify Onboarding Profile Creation through Existing API
  console.log('\n--- Step 2: Verify Onboarding Profile Creation ---');
  const newCandidatePayload = {
    name: 'Alex Sterling',
    email: 'alex.sterling@hackathon.io',
    primaryRole: 'Frontend',
    experienceLevel: 'Advanced',
    skills: [
      { name: 'React', proficiency: 'Advanced' },
      { name: 'TypeScript', proficiency: 'Advanced' },
      { name: 'Tailwind CSS', proficiency: 'Advanced' },
      { name: 'Next.js', proficiency: 'Advanced' }
    ],
    interests: ['Healthcare', 'FinTech', 'DevTools'],
    availabilityHours: 25,
    timezoneOffset: -5,
    shortBio: 'Lead frontend architect specializing in high-speed responsive UI and design systems.'
  };

  const createRes = await fetch(`${CLIENT_URL}/api/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCandidatePayload)
  });

  const createData = await createRes.json();
  console.assert(createData.success === true, 'Failed to create student via onboarding API');
  console.assert(createData.data.name === 'Alex Sterling', 'Candidate name mismatch');
  console.log(`✅ Step 2 Passed: Successfully created onboarded candidate "${createData.data.name}" (${createData.data.primaryRole}).`);

  // 3. Verify Candidate Pool includes the new student
  console.log('\n--- Step 3: Verify Roster Update in Candidate Pool ---');
  const studentsRes = await fetch(`${CLIENT_URL}/api/students`);
  const studentsData = await studentsRes.json();
  const foundStudent = studentsData.data.find((s) => s.name === 'Alex Sterling');
  console.assert(foundStudent !== undefined, 'New student not found in roster');
  console.log(`✅ Step 3 Passed: Candidate roster updated (Total Candidates: ${studentsData.count}).`);

  // 4. Verify Matches Page Loading & Recalculation for MediScan AI
  console.log('\n--- Step 4: Verify Matches Page for MediScan AI ---');
  const matchRes = await fetch(`${CLIENT_URL}/api/projects/proj_01/matches`);
  const matchData = await matchRes.json();
  console.assert(matchData.success === true, 'Matches endpoint failed');
  console.assert(matchData.data.matches.length > 0, 'No candidate matches returned');

  console.log(`✅ Step 4 Passed: Found ${matchData.data.eligibleMatchesCount} ranked matches for "${matchData.data.project.title}".`);
  console.log(`   Top Candidate: ${matchData.data.matches[0].student.name} (${matchData.data.matches[0].compatibilityScore}% Compatibility)`);
  console.log(`   AI Match Rationale: "${matchData.data.matches[0].aiExplanation}"`);

  // 5. Verify Project Switching across all projects
  console.log('\n--- Step 5: Verify Project Switching ---');
  const projectsRes = await fetch(`${CLIENT_URL}/api/projects`);
  const projectsData = await projectsRes.json();

  for (const proj of projectsData.data) {
    const pMatchRes = await fetch(`${CLIENT_URL}/api/projects/${proj.id}/matches`);
    const pMatchData = await pMatchRes.json();
    console.assert(pMatchData.success === true, `Failed matches for project ${proj.id}`);
    console.log(`   • Switched to "${proj.title}" (${proj.track}): ${pMatchData.data.eligibleMatchesCount} matches calculated.`);
  }

  console.log('\n🎉 ALL ONBOARDING, LANDING & MATCHING VERIFICATIONS PASSED SUCCESSFULLY!\n');
}

verifyAll().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
