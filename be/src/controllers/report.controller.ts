import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js';



// 1. Tạo bảng điểm mới cho cả lớp
export const createClassReport = async (req: Request, res: Response): Promise<void> => {
  const teacherId = req.user.id;
  const { classId, term } = req.body;

  if (!classId || !term) {
    res.status(400).json({ message: 'Thiếu thông tin lớp hoặc kỳ học' });
    return;
  }

  const classInfo = await prisma.class.findFirst({
    where: {
      id: classId,
      teacherIds: { has: teacherId },
    },
  });

  if (!classInfo) {
    res.status(403).json({ message: 'Bạn không chủ nhiệm lớp này' });
    return;
  }

  const existed = await prisma.report.findFirst({
    where: { classId, term },
  });

  if (existed) {
    res.status(400).json({ message: 'Kỳ này đã được tạo rồi' });
    return;
  }

  const students = await prisma.student.findMany({
    where: { classId },
    select: { id: true },
  });

  if (students.length === 0) {
    res.status(400).json({ message: 'Lớp này chưa có học sinh nào' });
    return;
  }

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
export const updateStudentReport = async (req: Request, res: Response): Promise<void> => {
  const teacherId = req.user.id;
  const { reportId } = req.params;
  const { grades, generalComment } = req.body;

  if (!reportId) {
    res.status(400).json({ message: 'Thiếu Report ID' });
    return;
  }

  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    res.status(404).json({ message: 'Không tìm thấy bảng điểm' });
    return;
  }

  const classInfo = await prisma.class.findUnique({
    where: { id: report.classId },
    select: { teacherIds: true }
  });

  const isOwner = report.createdBy === teacherId;
  const isClassTeacher = classInfo?.teacherIds.includes(teacherId) ?? false;

  if (!isOwner && !isClassTeacher) {
    res.status(403).json({ message: 'Không có quyền sửa' });
    return;
  }

  const updated = await prisma.report.update({
    where: { id: reportId },
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
export const getClassReport = async (req: Request, res: Response): Promise<void> => {
  const teacherId = req.user.id;
  const classId = req.query.classId as string;
  const term = req.query.term as string;

  if (!classId || !term) {
    res.status(400).json({ message: 'Vui lòng chọn lớp và kỳ học' });
    return;
  }

  const classInfo = await prisma.class.findFirst({
    where: {
      id: classId,
      teacherIds: { has: teacherId },
    },
  });

  if (!classInfo) {
    res.status(403).json({ message: 'Không chủ nhiệm lớp này' });
    return;
  }

  const reports = await prisma.report.findMany({
    where: { classId, term },
    include: {
      student: { select: { fullName: true, studentCode: true } },
    },
    orderBy: { student: { studentCode: 'asc' } },
  });

  res.json({ term, count: reports.length, reports });
};