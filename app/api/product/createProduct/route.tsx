import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createProduct, NewProduct } from "@/lib/sql/product_sql"; // Import the SQL function

// Define a schema for validating incoming Newproduct data
const productSchema = z.object({
  category_id: z.number().int().positive(), // category ID must be a positive integer
  name: z.string().min(1), // Product name is required
  description: z.string().optional(), // Optional product description
  price: z.number().positive(), // Product price must be a positive number
  is_available: z.boolean(), // Availability flag (true or false)
  admin_id: z.number().int().positive(), // Admin ID who creates the product
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data using Zod
    const validatedData = productSchema.parse(body);

    // Convert to the format expected by the SQL function
    const productData: NewProduct = {
      categoryId: validatedData.category_id,
      name: validatedData.name,
      description: validatedData.description,
      price: validatedData.price,
      isAvailable: validatedData.is_available,
      createdBy: validatedData.admin_id,
    };

    // Call the SQL function to create a product
    const result = await createProduct(productData);

    return NextResponse.json(
      { message: "Product created", product: result },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
