import dotenv from 'dotenv';
import app from './app';
import { prisma } from './lib/prisma';
import connectDB from './config/database';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Đang khởi động hệ thống...");

    await connectDB(); 
    console.log("[Mongoose] Connected");

    await prisma.$connect();
    console.log("[Prisma] Connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`- API Root: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1); 
  }
};

startServer();