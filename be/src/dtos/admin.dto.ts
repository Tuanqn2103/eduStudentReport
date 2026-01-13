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
}

// --- CLASS ---
export interface CreateClassDto {
  className:  string;
  schoolYear: string;
  teacherId?: string;
}

export interface UpdateClassDto {
  className?:  string;
  schoolYear?: string;
  isActive?:   boolean;
  teacherId?:  string;
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

export interface CreateStudentDto extends ImportStudentDto {
  classId: string;
}

export interface UpdateStudentDto {
  fullName?:     string;
  classId?:      string;
  parentPhones?: string[];
  gender?:       string;
  dateOfBirth?:  string | Date;
  studentCode?:  string;
  parentPin?:    string;
}

// --- SUBJECT ---
export interface CreateSubjectDto {
  name: string;
  code?: string;
}