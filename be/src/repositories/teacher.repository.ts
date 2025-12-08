import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const findTeacherByPhone = async (phoneNumber: string) => {
  return await prisma.teacher.findUnique({
    where: { phoneNumber }
  });
};

export const findClassesByTeacherId = async (teacherId: string) => {
  return await prisma.class.findMany({
    where: {
      teacherIds: { has: teacherId },
      isActive: true
    },
    select: {
      id: true,
      className: true,
      schoolYear: true
    }
  });
};

export const findStudentsInClassWithReport = async (classId: string, term: string) => {
  return await prisma.student.findMany({
    where: { classId },
    include: {
      reports: {
        where: { term: term },
        select: {
          id: true,
          isViewed: true,
          isPublished: true,
          generalComment: true
        }
      }
    },
    orderBy: { fullName: 'asc' }
  });
};

export const findReportByStudentAndTerm = async (studentId: string, term: string) => {
  return await prisma.report.findFirst({
    where: { studentId, term }
  });
};
export const findReportsByClassAndTerm = async (classId: string, term: string) => {
  return await prisma.report.findMany({
    where: { classId, term },
    include: {
      student: {
        select: { id: true, fullName: true, studentCode: true }
      }
    },
    orderBy: { student: { fullName: 'asc' } }
  });
};
export const upsertReport = async (data: Prisma.ReportCreateInput, reportId?: string) => {
  if (reportId) {
    return await prisma.report.update({
      where: { id: reportId },
      data: {
        grades: data.grades,
        generalComment: data.generalComment,
        isPublished: data.isPublished,
        updatedAt: new Date()
      }
    });
  } else {
    return await prisma.report.create({ data });
  }
};