import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateUserName } from "@/lib/sql/users_sql";

// Validate incoming request body
const nameUpdateSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = nameUpdateSchema.parse(body);

    const result = await updateUserName(email, firstName, lastName); // Check if any row was actually updated
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "User not found or no update done" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Name updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating name:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
