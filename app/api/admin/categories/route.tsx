// app/api/admin/categories/route.ts
import { query } from "@/lib/db"; // Import the PostgreSQL query function
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for category creation
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  parent_category_id: z.number().optional().nullable(),
});

export type NewCategory = z.infer<typeof categorySchema>;

// SQL function to create category
async function createCategory(categoryData: NewCategory) {
  try {
    const result = await query(
      `INSERT INTO Categories (name, description, parent_category_id, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING category_id`,
      [
        categoryData.name,
        categoryData.description || null,
        categoryData.parent_category_id || null,
      ]
    );
    return {
      insertId: result.rows[0].category_id,
      affectedRows: result.rowCount,
    };
  } catch (error) {
    throw error;
  }
}

// SQL function to get all categories
async function getAllCategories() {
  try {
    const result = await query(`
      SELECT c1.category_id, c1.name, c1.description, c1.parent_category_id,
             c2.name as parent_name      FROM Categories c1
      LEFT JOIN Categories c2 ON c1.parent_category_id = c2.category_id
      WHERE c1.deleted_at IS NULL
      ORDER BY c1.name
    `);
    console.log("Fetched categories:", result.rows);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

// GET - Fetch all categories
export async function GET() {
  try {
    const categories = await getAllCategories();
    console.log("Fetched categories:", categories);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the incoming request body with Zod
    const categoryData: NewCategory = categorySchema.parse(body); // Call the SQL function to create the category
    const result = await createCategory(categoryData);

    // Return success response with category ID
    return NextResponse.json(
      {
        message: "Category created successfully",
        id: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle errors like validation failures or SQL issues
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
