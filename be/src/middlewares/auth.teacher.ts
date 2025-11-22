import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-2025';

export const teacherAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // 1. Kiểm tra header có tồn tại và đúng định dạng không
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Thiếu token hoặc sai định dạng' });
  }

  // 2. Lấy token
  const token = authHeader.split(' ')[1];

  // 3. FIX LỖI: Kiểm tra chắc chắn token tồn tại trước khi verify
  if (!token) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }

  try {
    // Lúc này TypeScript đã biết 'token' chắc chắn là string
    const payload = jwt.verify(token, JWT_SECRET) as any;
    
    if (payload.role !== 'TEACHER') {
       // Nên throw error để nhảy xuống catch, hoặc return lỗi luôn
       return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token sai hoặc hết hạn' });
  }
};