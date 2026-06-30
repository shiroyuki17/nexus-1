import { prisma } from '../lib/prisma.js';
import { getEntityConfig, normalizePayload } from '../utils/entityConfig.js';

function getDelegate(entity) {
  const config = getEntityConfig(entity);
  if (!config || !prisma[config.model]) {
    return null;
  }

  return { config, delegate: prisma[config.model] };
}

export async function listEntities(req, res, next) {
  try {
    const entity = getDelegate(req.params.entity);
    if (!entity) {
      return res.status(404).json({ message: 'Unknown entity' });
    }

    const data = await entity.delegate.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

export async function getEntity(req, res, next) {
  try {
    const entity = getDelegate(req.params.entity);
    if (!entity) {
      return res.status(404).json({ message: 'Unknown entity' });
    }

    const data = await entity.delegate.findUnique({
      where: { id: req.params.id },
    });

    if (!data) {
      return res.status(404).json({ message: 'Record not found' });
    }

    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

export async function createEntity(req, res, next) {
  try {
    const entity = getDelegate(req.params.entity);
    if (!entity) {
      return res.status(404).json({ message: 'Unknown entity' });
    }

    const data = normalizePayload(req.body, entity.config);
    const created = await entity.delegate.create({ data });

    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
}

export async function updateEntity(req, res, next) {
  try {
    const entity = getDelegate(req.params.entity);
    if (!entity) {
      return res.status(404).json({ message: 'Unknown entity' });
    }

    const data = normalizePayload(req.body, entity.config);
    const updated = await entity.delegate.update({
      where: { id: req.params.id },
      data,
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
}

export async function deleteEntity(req, res, next) {
  try {
    const entity = getDelegate(req.params.entity);
    if (!entity) {
      return res.status(404).json({ message: 'Unknown entity' });
    }

    await entity.delegate.delete({
      where: { id: req.params.id },
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
