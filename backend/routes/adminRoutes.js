import express from 'express';
import { prisma } from '../lib/prisma.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// Get all PCs (admin view)
router.get('/pcs', adminAuth, async (req, res) => {
  try {
    const tenantId = req.tenant?.id;
    const pcs = await prisma.pC.findMany({
      where: { tenantId },
      orderBy: { pc_number: 'asc' }
    });
    res.json(pcs);
  } catch (error) {
    console.error('Get PCs error:', error);
    res.status(500).json({ error: 'Failed to get PCs' });
  }
});

// Lock/Unlock PC
router.put('/pcs/:pcId/lock', adminAuth, async (req, res) => {
  try {
    const { pcId } = req.params;
    const { locked } = req.body;
    
    const pc = await prisma.pC.update({
      where: { id: pcId },
      data: { status: locked ? 'locked' : 'available' }
    });
    
    res.json(pc);
  } catch (error) {
    console.error('Lock PC error:', error);
    res.status(500).json({ error: 'Failed to update PC status' });
  }
});

// Set PC time limit
router.put('/pcs/:pcId/time-limit', adminAuth, async (req, res) => {
  try {
    const { pcId } = req.params;
    const { timeLimit } = req.body;
    
    const pc = await prisma.pC.update({
      where: { id: pcId },
      data: { 
        specs: JSON.stringify({ timeLimit })
      }
    });
    
    res.json(pc);
  } catch (error) {
    console.error('Set time limit error:', error);
    res.status(500).json({ error: 'Failed to set time limit' });
  }
});

// Force stop user session
router.post('/pcs/:pcId/stop-session', adminAuth, async (req, res) => {
  try {
    const { pcId } = req.params;
    
    const pc = await prisma.pC.update({
      where: { id: pcId },
      data: {
        status: 'available',
        current_user_id: null,
        session_start: null
      }
    });

    // Update user session
    if (pc.current_user_id) {
      await prisma.userProfile.updateMany({
        where: { current_pc: parseInt(pc.pc_number) },
        data: {
          session_active: false,
          current_pc: null,
          session_start: null
        }
      });
    }
    
    res.json(pc);
  } catch (error) {
    console.error('Stop session error:', error);
    res.status(500).json({ error: 'Failed to stop session' });
  }
});

// Get all users (admin view)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const tenantId = req.tenant?.id;
    const users = await prisma.userProfile.findMany({
      where: { tenantId },
      include: { tenant: true }
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Change user role
router.put('/users/:userId/role', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const user = await prisma.userProfile.update({
      where: { user_id: userId },
      data: { role }
    });
    
    res.json(user);
  } catch (error) {
    console.error('Change role error:', error);
    res.status(500).json({ error: 'Failed to change user role' });
  }
});

// Get system statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const tenantId = req.tenant?.id;
    
    const [totalUsers, activeUsers, totalPCs, activePCs] = await Promise.all([
      prisma.userProfile.count({ where: { tenantId } }),
      prisma.userProfile.count({ where: { tenantId, session_active: true } }),
      prisma.pC.count({ where: { tenantId } }),
      prisma.pC.count({ where: { tenantId, status: 'in_use' } })
    ]);
    
    res.json({
      totalUsers,
      activeUsers,
      totalPCs,
      activePCs,
      availablePCs: totalPCs - activePCs
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

export { router as adminRouter };
