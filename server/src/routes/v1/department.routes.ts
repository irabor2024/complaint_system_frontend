import { Router } from 'express';
import { departmentController } from '../../controllers/department.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/requireRole.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { createDepartmentSchema, updateDepartmentSchema } from '../../validation/department.schema';

export const departmentRouter = Router();

departmentRouter.get('/', departmentController.list);
departmentRouter.get('/:id', departmentController.getById);

departmentRouter.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validateBody(createDepartmentSchema),
  departmentController.create
);

departmentRouter.patch(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validateBody(updateDepartmentSchema),
  departmentController.update
);

departmentRouter.delete('/:id', requireAuth, requireRole('ADMIN'), departmentController.remove);
