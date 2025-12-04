import { Request, Response } from 'express';
import { loginTeacherService } from '../services/teacher.service';

export const loginTeacher = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: 'Thiếu thông tin đăng nhập' });
    }

    const result = await loginTeacherService(phoneNumber, password);
    res.status(200).json({ message: 'Login thành công', ...result });

  } catch (error: any) {
    if (error.message === 'TEACHER_NOT_FOUND') return res.status(404).json({ message: 'Giáo viên không tồn tại' });
    if (error.message === 'ACCOUNT_LOCKED') return res.status(403).json({ message: 'Tài khoản bị khóa' });
    if (error.message === 'WRONG_PASSWORD') return res.status(401).json({ message: 'Sai mật khẩu' });
    res.status(500).json({ message: 'Lỗi server' });
  }
};