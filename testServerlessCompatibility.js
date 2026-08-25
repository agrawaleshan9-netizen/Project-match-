import http from 'node:http';

console.log('🧪 Testing Vercel Serverless Function & Express API Compatibility...\n');

async function testServerless() {
  // 1. Simulate Vercel Serverless Environment
  process.env.VERCEL = '1';
  process.env.NODE_ENV = 'production';

  const { default: app } = await import('./api/index.js');
  console.assert(typeof app === 'function', 'api/index.js must export an Express application function');
  console.log('✅ api/index.js successfully loaded and exported Express app.');

  // Create temporary HTTP server wrapping the serverless app handler
  const server = http.createServer(app);
  const TEST_PORT = 5098;

  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  const baseUrl = `http://localhost:${TEST_PORT}`;

  try {
    // 2. Test /api/health
    console.log('\n--- Test 1: GET /api/health ---');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    console.assert(healthRes.status === 200, `Expected 200, got ${healthRes.status}`);
    console.assert(healthData.status === 'healthy', 'Health check status mismatch');
    console.log('✅ /api/health passed with status: healthy');

    // 3. Test /api/projects
    console.log('\n--- Test 2: GET /api/projects ---');
    const projectsRes = await fetch(`${baseUrl}/api/projects`);
    const projectsData = await projectsRes.json();
    console.assert(projectsData.success === true, 'Projects fetch failed');
    console.assert(projectsData.count === 5, `Expected 5 projects, got ${projectsData.count}`);
    console.log(`✅ /api/projects passed (loaded ${projectsData.count} projects)`);

    // 4. Test /api/projects/proj_01/matches
    console.log('\n--- Test 3: GET /api/projects/proj_01/matches ---');
    const matchesRes = await fetch(`${baseUrl}/api/projects/proj_01/matches`);
    const matchesData = await matchesRes.json();
    console.assert(matchesData.success === true, 'Matches endpoint failed');
    console.assert(matchesData.data.matches.length > 0, 'No matches returned');
    console.log(`✅ /api/projects/proj_01/matches passed (${matchesData.data.eligibleMatchesCount} ranked candidates found)`);
    console.log(`   Top Candidate: ${matchesData.data.matches[0].student.name} (${matchesData.data.matches[0].compatibilityScore}% match)`);

    // 5. Test /api/students
    console.log('\n--- Test 4: GET /api/students ---');
    const studentsRes = await fetch(`${baseUrl}/api/students`);
    const studentsData = await studentsRes.json();
    console.assert(studentsData.success === true, 'Students fetch failed');
    console.assert(studentsData.count === 15, `Expected 15 students, got ${studentsData.count}`);
    console.log(`✅ /api/students passed (loaded ${studentsData.count} students)`);

    console.log('\n🎉 ALL VERCEL SERVERLESS FUNCTION COMPATIBILITY TESTS PASSED!\n');
  } finally {
    server.close();
  }
}

testServerless().catch((err) => {
  console.error('❌ Serverless test failed:', err);
  process.exit(1);
});
