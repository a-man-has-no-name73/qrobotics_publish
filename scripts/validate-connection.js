// scripts/validate-connection.js
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function validateConnection() {
  console.log('🔍 Validating Supabase connection...\n');

  // Check environment variables
  const requiredVars = [
    'DATABASE_URL',
    'DATABASE_PASSWORD', 
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  let missingVars = [];
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value || value.includes('[YOUR-') || value.includes('[YOUR_')) {
      missingVars.push(varName);
      console.log(`❌ ${varName}: Missing or placeholder`);
    } else {
      console.log(`✅ ${varName}: Set`);
    }
  });

  if (missingVars.length > 0) {
    console.log(`\n⚠️  Please update these variables in .env.local:`);
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    return;
  }

  console.log('\n🔌 Testing database connection...');

  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    // Test basic connection
    const result = await pool.query('SELECT 1 as test');
    console.log('✅ Database connection successful!');

    // Check if schema is set up
    const tableCheck = await pool.query(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('Products', 'Categories', 'Users', 'Admins')
    `);

    const tableCount = parseInt(tableCheck.rows[0].table_count);
    if (tableCount >= 4) {
      console.log(`✅ Database schema looks good! Found ${tableCount} main tables.`);
      console.log('\n🎉 Ready for deployment! Run: npm run dev');
    } else {
      console.log(`⚠️  Database schema incomplete. Found only ${tableCount} tables.`);
      console.log('Please run the schema from database/schema.sql in Supabase SQL Editor.');
    }

    await pool.end();

  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('\nCheck your DATABASE_URL and DATABASE_PASSWORD in .env.local');
  }
}

validateConnection();
