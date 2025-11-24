// src/server.ts
import dotenv from 'dotenv';
import app from './app'; // Import app đã cấu hình routes ở trên
import { prisma } from './lib/prisma'; // Kết nối Prisma (cho Admin)
import connectDB from './config/database'; // Kết nối Mongoose (cho Teacher cũ)

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("⏳ Đang khởi động hệ thống...");

    // 1. Kết nối MongoDB (Mongoose) - Dùng cho chức năng Teacher cũ
    await connectDB(); 
    
    // 2. Kết nối Prisma - Dùng cho Admin mới
    await prisma.$connect();
    console.log("✅ Connected to MongoDB via Prisma");

    // 3. Chạy Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`   - Admin API: http://localhost:${PORT}/api/admin/auth`);
      console.log(`   - Teacher API: http://localhost:${PORT}/api/teacher/reports`);
    });

  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();