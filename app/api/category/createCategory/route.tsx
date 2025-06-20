import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCategory, NewCategory } from "@/lib/sql/category_sql";

// Zod schema for validating category data
const categorySchema = z.object({
  name: z.string().min(1), // Category name is required
  description: z.string().optional(), // Optional description
  parentCategoryId: z.number().int().positive().optional().nullable(), // Optional, must be an integer
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the incoming data with Zod
    const categoryData: NewCategory = categorySchema.parse(body);

    // Call the SQL function to create a category
    const result = await createCategory(categoryData);
    return NextResponse.json(
      { message: "Category created", category: result },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
