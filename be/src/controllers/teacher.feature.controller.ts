import { Request, Response } from 'express';
import * as teacherService from '../services/teacher.service';
import { UpsertReportDto } from '../dtos/teacher.dto';

export const getMyClasses = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user.id;
    const classes = await teacherService.getMyClassesService(teacherId);
    return res.status(200).json(classes);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getClassStudents = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user.id;
    const { classId } = req.params;
    const { term } = req.query;

    if (!term) return res.status(400).json({ message: 'Thiếu kỳ học (term)' });

    const students = await teacherService.getClassStudentsService(teacherId, classId, String(term));
    return res.status(200).json(students);
  } catch (error: any) {
    if (error.message === 'FORBIDDEN_CLASS') return res.status(403).json({ message: 'Bạn không quản lý lớp này' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getStudentReport = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { term } = req.query;
    
    const report = await teacherService.getStudentGradeService(studentId, String(term));
    return res.status(200).json(report || { message: 'Chưa có điểm' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const saveReport = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user.id;
    const body: UpsertReportDto = req.body;

    if (!body.studentId || !body.term || !body.grades) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const result = await teacherService.inputGradeService(teacherId, body);
    return res.status(200).json({ message: 'Lưu kết quả thành công', data: result });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};