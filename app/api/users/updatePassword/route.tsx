import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateUserPassword } from "@/lib/sql/users_sql";

// Validate incoming request body
const passwordUpdateSchema = z.object({
  email: z.string().email(),
  newPasswordHash: z.string().min(6), // assume already hashed
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, newPasswordHash } = passwordUpdateSchema.parse(body);

    const result = await updateUserPassword(email, newPasswordHash); // Check if any row was actually updated
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "User not found or no update done" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
