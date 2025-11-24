// src/routes/admin.auth.routes.ts
import { Router } from 'express';
import { sendOtp, verifyOtp } from '../controllers/admin.auth.controller';

const router = Router();

// POST /api/admin/auth/login -> Gửi OTP
router.post('/login', sendOtp);

// POST /api/admin/auth/verify -> Nhập OTP để lấy Token
router.post('/verify', verifyOtp);

export default router;