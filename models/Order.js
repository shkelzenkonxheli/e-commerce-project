import { models, Schema, model } from "mongoose";

const OrderSchema = new Schema(
  {
    products: [{ name: String, price: Number, quantity: Number }],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = models?.Order || model("Order", OrderSchema);

export default Order;
