import { prisma } from '../lib/prisma';

export const findChildrenByParentPhone = async (phoneNumber: string) => {
  return await prisma.student.findMany({
    where: {
      parentPhones: { has: phoneNumber }
    },
    include: {
      class: {
        select: {
          id: true,
          className: true,
          schoolYear: true,
          teacherIds: true
        }
      }
    }
  });
};

export const findTeachersByIds = async (ids: string[]) => {
  return await prisma.teacher.findMany({
    where: { id: { in: ids } },
    select: { fullName: true, phoneNumber: true }
  });
};

export const findPublishedReports = async (studentId: string) => {
  return await prisma.report.findMany({
    where: {
      studentId,
      isPublished: true
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      term: true,
      isViewed: true,
      createdAt: true
    }
  });
};

export const findReportDetail = async (reportId: string) => {
  return await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      class: { select: { className: true, schoolYear: true } },
      student: { select: { fullName: true, studentCode: true } }
    }
  });
};

export const markReportAsViewed = async (reportId: string) => {
  return await prisma.report.update({
    where: { id: reportId },
    data: { isViewed: true }
  });
};