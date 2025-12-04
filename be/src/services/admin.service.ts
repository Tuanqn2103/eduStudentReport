import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as adminRepo from '../repositories/admin.repository';

export const loginAdminService = async (phoneNumber: string, pass: string) => {
  const admin = await adminRepo.findAdminByPhone(phoneNumber);
  
  if (!admin) throw new Error('ADMIN_NOT_FOUND');
  
  const isMatch = await bcrypt.compare(pass, admin.password);
  if (!isMatch) throw new Error('WRONG_PASSWORD');

  const token = jwt.sign(
    { id: admin.id, role: 'superadmin', fullName: admin.fullName },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );

  return { token, admin };
};

export const createAdminService = async (data: any) => {
  const exists = await adminRepo.findAdminByPhone(data.phoneNumber);
  if (exists) throw new Error('PHONE_EXISTED');

  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  return await adminRepo.createAdmin({
    ...data,
    password: hashedPassword,
    isAdmin: true
  });
};