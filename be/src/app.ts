import express from 'express';
import cors from 'cors';
import adminRoutes from './routes/admin.routes';
import teacherRoutes from './routes/teacher.routes';
import parentRoutes from './routes/parent.routes';
const app = express();

// 1. Middlewares
app.use(cors());
app.use(express.json());

// Logger đơn giản (để debug)
app.use((req, res, next) => {
  console.log(`👉 LOG REQUEST: [${req.method}] ${req.url}`);
  next();
});

// 2. Routes
// Gom tất cả vào prefix /api
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/parent', parentRoutes);

// Route mặc định kiểm tra server sống hay chết
app.get('/', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Backend API for EduStudentReports is running' 
  });
});

// 3. Error Handling Middleware (Nên có)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Something went wrong!' });
});

export default app;