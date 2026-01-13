import { Request, Response } from 'express';
import * as adminService from '../../services/admin.service';
import { CreateTeacherDto, UpdateTeacherDto } from '../../dtos/admin.dto';

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const body: CreateTeacherDto = req.body;
    
    if (!body.fullName || !body.phoneNumber || !body.password) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    const newTeacher = await adminService.createTeacherService(body);
    return res.status(201).json({ message: 'Tạo giáo viên thành công', data: newTeacher });
  } catch (error: any) {
    if (error.message === 'PHONE_EXISTED') return res.status(400).json({ message: 'SĐT đã tồn tại' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.query;

    if (phoneNumber) {
      const teacher = await adminService.getTeacherByPhoneService(String(phoneNumber));
      return res.status(200).json(teacher ? [teacher] : []);
    }

    const teachers = await adminService.getAllTeachersService();
    return res.status(200).json(teachers);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacher = await adminService.getTeacherByIdService(id as string);
    return res.status(200).json(teacher);
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body: UpdateTeacherDto = req.body;

    const updated = await adminService.updateTeacherService(id as string, body);
    return res.status(200).json({ message: 'Cập nhật thành công', data: updated });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminService.deleteTeacherService(id as string);
    return res.status(200).json({ message: 'Xóa giáo viên thành công' });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};