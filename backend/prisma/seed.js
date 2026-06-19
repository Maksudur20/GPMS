import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Create default admin
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: 'sium' }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('sium2000', 10);
      await prisma.admin.create({
        data: {
          username: 'sium',
          email: 'sium@gpms.local',
          password: hashedPassword
        }
      });
      console.log('✅ Default admin created (username: sium)');
    } else {
      console.log('ℹ️ Admin "sium" already exists, skipping');
    }

    // Create default settings
    const existingSettings = await prisma.settings.findFirst();

    if (!existingSettings) {
      await prisma.settings.create({
        data: {
          currencyApiUrl: process.env.CURRENCY_API_URL || 'https://v6.exchangerate-api.com/v6/your_key/latest/USD',
          chargePer1000: 12.50,
          minProfit: 50,
          maxProfit: 100
        }
      });
      console.log('✅ Default settings created');
    }

    console.log('🌱 Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

if (process.argv[1].endsWith('seed.js')) {
  seedDatabase();
}

