import { NextResponse } from "next/server";
import { initMongoose } from "../../../../lib/mongoose";
import Order from "../../../../models/Order";
import { User } from "../../../../models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
export async function GET(req) {
  await initMongoose();
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const user = await User.findOne({ email: session.user.email }).exec();
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const orders = user.admin
      ? await Order.find().sort({ createdAt: -1 }).exec() // admin: të gjitha
      : await Order.find({ user: user._id }).sort({ createdAt: -1 }).exec(); // user: vetëm vetja

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
