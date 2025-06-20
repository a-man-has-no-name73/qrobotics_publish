// app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db"; // Import the PostgreSQL query function

// Zod schema for product ID validation
const productIdSchema = z.string().transform((val) => {
  const num = parseInt(val, 10);
  if (isNaN(num)) throw new Error("Invalid product ID");
  return num;
});

// Zod schema for product update
const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  category_id: z.number().positive("Category ID is required"),
  stock_quantity: z
    .number()
    .min(0, "Stock quantity cannot be negative")
    .optional(),
  is_available: z.boolean(),
});

export type UpdateProduct = z.infer<typeof updateProductSchema>;

// SQL function to check if product is in active orders
async function checkProductInOrders(productId: number) {
  try {
    const result = await query(
      `
      SELECT COUNT(*) as count 
      FROM OrderItems oi
      JOIN Orders o ON oi.order_id = o.order_id
      WHERE oi.product_id = $1 AND o.deleted_at IS NULL
    `,
      [productId]
    );
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    throw error;
  }
}

// SQL function to soft delete product
async function deleteProductById(productId: number) {
  try {
    // Soft delete the product
    await query(
      "UPDATE Products SET deleted_at = NOW() WHERE product_id = $1",
      [productId]
    );

    // Remove from cart items (if cart table exists)
    // Note: Uncomment if you have a CartItems table
    // await query("DELETE FROM CartItems WHERE product_id = $1", [productId]);
  } catch (error) {
    throw error;
  }
}

// SQL function to update product
async function updateProductById(
  productId: number,
  productData: UpdateProduct
) {
  try {
    // Update product
    await query(
      `UPDATE Products 
       SET name = $1, description = $2, price = $3, category_id = $4, is_available = $5, updated_at = NOW()
       WHERE product_id = $6`,
      [
        productData.name,
        productData.description || null,
        productData.price,
        productData.category_id,
        productData.is_available,
        productId,
      ]
    );

    // Update inventory if stock_quantity is provided
    if (productData.stock_quantity !== undefined) {
      await query(
        `UPDATE ProductInventory 
         SET quantity = $1, last_updated = NOW(), updated_by = $2
         WHERE product_id = $3`,
        [productData.stock_quantity, 1, productId] // Replace 1 with actual admin_id
      );
    }
  } catch (error) {
    throw error;
  }
}

// DELETE - Soft delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate product ID
    const productId = productIdSchema.parse(params.id);

    // Check if product is in any active orders
    const inOrders = await checkProductInOrders(productId);
    if (inOrders) {
      return NextResponse.json(
        { error: "Cannot delete product that has been ordered" },
        { status: 400 }
      );
    }

    // Delete the product
    await deleteProductById(productId);

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    // Handle errors like validation failures or SQL issues
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate product ID
    const productId = productIdSchema.parse(params.id);

    const body = await request.json();

    // Validate the incoming request body with Zod
    const productData: UpdateProduct = updateProductSchema.parse(body);

    // Update the product
    await updateProductById(productId, productData);

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    // Handle errors like validation failures or SQL issues
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
