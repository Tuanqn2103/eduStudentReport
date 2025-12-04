// src/repositories/student.repository.ts
import { prisma } from '../lib/prisma';

// Hàm 1: Tìm học sinh theo ID
export const findStudentById = async (id: string) => {
  return await prisma.student.findUnique({
    where: { id }
  });
};

// Hàm 2: Cập nhật PIN
export const updateStudentPin = async (id: string, hashedPin: string) => {
  return await prisma.student.update({
    where: { id },
    data: { parentPin: hashedPin } // Nhớ là parentPin (số ít) nhé
  });
};

// Hàm 3: Tìm học sinh theo SĐT phụ huynh (Dùng cho Parent Login)
export const findStudentsByParentPhone = async (phoneNumber: string) => {
  return await prisma.student.findMany({
    where: {
      parentPhones: { has: phoneNumber },
    },
    include: {
      class: { select: { className: true, schoolYear: true } }
    }
  });
};