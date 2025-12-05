// DTO cho việc tạo Admin/SuperAdmin
export interface CreateAdminDto {
  phoneNumber: string;
  password:    string;
  fullName:    string;
}

// DTO cho việc tạo Giáo viên
export interface CreateTeacherDto {
  fullName:    string;
  phoneNumber: string;
  password:    string;
}

// DTO cho việc Import học sinh
export interface ImportStudentDto {
  fullName:      string;
  studentCode?:  string;
  parentPhones?: string[];
  gender?:       string;
  dateOfBirth?:  string | Date;
}