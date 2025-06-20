import { query } from "../db";

// Define the interface for a product
export interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
  category_id: number;
  created_by: number;
}

// Function to fetch product by its ID
export async function getProductById(
  productId: number
): Promise<Product | null> {
  try {
    const sql = `
      SELECT product_id, name, description, price, is_available, category_id, created_by
      FROM Products
      WHERE product_id = $1 AND deleted_at IS NULL
    `;
    const result = await query(sql, [productId]);

    if (result.rows.length > 0) {
      const product = result.rows[0]; // Only one product since we're using product_id
      return {
        product_id: product.product_id,
        name: product.name,
        description: product.description,
        price: Number(product.price), // Ensure price is converted to number
        is_available: product.is_available,
        category_id: product.category_id,
        created_by: product.created_by,
      };
    }

    return null; // No product found
  } catch (error) {
    throw error;
  }
}

// Define the type for a new product
export type NewProduct = {
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
  createdBy: number; // Admin ID who creates the product
};

export async function createProduct(product: NewProduct) {
  try {
    const sql = `
      INSERT INTO Products (category_id, name, description, price, is_available, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING product_id
    `;

    const params = [
      product.categoryId,
      product.name,
      product.description || null,
      product.price,
      product.isAvailable,
      product.createdBy,
    ];

    // Execute the SQL query and return the result
    const result = await query(sql, params);

    return {
      insertId: result.rows[0].product_id,
      affectedRows: result.rowCount,
    };
  } catch (error) {
    throw error;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const sql = `
      SELECT product_id, name, description, price, is_available, category_id, created_by
      FROM Products
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    const result = await query(sql);
    return result.rows.map((row: any) => ({
      product_id: row.product_id,
      name: row.name,
      description: row.description,
      price: Number(row.price), // Ensure price is converted to number
      is_available: row.is_available,
      category_id: row.category_id,
      created_by: row.created_by,
    }));
  } catch (error) {
    throw error;
  }
}

// Function to update a product by its product_id
export async function updateProduct(
  productId: number,
  productData: Partial<Product>
): Promise<Product | null> {
  try {
    // Build the SQL update query dynamically based on which fields are provided
    let sql = `
      UPDATE Products
      SET
        name = COALESCE($2, name),
        description = COALESCE($3, description),
        price = COALESCE($4, price),
        is_available = COALESCE($5, is_available),
        category_id = COALESCE($6, category_id),
        updated_at = NOW()
      WHERE product_id = $1 AND deleted_at IS NULL
      RETURNING product_id, name, description, price, is_available, category_id, created_by
    `;

    const params = [
      productId,
      productData.name,
      productData.description,
      productData.price,
      productData.is_available,
      productData.category_id,
    ]; // Execute the query
    const result = await query(sql, params);

    // If the affected rows is > 0, return the updated product
    if (result.rowCount && result.rowCount > 0) {
      const updatedProduct = result.rows[0];
      return {
        product_id: updatedProduct.product_id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        is_available: updatedProduct.is_available,
        category_id: updatedProduct.category_id,
        created_by: updatedProduct.created_by,
      };
    }

    return null; // Product not found or no changes were made
  } catch (error) {
    throw error;
  }
}
