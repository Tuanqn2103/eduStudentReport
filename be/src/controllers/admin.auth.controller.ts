import { Request, Response } from 'express';
import { loginAdminService, createAdminService } from '../services/admin.service';

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: 'Thiếu thông tin đăng nhập' });
    }

    const result = await loginAdminService(phoneNumber, password);
    res.status(200).json({ message: 'Login thành công', ...result });

  } catch (error: any) {
    if (error.message === 'ADMIN_NOT_FOUND') return res.status(404).json({ message: 'Tài khoản không tồn tại' });
    if (error.message === 'WRONG_PASSWORD') return res.status(401).json({ message: 'Sai mật khẩu' });
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password, fullName } = req.body;
    if (!phoneNumber || !password || !fullName) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    const newAdmin = await createAdminService(req.body);
    res.status(201).json({ message: 'Tạo tài khoản thành công', adminId: newAdmin.id });

  } catch (error: any) {
    if (error.message === 'PHONE_EXISTED') return res.status(400).json({ message: 'SĐT đã tồn tại' });
    res.status(500).json({ message: 'Lỗi server' });
  }
};