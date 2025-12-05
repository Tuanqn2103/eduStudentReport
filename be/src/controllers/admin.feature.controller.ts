import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import * as adminRepo from '../repositories/admin.repository';

// Tạo Giáo viên
export const createTeacherAccount = async (req: Request, res: Response) => {
  try {
    const { fullName, phoneNumber, password } = req.body;
    if (!fullName || !phoneNumber || !password) return res.status(400).json({ message: 'Thiếu thông tin' });

    const newTeacher = await adminService.createTeacherService(req.body);
    return res.status(201).json({ message: 'Tạo giáo viên thành công', data: newTeacher });
  } catch (error: any) {
    if (error.message === 'PHONE_EXISTED') return res.status(400).json({ message: 'SĐT đã tồn tại' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Tạo Lớp
export const createClass = async (req: Request, res: Response) => {
  try {
    console.log("DEBUG BODY:", req.body);
    const { className, schoolYear, teacherId } = req.body;
    
    if (!className || !schoolYear) {
      return res.status(400).json({ message: 'Thiếu tên lớp hoặc năm học' });
    }

    const newClass = await adminService.createClassService(className, schoolYear, teacherId);

    return res.status(201).json({ 
      message: teacherId ? 'Tạo lớp và phân công giáo viên thành công' : 'Tạo lớp thành công', 
      data: newClass 
    });

  } catch (error: any) {
    if (error.message === 'CLASS_EXISTED') return res.status(400).json({ message: 'Lớp đã tồn tại' });
    if (error.message === 'TEACHER_NOT_FOUND') return res.status(404).json({ message: 'Giáo viên không tồn tại' });
    
    console.error(error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách lớp
export const getAllClassesList = async (req: Request, res: Response) => {
  try {
    const classes = await adminRepo.getAllClasses();
    return res.status(200).json(classes);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Phân công
export const assignTeacher = async (req: Request, res: Response) => {
  try {
    const { teacherId, classId } = req.body;
    if (!teacherId || !classId) return res.status(400).json({ message: 'Thiếu ID' });

    await adminService.assignTeacherToClassService(teacherId, classId);
    return res.status(200).json({ message: 'Phân công thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Import Học sinh
export const importStudents = async (req: Request, res: Response) => {
  try {
    const { classId, students } = req.body;
    if (!classId || !students || !Array.isArray(students)) return res.status(400).json({ message: 'Dữ liệu sai định dạng' });

    const result = await adminService.importStudentsService(classId, students);
    return res.status(201).json({ message: 'Import thành công', exportData: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Dashboard
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await adminService.getDashboardStatsService();
    return res.status(200).json(stats);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};