import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, Product } from "@/lib/sql/product_sql"; // Importing the SQL function and interface

export async function GET() {
  try {
    const products: Product[] = await getAllProducts(); // Fetch all products with a limit of 20

    // Check if products are found
    if (products.length === 0) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }

    // Return the list of products
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
