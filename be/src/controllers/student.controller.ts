import { Request, Response } from 'express';
// Đảm bảo file service này đã tồn tại
import { resetStudentPinService } from '../services/student.service'; 

export const resetStudentPin = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      // THÊM RETURN
      return res.status(400).json({ message: 'Thiếu Student ID' });
    }

    const result = await resetStudentPinService(studentId);
    
    // THÊM RETURN
    return res.status(200).json({ 
      message: 'Reset PIN thành công', 
      data: result 
    });

  } catch (error: any) {
    // THÊM RETURN Ở TẤT CẢ CÁC DÒNG
    if (error.message === 'STUDENT_NOT_FOUND') {
        return res.status(404).json({ message: 'Học sinh không tồn tại' });
    }
    return res.status(500).json({ message: 'Lỗi server' });
  }
};