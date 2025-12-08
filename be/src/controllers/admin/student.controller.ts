import { Request, Response } from 'express';
import * as adminService from '../../services/admin.service';

// [C] CREATE SINGLE (Tạo lẻ 1 học sinh)
export const createStudent = async (req: Request, res: Response) => {
  try {
    const { classId, fullName, parentPhones, dateOfBirth, gender } = req.body;
    if (!classId || !fullName) return res.status(400).json({ message: 'Thiếu thông tin' });

    const newStudent = await adminService.createSingleStudentService(req.body);
    return res.status(201).json({ message: 'Tạo học sinh thành công', data: newStudent });
  } catch (error: any) {
    if (error.message === 'CLASS_NOT_FOUND') return res.status(404).json({ message: 'Lớp không tồn tại' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// [C] IMPORT BATCH (Nhập nhiều từ Excel)
export const importStudents = async (req: Request, res: Response) => {
  try {
    const { classId, students } = req.body;
    if (!classId || !students || !Array.isArray(students)) return res.status(400).json({ message: 'Dữ liệu sai định dạng' });

    const result = await adminService.importStudentsService(classId, students);
    return res.status(201).json({ message: 'Import thành công', exportData: result });
  } catch (error: any) {
    if (error.message === 'CLASS_NOT_FOUND') return res.status(404).json({ message: 'Lớp không tồn tại' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// [R] READ BY CLASS (Lấy DS học sinh theo lớp)
export const getStudentsByClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const students = await adminService.getStudentsByClassService(classId);
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// [R] READ ONE
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await adminService.getStudentByIdService(id);
    return res.status(200).json(student);
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Không tìm thấy học sinh' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// [U] UPDATE
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await adminService.updateStudentService(id, updateData);
    return res.status(200).json({ message: 'Cập nhật thành công', data: updated });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Không tìm thấy học sinh' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// [D] DELETE
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminService.deleteStudentService(id);
    return res.status(200).json({ message: 'Xóa học sinh thành công' });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Không tìm thấy học sinh' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};