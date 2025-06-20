import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateUserPhone } from "@/lib/sql/users_sql";

// Validate incoming request body with phone number pattern similar to creation validation
const phoneUpdateSchema = z.object({
  email: z.string().email(),
  phoneNumber: z
    .string()
    .regex(
      /^01[3-9]\d{8}$/,
      "Phone number must start with '01' followed by 3-9 and 8 more digits"
    ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phoneNumber } = phoneUpdateSchema.parse(body);

    const result = await updateUserPhone(email, phoneNumber);
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "User not found or no update done" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Phone number updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating phone:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
