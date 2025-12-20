import { Request, Response } from 'express';
import { loginParentService } from '../../services/auth.service';

export const parentLogin = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, pin } = req.body;

    if (!phoneNumber || !pin) {
      return res.status(400).json({ message: 'Vui lòng nhập SĐT và mã PIN' });
    }

    const result = await loginParentService(phoneNumber, pin);

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      ...result 
    });

  } catch (error: any) {
    if (error.message === 'PHONE_NOT_FOUND') {
      return res.status(404).json({ message: 'Số điện thoại không tồn tại' });
    }
    if (error.message === 'WRONG_PIN') {
      return res.status(400).json({ message: 'Mã PIN không chính xác' });
    }

    return res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};

export const logoutParent = async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Phụ huynh đã đăng xuất thành công' });
};