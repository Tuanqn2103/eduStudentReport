import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const createSubject = async (data: Prisma.SubjectCreateInput) => {
  return await prisma.subject.create({ data });
};

export const getAllSubjects = async () => {
  return await prisma.subject.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });
};

export const findSubjectByName = async (name: string) => {
  return await prisma.subject.findUnique({ where: { name } });
};

export const toggleSubjectStatus = async (id: string, status: boolean) => {
  return await prisma.subject.update({
    where: { id },
    data: { isActive: status }
  });
};