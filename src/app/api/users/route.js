import { NextResponse } from "next/server";
import { initMongoose } from "../../../../lib/mongoose";
import { User } from "../../../../models/User";
export async function GET(req) {
  try {
    await initMongoose();
    const users = await User.find().exec();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error in /api/users:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  try {
    await initMongoose();
    const body = await req.json();
    const { id, ...updateData } = body;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/users:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    await initMongoose();
    const body = await req.json();
    const { id } = body;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/users:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
