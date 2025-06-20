// app/api/test_db/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Test database connection endpoint
export async function GET() {
  try {
    // Test basic connection with a simple query
    const testResult = await query("SELECT 1 as test");
    
    // Get database info
    const dbInfoResult = await query("SELECT version(), current_database()");
    
    // Get table count
    const tableCountResult = await query(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    // Return success response with connection details
    return NextResponse.json({
      status: "success",
      message: "Database connection successful!",
      connectionTest: testResult.rows,
      databaseInfo: {
        current_database: dbInfoResult.rows[0].current_database,
        version: dbInfoResult.rows[0].version,
        table_count: tableCountResult.rows[0].table_count,
      },
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    // Handle connection or SQL errors
    return NextResponse.json({
      status: "error",
      message: "Database connection failed!",
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
