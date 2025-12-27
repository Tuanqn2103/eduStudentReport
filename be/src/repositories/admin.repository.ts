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
  const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
  if (!teacher) return;
  const current = Array.isArray(teacher.managedClassIds) ? teacher.managedClassIds : [];
  const newClassIds = Array.from(new Set([...current, classId]));
  return await prisma.teacher.update({
    where: { id: teacherId },
    data: { managedClassIds: { set: newClassIds } }
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

export const updateClassTeachers = async (classId: string, teacherId?: string) => {
  return await prisma.class.update({
    where: { id: classId },
    data: {
      teacherIds: teacherId ? { set: [teacherId] } : { set: [] }
    }
  });
};

export const removeClassFromTeacher = async (teacherId: string, classId: string) => {
  const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
  if (!teacher) return;

  const newClassIds = (teacher.managedClassIds || []).filter((id) => id !== classId);

  return await prisma.teacher.update({
    where: { id: teacherId },
    data: { managedClassIds: { set: newClassIds } }
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
    orderBy: { studentCode: 'asc' }
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

export const findRecentTeachers = async (limit: number = 5) => {
  return await prisma.teacher.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      phoneNumber: true,
      managedClassIds: true,
      createdAt: true
    }
  });
};

export const countEntitiesByDateRange = async (
  model: 'student' | 'teacher', 
  startDate: Date, 
  endDate: Date
) => {
  const whereClause = {
    createdAt: {
      gte: startDate,
      lt: endDate
    }
  };

  if (model === 'teacher') {
    return await prisma.teacher.count({ where: whereClause });
  }

  return await prisma.student.count({ where: whereClause });
};