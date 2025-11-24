import { Router } from 'express';
import {
  createClassReport,
  updateStudentReport,
  getClassReport
} from '../controllers/report.controller';
import { teacherAuth } from '../middlewares/auth.teacher';

const router = Router();

router.post('/create', teacherAuth, createClassReport);
router.put('/:reportId', teacherAuth, updateStudentReport);
router.get('/class', teacherAuth, getClassReport);

export default router;