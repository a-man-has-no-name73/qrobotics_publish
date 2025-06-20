// app/api/category/getCategory/route.ts
import { NextResponse } from "next/server";
import { getCategoryNames } from "@/lib/sql/category_sql";  // Correct import path

export async function GET() {
  try {
    const categories = await getCategoryNames(); // Fetch category names

    // Ensure categories are found
    if (categories.length === 0) {
      return NextResponse.json({ error: "No categories found" }, { status: 404 });
    }

    // Return category names as a JSON response
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
