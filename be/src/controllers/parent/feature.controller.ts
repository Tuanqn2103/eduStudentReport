import { Request, Response } from 'express';
import * as parentService from '../../services/parent.service';

export const getMyChildren = async (req: Request, res: Response) => {
  try {
    const parentPhone = req.user.parentId; 
    
    const children = await parentService.getMyChildrenService(parentPhone);
    return res.status(200).json(children);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getChildReports = async (req: Request, res: Response) => {
  try {
    const parentPhone = req.user.parentId;
    const { studentId } = req.params;

    const reports = await parentService.getStudentReportsService(studentId, parentPhone);
    return res.status(200).json(reports);
  } catch (error: any) {
    if (error.message === 'FORBIDDEN_CHILD') return res.status(403).json({ message: 'Đây không phải hồ sơ con của bạn' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getReportDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const report = await parentService.getReportDetailService(id);
    return res.status(200).json(report);
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Không tìm thấy bảng điểm' });
    if (error.message === 'NOT_PUBLISHED') return res.status(403).json({ message: 'Bảng điểm chưa được công bố' });
    return res.status(500).json({ message: 'Lỗi server' });
  }
};