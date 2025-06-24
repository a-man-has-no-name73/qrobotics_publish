// scripts/setup-database.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🚀 Setting up Qrobotics database schema...');
  
  // Create connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 
      `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
    ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL 
      ? { rejectUnauthorized: false } 
      : false,
  });

  try {
    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Reading schema file...');
    
    // Execute schema
    console.log('⚡ Executing schema...');
    await pool.query(schema);
    
    console.log('✅ Database schema setup completed successfully!');
    
    // Test the setup
    console.log('🧪 Testing database connection...');
    const result = await pool.query('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = \'public\'');
    console.log(`📊 Created ${result.rows[0].table_count} tables`);
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
