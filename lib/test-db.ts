// lib/test-db.ts
import { query } from "./db";

/**
 * Test database connection and return connection status
 */
export async function testDatabaseConnection() {
  try {
    console.log("🔄 Testing database connection...");
    
    // Test basic connection
    const testResult = await query("SELECT 1 as test");
    
    // Get database info
    const dbInfoResult = await query("SELECT version(), current_database()");
    
    console.log("✅ Database connection successful!");
    console.log("📊 Database Info:", dbInfoResult.rows[0]);
    
    return {
      success: true,
      message: "Database connection successful",
      data: { testResult: testResult.rows, dbInfo: dbInfoResult.rows }
    };
    
  } catch (error) {
    console.error("❌ Database connection failed:", (error as Error).message);
    
    return {
      success: false,
      message: "Database connection failed",
      error: (error as Error).message
    };
  }
}

/**
 * Check if all required environment variables are set
 */
export function checkDatabaseConfig() {
  const requiredEnvVars = ['DATABASE_HOST', 'DATABASE_USER', 'DATABASE_PASSWORD', 'DATABASE_NAME'];
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.warn("⚠️  Missing environment variables:", missing);
    return {
      valid: false,
      missing,
      message: `Missing required environment variables: ${missing.join(', ')}`
    };
  }
  
  console.log("✅ All database environment variables are set");
  return {
    valid: true,
    message: "All required environment variables are present"
  };
}
