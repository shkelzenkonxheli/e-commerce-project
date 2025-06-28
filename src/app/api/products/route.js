import { NextResponse } from "next/server";
import { initMongoose } from "../../../../lib/mongoose";
import Product from "../../../../models/Product";

export async function GET(req) {
  try {
    await initMongoose();

    const { searchParams } = new URL(req.url);
    const ids = searchParams.get("ids");

    if (ids) {
      const idsArray = ids.split(",");
      const products = await Product.find({ _id: { $in: idsArray } }).exec();
      return NextResponse.json(products, { status: 200 });
    }

    const allProducts = await Product.find().exec();
    return NextResponse.json(allProducts, { status: 200 });
  } catch (error) {
    console.error("Error in /api/products:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await initMongoose();
  const body = await req.json();
  const newProduct = await Product.create(body);
  return NextResponse.json(newProduct);
}

export async function DELETE(req) {
  try {
    await initMongoose();
    const { id } = await req.json();

    const deleteProduct = await Product.findByIdAndDelete(id);
    if (!deleteProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/products:", error);
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

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/products:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
