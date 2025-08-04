import { NextResponse } from "next/server";
import { initMongoose } from "../../../../lib/mongoose";
import Order from "../../../../models/Order";
export async function GET(req) {
  await initMongoose();
  try {
    const orders = await Order.find().exec();
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error in /api/orders:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  await initMongoose();
  const { id } = await req.json();
  try {
    await Order.findByIdAndDelete(id).exec();
    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/orders/[id]:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
