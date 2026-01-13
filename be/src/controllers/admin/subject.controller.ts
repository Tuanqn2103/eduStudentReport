import { Request, Response } from 'express';
import * as subjectService from '../../services/subject.service';
import { CreateSubjectDto } from '../../dtos/subject.dto';

export const createSubject = async (req: Request, res: Response) => {
  try {
    const body: CreateSubjectDto = req.body;
    if (!body.name) return res.status(400).json({ message: 'Thiếu tên môn học' });

    const newSubject = await subjectService.createSubjectService(body);
    return res.status(201).json({ message: 'Tạo môn học thành công', data: newSubject });
  } catch (error: any) {
    if (error.message === 'SUBJECT_EXISTED') return res.status(400).json({ message: 'Môn học này đã tồn tại' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await subjectService.getAllSubjectsService();
    return res.status(200).json(subjects);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};