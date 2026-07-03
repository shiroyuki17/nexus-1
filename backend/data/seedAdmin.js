import { prisma } from '../lib/prisma.js';

async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.userProfile.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.username);
      return;
    }

    // Create admin user
    const admin = await prisma.userProfile.create({
      data: {
        user_id: 'admin-001',
        username: 'admin',
        role: 'admin',
        balance: 0,
        points: 0,
        rank: 'Admin',
        total_hours: 0,
        tenantId: 'default-tenant' // Update this with actual tenant ID
      }
    });

    console.log('Admin user created successfully:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
