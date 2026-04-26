import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from '../../controllers/auth.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../../validation/auth.schema';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRouter = Router();

authRouter.post('/register', loginLimiter, validateBody(registerSchema), authController.register);
authRouter.post('/login', loginLimiter, validateBody(loginSchema), authController.login);
authRouter.get('/me', requireAuth, authController.me);
