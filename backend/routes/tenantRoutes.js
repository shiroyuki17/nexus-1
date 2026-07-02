import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireTenant, checkTenantLimits } from '../middleware/tenantMiddleware.js';

const router = Router();

/**
 * Public: Register new tenant (SaaS signup)
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, address, slug, plan = 'basic' } = req.body;

    if (!name || !email || !slug) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'slug']
      });
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({ 
        error: 'Invalid slug format',
        message: 'Slug must contain only lowercase letters, numbers, and hyphens'
      });
    }

    // Check if tenant already exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug }
    });

    if (existingTenant) {
      return res.status(409).json({ 
        error: 'Tenant already exists',
        message: 'A tenant with this slug already exists'
      });
    }

    const existingEmail = await prisma.tenant.findUnique({
      where: { email }
    });

    if (existingEmail) {
      return res.status(409).json({ 
        error: 'Email already registered',
        message: 'A tenant with this email already exists'
      });
    }

    // Plan configurations
    const planConfigs = {
      basic: { max_pcs: 10, max_users: 100, monthlyPrice: 0 },
      pro: { max_pcs: 50, max_users: 500, monthlyPrice: 99 },
      enterprise: { max_pcs: 200, max_users: 2000, monthlyPrice: 299 }
    };

    const planConfig = planConfigs[plan] || planConfigs.basic;

    // Create tenant with subscription
    const tenant = await prisma.tenant.create({
      data: {
        name,
        slug,
        email,
        phone,
        address,
        max_pcs: planConfig.max_pcs,
        max_users: planConfig.max_users,
        subscription: {
          create: {
            plan,
            status: 'active',
            monthlyPrice: planConfig.monthlyPrice,
            features: JSON.stringify({
              max_pcs: planConfig.max_pcs,
              max_users: planConfig.max_users,
              support: plan === 'enterprise' ? 'priority' : 'standard'
            })
          }
        }
      },
      include: {
        subscription: true
      }
    });

    res.status(201).json({
      message: 'Tenant registered successfully',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        email: tenant.email,
        subscription: tenant.subscription
      }
    });
  } catch (error) {
    console.error('Tenant registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      message: error.message
    });
  }
});

/**
 * Get current tenant info
 */
router.get('/current', requireTenant, async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.tenantId },
      include: {
        subscription: true,
        _count: {
          select: {
            pcs: true,
            users: true,
            reservations: true,
            tournaments: true
          }
        }
      }
    });

    res.json(tenant);
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tenant',
      message: error.message
    });
  }
});

/**
 * Update tenant settings
 */
router.patch('/settings', requireTenant, async (req, res) => {
  try {
    const { name, phone, address, logo_url, settings } = req.body;

    const tenant = await prisma.tenant.update({
      where: { id: req.tenantId },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(logo_url !== undefined && { logo_url }),
        ...(settings && { settings })
      },
      include: {
        subscription: true
      }
    });

    res.json({
      message: 'Settings updated successfully',
      tenant
    });
  } catch (error) {
    console.error('Update tenant error:', error);
    res.status(500).json({ 
      error: 'Failed to update tenant',
      message: error.message
    });
  }
});

/**
 * Upgrade/Change subscription plan
 */
router.post('/subscription/upgrade', requireTenant, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({ 
        error: 'Plan required',
        message: 'Please specify the plan to upgrade to'
      });
    }

    const planConfigs = {
      basic: { max_pcs: 10, max_users: 100, monthlyPrice: 0 },
      pro: { max_pcs: 50, max_users: 500, monthlyPrice: 99 },
      enterprise: { max_pcs: 200, max_users: 2000, monthlyPrice: 299 }
    };

    const planConfig = planConfigs[plan];
    if (!planConfig) {
      return res.status(400).json({ 
        error: 'Invalid plan',
        message: 'Plan must be one of: basic, pro, enterprise'
      });
    }

    // Update subscription and tenant limits
    const tenant = await prisma.tenant.update({
      where: { id: req.tenantId },
      data: {
        max_pcs: planConfig.max_pcs,
        max_users: planConfig.max_users,
        subscription: {
          update: {
            plan,
            monthlyPrice: planConfig.monthlyPrice,
            features: JSON.stringify({
              max_pcs: planConfig.max_pcs,
              max_users: planConfig.max_users,
              support: plan === 'enterprise' ? 'priority' : 'standard'
            })
          }
        }
      },
      include: {
        subscription: true
      }
    });

    res.json({
      message: 'Subscription upgraded successfully',
      tenant
    });
  } catch (error) {
    console.error('Subscription upgrade error:', error);
    res.status(500).json({ 
      error: 'Failed to upgrade subscription',
      message: error.message
    });
  }
});

/**
 * Get tenant usage statistics
 */
router.get('/stats', requireTenant, async (req, res) => {
  try {
    const tenantId = req.tenantId;

    const [pcCount, userCount, reservationCount, tournamentCount, totalRevenue] = await Promise.all([
      prisma.pC.count({ where: { tenantId } }),
      prisma.userProfile.count({ where: { tenantId } }),
      prisma.reservation.count({ where: { tenantId } }),
      prisma.tournament.count({ where: { tenantId } }),
      prisma.transaction.aggregate({
        where: { 
          tenantId,
          type: 'payment'
        },
        _sum: { amount: true }
      })
    ]);

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        max_pcs: true,
        max_users: true,
        subscription: true
      }
    });

    res.json({
      usage: {
        pcs: { current: pcCount, max: tenant.max_pcs, percentage: (pcCount / tenant.max_pcs) * 100 },
        users: { current: userCount, max: tenant.max_users, percentage: (userCount / tenant.max_users) * 100 },
        reservations: reservationCount,
        tournaments: tournamentCount,
        totalRevenue: totalRevenue._sum.amount || 0
      },
      subscription: tenant.subscription
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

export { router as tenantRouter };
