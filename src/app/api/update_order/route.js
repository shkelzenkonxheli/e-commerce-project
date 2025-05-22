import mongoose from "mongoose";
import Order from "../../../../models/Order";

const MONGODB_URI = process.env.MONGODB_URL;

if (!mongoose.connection.readyState) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("🔥 MongoDB connection error:", err));
}

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paid: true },
      { new: true }
    );

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    console.log("💰 Order marked as paid:", updatedOrder);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("🔥 Error updating order:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
