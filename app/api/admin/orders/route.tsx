// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db"; // Import the PostgreSQL connection

// Zod schema for order status update
const updateOrderSchema = z.object({
  order_id: z.number().positive("Order ID is required"),
  payment_status: z
    .enum(["pending", "completed", "failed", "refunded"])
    .optional(),
  shipping_status: z
    .enum(["processing", "shipped", "delivered", "returned"])
    .optional(),
});

export type UpdateOrder = z.infer<typeof updateOrderSchema>;

// SQL function to get all orders with customer information
async function getAllOrders() {
  const result = await query(`
    SELECT 
      o.order_id,
      o.user_id,
      CONCAT(u.first_name, ' ', u.last_name) as customer_name,
      u.email as customer_email,
      o.order_date,
      o.total_amount,
      o.payment_method,
      o.payment_status,
      o.shipping_status,
      COUNT(oi.order_item_id) as total_items
    FROM Orders o
    JOIN Users u ON o.user_id = u.user_id
    LEFT JOIN OrderItems oi ON o.order_id = oi.order_id
    WHERE o.deleted_at IS NULL
    GROUP BY o.order_id, o.user_id, u.first_name, u.last_name, u.email, 
             o.order_date, o.total_amount, o.payment_method, o.payment_status, o.shipping_status
    ORDER BY o.order_date DESC
  `);
  return result.rows;
}

// SQL function to update order status
async function updateOrderStatus(orderData: UpdateOrder) {
  let updateFields = [];
  let updateValues = [];

  if (orderData.payment_status) {
    updateFields.push("payment_status = $" + (updateValues.length + 1));
    updateValues.push(orderData.payment_status);
  }

  if (orderData.shipping_status) {
    updateFields.push("shipping_status = $" + (updateValues.length + 1));
    updateValues.push(orderData.shipping_status);
  }

  if (updateFields.length === 0) {
    throw new Error("No valid fields to update");
  }

  updateValues.push(orderData.order_id);

  const result = await query(
    `UPDATE Orders SET ${updateFields.join(", ")} WHERE order_id = $${
      updateValues.length
    }`,
    updateValues
  );

  return result;
}

// SQL function to get order details by ID
async function getOrderById(orderId: number) {
  const orderResult = await query(
    `
    SELECT 
      o.order_id,
      o.user_id,
      CONCAT(u.first_name, ' ', u.last_name) as customer_name,
      u.email as customer_email,
      u.phone_number,
      o.order_date,
      o.total_amount,
      o.payment_method,
      o.payment_status,
      o.shipping_status,
      sa.street_address as shipping_address,
      sa.city as shipping_city,
      sa.postal_code as shipping_postal,
      ba.street_address as billing_address,
      ba.city as billing_city,
      ba.postal_code as billing_postal
    FROM Orders o
    JOIN Users u ON o.user_id = u.user_id
    JOIN UserAddresses sa ON o.shipping_address_id = sa.address_id
    JOIN UserAddresses ba ON o.billing_address_id = ba.address_id
    WHERE o.order_id = $1 AND o.deleted_at IS NULL
  `,
    [orderId]
  );

  // Get order items
  const itemsResult = await query(
    `
    SELECT 
      oi.order_item_id,
      oi.product_id,
      p.name as product_name,
      oi.quantity,
      oi.price_at_time,
      oi.subtotal
    FROM OrderItems oi
    JOIN Products p ON oi.product_id = p.product_id
    WHERE oi.order_id = $1
  `,
    [orderId]
  );

  return {
    order: orderResult.rows[0],
    items: itemsResult.rows,
  };
}

// GET - Fetch all orders
export async function GET(request: NextRequest) {
  try {
    // Check if specific order ID is requested
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (orderId) {
      const orderIdNum = parseInt(orderId, 10);
      if (isNaN(orderIdNum)) {
        return NextResponse.json(
          { error: "Invalid order ID" },
          { status: 400 }
        );
      }

      const orderDetails = await getOrderById(orderIdNum);
      return NextResponse.json(orderDetails);
    }

    // Return all orders
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// PUT - Update order status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the incoming request body with Zod
    const orderData: UpdateOrder = updateOrderSchema.parse(body);

    // Call the SQL function to update the order
    await updateOrderStatus(orderData);

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    // Handle errors like validation failures or SQL issues
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
