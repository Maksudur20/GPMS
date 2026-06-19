import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Create default admin
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: 'admin' }
    });

    if (!existingAdmin) {
      await prisma.admin.create({
        data: {
          username: 'admin',
          email: 'admin@gpms.local',
          password: '$2a$10$YourHashedPasswordHere' // Use bcrypt in production
        }
      });
      console.log('✅ Default admin created');
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
