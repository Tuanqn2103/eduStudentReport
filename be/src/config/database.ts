import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI as string;

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB (Compass)");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
