import bcrypt from 'bcryptjs';
import * as studentRepo from '../repositories/student.repository';

const generatePin = () => Math.floor(100000 + Math.random() * 900000).toString();

export const resetStudentPinService = async (studentId: string) => {
  const student = await studentRepo.findStudentById(studentId);
  if (!student) throw new Error('STUDENT_NOT_FOUND');

  const newPin = generatePin();
  const hashedPin = await bcrypt.hash(newPin, 10);

  await studentRepo.updateStudentPin(studentId, hashedPin);

  return { 
    newPin,
    studentName: student.fullName 
  };
};