import { NextRequest, NextResponse } from "next/server";
import { getProductById, Product } from "@/lib/sql/product_sql"; // Import the function and interface

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId || isNaN(Number(productId))) {
    return NextResponse.json({ error: "Invalid or missing productId" }, { status: 400 });
  }

  try {
    const product: Product | null = await getProductById(Number(productId));

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product); // Return the product details, which now conform to the Product interface
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
