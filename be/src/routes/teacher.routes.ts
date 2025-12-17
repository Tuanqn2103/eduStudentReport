import { Router } from 'express';
import { loginTeacher, logoutTeacher } from '../controllers/teacher/auth.controller';

import * as classCtrl from '../controllers/teacher/class.controller';
import * as studentCtrl from '../controllers/teacher/student.controller';
import * as reportCtrl from '../controllers/teacher/report.controller';
import * as subjectController from '../controllers/admin/subject.controller';
import * as dashboardController from '../controllers/admin/dashboard.controller';

import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// --- AUTH ---
router.post('/login', loginTeacher);
router.post('/logout', verifyToken, logoutTeacher);

// --- CLASS ---
router.get('/classes', verifyToken, classCtrl.getMyClasses);

// --- STUDENT ---
router.get('/classes/:classId/students', verifyToken, studentCtrl.getClassStudents);

// --- REPORT (ĐIỂM) ---
router.get('/reports/:studentId', verifyToken, reportCtrl.getStudentReport);
router.get('/reports', verifyToken, reportCtrl.getClassReports);
router.delete('/reports/:reportId', verifyToken, reportCtrl.deleteReport);

// Nhập điểm / Lưu điểm
router.post('/reports', verifyToken, reportCtrl.saveReport);


// --- SUBJECT (MÔN HỌC) ---
router.get('/subjects', verifyToken, subjectController.getSubjects);

router.get('/stats', verifyToken, dashboardController.getDashboardStats);


export default router;