import * as parentRepo from '../repositories/parent.repository';
import { ChildResponseDto, TeacherInfoDto, ReportSummaryDto } from '../dtos/parent.dto';

export const getMyChildrenService = async (phoneNumber: string): Promise<ChildResponseDto[]> => {
  const students = await parentRepo.findChildrenByParentPhone(phoneNumber);
  
  const result = await Promise.all(students.map(async (student) => {
    let teachers: TeacherInfoDto[] = [];
    
    if (student.class && student.class.teacherIds.length > 0) {
      teachers = await parentRepo.findTeachersByIds(student.class.teacherIds);
    }

    return {
      id: student.id,
      fullName: student.fullName,
      studentCode: student.studentCode,
      className: student.class?.className || null,
      schoolYear: student.class?.schoolYear || null,
      homeroomTeachers: teachers
    };
  }));

  return result;
};

export const getStudentReportsService = async (studentId: string, parentPhone: string): Promise<ReportSummaryDto[]> => {
  const children = await parentRepo.findChildrenByParentPhone(parentPhone);
  const isMyChild = children.some(c => c.id === studentId);
  
  if (!isMyChild) throw new Error('FORBIDDEN_CHILD');

  return await parentRepo.findPublishedReports(studentId);
};

export const getReportDetailService = async (reportId: string) => {
  const report = await parentRepo.findReportDetail(reportId);
  
  if (!report) throw new Error('NOT_FOUND');
  if (!report.isPublished) throw new Error('NOT_PUBLISHED');

  if (!report.isViewed) {
    await parentRepo.markReportAsViewed(reportId);
    return { ...report, isViewed: true };
  }

  return report;
};