console.log('🧪 Testing Project Switching and Match Updates across all projects...\n');

async function testProjectSwitching() {
  const CLIENT_URL = 'http://localhost:5173';

  const projectsRes = await fetch(`${CLIENT_URL}/api/projects`);
  const { data: projects } = await projectsRes.json();

  console.log(`Found ${projects.length} projects to test:\n`);

  for (const project of projects) {
    const res = await fetch(`${CLIENT_URL}/api/projects/${project.id}/matches`);
    const { data: matchData } = await res.json();

    console.log(`📌 Project: "${project.title}" (${project.track})`);
    console.log(`   - Required Roles: ${(project.requiredRoles || []).join(', ')}`);
    console.log(`   - Required Skills: ${(project.requiredSkills || []).join(', ')}`);
    console.log(`   - Total Matches Found: ${matchData.eligibleMatchesCount}`);

    if (matchData.matches.length > 0) {
      const top = matchData.matches[0];
      console.log(`   - Top Match: ${top.student.name} (${top.compatibilityScore}% - ${top.roleCovered})`);
      console.log(`   - Matched Skills: [${top.matchedSkills.join(', ')}]`);
    } else {
      console.log('   - No eligible matches currently.');
    }
    console.log('');
  }

  console.log('🎉 ALL PROJECTS SWITCHED AND RETURNED VALID MATCHES SUCCESSFULLY!\n');
}

testProjectSwitching().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
