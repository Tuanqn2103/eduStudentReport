import { Router } from 'express';
import { loginTeacher, logoutTeacher} from '../controllers/teacher.auth.controller';
import * as teacherFeature from '../controllers/teacher.feature.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', loginTeacher);
router.post('/logout', verifyToken, logoutTeacher);


router.get('/classes', verifyToken, teacherFeature.getMyClasses);

router.get('/classes/:classId/students', verifyToken, teacherFeature.getClassStudents);

router.get('/reports/:studentId', verifyToken, teacherFeature.getStudentReport);

router.post('/reports', verifyToken, teacherFeature.saveReport);

export default router;