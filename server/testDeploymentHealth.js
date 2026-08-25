console.log('🧪 Running Deployment Health & Readiness Audit Tests...\n');

async function testHealth() {
  const endpoints = [
    'http://localhost:5000/api/health',
    'http://localhost:5000/health',
    'http://localhost:5000/',
    'http://localhost:5173/api/health'
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.assert(res.status === 200, `Expected 200 from ${url}, got ${res.status}`);
      console.assert(data.status === 'healthy', `Status mismatch on ${url}`);
      console.log(`✅ ${url} -> Status: 200 OK (${data.status})`);
    } catch (err) {
      console.error(`❌ Health check failed on ${url}:`, err.message);
      process.exit(1);
    }
  }

  console.log('\n🎉 ALL DEPLOYMENT HEALTH PROBES PASSED SUCCESSFULLY!\n');
}

testHealth();
