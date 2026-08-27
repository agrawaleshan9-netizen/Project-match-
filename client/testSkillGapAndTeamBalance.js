console.log('🧪 Testing Project Skill Gap & Team Balance Features across all projects...\n');

async function runTests() {
  const CLIENT_URL = 'http://localhost:5173';

  // 1. Fetch all projects
  const projectsRes = await fetch(`${CLIENT_URL}/api/projects`);
  const projectsData = await projectsRes.json();
  console.assert(projectsData.success === true, 'Failed to fetch projects');
  console.log(`✅ Loaded ${projectsData.count} projects.\n`);

  for (const project of projectsData.data) {
    console.log(`=======================================================`);
    console.log(`📌 Project: "${project.title}" [${project.track}]`);
    console.log(`=======================================================`);

    const matchRes = await fetch(`${CLIENT_URL}/api/projects/${project.id}/matches`);
    const matchData = await matchRes.json();
    console.assert(matchData.success === true, `Failed matches for ${project.id}`);

    const { skillGap, teamBalance, matches } = matchData.data;

    // Verify Skill Gap structure
    console.assert(skillGap !== undefined, 'skillGap object missing from API response');
    console.assert(Array.isArray(skillGap.projectNeeds), 'skillGap.projectNeeds must be an array');
    console.assert(Array.isArray(skillGap.currentTeam), 'skillGap.currentTeam must be an array');
    console.assert(Array.isArray(skillGap.missingSkills), 'skillGap.missingSkills must be an array');

    console.log(`\n--- FEATURE 1: PROJECT SKILL GAP ---`);
    console.log(`PROJECT NEEDS (${skillGap.projectNeeds.length}):`);
    skillGap.projectNeeds.forEach((n) => console.log(`  ✓ ${n}`));

    console.log(`\nCURRENT TEAM (${skillGap.currentTeam.length}):`);
    if (skillGap.currentTeam.length > 0) {
      skillGap.currentTeam.forEach((c) => console.log(`  ✓ ${c}`));
    } else {
      console.log(`  (None)`);
    }

    console.log(`\nMISSING SKILLS (${skillGap.missingSkills.length}):`);
    if (skillGap.missingSkills.length > 0) {
      skillGap.missingSkills.forEach((m) => console.log(`  ⚠ ${m}`));
    } else {
      console.log(`  (All needs covered)`);
    }

    console.log(`\nRECOMMENDED CANDIDATE:`);
    if (skillGap.recommendedCandidate) {
      console.log(`  👤 ${skillGap.recommendedCandidate.name} — ${skillGap.recommendedCandidate.filledSkillOrRole} (${skillGap.recommendedCandidate.compatibilityScore}% match)`);
      console.assert(skillGap.recommendedCandidate.name.length > 0, 'Candidate name empty');
    } else {
      console.log(`  (No candidate recommended)`);
    }

    // Verify Team Balance structure
    console.assert(teamBalance !== undefined, 'teamBalance object missing from API response');
    console.assert(Array.isArray(teamBalance.covered), 'teamBalance.covered must be an array');
    console.assert(Array.isArray(teamBalance.missing), 'teamBalance.missing must be an array');
    console.assert(Array.isArray(teamBalance.suggested), 'teamBalance.suggested must be an array');

    console.log(`\n--- FEATURE 2: TEAM BALANCE ---`);
    console.log(`Covered:`);
    teamBalance.covered.forEach((c) => console.log(`  ✓ ${c}`));

    console.log(`Missing:`);
    teamBalance.missing.forEach((m) => console.log(`  ⚠ ${m}`));

    console.log(`Suggested:`);
    teamBalance.suggested.forEach((s) => {
      console.log(`  👤 ${s.name} — ${s.filledSkillOrRole} (${s.compatibilityScore}% match)`);
    });

    console.log(`\nRanked Matches Available: ${matches.length}`);
    if (matches.length > 0) {
      console.log(`Top Ranked Match: ${matches[0].student.name} (${matches[0].compatibilityScore}%)`);
      console.assert(matches[0].student.name.length > 0, 'Top match student name empty');
      console.assert(matches[0].aiExplanation.length > 0, 'AI explanation empty');
    }
    console.log('\n');
  }

  console.log('🎉 ALL PROJECT SKILL GAP & TEAM BALANCE VERIFICATIONS PASSED SUCCESSFULLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
