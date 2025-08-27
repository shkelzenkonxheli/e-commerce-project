import Stripe from "stripe";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "../../../../models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const MONGO_URL = process.env.MONGO_URL;

if (!mongoose.connection.readyState) {
  mongoose
    .connect(MONGO_URL)
    .then(() => console.log("Conected to Mongo db"))
    .catch((err) => console.error("Mongo conection err", err));
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📦 Received body:", body);

    const { products, total, address, deliveryPrice, city, name, email } = body;

    if (!total || isNaN(total)) {
      throw new Error("Total price is invalid");
    }
    const newOrder = await Order.create({
      products: products.map((p) => ({
        productId: p.productId,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
      })),
      total,
      address,
      city,
      name,
      email,
      paid: false,
    });
    console.log("Order Saved: " + newOrder);

    const NEXT_PUBLIC_URL =
      process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    console.log("🔗 NEXT_PUBLIC_URL:", NEXT_PUBLIC_URL);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        ...products.map((product) => ({
          price_data: {
            currency: "usd",
            product_data: { name: product.name },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: product.quantity,
        })),
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Delivery Fee" },
            unit_amount: Math.round(deliveryPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?orderId=${newOrder._id}`,
      cancel_url: `${NEXT_PUBLIC_URL}/cancel`,
      metadata: {
        newOrderId: newOrder._id.toString(),
        products: JSON.stringify(
          products.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
          }))
        ),
      },
    });
    console.log("Checkout Session Metadata:", session.metadata);
    return new Response(JSON.stringify({ id: session.id, url: session.url }), {
      status: 200,
    });
  } catch (error) {
    console.error("🔥 Error creating Stripe session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
