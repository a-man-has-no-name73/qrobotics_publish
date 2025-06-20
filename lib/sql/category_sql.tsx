import { query } from "../db";

export type NewCategory = {
  name: string;
  description?: string;
  parentCategoryId?: number | null; // optional if it's a subcategory
};

export async function getCategoryNames(): Promise<string[]> {
  try {
    const sql = `
      SELECT name FROM Categories
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    const result = await query(sql);
    return result.rows.map((row: any) => row.name);
  } catch (error) {
    throw error;
  }
}

export async function createCategory(category: NewCategory) {
  try {
    const sql = `
      INSERT INTO Categories (name, description, parent_category_id)
      VALUES ($1, $2, $3)
      RETURNING category_id
    `;

    const params = [
      category.name,
      category.description || null,
      category.parentCategoryId || null,
    ];

    const result = await query(sql, params);
    return {
      insertId: result.rows[0].category_id,
      affectedRows: result.rowCount,
    };
  } catch (error) {
    throw error;
  }
}
