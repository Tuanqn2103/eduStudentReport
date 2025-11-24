import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;
  
  if (!uri) {
    console.error("FATAL ERROR: Chưa cấu hình biến môi trường MONGODB_URI hoặc DATABASE_URL trong file .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB Connected via Mongoose');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export default connectDB;