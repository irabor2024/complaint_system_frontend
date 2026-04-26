import { Router } from 'express';
import { authRouter } from './auth.routes';
import { complaintRouter } from './complaint.routes';
import { departmentRouter } from './department.routes';
import { notificationRouter } from './notification.routes';
import { staffRouter } from './staff.routes';

export const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/departments', departmentRouter);
v1Router.use('/staff', staffRouter);
v1Router.use('/complaints', complaintRouter);
v1Router.use('/notifications', notificationRouter);
