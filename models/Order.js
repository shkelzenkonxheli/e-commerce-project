import { models, Schema, model } from "mongoose";
import { type } from "os";

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models?.Order || model("Order", OrderSchema);
