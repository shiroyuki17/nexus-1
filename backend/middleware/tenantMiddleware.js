import { prisma } from '../lib/prisma.js';

/**
 * Extract tenant from request and add to context
 * Supports tenant identification via:
 * 1. Subdomain (tenant.example.com)
 * 2. Header (X-Tenant-Slug)
 * 3. Query parameter (?tenant=slug)
 */
export async function tenantMiddleware(req, res, next) {
  try {
    let tenantSlug = null;

    // Try subdomain first
    const host = req.headers.host || '';
    const subdomain = host.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'api' && subdomain !== 'localhost') {
      tenantSlug = subdomain;
    }

    // Try header
    if (!tenantSlug) {
      tenantSlug = req.headers['x-tenant-slug'];
    }

    // Try query parameter
    if (!tenantSlug) {
      tenantSlug = req.query.tenant;
    }

    // Default tenant for development and production (fallback)
    if (!tenantSlug) {
      tenantSlug = process.env.DEFAULT_TENANT || 'default';
    }

    if (!tenantSlug) {
      return res.status(400).json({ 
        error: 'Tenant identifier required',
        message: 'Please provide tenant via subdomain, X-Tenant-Slug header, or ?tenant= parameter'
      });
    }

    // Fetch tenant from database
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: {
        subscription: true
      }
    });

    if (!tenant) {
      return res.status(404).json({ 
        error: 'Tenant not found',
        message: `Tenant '${tenantSlug}' does not exist`
      });
    }

    if (tenant.status !== 'active') {
      return res.status(403).json({ 
        error: 'Tenant inactive',
        message: 'This tenant account is not active'
      });
    }

    // Check subscription status
    if (tenant.subscription && tenant.subscription.status !== 'active') {
      return res.status(403).json({ 
        error: 'Subscription inactive',
        message: 'Tenant subscription is not active'
      });
    }

    // Add tenant to request context
    req.tenant = tenant;
    req.tenantId = tenant.id;

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to validate tenant'
    });
  }
}

/**
 * Ensure tenant context is present (for routes that require tenant)
 */
export function requireTenant(req, res, next) {
  if (!req.tenant || !req.tenantId) {
    return res.status(401).json({ 
      error: 'Tenant required',
      message: 'Tenant context is required for this operation'
    });
  }
  next();
}

/**
 * Check tenant limits (PCs, users, etc.)
 */
export async function checkTenantLimits(req, res, next) {
  try {
    const tenant = req.tenant;
    
    // Check PC limit
    if (tenant.max_pcs) {
      const pcCount = await prisma.pC.count({
        where: { tenantId: tenant.id }
      });
      
      if (pcCount >= tenant.max_pcs) {
        return res.status(403).json({ 
          error: 'PC limit reached',
          message: `Maximum ${tenant.max_pcs} PCs allowed for current plan`
        });
      }
    }

    // Check user limit
    if (tenant.max_users) {
      const userCount = await prisma.userProfile.count({
        where: { tenantId: tenant.id }
      });
      
      if (userCount >= tenant.max_users) {
        return res.status(403).json({ 
          error: 'User limit reached',
          message: `Maximum ${tenant.max_users} users allowed for current plan`
        });
      }
    }

    next();
  } catch (error) {
    console.error('Tenant limits check error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to check tenant limits'
    });
  }
}
