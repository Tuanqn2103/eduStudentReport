import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import * as teacherRepo from '../repositories/teacher.repository';
import { LoginTeacherDto, UpsertReportDto } from '../dtos/teacher.dto';

export const loginTeacherService = async (data: LoginTeacherDto) => {
  const teacher = await teacherRepo.findTeacherByPhone(data.phoneNumber);

  if (!teacher) throw new Error('TEACHER_NOT_FOUND');
  if (!teacher.isActive) throw new Error('ACCOUNT_LOCKED');

  const isMatch = await bcrypt.compare(data.password, teacher.password);
  if (!isMatch) throw new Error('WRONG_PASSWORD');

  const currentClassIds = teacher.managedClassIds;

  const validClasses = await prisma.class.findMany({
    where: { id: { in: currentClassIds } },
    select: { id: true }
  });

  const validClassIds = validClasses.map(c => c.id);

  if (validClassIds.length !== currentClassIds.length) {
    await prisma.teacher.update({
      where: { id: teacher.id },
      data: { managedClassIds: validClassIds }
    });
    teacher.managedClassIds = validClassIds;
  }

  const token = jwt.sign(
    { 
      id: teacher.id, 
      role: 'admin', 
      managedClasses: teacher.managedClassIds 
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );

  return { token, teacher };
};

export const getMyClassesService = async (teacherId: string) => {
  return await teacherRepo.findClassesByTeacherId(teacherId);
};

export const getClassStudentsService = async (teacherId: string, classId: string, term: string) => {
  const classes = await teacherRepo.findClassesByTeacherId(teacherId);
  const isManaged = classes.some(c => c.id === classId);
  
  if (!isManaged) throw new Error('FORBIDDEN_CLASS');

  const students = await teacherRepo.findStudentsInClassWithReport(classId, term);
  
  return students.map(s => {
    const report = s.reports[0]; 
    return {
      id: s.id,
      studentCode: s.studentCode,
      fullName: s.fullName,
      reportStatus: report ? (report.isPublished ? 'Đã công bố' : 'Lưu nháp') : 'Chưa nhập',
      isParentViewed: report ? report.isViewed : false
    };
  });
};

export const getStudentGradeService = async (studentId: string, term: string) => {
  return await teacherRepo.findReportByStudentAndTerm(studentId, term);
};

export const inputGradeService = async (teacherId: string, data: UpsertReportDto) => {
  const existingReport = await teacherRepo.findReportByStudentAndTerm(data.studentId, data.term);

  const reportData: Prisma.ReportCreateInput = {
    term: data.term,
    generalComment: data.generalComment,
    isPublished: data.isPublished || false,
    grades: data.grades,
    createdBy: teacherId,
    student: { connect: { id: data.studentId } },
    class: { connect: { id: data.classId } }
  };

  return await teacherRepo.upsertReport(reportData, existingReport?.id);
};