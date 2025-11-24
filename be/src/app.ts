import express from 'express';
import cors from 'cors';
import adminAuthRoutes from './routes/admin.auth.routes';
import teacherReportRoutes from './routes/teacher.report.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`👉 LOG REQUEST: [${req.method}] ${req.url}`);
  next();
});
app.get('/', (req, res) => {
  res.json({ message: 'Backend API for EduStudentReports is running' });
});

app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/teacher/reports', teacherReportRoutes); 


export default app;