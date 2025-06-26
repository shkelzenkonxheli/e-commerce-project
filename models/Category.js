import { Schema, model, models } from "mongoose";
const CategorySchema = new Schema({
  name: String,
  required: true,
  unique: true,
});
export const Category = models?.Category || model("Category", CategorySchema);
