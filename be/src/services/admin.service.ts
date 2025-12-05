import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import * as adminRepo from '../repositories/admin.repository';
import { 
  CreateAdminDto, 
  CreateTeacherDto, 
  ImportStudentDto 
} from '../dtos/admin.dto';

const generatePin = () => Math.floor(100000 + Math.random() * 900000).toString();

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

export const assignTeacherToClassService = async (teacherId: string, classId: string) => {
  await adminRepo.updateTeacherClasses(teacherId, classId);
  await adminRepo.updateClassTeachers(classId, teacherId);
  return { success: true };
};

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
      class: {
        connect: { id: classId }
      }
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

export const getDashboardStatsService = async () => {
  return await adminRepo.getSystemStats();
};