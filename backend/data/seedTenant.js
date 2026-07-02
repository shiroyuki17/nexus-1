import { prisma } from '../lib/prisma.js';

async function seedDefaultTenant() {
  try {
    console.log('🌱 Seeding default tenant...');

    // Check if default tenant already exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug: 'default' }
    });

    if (existingTenant) {
      console.log('✅ Default tenant already exists');
      return;
    }

    // Create default tenant with subscription
    const tenant = await prisma.tenant.create({
      data: {
        name: 'Nexus Arena - Default',
        slug: 'default',
        email: 'default@nexus-arena.com',
        phone: '+976 9999 9999',
        address: 'Ulaanbaatar, Mongolia',
        status: 'active',
        max_pcs: 50,
        max_users: 500,
        settings: JSON.stringify({
          currency: 'MNT',
          timezone: 'Asia/Ulaanbaatar',
          language: 'mn'
        }),
        subscription: {
          create: {
            plan: 'pro',
            status: 'active',
            monthlyPrice: 99,
            features: JSON.stringify({
              max_pcs: 50,
              max_users: 500,
              support: 'standard',
              analytics: true,
              custom_branding: true
            })
          }
        }
      }
    });

    console.log('✅ Default tenant created:', tenant.slug);

    // Create sample PCs
    const zones = ['standard', 'vip', 'streaming'];
    const specs = [
      'RTX 3060 / 165Hz',
      'RTX 3070 / 240Hz',
      'RTX 3080 / 240Hz',
      'RTX 4070 / 240Hz'
    ];

    for (let i = 1; i <= 20; i++) {
      const zone = zones[Math.floor(Math.random() * zones.length)];
      const spec = specs[Math.floor(Math.random() * specs.length)];
      
      await prisma.pC.create({
        data: {
          tenantId: tenant.id,
          pc_number: i,
          zone,
          specs: spec,
          status: i <= 15 ? 'available' : 'maintenance',
          hourly_rate: zone === 'vip' ? 8000 : zone === 'streaming' ? 10000 : 5000
        }
      });
    }

    console.log('✅ Created 20 sample PCs');

    // Create sample games
    const games = [
      { title: 'Counter-Strike 2', category: 'FPS', is_featured: true },
      { title: 'Valorant', category: 'FPS', is_featured: true },
      { title: 'League of Legends', category: 'MOBA', is_featured: true },
      { title: 'Dota 2', category: 'MOBA', is_featured: false },
      { title: 'Fortnite', category: 'Battle Royale', is_featured: true },
      { title: 'Apex Legends', category: 'Battle Royale', is_featured: false },
      { title: 'Minecraft', category: 'Sandbox', is_featured: false },
      { title: 'FIFA 24', category: 'Sports', is_featured: true }
    ];

    for (const game of games) {
      await prisma.game.create({
        data: {
          tenantId: tenant.id,
          ...game,
          popularity: Math.random() * 100
        }
      });
    }

    console.log('✅ Created 8 sample games');

    // Create sample products
    const products = [
      { name: 'Coca-Cola', category: 'drinks', price: 3000 },
      { name: 'Pepsi', category: 'drinks', price: 3000 },
      { name: 'Energy Drink', category: 'drinks', price: 5000 },
      { name: 'Water', category: 'drinks', price: 1500 },
      { name: 'Coffee', category: 'drinks', price: 4000 },
      { name: 'Chips', category: 'snacks', price: 2500 },
      { name: 'Chocolate', category: 'snacks', price: 3000 },
      { name: 'Sandwich', category: 'food', price: 8000 },
      { name: 'Pizza Slice', category: 'food', price: 6000 },
      { name: 'Noodles', category: 'food', price: 4500 }
    ];

    for (const product of products) {
      await prisma.product.create({
        data: {
          tenantId: tenant.id,
          ...product
        }
      });
    }

    console.log('✅ Created 10 sample products');

    // Create sample tournament
    await prisma.tournament.create({
      data: {
        tenantId: tenant.id,
        title: 'CS2 Weekly Tournament',
        game: 'Counter-Strike 2',
        description: 'Weekly 5v5 tournament with prizes',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: '18:00',
        max_participants: 10,
        current_participants: 3,
        prize_pool: '500,000₮',
        entry_fee: 10000,
        status: 'upcoming'
      }
    });

    console.log('✅ Created sample tournament');

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDefaultTenant();
}

export { seedDefaultTenant };
