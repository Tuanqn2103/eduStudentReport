import { prisma } from '../lib/prisma';

export const findStudentById = async (id: string) => {
  return await prisma.student.findUnique({
    where: { id }
  });
};

export const updateStudentPin = async (id: string, hashedPin: string) => {
  return await prisma.student.update({
    where: { id },
    data: { parentPin: hashedPin }
  });
};

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