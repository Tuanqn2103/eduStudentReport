import { Request, Response } from 'express';
import * as adminService from '../../services/admin.service';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await adminService.getDashboardStatsService();
    return res.status(200).json(stats);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};