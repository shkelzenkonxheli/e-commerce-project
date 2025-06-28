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
