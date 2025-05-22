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
