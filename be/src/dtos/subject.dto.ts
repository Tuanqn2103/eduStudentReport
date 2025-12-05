export interface CreateSubjectDto {
  name: string;
  code?: string;
}

export interface UpdateSubjectDto {
  name?: string;
  code?: string;
  isActive?: boolean;
}