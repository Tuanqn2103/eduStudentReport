// --- ADMIN ---
export interface CreateAdminDto {
  phoneNumber: string;
  password:    string;
  fullName:    string;
}

// --- TEACHER ---
export interface CreateTeacherDto {
  fullName:    string;
  phoneNumber: string;
  password:    string;
}

export interface UpdateTeacherDto {
  fullName?:    string;
  phoneNumber?: string;
  password?:    string;
  isActive?:    boolean;
  // managedClassIds thường được update qua hàm assign, nhưng có thể cho phép sửa ở đây nếu muốn
}

// --- CLASS ---
export interface CreateClassDto {
  className:  string;
  schoolYear: string;
  teacherId?: string; // Optional
}

export interface UpdateClassDto {
  className?:  string;
  schoolYear?: string;
  isActive?:   boolean;
}

export interface AssignTeacherDto {
  teacherId: string;
  classId:   string;
}

// --- STUDENT ---
export interface ImportStudentDto {
  fullName:      string;
  studentCode?:  string;
  parentPhones?: string[];
  gender?:       string;
  dateOfBirth?:  string | Date;
}

// DTO tạo 1 học sinh
export interface CreateStudentDto extends ImportStudentDto {
  classId: string;
}

// DTO update học sinh
export interface UpdateStudentDto {
  fullName?:     string;
  classId?:      string;
  parentPhones?: string[];
  gender?:       string;
  dateOfBirth?:  string | Date;
  studentCode?:  string;
  parentPin?:    string; // Cho phép reset PIN thủ công nếu cần
}

// --- SUBJECT ---
export interface CreateSubjectDto {
  name: string;
  code?: string;
}