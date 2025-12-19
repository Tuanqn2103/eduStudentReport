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

export const getClassReportsService = async (teacherId: string, classId: string, term: string) => {
  const classes = await teacherRepo.findClassesByTeacherId(teacherId);
  const isManaged = classes.some(c => c.id === classId);
  if (!isManaged) throw new Error('FORBIDDEN_CLASS');

  const reports = await teacherRepo.findReportsByClassAndTerm(classId, term);
  return reports;
};

export const getStudentGradeService = async (studentId: string, term: string) => {
  const report = await teacherRepo.findReportByStudentAndTerm(studentId, term);
  if (report) {
    return report;
  }
  const student = await teacherRepo.findStudentById(studentId);
  if (!student) {
    return null;
  }
  return {
    studentId: student.id,
    term: term,
    grades: [],
    generalComment: "",
    isPublished: false,
    student: {
      fullName: student.fullName,
      studentCode: student.studentCode
    }
  };
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

export const getDashboardStatsService = async (teacherId: string) => {
  const [classCount, studentCount] = await Promise.all([
    teacherRepo.countClassesByTeacher(teacherId),
    teacherRepo.countStudentsByTeacher(teacherId)
  ]);

  return {
    classCount,
    studentCount
  };
};
export const deleteReportService = async (teacherId: string, reportId: string) => {
  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report) throw new Error('NOT_FOUND');
  
  if (report.createdBy !== teacherId) {
    throw new Error('FORBIDDEN');
  }

  return await teacherRepo.deleteReport(reportId);
};

export const getStudentDetailService = async (teacherId: string, studentId: string) => {
  const hasAccess = await teacherRepo.isStudentInTeacherClass(studentId, teacherId);
  if (!hasAccess) throw new Error('FORBIDDEN_STUDENT');
  return await teacherRepo.findStudentById(studentId);
};

export const updateStudentService = async (teacherId: string, studentId: string, data: any) => {
  const hasAccess = await teacherRepo.isStudentInTeacherClass(studentId, teacherId);
  if (!hasAccess) throw new Error('FORBIDDEN_STUDENT');
  const updateData: Prisma.StudentUpdateInput = {
    parentPhones: data.parentPhones,
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
    gender: data.gender
  };
  return await teacherRepo.updateStudent(studentId, updateData);
};