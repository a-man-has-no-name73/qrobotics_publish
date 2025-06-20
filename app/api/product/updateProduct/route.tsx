import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateProduct } from "@/lib/sql/product_sql"; // Import the SQL function

// Zod schema for validating the incoming product data
const productUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  isAvailable: z.boolean().optional(),
  categoryId: z.number().int().positive().optional(),
});

export async function PUT(request: NextRequest) {
  // Extract the productId from the URL parameters
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId || isNaN(Number(productId))) {
    return NextResponse.json(
      { error: "Invalid or missing productId" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    // Validate incoming data using Zod
    const productData = productUpdateSchema.parse(body);

    // Call the SQL function to update the product
    const updatedProduct = await updateProduct(Number(productId), productData);

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found or no changes made" },
        { status: 404 }
      );
    }

    // Return the updated product
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
