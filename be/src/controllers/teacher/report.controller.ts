import { Request, Response } from 'express';
import * as teacherService from '../../services/teacher.service';
import { UpsertReportDto } from '../../dtos/teacher.dto';

export const getStudentReport = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { term } = req.query;
    
    if (!term) {
      return res.status(400).json({ message: 'Thiếu kỳ học' });
    }

    const report = await teacherService.getStudentGradeService(studentId, String(term));
    
    return res.status(200).json(report || null); 
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const saveReport = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user?.id;
    const body: UpsertReportDto = req.body;

    if (!body.studentId || !body.term || !body.grades) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc (studentId, term, grades)' });
    }

    const result = await teacherService.inputGradeService(teacherId, body);
    return res.status(200).json({ message: 'Lưu kết quả thành công', data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getClassReports = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user?.id;
    const { classId, term } = req.query;

    if (!classId || !term) {
      return res.status(400).json({ message: 'Thiếu classId hoặc term' });
    }

    const reports = await teacherService.getClassReportsService(teacherId, String(classId), String(term));
    
    return res.status(200).json(reports);
  } catch (error) {
    const err = error as Error;
    if (err.message === 'FORBIDDEN_CLASS') return res.status(403).json({ message: 'Bạn không quản lý lớp này' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};