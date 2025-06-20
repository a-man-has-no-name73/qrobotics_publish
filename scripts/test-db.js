// scripts/test-db.js
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('🔄 Testing PostgreSQL Database Connection...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`   DATABASE_HOST: ${process.env.DATABASE_HOST || 'NOT SET'}`);
  console.log(`   DATABASE_USER: ${process.env.DATABASE_USER || 'NOT SET'}`);
  console.log(`   DATABASE_NAME: ${process.env.DATABASE_NAME || 'NOT SET'}`);
  console.log(`   DATABASE_PORT: ${process.env.DATABASE_PORT || 'NOT SET'}`);
  console.log(`   DATABASE_PASSWORD: ${process.env.DATABASE_PASSWORD ? '***SET***' : 'NOT SET'}\n`);
  
  try {
    // Create connection pool
    const pool = new Pool({
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      user: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'qrobotics',
    });
    
    console.log('✅ Successfully connected to PostgreSQL database!');
    
    // Test basic query
    const testResult = await pool.query('SELECT 1 as test');
    console.log('✅ Basic query test passed');
    
    // Get database info
    const dbInfoResult = await pool.query('SELECT version()');
    console.log('📊 Database Info:');
    console.log(`   Current Database: ${process.env.DATABASE_NAME}`);
    console.log(`   PostgreSQL Version: ${dbInfoResult.rows[0].version.split(' ')[0]} ${dbInfoResult.rows[0].version.split(' ')[1]}`);
    
    // Test if database exists and has tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`\n📋 Tables in database (${tablesResult.rows.length} found):`);
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach((table, index) => {
        console.log(`   ${index + 1}. ${table.table_name}`);
      });
    } else {
      console.log('   No tables found in database');
    }
    
    // Close connection
    await pool.end();
    console.log('\n🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || 'Unknown'}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   • Make sure PostgreSQL server is running');
      console.error('   • Check if the host and port are correct (default: localhost:5432)');
      console.error('   • Verify firewall settings');
    } else if (error.code === '28P01') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   • Check username and password');
      console.error('   • Verify user has proper permissions');
    } else if (error.code === '3D000') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   • Check if the database name is correct');
      console.error('   • Make sure the database exists');
      console.error('   • Try connecting to "postgres" database first');
    }
    
    process.exit(1);
  }
}

testConnection();
