import { Request, Response } from 'express';
import * as teacherService from '../../services/teacher.service';

export const getMyClasses = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user?.id;
    const classes = await teacherService.getMyClassesService(teacherId);
    return res.status(200).json(classes);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};