import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { loginTeacherService } from '../../services/teacher.service';
import { LoginTeacherDto } from '../../dtos/teacher.dto';

export const loginTeacher = async (req: Request, res: Response) => {
  try {
    const body: LoginTeacherDto = req.body;
    
    if (!body.phoneNumber || !body.password) {
      return res.status(400).json({ message: 'Thiếu thông tin đăng nhập' });
    }

    const result = await loginTeacherService(body);
    return res.status(200).json({ message: 'Login thành công', ...result });

  } catch (error) {
    const err = error as Error;
    if (err.message === 'TEACHER_NOT_FOUND') return res.status(404).json({ message: 'Giáo viên không tồn tại' });
    if (err.message === 'ACCOUNT_LOCKED') return res.status(403).json({ message: 'Tài khoản bị khóa' });
    if (err.message === 'WRONG_PASSWORD') return res.status(401).json({ message: 'Sai mật khẩu' });
    
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getTeacherProfile = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id; 

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      select: { 
        id: true, 
        fullName: true, 
        phoneNumber: true, 
        managedClassIds: true,
        isActive: true
      }
    });

    if (!teacher) return res.status(404).json({ message: 'Không tìm thấy Giáo viên' });

    return res.status(200).json(teacher);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const logoutTeacher = async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Giáo viên đã đăng xuất thành công' });
};