import { Request, Response } from 'express';
import { loginParentService } from '../services/auth.service';

export const parentLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, pin } = req.body;

    if (!phoneNumber || !pin) {
      res.status(400).json({ message: 'Vui lòng nhập SĐT và mã PIN' });
      return;
    }

    const result = await loginParentService(phoneNumber, pin);

    res.status(200).json({
      message: 'Đăng nhập thành công',
      data: result
    });

  } catch (error: any) {
    console.error('Login Error:', error);

    if (error.message === 'PHONE_NOT_FOUND') {
      res.status(404).json({ message: 'Số điện thoại không tồn tại' });
      return;
    }
    if (error.message === 'WRONG_PIN') {
      res.status(400).json({ message: 'Mã PIN không chính xác' });
      return;
    }

    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};