import { Request, Response } from 'express';
import * as adminService from '../../services/admin.service';
import { CreateClassDto, UpdateClassDto, AssignTeacherDto } from '../../dtos/admin.dto';

export const createClass = async (req: Request, res: Response) => {
  try {
    const body: CreateClassDto = req.body;
    
    if (!body.className || !body.schoolYear) {
      return res.status(400).json({ message: 'Thiếu tên lớp hoặc năm học' });
    }

    const newClass = await adminService.createClassService(body.className, body.schoolYear, body.teacherId);

    return res.status(201).json({ 
      message: body.teacherId ? 'Tạo lớp và phân công thành công' : 'Tạo lớp thành công', 
      data: newClass 
    });
  } catch (error: any) {
    if (error.message === 'CLASS_EXISTED') return res.status(400).json({ message: 'Lớp đã tồn tại' });
    if (error.message === 'TEACHER_NOT_FOUND') return res.status(404).json({ message: 'Giáo viên không tồn tại' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getClasses = async (req: Request, res: Response) => {
  try {
    const { className } = req.query;
    if (className) {
      const classes = await adminService.findClassesByNameService(String(className));
      return res.status(200).json(classes);
    }
    const classes = await adminService.getAllClassesService();
    return res.status(200).json(classes);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getClassById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const classInfo = await adminService.getClassByIdService(id as string);
    return res.status(200).json(classInfo);
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Không tìm thấy lớp học' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updateClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body: UpdateClassDto = req.body;
    
    const updated = await adminService.updateClassService(id as string, body);
    return res.status(200).json({ message: 'Cập nhật lớp thành công', data: updated });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Không tìm thấy lớp' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminService.deleteClassService(id as string);
    return res.status(200).json({ message: 'Xóa lớp thành công' });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Không tìm thấy lớp' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const assignTeacher = async (req: Request, res: Response) => {
  try {
    const body: AssignTeacherDto = req.body;
    
    if (!body.teacherId || !body.classId) {
      return res.status(400).json({ message: 'Thiếu ID' });
    }

    await adminService.assignTeacherToClassService(body.teacherId, body.classId);
    return res.status(200).json({ message: 'Phân công thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};