import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./config/database";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
connectDB();
app.get('/', (req, res) => {
  res.json({ message: 'Backend API for EduStudentReports' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
