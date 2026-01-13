import { Request, Response } from 'express';
import * as teacherService from '../../services/teacher.service';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user?.id;
    const stats = await teacherService.getDashboardStatsService(teacherId);
    return res.status(200).json(stats);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};