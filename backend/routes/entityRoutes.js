import { Router } from 'express';
import {
  createEntity,
  deleteEntity,
  getEntity,
  listEntities,
  updateEntity,
} from '../controllers/entityController.js';

export const entityRouter = Router();

entityRouter.get('/:entity', listEntities);
entityRouter.post('/:entity', createEntity);
entityRouter.get('/:entity/:id', getEntity);
entityRouter.put('/:entity/:id', updateEntity);
entityRouter.patch('/:entity/:id', updateEntity);
entityRouter.delete('/:entity/:id', deleteEntity);
