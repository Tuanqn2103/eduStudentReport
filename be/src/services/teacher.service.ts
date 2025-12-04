import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as teacherRepo from '../repositories/teacher.repository';

export const loginTeacherService = async (phoneNumber: string, pass: string) => {
  const teacher = await teacherRepo.findTeacherByPhone(phoneNumber);

  if (!teacher) throw new Error('TEACHER_NOT_FOUND');
  if (!teacher.isActive) throw new Error('ACCOUNT_LOCKED');

  const isMatch = await bcrypt.compare(pass, teacher.password);
  if (!isMatch) throw new Error('WRONG_PASSWORD');

  const token = jwt.sign(
    { 
      id: teacher.id, 
      role: 'admin', // Role admin lớp
      managedClasses: teacher.managedClassIds 
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );

  return { token, teacher };
};