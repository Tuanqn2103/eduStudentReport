import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const phone = "0379206581"; 
  const password = "adminpassword"; 
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingAdmin = await prisma.admin.findUnique({
    where: { phoneNumber: phone },
  });

  if (existingAdmin) {
    console.log('Admin đã tồn tại, không cần tạo mới.');
  } else {
    const newAdmin = await prisma.admin.create({
      data: {
        phoneNumber: phone,
        password: hashedPassword, 
        fullName: "Admin",
        isAdmin: true,
      },
    });
    console.log('Đã tạo Admin mẫu thành công:', newAdmin);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });