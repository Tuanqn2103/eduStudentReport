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

export const getAllTeachers = async () => {
  return await prisma.teacher.findMany({ orderBy: { createdAt: 'desc' } });
};

export const findTeacherById = async (id: string) => {
  const teacher = await prisma.teacher.findUnique({ where: { id } });
  
  if (!teacher) return null;
  const classes = await prisma.class.findMany({
    where: {
      id: { in: teacher.managedClassIds }
    },
    select: { id: true, className: true, schoolYear: true }
  });
  return { ...teacher, managedClasses: classes };
};

export const updateTeacher = async (id: string, data: Prisma.TeacherUpdateInput) => {
  return await prisma.teacher.update({ where: { id }, data });
};

export const deleteTeacher = async (id: string) => {
  return await prisma.teacher.delete({ where: { id } });
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
    include: { _count: { select: { students: true } } },
  });
};

export const findClassesByName = async (className: string) => {
  return await prisma.class.findMany({
    where: { 
      className: { contains: className, mode: 'insensitive' }
    },
    include: { _count: { select: { students: true } } },
    orderBy: { schoolYear: 'desc' }
  });
};

export const findClassById = async (id: string) => {
  return await prisma.class.findUnique({
    where: { id },
    include: {
      _count: { select: { students: true } },
      students: {
        orderBy: { fullName: 'asc' }
      }
    }
  });
};

export const updateClassTeachers = async (classId: string, teacherId: string) => {
  return await prisma.class.update({
    where: { id: classId },
    data: { teacherIds: { push: teacherId } }
  });
};

export const updateClass = async (id: string, data: Prisma.ClassUpdateInput) => {
  return await prisma.class.update({ where: { id }, data });
};

export const deleteClass = async (id: string) => {
  return await prisma.class.delete({ where: { id } });
};

export const createManyStudents = async (studentsData: Prisma.StudentCreateInput[]) => {
  return await prisma.$transaction(
    studentsData.map((student) => prisma.student.create({ data: student }))
  );
};

export const createStudent = async (data: Prisma.StudentCreateInput) => {
  return await prisma.student.create({ data });
};

export const getStudentsByClassId = async (classId: string) => {
  return await prisma.student.findMany({
    where: { classId: classId },
    orderBy: { fullName: 'asc' }
  });
};

export const findStudentById = async (id: string) => {
  return await prisma.student.findUnique({ where: { id } });
};

export const updateStudent = async (id: string, data: Prisma.StudentUpdateInput) => {
  return await prisma.student.update({ where: { id }, data });
};

export const deleteStudent = async (id: string) => {
  return await prisma.student.delete({ where: { id } });
};

export const countStudentsInClass = async (classId: string) => {
  return await prisma.student.count({ where: { classId } });
};

export const getSystemStats = async () => {
  const [teacherCount, studentCount, classCount] = await Promise.all([
    prisma.teacher.count(),
    prisma.student.count(),
    prisma.class.count(),
  ]);
  return { teacherCount, studentCount, classCount };
};