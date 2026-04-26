import { Router } from 'express';
import { staffController } from '../../controllers/staff.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/requireRole.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { createStaffSchema } from '../../validation/staff.schema';

export const staffRouter = Router();

staffRouter.use(requireAuth, requireRole('ADMIN'));

staffRouter.get('/', staffController.list);
staffRouter.post('/', validateBody(createStaffSchema), staffController.create);
