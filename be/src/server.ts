import app from "./app";
import connectDB from "./config/database";
import dotenv from "dotenv";
import {
  createClassReport,
  updateStudentReport,
  getClassReport
} from './controllers/report.controller';
import { teacherAuth } from './middlewares/auth.teacher';

dotenv.config();

const PORT = process.env.PORT || 3001;

connectDB();

app.post('/api/teacher/reports/create', teacherAuth, createClassReport);
app.put('/api/teacher/reports/:reportId', teacherAuth, updateStudentReport);
app.get('/api/teacher/reports/class', teacherAuth, getClassReport);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});