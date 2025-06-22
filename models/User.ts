import mongoose, { Schema, Document, model, models } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      validate: (pass: string) => {
        if (!pass?.length || pass.length < 5) {
          throw new Error("Password must be at least 5 characters");
        }
        return true;
      },
    },
    phone: { type: String },
    address: { type: String },
    postalCode: { type: String },
    city: { type: String },
    country: { type: String },
  },
  { timestamps: true }
);

UserSchema.post("validate", function (user: IUser) {
  const notHashedPassword = user.password;
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(notHashedPassword, salt);
});

export const User = models.User || model<IUser>("User", UserSchema);
