import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdmin, NewAdmin } from "@/lib/sql/admin_sql"; // Import the SQL function

// Zod schema to validate the incoming data
const adminSchema = z.object({
  email: z.string().email(),
  passwordHash: z.string().min(6), // Assuming password is already hashed
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["super_admin", "product_manager", "order_manager"]),
  isActive: z.boolean().optional().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the incoming request body with Zod
    const adminData: NewAdmin = adminSchema.parse(body);

    // Call the SQL function to create the admin
    const result = await createAdmin(adminData); // Return success response with admin ID
    return NextResponse.json(
      { message: "Admin created", id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
