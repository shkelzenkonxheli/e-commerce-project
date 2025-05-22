import mongoose from "mongoose";

export async function initMongoose() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection.asPromise();
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Could not connect to MongoDB");
  }
}
