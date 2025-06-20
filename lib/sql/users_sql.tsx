// lib/sql/users.ts
import { query } from "../db"; // PostgreSQL query function

// Create a new user address
export type NewUserAddress = {
  userId: number;
  addressType: "billing" | "shipping";
  streetAddress: string;
  city: string;
  postalCode: string;
  isDefault?: boolean;
};

export type user = {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
};

export async function createUser(user: user) {
  try {
    const result = await query(
      `INSERT INTO Users (email, password_hash, first_name, last_name, phone_number) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING user_id`,
      [
        user.email,
        user.password_hash,
        user.first_name,
        user.last_name,
        user.phone_number || null,
      ]
    );
    return { insertId: result.rows[0].user_id };
  } catch (error) {
    throw error;
  }
}

export async function createUserAddress(address: NewUserAddress) {
  try {
    const result = await query(
      `INSERT INTO UserAddresses 
       (user_id, address_type, street_address, city, postal_code, is_default) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING address_id`,
      [
        address.userId,
        address.addressType,
        address.streetAddress,
        address.city,
        address.postalCode,
        address.isDefault ?? false,
      ]
    );
    return { insertId: result.rows[0].address_id };
  } catch (error) {
    throw error;
  }
}

// Update password for a user by email
export async function updateUserPassword(
  email: string,
  newPasswordHash: string
) {
  try {
    const result = await query(
      `UPDATE Users 
       SET password_hash = $1, updated_at = NOW() 
       WHERE email = $2 AND deleted_at IS NULL`,
      [newPasswordHash, email]
    );
    return { affectedRows: result.rowCount };
  } catch (error) {
    throw error;
  }
}

// Update name for a user by email
export async function updateUserName(
  email: string,
  firstName: string,
  lastName: string
) {
  try {
    const result = await query(
      `UPDATE Users 
       SET first_name = $1, last_name = $2, updated_at = NOW() 
       WHERE email = $3 AND deleted_at IS NULL`,
      [firstName, lastName, email]
    );
    return { affectedRows: result.rowCount };
  } catch (error) {
    throw error;
  }
}

// Update phone number for a user by email
export async function updateUserPhone(email: string, phoneNumber: string) {
  try {
    const result = await query(
      `UPDATE Users 
       SET phone_number = $1, updated_at = NOW() 
       WHERE email = $2 AND deleted_at IS NULL`,
      [phoneNumber, email]
    );
    return { affectedRows: result.rowCount };
  } catch (error) {
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await query(
      `SELECT * FROM Users WHERE email = $1 AND deleted_at IS NULL LIMIT 1`,
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}
