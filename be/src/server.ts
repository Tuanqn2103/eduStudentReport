import dotenv from 'dotenv';
import app from './app';
import { prisma } from './lib/prisma'; 

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Đang khởi động hệ thống...");

    await prisma.$connect();
    console.log("Connected to MongoDB via Prisma");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();