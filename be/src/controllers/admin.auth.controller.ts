import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendSms } from '../services/sms.service';

// 1. Gửi OTP
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber } = req.body;

    // Validate input
    if (!phoneNumber) {
      res.status(400).json({ message: 'Vui lòng nhập số điện thoại' });
      return;
    }

    const admin = await prisma.admin.findUnique({
      where: { phoneNumber },
    });

    if (!admin) {
      res.status(404).json({ message: 'Số điện thoại Admin không tồn tại trong hệ thống' });
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const hashedOtp = await bcrypt.hash(otp, 10);

    await prisma.otp.deleteMany({
      where: { phoneNumber }
    });

    await prisma.otp.create({
      data: {
        phoneNumber,
        hashedOtp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Hết hạn sau 5 phút
      },
    });

    // Gửi SMS (Giả lập)
    await sendSms(phoneNumber, otp);

    res.status(200).json({ message: 'Mã OTP đã được gửi thành công' });

  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ message: 'Lỗi server khi gửi OTP' });
  }
};

// 2. Xác thực OTP và trả về Token
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      res.status(400).json({ message: 'Thiếu số điện thoại hoặc mã OTP' });
      return;
    }

    // Tìm bản ghi OTP mới nhất của số điện thoại này
    const otpRecord = await prisma.otp.findFirst({
      where: { phoneNumber },
      orderBy: { expiresAt: 'desc' } // Lấy cái mới nhất
    });

    // Các trường hợp lỗi OTP
    if (!otpRecord) {
      res.status(400).json({ message: 'Không tìm thấy yêu cầu OTP nào' });
      return;
    }

    if (new Date() > otpRecord.expiresAt) {
      res.status(400).json({ message: 'Mã OTP đã hết hạn' });
      return;
    }

    const isValid = await bcrypt.compare(otp, otpRecord.hashedOtp);
    if (!isValid) {
      res.status(400).json({ message: 'Mã OTP không chính xác' });
      return;
    }

    // OTP OK -> Lấy thông tin Admin
    const admin = await prisma.admin.findUnique({ where: { phoneNumber } });

    if (!admin) {
      res.status(404).json({ message: 'Tài khoản admin không tìm thấy' });
      return;
    }

    // Tạo JWT Token
    const token = jwt.sign(
      { 
        id: admin.id, 
        role: admin.isSuperAdmin ? 'superadmin' : 'admin',
        phoneNumber: admin.phoneNumber
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    // Xóa OTP sau khi dùng xong (để không ai dùng lại được)
    await prisma.otp.delete({ where: { id: otpRecord.id } });

    // Trả về kết quả
    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      admin: {
        id: admin.id,
        fullName: admin.fullName,
        phoneNumber: admin.phoneNumber,
        isSuperAdmin: admin.isSuperAdmin
      }
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: 'Lỗi server khi xác thực' });
  }
};