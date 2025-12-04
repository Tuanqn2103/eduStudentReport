import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as studentRepo from '../repositories/student.repository'; // Gọi Repository

export const loginParentService = async (phoneNumber: string, pin: string) => {
  const students = await studentRepo.findStudentsByParentPhone(phoneNumber);

  if (students.length === 0) {
    throw new Error('PHONE_NOT_FOUND');
  }

  let matchedStudent = null;
  for (const student of students) {
    if (student.parentPin) {
      const isMatch = await bcrypt.compare(pin, student.parentPin);
      if (isMatch) {
        matchedStudent = student;
        break;
      }
    }
  }

  if (!matchedStudent) {
    throw new Error('WRONG_PIN');
  }

  const token = jwt.sign(
    {
      id: matchedStudent.id,
      role: 'parent',
      parentId: phoneNumber,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '30d' }
  );

  return {
    token,
    student: matchedStudent
  };
};