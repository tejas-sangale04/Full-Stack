import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const demoUsers = [
    { email: "waiter1", password: "waiter123", role: "waiter" },
    { email: "chef1", password: "chef123", role: "chef" },
    { email: "admin", password: "admin123", role: "admin" },
  ];

  console.log('Seeding demo users...');

  for (const user of demoUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        password: hashedPassword,
        role: user.role,
      },
      create: {
        email: user.email,
        password: hashedPassword,
        role: user.role,
      },
    });
    console.log(`- User ${user.email} (${user.role}) seeded.`);
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
