import { prisma } from '../lib/prisma';

export const findTeacherByPhone = async (phoneNumber: string) => {
  return await prisma.teacher.findUnique({
    where: { phoneNumber }
  });
};