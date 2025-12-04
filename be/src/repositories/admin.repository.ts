import { prisma } from '../lib/prisma';

export const findAdminByPhone = async (phoneNumber: string) => {
  return await prisma.admin.findUnique({
    where: { phoneNumber }
  });
};

export const createAdmin = async (data: any) => {
  return await prisma.admin.create({
    data
  });
};