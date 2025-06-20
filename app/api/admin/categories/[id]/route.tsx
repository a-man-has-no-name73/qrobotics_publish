// app/api/admin/categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db"; // Import the PostgreSQL connection

// Zod schema for category ID validation
const categoryIdSchema = z.string().transform((val) => {
  const num = parseInt(val, 10);
  if (isNaN(num)) throw new Error("Invalid category ID");
  return num;
});

// SQL function to check if category has products
async function checkCategoryHasProducts(categoryId: number) {
  const result = await query(
    "SELECT COUNT(*) as count FROM Products WHERE category_id = $1 AND deleted_at IS NULL",
    [categoryId]
  );
  return result.rows[0].count > 0;
}

// SQL function to check if category has subcategories
async function checkCategoryHasSubcategories(categoryId: number) {
  const result = await query(
    "SELECT COUNT(*) as count FROM Categories WHERE parent_category_id = $1 AND deleted_at IS NULL",
    [categoryId]
  );
  return result.rows[0].count > 0;
}

// SQL function to soft delete category
async function deleteCategoryById(categoryId: number) {
  const result = await query(
    "UPDATE Categories SET deleted_at = NOW() WHERE category_id = $1",
    [categoryId]
  );
  return result;
}

// DELETE - Soft delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate category ID
    const categoryId = categoryIdSchema.parse(params.id);

    // Check if category has products
    const hasProducts = await checkCategoryHasProducts(categoryId);
    if (hasProducts) {
      return NextResponse.json(
        { error: "Cannot delete category that has products assigned to it" },
        { status: 400 }
      );
    }

    // Check if category has subcategories
    const hasSubcategories = await checkCategoryHasSubcategories(categoryId);
    if (hasSubcategories) {
      return NextResponse.json(
        { error: "Cannot delete category that has subcategories" },
        { status: 400 }
      );
    }

    // Delete the category
    await deleteCategoryById(categoryId);

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    // Handle errors like validation failures or SQL issues
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
