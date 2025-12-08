import { Router } from 'express';
import { loginAdmin, createAdmin, logoutAdmin } from '../controllers/admin/auth.controller';
import * as teacherCtrl from '../controllers/admin/teacher.controller';
import * as classCtrl from '../controllers/admin/class.controller';
import * as studentCtrl from '../controllers/admin/student.controller';
import * as dashboardCtrl from '../controllers/admin/dashboard.controller';
import * as subjectController from '../controllers/subject.controller';

import { verifyToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// --- Auth Routes ---
router.post('/login', loginAdmin);
router.post('/register', createAdmin);
router.post('/logout', verifyToken, logoutAdmin);

// --- Teacher Routes ---
router.post('/teachers', verifyToken, requireRole(['superadmin']), teacherCtrl.createTeacher);
router.get('/teachers', verifyToken, requireRole(['superadmin']), teacherCtrl.getTeachers);
router.get('/teachers/:id', verifyToken, requireRole(['superadmin']), teacherCtrl.getTeacherById);
router.put('/teachers/:id', verifyToken, requireRole(['superadmin']), teacherCtrl.updateTeacher);
router.delete('/teachers/:id', verifyToken, requireRole(['superadmin']), teacherCtrl.deleteTeacher);

// --- Class Routes ---
router.post('/classes', verifyToken, requireRole(['superadmin']), classCtrl.createClass);
router.get('/classes', verifyToken, requireRole(['superadmin']), classCtrl.getClasses);
router.get('/classes/:id', verifyToken, requireRole(['superadmin']), classCtrl.getClassById);
router.put('/classes/:id', verifyToken, requireRole(['superadmin']), classCtrl.updateClass);
router.delete('/classes/:id', verifyToken, requireRole(['superadmin']), classCtrl.deleteClass);
router.post('/assign', verifyToken, requireRole(['superadmin']), classCtrl.assignTeacher);

// --- Student Routes ---
router.post('/students', verifyToken, requireRole(['superadmin']), studentCtrl.createStudent);
router.post('/students/import', verifyToken, requireRole(['superadmin']), studentCtrl.importStudents);
router.get('/classes/:classId/students', verifyToken, requireRole(['superadmin']), studentCtrl.getStudentsByClass);
router.get('/students/:id', verifyToken, requireRole(['superadmin']), studentCtrl.getStudentById);
router.put('/students/:id', verifyToken, requireRole(['superadmin']), studentCtrl.updateStudent);
router.delete('/students/:id', verifyToken, requireRole(['superadmin']), studentCtrl.deleteStudent);

// --- Subject Routes ---
router.post('/subjects', verifyToken, requireRole(['superadmin']), subjectController.createSubject);
router.get('/subjects', verifyToken, subjectController.getSubjects);

// --- Dashboard ---
router.get('/stats', verifyToken, requireRole(['superadmin']), dashboardCtrl.getDashboardStats);

export default router;