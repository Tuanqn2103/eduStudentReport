import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import * as adminRepo from '../repositories/admin.repository';
import {
  CreateAdminDto,
  CreateTeacherDto,
  ImportStudentDto, UpdateTeacherDto,
  UpdateClassDto,
  UpdateStudentDto
} from '../dtos/admin.dto';

const generatePin = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- AUTH ---

export const loginAdminService = async (phoneNumber: string, pass: string) => {
  const admin = await adminRepo.findAdminByPhone(phoneNumber);
  if (!admin) throw new Error('ADMIN_NOT_FOUND');

  const isMatch = await bcrypt.compare(pass, admin.password);
  if (!isMatch) throw new Error('WRONG_PASSWORD');

  const token = jwt.sign(
    { id: admin.id, role: 'superadmin', fullName: admin.fullName },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );
  return { token, admin };
};

export const createAdminService = async (data: CreateAdminDto) => {
  const exists = await adminRepo.findAdminByPhone(data.phoneNumber);
  if (exists) throw new Error('PHONE_EXISTED');

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const adminData: Prisma.AdminCreateInput = {
    phoneNumber: data.phoneNumber,
    password: hashedPassword,
    fullName: data.fullName,
    isAdmin: true
  };

  return await adminRepo.createAdmin(adminData);
};

// --- TEACHER ---

export const createTeacherService = async (data: CreateTeacherDto) => {
  const exists = await adminRepo.findTeacherByPhone(data.phoneNumber);
  if (exists) throw new Error('PHONE_EXISTED');

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const teacherData: Prisma.TeacherCreateInput = {
    fullName: data.fullName,
    phoneNumber: data.phoneNumber,
    password: hashedPassword,
    isActive: true,
    managedClassIds: []
  };

  return await adminRepo.createTeacher(teacherData);
};

export const getAllTeachersService = async () => {
  return await adminRepo.getAllTeachers();
};
export const getTeacherByPhoneService = async (phoneNumber: string) => {
  return await adminRepo.findTeacherByPhone(phoneNumber);
};
export const getTeacherByIdService = async (id: string) => {
  const teacher = await adminRepo.findTeacherById(id);
  if (!teacher) throw new Error('NOT_FOUND');
  return teacher;
};

export const updateTeacherService = async (id: string, data: UpdateTeacherDto) => {
  const teacher = await adminRepo.findTeacherById(id);
  if (!teacher) throw new Error('NOT_FOUND');

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return await adminRepo.updateTeacher(id, data);
};

export const deleteTeacherService = async (id: string) => {
  const teacher = await adminRepo.findTeacherById(id);
  if (!teacher) throw new Error('NOT_FOUND');
  return await adminRepo.deleteTeacher(id);
};

// --- CLASS ---

export const createClassService = async (className: string, schoolYear: string, teacherId?: string) => {
  const exists = await adminRepo.findClassByNameAndYear(className, schoolYear);
  if (exists) throw new Error('CLASS_EXISTED');

  if (teacherId) {
    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
    if (!teacher) throw new Error('TEACHER_NOT_FOUND');
  }

  const classData: Prisma.ClassCreateInput = {
    className,
    schoolYear,
    teacherIds: teacherId ? [teacherId] : []
  };

  const newClass = await adminRepo.createClass(classData);

  if (teacherId) {
    await adminRepo.updateTeacherClasses(teacherId, newClass.id);
  }

  return newClass;
};

export const getAllClassesService = async () => {
  return await adminRepo.getAllClasses();
};

export const findClassesByNameService = async (className: string) => {
  return await adminRepo.findClassesByName(className);
};

export const getClassByIdService = async (id: string) => {
  const classInfo = await adminRepo.findClassById(id);
  if (!classInfo) throw new Error('NOT_FOUND');
  return classInfo;
};

export const updateClassService = async (id: string, data: UpdateClassDto) => {
  const classInfo = await adminRepo.findClassById(id);
  if (!classInfo) throw new Error('NOT_FOUND');

  const oldTeacherId = classInfo.teacherIds[0] ?? null;
  const newTeacherId = data.teacherId ?? null;

  await adminRepo.updateClass(id, {
    className: data.className,
    schoolYear: data.schoolYear,
    isActive: data.isActive
  });

  if (!newTeacherId && oldTeacherId) {
    await adminRepo.removeClassFromTeacher(oldTeacherId, id);
    await adminRepo.updateClassTeachers(id, '');
    return { success: true };
  }

  if (newTeacherId && newTeacherId !== oldTeacherId) {
    await assignTeacherToClassService(newTeacherId, id);
  }

  return { success: true };
};


export const deleteClassService = async (id: string) => {
  const classInfo = await adminRepo.findClassById(id);
  if (!classInfo) throw new Error('NOT_FOUND');
  return await adminRepo.deleteClass(id);
};

export const assignTeacherToClassService = async (teacherId: string, classId: string) => {
  const currentClass = await adminRepo.findClassById(classId);
  if (!currentClass) throw new Error('CLASS_NOT_FOUND');
  const oldTeacherId = currentClass.teacherIds[0];
  if (oldTeacherId && oldTeacherId !== teacherId) {
    await adminRepo.removeClassFromTeacher(oldTeacherId, classId);
  }
  await adminRepo.updateTeacherClasses(teacherId, classId);
  await adminRepo.updateClassTeachers(classId, teacherId);
  return { success: true };
};

// --- STUDENT ---

export const importStudentsService = async (classId: string, studentsRawData: ImportStudentDto[]) => {
  const classInfo = await adminRepo.findClassById(classId);
  if (!classInfo) throw new Error('CLASS_NOT_FOUND');

  const currentCount = await adminRepo.countStudentsInClass(classId);
  let serialNumber = currentCount + 1;

  const processedData: Prisma.StudentCreateInput[] = [];
  const exportData = [];

  for (const student of studentsRawData) {
    const rawPin = generatePin();
    const hashedPin = await bcrypt.hash(rawPin, 10);

    let finalStudentCode = student.studentCode;

    if (!finalStudentCode) {
      const suffix = String(serialNumber).padStart(3, '0');
      finalStudentCode = `HS${classInfo.className}${suffix}`;
      serialNumber++;
    }

    const studentInput: Prisma.StudentCreateInput = {
      fullName: student.fullName,
      studentCode: finalStudentCode,
      parentPhones: student.parentPhones || [],
      parentPin: hashedPin,
      gender: student.gender || null,
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth) : null,
      class: { connect: { id: classId } }
    };

    processedData.push(studentInput);
    exportData.push({
      fullName: student.fullName,
      studentCode: finalStudentCode,
      pin: rawPin
    });
  }

  await adminRepo.createManyStudents(processedData);
  return exportData;
};

export const createSingleStudentService = async (data: ImportStudentDto & { classId: string }) => {
  const classInfo = await adminRepo.findClassById(data.classId);
  if (!classInfo) throw new Error('CLASS_NOT_FOUND');

  const rawPin = generatePin();
  const hashedPin = await bcrypt.hash(rawPin, 10);

  const currentCount = await adminRepo.countStudentsInClass(data.classId);
  const suffix = String(currentCount + 1).padStart(3, '0');
  const studentCode = `HS${classInfo.className}${suffix}`;

  const studentData: Prisma.StudentCreateInput = {
    fullName: data.fullName,
    studentCode,
    parentPhones: data.parentPhones || [],
    parentPin: hashedPin,
    gender: data.gender,
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
    class: { connect: { id: data.classId } }
  };

  const newStudent = await adminRepo.createStudent(studentData);
  return { ...newStudent, pin: rawPin };
};

export const getStudentsByClassService = async (classId: string) => {
  return await adminRepo.getStudentsByClassId(classId);
};

export const getStudentByIdService = async (id: string) => {
  const student = await adminRepo.findStudentById(id);
  if (!student) throw new Error('NOT_FOUND');
  return student;
};

export const updateStudentService = async (id: string, data: UpdateStudentDto) => {
  const student = await adminRepo.findStudentById(id);
  if (!student) throw new Error('NOT_FOUND');
  return await adminRepo.updateStudent(id, data);
};

export const deleteStudentService = async (id: string) => {
  const student = await adminRepo.findStudentById(id);
  if (!student) throw new Error('NOT_FOUND');
  return await adminRepo.deleteStudent(id);
};

export const resetStudentPinService = async (studentId: string) => {
  const student = await adminRepo.findStudentById(studentId);
  if (!student) throw new Error('NOT_FOUND');

  const newPin = generatePin();
  const hashedPin = await bcrypt.hash(newPin, 10);

  await adminRepo.updateStudent(studentId, { parentPin: hashedPin });

  return {
    newPin,
    studentName: student.fullName
  };
};

export const getDashboardStatsService = async () => {
  return await adminRepo.getSystemStats();
};