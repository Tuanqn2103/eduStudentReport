import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-2025';

export const teacherAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Thiếu token hoặc sai định dạng' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token không hợp lệ' });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;

    if (payload.role !== 'TEACHER') {
       res.status(403).json({ message: 'Không có quyền truy cập' });
       return;
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token sai hoặc hết hạn' });
    return;
  }
};