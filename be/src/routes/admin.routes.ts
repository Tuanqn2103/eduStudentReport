import { Router } from 'express';
import { loginAdmin, createAdmin } from '../controllers/admin.auth.controller';

const router = Router();

// url: /api/admin/...
router.post('/login', loginAdmin);
router.post('/register', createAdmin);

export default router;