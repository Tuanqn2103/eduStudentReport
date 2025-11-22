import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js';


declare global {
  namespace Express {
    interface Request {
      user: { id: string; phoneNumber: string; role: string };
    }
  }
}

// 1. Tạo bảng điểm mới cho cả lớp
export const createClassReport = async (req: Request, res: Response) => {
  const teacherId = req.user.id;
  const { classId, term } = req.body;

  if (!classId || !term) {
    return res.status(400).json({ message: 'Thiếu thông tin lớp hoặc kỳ học' });
  }

  // Kiểm tra quyền giáo viên
  const classInfo = await prisma.class.findFirst({
    where: {
      id: classId,
      teacherIds: { has: teacherId },
    },
  });

  if (!classInfo) return res.status(403).json({ message: 'Bạn không chủ nhiệm lớp này' });

  // Kiểm tra bảng điểm đã tồn tại chưa
  const existed = await prisma.report.findFirst({
    where: { classId, term },
  });
  
  if (existed) return res.status(400).json({ message: 'Kỳ này đã được tạo rồi' });

  // Lấy danh sách học sinh
  const students = await prisma.student.findMany({
    where: { classId },
    select: { id: true },
  });

  if (students.length === 0) {
    return res.status(400).json({ message: 'Lớp này chưa có học sinh nào' });
  }

  // Tạo report cho từng học sinh
  await prisma.report.createMany({
    data: students.map((student: { id: string }) => ({
      studentId: student.id,
      classId,
      term,
      grades: [],
      generalComment: '',
      createdBy: teacherId,
    })),
  });

  res.json({ message: `Đã tạo bảng điểm cho ${students.length} học sinh` });
};

// 2. Cập nhật điểm cho 1 học sinh
export const updateStudentReport = async (req: Request, res: Response) => {
  const teacherId = req.user.id;
  const { reportId } = req.params;
  const { grades, generalComment } = req.body;

  // FIX LỖI 1: Kiểm tra reportId tồn tại
  if (!reportId) {
    return res.status(400).json({ message: 'Thiếu Report ID' });
  }

  // Tìm báo cáo (Không dùng include class để tránh lỗi property 'class')
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) return res.status(404).json({ message: 'Không tìm thấy bảng điểm' });

  const classInfo = await prisma.class.findUnique({
    where: { id: report.classId },
    select: { teacherIds: true }
  });

  const isOwner = report.createdBy === teacherId;
  const isClassTeacher = classInfo?.teacherIds.includes(teacherId) ?? false;

  if (!isOwner && !isClassTeacher) {
    return res.status(403).json({ message: 'Không có quyền sửa' });
  }

  // Cập nhật
  const updated = await prisma.report.update({
    where: { id: reportId }, // reportId ở đây chắc chắn là string do đã check ở trên
    data: {
      grades: grades ?? report.grades,
      generalComment: generalComment ?? report.generalComment,
    },
    include: {
      student: { select: { fullName: true, studentCode: true } },
    },
  });

  res.json({ message: 'Cập nhật điểm thành công', report: updated });
};

// 3. Xem bảng điểm cả lớp
export const getClassReport = async (req: Request, res: Response) => {
  const teacherId = req.user.id;
  
  // Ép kiểu về string để tránh lỗi type undefined
  const classId = req.query.classId as string;
  const term = req.query.term as string;

  if (!classId || !term) {
    return res.status(400).json({ message: 'Vui lòng chọn lớp và kỳ học' });
  }

  const classInfo = await prisma.class.findFirst({
    where: {
      id: classId,
      teacherIds: { has: teacherId },
    },
  });

  if (!classInfo) return res.status(403).json({ message: 'Không chủ nhiệm lớp này' });

  const reports = await prisma.report.findMany({
    where: { classId, term },
    include: {
      student: { select: { fullName: true, studentCode: true } },
    },
    orderBy: { student: { studentCode: 'asc' } },
  });

  res.json({ term, count: reports.length, reports });
};