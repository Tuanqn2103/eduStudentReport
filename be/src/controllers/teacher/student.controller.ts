import { Request, Response } from 'express';
import * as teacherService from '../../services/teacher.service';

export const getClassStudents = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user.id;
    const { classId } = req.params;
    const { term } = req.query;

    if (!term) {
      return res.status(400).json({ message: 'Thiếu kỳ học (term)' });
    }

    const students = await teacherService.getClassStudentsService(teacherId, classId, String(term));
    return res.status(200).json(students);
  } catch (error: any) {
    if (error.message === 'FORBIDDEN_CLASS') {
      return res.status(403).json({ message: 'Bạn không quản lý lớp này' });
    }
    return res.status(500).json({ message: 'Lỗi server' });
  }
};