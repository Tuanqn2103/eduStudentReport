export interface LoginTeacherDto {
  phoneNumber: string;
  password:    string;
}

export interface GradeInput {
  subject: string;
  score:   number;
  comment?: string;
}

export interface UpsertReportDto {
  studentId:       string;
  classId:         string;
  term:            string;
  grades:          GradeInput[];
  generalComment?: string;
  isPublished?:    boolean;
}