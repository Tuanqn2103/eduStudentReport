import { Router } from 'express';
import { loginAdmin, createAdmin, logoutAdmin } from '../controllers/admin.auth.controller';
import * as adminFeature from '../controllers/admin.feature.controller';
import * as subjectController from '../controllers/subject.controller';

import { verifyToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', loginAdmin);
router.post('/register', createAdmin);
router.post('/logout', verifyToken, logoutAdmin);

// Quản lý Giáo viên
router.post('/teachers', adminFeature.createTeacherAccount);
// Quản lý Lớp học
router.get('/classes', adminFeature.getAllClassesList);
router.post('/classes', adminFeature.createClass);
// Phân công GV - Lớp
router.post('/assign', adminFeature.assignTeacher);
// Import Học sinh
router.post('/students/import', adminFeature.importStudents);
// Dashboard
router.get('/stats', adminFeature.getDashboardStats);
// Subject
router.post('/subjects', subjectController.createSubject);
router.get('/subjects', subjectController.getSubjects);
export default router;