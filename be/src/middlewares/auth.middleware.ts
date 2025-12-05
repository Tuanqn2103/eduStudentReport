import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}

// 1. Middleware Xác thực
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Bạn chưa đăng nhập (Thiếu Token)' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    req.user = decoded;
    return next();

  } catch (error) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// 2. Middleware Phân quyền
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
    }
    return next();
  };
};