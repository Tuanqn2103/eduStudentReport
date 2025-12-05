import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const findAdminByPhone = async (phoneNumber: string) => {
  return await prisma.admin.findUnique({ where: { phoneNumber } });
};

export const createAdmin = async (data: Prisma.AdminCreateInput) => {
  return await prisma.admin.create({ data });
};

export const findTeacherByPhone = async (phoneNumber: string) => {
  return await prisma.teacher.findUnique({ where: { phoneNumber } });
};

export const createTeacher = async (data: Prisma.TeacherCreateInput) => {
  return await prisma.teacher.create({ data });
};

export const updateTeacherClasses = async (teacherId: string, classId: string) => {
  return await prisma.teacher.update({
    where: { id: teacherId },
    data: { managedClassIds: { push: classId } }
  });
};

export const findClassByNameAndYear = async (className: string, schoolYear: string) => {
  return await prisma.class.findUnique({
    where: { className_schoolYear: { className, schoolYear } }
  });
};

export const createClass = async (data: Prisma.ClassCreateInput) => {
  return await prisma.class.create({ data });
};

export const getAllClasses = async () => {
  return await prisma.class.findMany({
    include: { _count: { select: { students: true } } }
  });
};

export const updateClassTeachers = async (classId: string, teacherId: string) => {
  return await prisma.class.update({
    where: { id: classId },
    data: { teacherIds: { push: teacherId } }
  });
};

export const createManyStudents = async (studentsData: Prisma.StudentCreateInput[]) => {
  return await prisma.$transaction(
    studentsData.map((student) => prisma.student.create({ data: student }))
  );
};

export const getSystemStats = async () => {
  const [teacherCount, studentCount, classCount] = await Promise.all([
    prisma.teacher.count(),
    prisma.student.count(),
    prisma.class.count(),
  ]);
  return { teacherCount, studentCount, classCount };
};

export const findClassById = async (id: string) => {
  return await prisma.class.findUnique({ where: { id } });
};

export const countStudentsInClass = async (classId: string) => {
  return await prisma.student.count({
    where: { classId }
  });
};