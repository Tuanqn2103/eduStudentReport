import { Router } from 'express';
import { parentLogin } from '../controllers/parent/auth.controller';
import { logoutParent } from '../controllers/parent/auth.controller';
import * as parentFeature from '../controllers/parent/feature.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', parentLogin);
router.post('/logout', verifyToken, logoutParent);

router.get('/children', verifyToken, parentFeature.getMyChildren);
router.get('/children/:studentId/reports', verifyToken, parentFeature.getChildReports);
router.get('/reports/:id', verifyToken, parentFeature.getReportDetail);

export default router;