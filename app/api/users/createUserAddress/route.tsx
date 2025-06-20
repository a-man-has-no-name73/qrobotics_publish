import { NextRequest, NextResponse } from "next/server";
import { createUserAddress, NewUserAddress } from "@/lib/sql/users_sql";
import { z } from "zod";

// Zod schema for validation
const addressSchema = z.object({
  userId: z.number().int().positive(),
  addressType: z.enum(["billing", "shipping"]),
  streetAddress: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  isDefault: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const addressData: NewUserAddress = addressSchema.parse(body);

    // Call SQL function to insert address
    const result = await createUserAddress(addressData);
    return NextResponse.json(
      { message: "Address created", id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
