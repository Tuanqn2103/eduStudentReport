export interface TeacherInfoDto {
  fullName: string;
  phoneNumber: string;
}

export interface ChildResponseDto {
  id: string;
  fullName: string;
  studentCode: string;
  className: string | null;
  schoolYear: string | null;
  homeroomTeachers: TeacherInfoDto[];
}

export interface ReportSummaryDto {
  id: string;
  term: string;
  isViewed: boolean;
  createdAt: Date;
}