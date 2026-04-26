import type { Request, Response } from 'express';
import { routeParam } from '../common/http/params';
import { asyncHandler } from '../middleware/asyncHandler';
import { departmentService } from '../services/department.service';

export const departmentController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const data = await departmentService.list();
    res.json({ success: true, data });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const data = await departmentService.getById(routeParam(req, 'id'));
    res.json({ success: true, data });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await departmentService.create(req.body);
    res.status(201).json({ success: true, data });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const data = await departmentService.update(routeParam(req, 'id'), req.body);
    res.json({ success: true, data });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await departmentService.delete(routeParam(req, 'id'));
    res.status(204).send();
  }),
};
