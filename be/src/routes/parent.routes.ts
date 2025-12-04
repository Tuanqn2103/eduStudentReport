// src/routes/parent.routes.ts
import { Router } from 'express';
import { parentLogin } from '../controllers/parent.auth.controller';

const router = Router();

// url: /api/parent/...

router.post('/login', parentLogin);

export default router;