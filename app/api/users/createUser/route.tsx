import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/sql/users_sql";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  password_hash: z.string().min(6),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone_number: z
    .string()
    .regex(
      /^01[3-9]\d{8}$/,
      "Phone number must start with '01' followed by 3-9 and 8 more digits"
    )
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userData = userSchema.parse(body);

    const result = await createUser(userData);
    return NextResponse.json(
      { message: "User created", id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
