import { Request, Response } from 'express';
import * as teacherService from '../../services/teacher.service';
import { UpdateStudentDto } from '../../dtos/teacher.dto';


export const getClassStudents = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user?.id;
    const { classId } = req.params;
    const { term } = req.query;

    if (!term) {
      return res.status(400).json({ message: 'Thiếu kỳ học (term)' });
    }

    const students = await teacherService.getClassStudentsService(teacherId, classId as string, String(term));
    return res.status(200).json(students);
  } catch (error) {
    const err = error as Error;
    if (err.message === 'FORBIDDEN_CLASS') {
      return res.status(403).json({ message: 'Bạn không quản lý lớp này' });
    }
    return res.status(500).json({ message: 'Lỗi server' });
  }
};
export const getStudentDetail = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user?.id;
    const { id } = req.params;

    const student = await teacherService.getStudentDetailService(teacherId, id as string);
    
    if (!student) {
      return res.status(404).json({ message: 'Không tìm thấy học sinh' });
    }

    return res.status(200).json(student);
  } catch (error) {
    const err = error as Error;
    if (err.message === 'FORBIDDEN_STUDENT') {
      return res.status(403).json({ message: 'Học sinh này không thuộc lớp bạn chủ nhiệm' });
    }
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user?.id;
    const { id } = req.params;
    const body: UpdateStudentDto = req.body;

    const updatedStudent = await teacherService.updateStudentService(teacherId, id as string, body);
    
    return res.status(200).json({ 
      message: 'Cập nhật thông tin thành công', 
      data: updatedStudent 
    });
  } catch (error) {
    const err = error as Error;
    if (err.message === 'FORBIDDEN_STUDENT') {
      return res.status(403).json({ message: 'Bạn không có quyền sửa học sinh này' });
    }
    return res.status(500).json({ message: 'Lỗi server' });
  }
};