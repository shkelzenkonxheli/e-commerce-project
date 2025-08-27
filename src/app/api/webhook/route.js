import Stripe from "stripe";
import Order from "../../../../models/Order";
import mongoose from "mongoose";
import Product from "../../../../models/Product";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URL).catch(console.error);
}

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return new Response("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const products = JSON.parse(session.metadata.products);
    const orderId = session.metadata.newOrderId;

    await Promise.all(
      products.map((item) =>
        Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        })
      )
    );

    await Order.findByIdAndUpdate(orderId, { paid: true });

    console.log("✅ Payment succeeded for session:", session.id);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
