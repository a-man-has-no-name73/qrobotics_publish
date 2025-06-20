// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db"; // Import the PostgreSQL query function

// Zod schema for product creation
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  category_id: z.number().positive("Category ID is required"),
  stock_quantity: z
    .number()
    .min(0, "Stock quantity cannot be negative")
    .default(0),
  is_available: z.boolean().default(true),
});

export type NewProduct = z.infer<typeof productSchema>;

// SQL function to get all products with category and inventory info
async function getAllProducts() {
  try {
    const result = await query(`
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price,
        p.category_id,
        c.name as category_name,
        p.is_available,
        COALESCE(pi.quantity, 0) as stock_quantity,
        p.created_at,
        p.updated_at      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.category_id
      LEFT JOIN ProductInventory pi ON p.product_id = pi.product_id
      WHERE p.deleted_at IS NULL
      ORDER BY p.created_at DESC
    `);

    // Ensure price is converted to number for each product
    return result.rows.map((row: any) => ({
      ...row,
      price: Number(row.price),
    }));
  } catch (error) {
    throw error;
  }
}

// SQL function to create product with inventory
async function createProduct(productData: NewProduct) {
  try {
    // Insert product (assuming admin_id = 1 for now)
    const productResult = await query(
      `INSERT INTO Products (category_id, name, description, price, is_available, created_by, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING product_id`,
      [
        productData.category_id,
        productData.name,
        productData.description || null,
        productData.price,
        productData.is_available,
        1, // Replace with actual admin_id from session
      ]
    );

    const productId = productResult.rows[0].product_id;

    // Insert inventory record
    await query(
      `INSERT INTO ProductInventory (product_id, quantity, updated_by, last_updated) 
       VALUES ($1, $2, $3, NOW())`,
      [productId, productData.stock_quantity, 1] // Replace with actual admin_id
    );

    return { insertId: productId };
  } catch (error) {
    throw error;
  }
}

// GET - Fetch all products
export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the incoming request body with Zod
    const productData: NewProduct = productSchema.parse(body);

    // Call the SQL function to create the product
    const result = await createProduct(productData);

    // Return success response with product ID
    return NextResponse.json(
      { message: "Product created successfully", id: result.insertId },
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
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
