import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { publishEvent } from '../events/rabbitmq.js';

export const eventRouter = Router();

eventRouter.get('/events/logs', async (req, res, next) => {
  try {
    const logs = await prisma.eventLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(logs);
  } catch (error) {
    next(error);
  }
});

eventRouter.post('/events/test', async (req, res, next) => {
  try {
    const result = await publishEvent('TestEventPublished', {
      entity: 'test',
      message: req.body?.message ?? 'RabbitMQ test event',
    });
    res.status(result.published ? 202 : 503).json(result);
  } catch (error) {
    next(error);
  }
});
