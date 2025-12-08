import { Request, Response } from 'express';
import * as adminService from '../../services/admin.service';
import { CreateStudentDto, ImportStudentDto, UpdateStudentDto } from '../../dtos/admin.dto';


export const createStudent = async (req: Request, res: Response) => {
  try {
    const body: CreateStudentDto = req.body;
    
    if (!body.classId || !body.fullName) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    const newStudent = await adminService.createSingleStudentService(body);
    return res.status(201).json({ message: 'Tạo học sinh thành công', data: newStudent });
  } catch (error: any) {
    if (error.message === 'CLASS_NOT_FOUND') return res.status(404).json({ message: 'Lớp không tồn tại' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const importStudents = async (req: Request, res: Response) => {
  try {
    const { classId, students } = req.body;
    const studentsDto: ImportStudentDto[] = students;

    if (!classId || !studentsDto || !Array.isArray(studentsDto)) {
      return res.status(400).json({ message: 'Dữ liệu sai định dạng' });
    }

    const result = await adminService.importStudentsService(classId, studentsDto);
    return res.status(201).json({ message: 'Import thành công', exportData: result });
  } catch (error: any) {
    if (error.message === 'CLASS_NOT_FOUND') return res.status(404).json({ message: 'Lớp không tồn tại' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getStudentsByClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const students = await adminService.getStudentsByClassService(classId);
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

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

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body: UpdateStudentDto = req.body; // Ép kiểu DTO
    
    const updated = await adminService.updateStudentService(id, body);
    return res.status(200).json({ message: 'Cập nhật thành công', data: updated });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Không tìm thấy học sinh' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};


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