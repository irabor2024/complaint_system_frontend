import type { Request, Response } from 'express';
import { routeParam } from '../common/http/params';
import { asyncHandler } from '../middleware/asyncHandler';
import { complaintService } from '../services/complaint.service';
import { listComplaintsQuerySchema } from '../validation/complaint.schema';

export const complaintController = {
  submitPublic: asyncHandler(async (req: Request, res: Response) => {
    const files = Array.isArray(req.files)
      ? (req.files as { buffer: Buffer; originalname: string; mimetype: string; size: number }[])
      : [];
    const data = await complaintService.submitPublic({ ...req.body, files });
    res.status(201).json({ success: true, data });
  }),

  track: asyncHandler(async (req: Request, res: Response) => {
    const data = await complaintService.trackByTicket(routeParam(req, 'ticketId'));
    res.json({ success: true, data });
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const query = listComplaintsQuerySchema.parse(req.query);
    const data = await complaintService.list(req.auth!, query);
    res.json({ success: true, data });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const data = await complaintService.getById(req.auth!, routeParam(req, 'id'));
    res.json({ success: true, data });
  }),

  downloadAttachment: asyncHandler(async (req: Request, res: Response) => {
    const { stream, downloadName, mimeType } = await complaintService.getAttachmentFile(
      req.auth!,
      routeParam(req, 'id'),
      routeParam(req, 'attachmentId')
    );
    res.setHeader('Content-Type', mimeType);
    const encoded = encodeURIComponent(downloadName);
    res.setHeader('Content-Disposition', `attachment; filename="${encoded}"; filename*=UTF-8''${encoded}`);
    stream.on('error', () => {
      if (!res.headersSent) res.status(500).end();
    });
    stream.pipe(res);
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const data = await complaintService.updateStatus(req.auth!, routeParam(req, 'id'), req.body.status);
    res.json({ success: true, data });
  }),

  addResponse: asyncHandler(async (req: Request, res: Response) => {
    const data = await complaintService.addResponse(req.auth!, routeParam(req, 'id'), req.body.message);
    res.json({ success: true, data });
  }),

  assign: asyncHandler(async (req: Request, res: Response) => {
    const data = await complaintService.assignStaff(req.auth!, routeParam(req, 'id'), req.body.staffUserId);
    res.json({ success: true, data });
  }),

  setPriority: asyncHandler(async (req: Request, res: Response) => {
    const data = await complaintService.setPriority(req.auth!, routeParam(req, 'id'), req.body.priority);
    res.json({ success: true, data });
  }),
};
