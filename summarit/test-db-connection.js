const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.dfmcfpxwccazbwilyaxh:W9jq-H%23NhqRGzYA@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres'
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    await client.connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database query successful:', result.rows[0]);
    
    await client.end();
    console.log('✅ Connection closed successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();
