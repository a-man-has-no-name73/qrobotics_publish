import { query } from "../db"; // PostgreSQL query function

// Define type for the New Admin object
export type NewAdmin = {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: "super_admin" | "product_manager" | "order_manager";
  isActive?: boolean;
};

export async function createAdmin(admin: NewAdmin) {
  try {
    const result = await query(
      `INSERT INTO Admins (email, password_hash, first_name, last_name, role, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING admin_id`,
      [
        admin.email,
        admin.passwordHash,
        admin.firstName,
        admin.lastName,
        admin.role,
        admin.isActive ?? true,
      ]
    );
    return { insertId: result.rows[0].admin_id };
  } catch (error) {
    throw error;
  }
}

export async function getAdminByEmail(email: string) {
  try {
    const result = await query(
      `SELECT * FROM Admins WHERE email = $1 AND deleted_at IS NULL LIMIT 1`,
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

export async function updateAdminLastLogin(adminId: number) {
  try {
    const result = await query(
      `UPDATE Admins SET last_login = NOW() WHERE admin_id = $1`,
      [adminId]
    );
    return { affectedRows: result.rowCount };
  } catch (error) {
    throw error;
  }
}
