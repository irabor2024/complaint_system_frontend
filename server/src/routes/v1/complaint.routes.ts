import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { complaintController } from '../../controllers/complaint.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/requireRole.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import {
  addComplaintResponseSchema,
  assignComplaintSchema,
  setPrioritySchema,
  submitComplaintSchema,
  updateComplaintStatusSchema,
} from '../../validation/complaint.schema';

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

export const complaintRouter = Router();

complaintRouter.post(
  '/',
  submitLimiter,
  validateBody(submitComplaintSchema),
  complaintController.submitPublic
);

complaintRouter.get('/track/:ticketId', complaintController.track);

complaintRouter.use(requireAuth);

complaintRouter.get('/', complaintController.list);
complaintRouter.get('/:id', complaintController.getById);

complaintRouter.patch(
  '/:id/status',
  requireRole('ADMIN', 'STAFF'),
  validateBody(updateComplaintStatusSchema),
  complaintController.updateStatus
);

complaintRouter.post(
  '/:id/responses',
  requireRole('ADMIN', 'STAFF'),
  validateBody(addComplaintResponseSchema),
  complaintController.addResponse
);

complaintRouter.patch(
  '/:id/assign',
  requireRole('ADMIN'),
  validateBody(assignComplaintSchema),
  complaintController.assign
);

complaintRouter.patch(
  '/:id/priority',
  requireRole('ADMIN'),
  validateBody(setPrioritySchema),
  complaintController.setPriority
);
