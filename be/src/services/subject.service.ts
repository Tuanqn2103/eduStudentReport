import * as subjectRepo from '../repositories/subject.repository';
import { CreateSubjectDto } from '../dtos/subject.dto';
import { Prisma } from '@prisma/client';

export const createSubjectService = async (data: CreateSubjectDto) => {
  const exists = await subjectRepo.findSubjectByName(data.name);
  if (exists) throw new Error('SUBJECT_EXISTED');

  const subjectData: Prisma.SubjectCreateInput = {
    name: data.name,
    code: data.code || null,
    isActive: true
  };

  return await subjectRepo.createSubject(subjectData);
};

export const getAllSubjectsService = async () => {
  return await subjectRepo.getAllSubjects();
};